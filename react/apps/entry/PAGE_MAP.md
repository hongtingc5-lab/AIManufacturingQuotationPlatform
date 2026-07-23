# entry · PAGE_MAP

> 共用登录/注册入口盘点。规范见 [`../../SYSTEMS.md`](../../SYSTEMS.md)「PAGE_MAP 文档规范」。

| 项 | 值 |
|----|-----|
| systemId | `entry` |
| 包名 | `@zhizao/frontend-entry` |
| 开发端口 | **5175** |
| 本机地址 | http://localhost:5175 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\入口` |
| React 根 | `apps/entry/src` |

## 端口与联调

| 用途 | URL |
|------|-----|
| **默认** | http://localhost:5175/ → **重定向** `/login`（客户工作台） |
| 客户登录 | http://localhost:5175/login → 成功后跳转 :5174 |
| 客户注册 | http://localhost:5175/register |
| 多系统 Hub（预留） | http://localhost:5175/hub（Admin/MES/供应商暂显示「后续链接」） |
| 返回营销 | http://localhost:5173/（`VITE_MARKETING_ORIGIN`） |
| 客户工作台跳转 | http://localhost:5174/（`VITE_USER_ORIGIN`） |
| 管理后台跳转 | http://localhost:5176/（`VITE_ADMIN_ORIGIN`，Hub 暂未外链） |
| MES 跳转 | http://localhost:5177/（`VITE_MES_ORIGIN`，Hub 暂未外链） |
| 供应商跳转 | http://localhost:5178/（`VITE_SUPPLIER_ORIGIN`，Hub 暂未外链） |

语言：路由 `/en/…` + Cookie/`promakehub_lang`（与营销跨端口同步）。

---

## 目录盘点

> 粒度对齐营销 README「目录速览」：每个文件夹、关键文件都有 `#` 注释。

```
apps/entry/
├── index.html                 # Vite HTML 入口
├── package.json               # @zhizao/frontend-entry
├── vite.config.ts             # 开发/预览端口 5175 · strictPort
├── tsconfig.json              # TS 编译选项
├── README.md                  # 怎么跑 + 环境变量（短）
├── PAGE_MAP.md                # 本文件（本系统唯一盘点）
│
└── src/                       # React 源码根
    ├── main.tsx               # React 挂载 + BrowserRouter
    ├── App.tsx                # 默认 / → /login；Hub 在 /hub；Auth 路由含预留门户
    ├── vite-env.d.ts          # Vite 类型声明
    │
    ├── system/                # 系统身份
    │   └── meta.ts            # systemId / data-system="entry"
    │
    ├── components/            # 壳层组件
    │   ├── AuthShell.tsx      # 左视觉 + 右表单登录/注册壳
    │   ├── AuthFooter.tsx     # 表单区页脚链接
    │   └── BrandLogo.tsx      # 品牌 SVG
    │
    ├── pages/                 # 路由页面组件
    │   ├── HubPage.tsx        # 多系统清单（/hub；非默认首页）
    │   ├── AuthPage.tsx       # 登录/注册（客户默认；Admin/MES/供应商预留）
    │   └── ForgotPasswordPage.tsx  # 找回密码
    │
    ├── data/                  # 非文案结构化配置
    │   └── authPages.ts       # 各角色登录/注册文案与视觉配置
    │
    ├── config/                # 跨系统 origin / 跳转
    │   ├── origins.ts         # VITE_*_ORIGIN → 5173–5178
    │   └── redirects.ts       # 登录成功跳转目标
    │
    ├── i18n/                  # 语言与跨端口同步
    │   ├── lang.ts            # 语言读写 / Cookie promakehub_lang
    │   ├── LangSync.tsx       # URL ↔ locale 硬跳转同步
    │   └── catalog.ts         # Hub 等短文案加载
    │
    ├── interactions/          # 表单交互增强
    │   └── authInteractions.ts # 密码显隐 / 校验等（自静态 auth.js 重写）
    │
    ├── locales/               # 入口短文案（非整页 HTML）
    │   ├── zh.json            # 中文 Hub / 通用文案
    │   └── en.json            # 英文 Hub / 通用文案
    │
    └── styles/                # 样式
        ├── auth.css           # 登录/注册（自静态 auth.css 增强）
        └── hub.css            # Hub 选择页
```

---

## 框架归类（Framework）

同类壳只定义一次；页面表只引用 Framework ID。

| Framework ID | 说明 | 共享 React | 共享样式 / 数据 | 覆盖静态页 |
|--------------|------|------------|-----------------|------------|
| `F-hub` | 五系统选择 Hub | `pages/HubPage.tsx` | `styles/hub.css` · `locales/{zh,en}.json` | （无静态稿，React 自建） |
| `F-auth-shell` | 左视觉 + 右表单登录/注册 | `components/AuthShell.tsx` · `pages/AuthPage.tsx` | `styles/auth.css` · `data/authPages.ts` · `interactions/authInteractions.ts` | 登录/注册共 8 个 HTML（客户/Admin/MES/供应商 × 登录+注册） |
| `F-forgot` | 找回密码 | `pages/ForgotPasswordPage.tsx` | 复用 `AuthShell` + `auth.css` | `忘记密码.html` |

**说明：** 静态目录里客户登录/注册外链 `auth.css`；Admin/MES/供应商页多为内联样式，但 DOM 结构同属 Auth 壳 → **全部归入 `F-auth-shell`**，不按 CSS 外链拆第二套框架。

---

## 页面盘点表

对照源只列中文 HTML；英文在 `入口/EN/`（文件名见备注）。

| 中文静态 HTML | React 路由（中） | React 路由（英） | 状态 | 文案 / 配置 | Framework | 备注 |
|---------------|------------------|------------------|------|-------------|-----------|------|
| （无） | `/` → `/login` | `/en` → `/en/login` | React 已迁 | — | — | **默认客户工作台登录** |
| （无） | `/hub` | `/en/hub` | React 已迁 | `locales/*.json#hub` | `F-hub` | 多系统清单；Admin/MES/供应商暂「后续链接」 |
| `登录.html` | `/login` | `/en/login` | React 已迁 | `authPages.ts#customer-login` | `F-auth-shell` | 登录成功 → :5174；EN: `EN/login.html` |
| `注册页.html` | `/register` | `/en/register` | React 已迁 | `authPages.ts#customer-register` | `F-auth-shell` | EN: `EN/register.html` |
| `忘记密码.html` | `/forgot-password` | `/en/forgot-password` | React 已迁 | `ForgotPasswordPage` 内 copy | `F-forgot` | EN: `EN/forgot-password.html` |
| `管理员登录.html` | `/admin/login` | `/en/admin/login` | React 已迁 | `authPages.ts#admin-login` | `F-auth-shell` | 路由预留，Hub 暂不外链 |
| `管理员注册.html` | `/admin/register` | `/en/admin/register` | React 已迁 | `authPages.ts#admin-register` | `F-auth-shell` | 同上 |
| `MES登录.html` | `/mes/login` | `/en/mes/login` | React 已迁 | `authPages.ts#mes-login` | `F-auth-shell` | 同上 |
| `MES注册.html` | `/mes/register` | `/en/mes/register` | React 已迁 | `authPages.ts#mes-register` | `F-auth-shell` | 同上 |
| `供应商登录.html` | `/supplier/login` | `/en/supplier/login` | React 已迁 | `authPages.ts#supplier-login` | `F-auth-shell` | 同上 |
| `供应商注册.html` | `/supplier/register` | `/en/supplier/register` | React 已迁 | `authPages.ts#supplier-register` | `F-auth-shell` | 同上 |

### 静态资源对照

| 静态文件 | React 位置 | 状态 |
|----------|------------|------|
| `auth.css` | `src/styles/auth.css` | 已迁（React 侧有增强，对稿时以新路径静态为视觉基准） |
| `auth.js` | `src/interactions/authInteractions.ts` | 已迁（逻辑重写，非逐行拷贝） |

---

## 汇总

| 状态 | 数量 |
|------|------|
| React 已迁（含 Hub） | 10 |
| 待迁 | 0 |
| 中文 HTML 文件总数 | 9 |
| 英文 HTML 文件总数 | 9 |

**结论：** 入口默认落地 **客户工作台登录**（`/` → `/login` → :5174）。Admin/MES/供应商路由已预留，Hub（`/hub`）暂标「后续链接」。
