# 五系统前端区分（维护手册）

平台前端按 **5 个业务系统** 分开；另有 **共用入口**（不算第六业务系统）。  
每个系统独立包、独立端口、独立 `build` → 独立 `dist`，互不混路由 / 不混 `locales`。

> **端口只写已启用的。** 待建系统迁入并在 Vite 里定好端口后，再回填本文件。

本仓库是 **npm workspaces monorepo**：

| 路径 | 作用 |
|------|------|
| `D:\zhizao\zhizao\react\` | monorepo 根（`package.json` / 共用 `node_modules`） |
| `apps/<system-id>/` | 各系统（或共用入口）工程 |
| `apps/<system-id>/PAGE_MAP.md` | **该系统唯一** HTML↔React 盘点表（见下方规范） |
| `D:\zhizao\内容\代码\前端页面\` | 静态 HTML 对照源（权威设计稿，**不进** react 包内复制） |
| `D:\zhizao\zhizao\marketing-react-main` | 营销站上推镜像（与 `react` 同级） |

**静态源根目录（唯一）：** `D:\zhizao\内容\代码\前端页面\`

| 子目录 | 系统 |
|--------|------|
| `营销页（已核对）` | marketing |
| `入口` | entry |
| `用户（已核对）` | user |
| `后台（已核对）` | admin |
| `MES工作台（已核对）` | mes |
| `供应商页面（已核对）` | supplier |

---

## 总览表

| 系统 ID | 中文名 | 包名 | 工程目录 | 开发端口 | 静态 HTML 源 | 状态 | 盘点表 |
|---------|--------|------|----------|----------|--------------|------|--------|
| `marketing` | 营销页 | `@zhizao/frontend-marketing` | `apps/marketing` | **5173** | `…/营销页（已核对）` | 已迁入 | `apps/marketing/README.md`（迁移清单段） |
| `user` | 用户端 | `@zhizao/frontend-user` | `apps/user` | **5174** | `…/用户（已核对）` | 已迁入（壳+13页） | `apps/user/PAGE_MAP.md` |
| `entry` | 共用入口 | `@zhizao/frontend-entry` | `apps/entry` | **5175** | `…/入口` | 已迁入 | `apps/entry/PAGE_MAP.md` |
| `admin` | 管理后台 | `@zhizao/frontend-admin` | `apps/admin` | **5176** | `…/后台（已核对）` | 已迁入（壳+16页） | `apps/admin/PAGE_MAP.md` |
| `mes` | MES 工作台 | `@zhizao/frontend-mes` | `apps/mes` | **5177** | `…/MES工作台（已核对）` | 已迁入（壳+10页） | `apps/mes/PAGE_MAP.md` |
| `supplier` | 供应商端 | `@zhizao/frontend-supplier` | `apps/supplier` | **5178** | `…/供应商页面（已核对）` | 已迁入（壳+10页） | `apps/supplier/PAGE_MAP.md` |

> `entry` 是共用登录壳，**不是**第六业务系统；表中单独列出是为了端口与跳转清晰。

### 当前已启用 / 已占端口

| 端口 | 系统 | 本机地址 | 启动命令 | 说明 |
|------|------|----------|----------|------|
| **5173** | marketing | http://localhost:5173 | `npm run dev:marketing` | 已迁 |
| **5174** | user | http://localhost:5174 | `npm run dev:user` | 已迁（13 页） |
| **5175** | entry | http://localhost:5175 | `npm run dev:entry` | 已迁 |
| **5176** | admin | http://localhost:5176 | `npm run dev:admin` | 已迁（16 页） |
| **5177** | mes | http://localhost:5177 | `npm run dev:mes` | 已迁（10 页） |
| **5178** | supplier | http://localhost:5178 | `npm run dev:supplier` | 已迁（10 页） |

`npm run stop` 会清理 **5173–5178**。

---

## PAGE_MAP 文档规范（强制）

**不要** 在仓库里随手新建零散 `.md`。每个系统 **最多** 两份业务文档：

| 文件 | 职责 |
|------|------|
| `apps/<id>/README.md` | 怎么跑、目录结构、环境变量（短） |
| `apps/<id>/PAGE_MAP.md` | **唯一** HTML↔React 盘点与迁移状态 |

营销例外：盘点已写在 `apps/marketing/README.md` 的「HTML ↔ React 迁移清单」段，**不再另建** `PAGE_MAP.md`，避免双份。

### `PAGE_MAP.md` 必须含有的章节（顺序固定）

1. **元信息表** — systemId / 端口 / 静态源绝对路径 / React 根  
2. **端口与联调** — 本系统 URL + 依赖的入口登录 URL  
3. **目录盘点** — `apps/<id>/` 源码树；**每个文件夹与关键文件都要有 `#` 注释**（粒度对齐营销 README「目录速览」；营销写在 README 该段）  
4. **框架归类（Framework）** — **同类壳只写一次**：框架 ID、共享 React 组件、共享 CSS、适用页面列表  
5. **页面盘点表** — 一行一页：静态 HTML｜路由｜状态｜JSON｜框架 ID｜备注  
6. **汇总计数** — 已迁 / 待迁 / 不迁 / HTML 总数  

### 状态枚举（统一用词）

| 状态 | 含义 |
|------|------|
| `React 已迁` | 路由 + 组件 + 文案可用 |
| `框架已立` | 共用壳已有，本页内容待填 |
| `待迁` | 尚未动手 |
| `不迁` | 明确不下线/已并入他页 |
| `已并入他系统` | 例如访客报价 → marketing `/quote` |

### 框架归类规则

- 同一套侧栏 / Auth 壳 / 顶栏布局 → **一个 Framework ID**（如 `F-auth-shell`、`F-user-workspace`）  
- 页面盘点表只写 Framework ID，**不要**每行重复写组件路径  
- 完成一页：更新状态 + 写入 `locales` JSON（或该系统约定的数据文件）+ 如需新壳再新增 Framework 行  

---

## 根目录命令

```bash
cd D:\zhizao\zhizao\react
npm install

npm run dev             # marketing(:5173) + entry(:5175)
npm run dev:marketing
npm run dev:entry
npm run dev:user        # :5174
npm run dev:admin       # :5176
npm run dev:mes         # :5177
npm run dev:supplier    # :5178
npm run build:marketing
npm run build:entry
npm run stop
```

| 脚本 | 行为 |
|------|------|
| `npm run dev` | 并行启动 **5173 + 5175**（营销 + 入口联调） |
| `npm run dev:user` / `dev:admin` / `dev:mes` / `dev:supplier` | 各业务系统独立端口 |
| `npm run stop` | `scripts/stop-dev.mjs` 清理 5173–5178 |

---

## 1. marketing · 营销页

| 项 | 值 |
|----|-----|
| systemId | `marketing` |
| 包名 | `@zhizao/frontend-marketing` |
| 目录 | `apps/marketing` |
| **开发端口** | **5173** |
| 本机地址 | http://localhost:5173 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\营销页（已核对）` |
| 盘点 | `apps/marketing/README.md` →「HTML ↔ React 迁移清单」 |
| 上推 | `sync-to-push.ps1` → `D:\zhizao\zhizao\marketing-react-main` |

职责：官网 / 能力 / 方案 / 行业 / 资源 / 关于 / 访客报价（`/quote`）。  
登录跳转：`entryUrl()` → **5175**。

---

## 2. entry · 共用入口

| 项 | 值 |
|----|-----|
| systemId | `entry`（非业务系统） |
| 包名 | `@zhizao/frontend-entry` |
| 目录 | `apps/entry` |
| **开发端口** | **5175** |
| 本机地址 | http://localhost:5175 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\入口` |
| 盘点 | [`apps/entry/PAGE_MAP.md`](apps/entry/PAGE_MAP.md) |

职责：Hub + 各 portal 登录/注册/找回密码。  
详见 PAGE_MAP：框架 `F-auth-shell` / `F-forgot` / `F-hub`。

---

## 3. user · 用户端

| 项 | 值 |
|----|-----|
| systemId | `user` |
| 包名 | `@zhizao/frontend-user` |
| 目录 | `apps/user` |
| **开发端口** | **5174** |
| 本机地址 | http://localhost:5174 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\用户（已核对）` |
| 登录入口 | http://localhost:5175/login |
| 盘点 | [`apps/user/PAGE_MAP.md`](apps/user/PAGE_MAP.md) |

职责：登录后的客户工作台（报价、订单、模型、AI 工具等）。  
框架：`F-user-workspace`（`UserShell` + 13 页 `locales` JSON）。详见 PAGE_MAP。  
`报价模型上传页未登录.html` → **已并入 marketing** `/quote`（不要再在 user 迁一份）。

---

## 4. admin · 管理后台

| 项 | 值 |
|----|-----|
| systemId | `admin` |
| 包名 | `@zhizao/frontend-admin` |
| 目录 | `apps/admin` |
| **开发端口** | **5176** |
| 本机地址 | http://localhost:5176 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\后台（已核对）` |
| 登录入口 | http://localhost:5175/admin/login |
| 盘点 | [`apps/admin/PAGE_MAP.md`](apps/admin/PAGE_MAP.md) |

职责：权限、运营、RFQ 审核、客服、财务、系统设置等控制台。  
框架：`F-admin-workspace`（`AdminShell` + 16 页 `locales` JSON）。详见 PAGE_MAP。

---

## 5. mes · MES 工作台

| 项 | 值 |
|----|-----|
| systemId | `mes` |
| 包名 | `@zhizao/frontend-mes` |
| 目录 | `apps/mes` |
| **开发端口** | **5177** |
| 本机地址 | http://localhost:5177 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\MES工作台（已核对）` |
| 登录入口 | http://localhost:5175/mes/login |
| 盘点 | [`apps/mes/PAGE_MAP.md`](apps/mes/PAGE_MAP.md) |

框架：`F-mes-workspace`（`MesShell` + 10 页 `locales` JSON）。详见 PAGE_MAP。

---

## 6. supplier · 供应商端

| 项 | 值 |
|----|-----|
| systemId | `supplier` |
| 包名 | `@zhizao/frontend-supplier` |
| 目录 | `apps/supplier` |
| **开发端口** | **5178** |
| 本机地址 | http://localhost:5178 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\供应商页面（已核对）` |
| 登录入口 | http://localhost:5175/supplier/login |
| 盘点 | [`apps/supplier/PAGE_MAP.md`](apps/supplier/PAGE_MAP.md) |

框架：`F-supplier-workspace`（`SupplierShell` + 10 页 `locales` JSON）。详见 PAGE_MAP。

---

## 跨系统跳转约定

1. **不要** 在 A 系统路由树里挂 B 系统业务页。  
2. 用 **完整 origin**（开发期带端口；生产用域名）。  
3. 登录统一走 `apps/entry`（**5175**）；成功后再 `redirect` 到目标系统。  
4. 营销（**5173**）→ 入口：`apps/marketing/src/system/origins.ts` 的 `entryUrl()`。  
5. 入口 → 各系统：`apps/entry/src/config/origins.ts` 的 `VITE_*_ORIGIN`（user **5174** · admin **5176** · mes **5177** · supplier **5178**）。

---

## 新建系统检查清单

1. `apps/<id>/` 建包  
2. 根 `workspaces` + `dev:<id>` / `build:<id>`  
3. `src/system/meta.ts` → `data-system`  
4. Vite 端口 + `strictPort: true`，**立刻**写入本文件与 `PAGE_MAP.md`  
5. `scripts/stop-dev.mjs` 加入端口  
6. 新建 `PAGE_MAP.md`（按上方规范，**目录盘点**对照营销 README「目录速览」粒度）  
7. 登录：确认 entry 路由与 `VITE_*_ORIGIN`  
8. 静态 HTML **只** 留在 `D:\zhizao\内容\代码\前端页面\…`

---

## 约定（摘要）

- 系统之间 **不** 共用一套路由树或一套 `locales` 根目录。  
- **可以** 共用根 `node_modules` 与后续 `packages/*`。  
- **不要** 把五系统打成同一个 Vite 应用 / 同一套 `dist`。  
- 盘点与迁移状态 **只** 写在各系统 `PAGE_MAP.md`（营销写在其 README 清单段）。  
- 当前端口：**5173 marketing · 5174 user · 5175 entry · 5176 admin · 5177 mes · 5178 supplier**。
