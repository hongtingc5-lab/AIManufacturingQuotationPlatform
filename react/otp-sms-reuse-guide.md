# 手机验证码（OTP）发码与校验 — 复用指南

本文档整理自 `agx-quote` 现有实现，说明手机登录验证码的**生成、封装、发送、校验**逻辑，便于在其他网站复用同一套方案。

> **重要澄清**  
> 本项目**不是**运营商把验证码回调到你们服务器。  
> 真实流程是：  
> **服务端生成验证码 → 腾讯云短信（对接运营商）发到用户手机 → 用户在网页输入 → 服务端校验。**  
> 「接收验证码」发生在**用户手机**；网站只负责**发码**和**验码**。

---

## 1. 整体架构

```
┌────────────┐   POST /api/auth/otp/send    ┌─────────────────┐
│  前端页面   │ ───────────────────────────► │  后端            │
│ 输入手机号  │ ◄── { envelope } ─────────── │ 1. 生成 6 位码  │
└────────────┘                               │ 2. 做成 envelope│
      │                                      │ 3. 调短信通道发送│
      │ 用户手机收到短信                      └────────┬────────┘
      │ 「您的验证码是 123456」                        │
      ▼                                              ▼
┌────────────┐   POST /api/auth/otp/verify   ┌─────────────────┐
│ 输入 6 位码 │ ───────────────────────────► │ 验 envelope+码  │
│ + envelope │ ◄── LOGIN / REGISTER / RESET─ │ 再走业务分支    │
└────────────┘                               └─────────────────┘
```

### 关键设计

- **验证码不存数据库、不存 Redis**
- 明文 OTP 只在生成瞬间存在于内存，随后：
  1. 哈希后封进 `envelope` 返回给前端保存
  2. 明文交给短信通道发出去
- 校验时用「前端带回的 envelope + 用户输入的码」本地验签即可

---

## 2. 本仓库对应源码

| 职责 | 路径 |
|------|------|
| 发码 API | `src/app/api/auth/otp/send/route.ts` |
| 验码 API | `src/app/api/auth/otp/verify/route.ts` |
| 信封 / 票据（无状态核心） | `src/lib/auth/otp/store.ts` |
| 短信 / 邮件发送 | `src/lib/auth/otp/sender.ts` |
| 手机号 / 邮箱解析 | `src/lib/auth/identifier.ts` |
| 前端交互 | `src/components/auth/login-panel.tsx` |
| 注册（验码后设密） | `src/app/api/auth/register/route.ts` |

---

## 3. 发码流程（逐步）

### 3.1 前端请求

```http
POST /api/auth/otp/send
Content-Type: application/json

{
  "identifier": "13800138000",
  "purpose": "login_or_register"
}
```

`purpose` 取值：

| 值 | 用途 |
|----|------|
| `login_or_register` | 登录或注册（默认） |
| `reset_password` | 忘记密码 |

前端要点（见 `login-panel.tsx`）：

1. 本地先规范化手机号
2. 发码成功后把返回的 `envelope` 存到 state
3. 进入「输入验证码」阶段
4. 前端倒计时冷却（防连点）；服务端另有限流

### 3.2 服务端限流

```ts
assertRateLimit(req, {
  scope: "auth:otp-send",
  limit: 12,                 // 10 分钟最多 12 次
  windowMs: 10 * 60 * 1000,
});
assertContentLength(req, { maxBytes: 8 * 1024 });
```

验码接口：`auth:otp-verify`，10 分钟最多 24 次。

### 3.3 识别渠道 + 规范化手机号

实现：`src/lib/auth/identifier.ts`

```ts
detectIdentifierChannel(identifier)
// 手机：去掉非数字，必须是 1 开头的 11 位 → channel: "phone"
// 邮箱：匹配 email → channel: "email"

normalizePhoneToE164("13800138000")  // → "+8613800138000"
```

发给腾讯云时手机号必须用 **E.164**（`+86` + 11 位）。

### 3.4 生成 6 位验证码

当前实现：

```ts
const otp = String(Math.floor(100000 + Math.random() * 900000));
// 范围：100000 ~ 999999，字符串，例如 "483920"
```

复用到生产环境时，建议改为：

```ts
import crypto from "node:crypto";
const otp = String(crypto.randomInt(100000, 1000000));
```

### 3.5 做成无状态 envelope（核心，必须复用）

实现：`createOtpEnvelope`（`src/lib/auth/otp/store.ts`）

```ts
createOtpEnvelope({
  channel: "phone",
  destination: "+8613800138000",
  purpose: "login_or_register",
  otp,                 // 明文只在这里用一次
  ttlSeconds: 5 * 60,  // 5 分钟有效
});
```

#### envelope 格式

```
{base64url(JSON payload)}.{hmac_sha256_hex}
```

#### payload JSON 字段

| 字段 | 含义 |
|------|------|
| `v` | 版本号，固定 `1` |
| `exp` | 过期时间（Unix 秒） |
| `ch` | `"phone"` / `"email"` |
| `d` | 目标：`+86138...` 或邮箱 |
| `p` | `"login_or_register"` / `"reset_password"` |
| `s` | 8 字节随机 salt（hex） |
| `oh` | `sha256(\`${otp}:${salt}\`)` 的 hex |

#### 签名算法

```ts
sig = HMAC-SHA256(authSecret, payloadBase64url).digest("hex")
envelope = `${payloadBase64url}.${sig}`
```

#### authSecret 读取顺序

```
AUTH_REGISTRATION_SECRET
→ AUTH_SECRET
→ NEXTAUTH_SECRET
→ SESSION_SECRET
→ APP_SECRET
→ 仅开发环境有默认值（生产必须配置）
```

#### 设计原因

| 点 | 说明 |
|----|------|
| 服务端不存验证码 | 少状态、少依赖 |
| 前端持有 envelope | 验码时原样带回即可 |
| HMAC 签名 | 无法篡改手机号 / 用途 / 过期时间 |
| 只存 hash | 明文 OTP 不出现在 envelope 里 |

### 3.6 调用腾讯云发短信

实现：`sendOtp` → `sendSmsTencentOTP`（`src/lib/auth/otp/sender.ts`）

```ts
await sendOtp({ channel: "phone", destination: "+86138...", otp });
```

腾讯云调用参数：

```ts
client.SendSms({
  SmsSdkAppId: SMS_SDK_APP_ID,
  SignName: SMS_SIGN_NAME,           // 短信签名，如「敏捷智造」
  TemplateId: SMS_TEMPLATE_ID_LOGIN, // 已审核模板 ID
  TemplateParamSet: [otp, "5"],      // {1}=验证码，{2}=有效分钟数
  PhoneNumberSet: ["+8613800138000"],
  SessionContext: `otp_login_${Date.now()}`,
});
```

成功条件：`SendStatusSet[0].Code === "Ok"`。

**运营商位置：** 腾讯云短信对接三大运营商；业务侧只调腾讯云 API，不直连运营商，也没有「运营商推送验证码到 webhook」的环节。

### 3.7 返回前端

```json
{ "envelope": "eyJ...payload....hmac_hex" }
```

**绝不返回明文 otp。** 用户只能从手机短信看到验证码。

---

## 4. 验码流程（逐步）

### 4.1 前端请求

```http
POST /api/auth/otp/verify
Content-Type: application/json

{
  "envelope": "发码时拿到的那个字符串",
  "otp": "483920",
  "remember7days": true
}
```

兼容字段：也可用 `requestId` 代替 `envelope`（历史命名）。

### 4.2 verifyOtpEnvelope 校验顺序

实现：`verifyOtpEnvelope`（`src/lib/auth/otp/store.ts`）

1. 拆分 `payload.sig`
2. HMAC 验签（`timingSafeEqual`）
3. 解 base64url → JSON
4. 检查版本 / channel / purpose 合法
5. 检查 `exp` 未过期
6. 用用户输入的 otp + payload.s 重算 hash，与 `oh` 比较

任一失败 → 返回 `null` → API 返回「验证码错误或已过期」。

### 4.3 验过之后的业务分支

```
purpose == reset_password
  → 用户必须已存在
  → 发放 resetTicket（15 分钟）→ type: "RESET"

purpose == login_or_register
  → 该手机号已有 User
      → 创建 Session + 写 Cookie session_token → type: "LOGIN"
  → 没有 User
      → 发放 registrationTicket（15 分钟）→ type: "REGISTER"
         （此时还不建用户；前端再让用户设密码，调 POST /api/auth/register）
```

#### registrationTicket / resetTicket

同样是「payload + HMAC」无状态票据，不再带 otp hash，只证明：

> 这个手机号 / 邮箱已经通过 OTP 验证。

注册接口：`POST /api/auth/register`

```json
{
  "registrationTicket": "...",
  "password": "用户设置的密码",
  "remember7days": true
}
```

成功后：`create User`（写入 `phone` 或 `email` + `passwordHash`）+ `Session` + Cookie。

---

## 5. 前端状态机

### 登录 / 注册 OTP

```
INPUT（输手机号）
  → 点「获取验证码」→ POST /otp/send
  → VERIFY（输 6 位码，持有 envelope）
      → verify 成功 LOGIN  → 已登录
      → verify 成功 REGISTER → 再设密码 → POST /register
```

### 忘记密码

```
INPUT
  → send(purpose=reset_password)
  → VERIFY
  → RESET（持有 resetTicket）
  → 设新密码
```

冷却：前端 `otpCooldown` 倒计时；与服务端限流是两层防护。

---

## 6. 环境变量

### 签名密钥（必配）

| 变量 | 作用 |
|------|------|
| `AUTH_SECRET` | 签 envelope / ticket（推荐） |
| `AUTH_REGISTRATION_SECRET` | 可选，专用注册/OTP 密钥 |

### 腾讯云短信

| 变量 | 作用 |
|------|------|
| `TENCENTCLOUD_SECRET_ID` / `TENCENTCLOUD_SECRET_KEY` | API 密钥（也认 `TENCENT_*`、`SecretId`/`SecretKey`） |
| `SMS_SDK_APP_ID` | 短信应用 SDK AppId |
| `SMS_SIGN_NAME` | 短信签名 |
| `SMS_TEMPLATE_ID_LOGIN` | 登录/注册模板 ID |
| `TENCENT_SMS_REGION` | 默认 `ap-guangzhou` |

腾讯云控制台需先完成：实名、签名审核、模板审核。

模板内容示例：

```text
您的验证码为{1}，{2}分钟内有效，请勿泄露。
```

对应代码：`TemplateParamSet: [otp, "5"]`。

### 邮件 OTP（可选，同一套 envelope）

| 变量 | 作用 |
|------|------|
| `EMAIL_FROM_ADDRESS` | 发件地址 |
| `EMAIL_TEMPLATE_ID_LOGIN` | SES 模板 ID（可空，空则纯文本） |
| `EMAIL_OTP_SUBJECT` | 邮件主题 |
| `OTP_TTL_MINUTES` | 邮件文案中的有效分钟数提示 |

---

## 7. 端到端时序（对照用）

```
1. 用户输入 13800138000，点「获取验证码」
2. 后端生成 otp = 483920
3. 后端造 envelope（内含 phone=+8613800138000 与 otp 的 hash）
4. 腾讯云把「483920」发到用户手机（运营商投递）
5. 接口返回 { envelope }；前端保存（不存明文码）
6. 用户看短信，页面输入 483920
7. 前端 POST { envelope, otp: "483920" }
8. 后端验签 + 比对 hash
9. 老用户 → Session Cookie
   新用户 → registrationTicket → 设密注册 → Session Cookie
```

---

## 8. 复用到其他网站

### 方案 A：继续用腾讯云短信（与本项目一致）

1. 拷贝：
   - `src/lib/auth/otp/store.ts`
   - `src/lib/auth/otp/sender.ts`（短信部分）
   - `src/lib/auth/identifier.ts`
2. 实现两个接口：`POST /otp/send`、`POST /otp/verify`
3. 配置第 6 节环境变量
4. 前端：发码存 `envelope`，验码带回 `envelope + otp`

### 方案 B：换成阿里云 / 其它聚合 / 运营商直连

**只替换「发短信」一层**（`sendOtp` / `sendSmsTencentOTP`），其余逻辑原样复用：

```ts
async function sendSms(phoneE164: string, otp: string) {
  await yourSmsProvider.send({
    to: phoneE164,
    templateCode: "...",
    params: { code: otp, minutes: "5" },
  });
}
```

**envelope 的生成与校验不要改**——那是安全核心。

### 方案 C：运营商上行短信（用户发短信到短号）

那是另一套产品形态，**本项目未实现**。  
需要：运营商短号、上行回调 URL、解析短信正文。不能直接套本文档的下行 OTP 方案。

---

## 9. 安全注意（复用时务必保留）

1. **生产必须配置强随机 `AUTH_SECRET`**，否则 envelope 可被伪造
2. OTP 明文只走短信通道，不写日志、不返回给前端
3. 必须有发码 / 验码限流（防刷短信费、防爆破）
4. envelope 过期时间建议 5 分钟；registration / reset ticket 建议 15 分钟
5. 验签使用 `timingSafeEqual`，防止时序攻击
6. **已知缺口：** 当前同一 envelope 可被重复验证成功（无一次性消费标记）。若要「用过即废」，可：
   - 用 Redis 记录已消费的 envelope hash；或
   - 在 payload 中加入 `jti`，消费后写入黑名单

---

## 10. 与登录体系的关系（本项目）

OTP 只是「证明你控制这个手机号」的手段；验过之后统一落到：

- `User` 表（`phone` / `email` + `passwordHash`）
- `Session` 表 + Cookie `session_token`

Google / 微信登录是另一条身份证明路径，最终同样写入 `User` + `Session`。详见代码：

- Google：`src/app/api/auth/google/*`
- 微信：`src/app/api/auth/wechat/*`
- Session：`src/lib/auth/session.ts`

---

## 11. 最小可搬接口契约

### 发码

**请求**

```json
{ "identifier": "13800138000", "purpose": "login_or_register" }
```

**成功响应**

```json
{ "envelope": "<base64url_payload>.<hmac_hex>" }
```

**失败响应**

```json
{ "error": "错误说明" }
```

### 验码

**请求**

```json
{ "envelope": "...", "otp": "483920", "remember7days": true }
```

**成功响应（三选一）**

```json
{ "type": "LOGIN", "user": { "id": "...", "phone": "+86138...", "...": "..." } }
```

```json
{
  "type": "REGISTER",
  "registrationTicket": "...",
  "destination": "+8613800138000",
  "channel": "phone"
}
```

```json
{
  "type": "RESET",
  "resetTicket": "...",
  "destination": "+8613800138000",
  "channel": "phone"
}
```

---

## 12. 复用检查清单

- [ ] 已配置 `AUTH_SECRET`（生产强随机）
- [ ] 已配置短信通道密钥与模板（腾讯云或其它）
- [ ] 签名 / 模板已在短信平台审核通过
- [ ] 发码接口：生成 OTP → envelope → 发短信 → 只返回 envelope
- [ ] 验码接口：验签 + hash 比对 → 再走登录 / 注册 / 重置分支
- [ ] 前端保存 envelope，验码时原样带回
- [ ] 有发码限流与前端冷却
- [ ] 手机号统一存 E.164（`+86...`）
- [ ] （可选）OTP 改用 `crypto.randomInt`
- [ ] （可选）envelope 一次性消费，防重放

---

*文档对应仓库实现版本：以 `src/lib/auth/otp/*` 与 `src/app/api/auth/otp/*` 为准。*
