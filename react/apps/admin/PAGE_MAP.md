# admin · PAGE_MAP

> 管理后台盘点。规范见 [`../../SYSTEMS.md`](../../SYSTEMS.md)「PAGE_MAP 文档规范」。

| 项 | 值 |
|----|-----|
| systemId | `admin` |
| 包名 | `@zhizao/frontend-admin` |
| 开发端口 | **5176** |
| 本机地址 | http://localhost:5176 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\后台（已核对）` |
| React 根 | `apps/admin/src` |
| 登录入口 | http://localhost:5175/admin/login |

## 端口与联调

| 用途 | URL |
|------|-----|
| 管理后台 | http://localhost:5176/ |
| 管理员登录 | http://localhost:5175/admin/login |
| 营销 | http://localhost:5173/ |

```bash
cd D:\zhizao\zhizao\react
npm run dev:admin
```

**内容基准：** 静态后台多为占位模板。品牌以营销/入口为准（中文「敏捷智造」、英文 `AgileMakeAI`）；AI 管理页五个模块与营销站 `translation.json#ai.modules` 对齐。

---

## 目录盘点

> 粒度对齐营销 README「目录速览」：每个文件夹、关键文件都有 `#` 注释。

```
apps/admin/
├── index.html                 # Vite HTML 入口（Tailwind CDN + Material Symbols）
├── package.json               # @zhizao/frontend-admin
├── vite.config.ts             # 开发/预览端口 5176 · strictPort
├── tsconfig.json              # TS 编译选项（resolveJsonModule）
├── README.md                  # 怎么跑（短）；盘点不写这里
├── PAGE_MAP.md                # 本文件（本系统唯一盘点）
│
├── public/                    # 静态资源（原样映射到站点根路径）
│   └── tailwind-config.js     # Tailwind theme（色板 / 字号 / spacing tokens）
│
└── src/                       # React 源码根
    ├── main.tsx               # React 挂载 + BrowserRouter
    ├── App.tsx                # 全站路由（AdminShell 内 16 页）
    ├── vite-env.d.ts          # Vite 类型声明
    │
    ├── system/                # 系统身份
    │   └── meta.ts            # systemId / data-system="admin"
    │
    ├── components/            # 壳层组件
    │   ├── AdminShell.tsx     # 侧栏 w-72 + 顶栏搜索 / 语言 / 按路由 main 背景
    │   └── BrandLogo.tsx      # 品牌 SVG（与营销/入口同标）
    │
    ├── pages/                 # 路由页面组件
    │   └── AdminHtmlPage.tsx  # 渲染 locales mainHtml；客服 Tabs；SPA 内链
    │
    ├── data/                  # 非文案结构化配置
    │   ├── shell.json         # 品牌 / 侧栏 15 项导航 / 顶栏文案
    │   └── pages.ts           # 路由 registry + getAdminPage()
    │
    ├── i18n/                  # 语言切换
    │   └── LocaleContext.tsx  # zh/en · Cookie/localStorage promakehub_lang
    │
    ├── styles/                # 全局样式
    │   └── admin-workspace.css # Material Symbols / shadow / scrollbar
    │
    └── locales/               # 中英文案与页面 HTML 片段（en/ 与 zh/ 同构）
        ├── zh/                # 中文页正文 JSON
        │   ├── registry.json              # slug → 文件名清单
        │   ├── home.json                  # 平台总览 /
        │   ├── users.json                 # 用户管理 /users
        │   ├── customers.json             # 客户管理 /customers
        │   ├── customers-enterprise.json  # 企业用户 /customers/enterprise
        │   ├── suppliers.json             # 供应商管理 /suppliers
        │   ├── supply.json                # 供应管理 /supply
        │   ├── rfq.json                   # RFQ 管理 /rfq
        │   ├── ai.json                    # AI 管理 /ai（营销五模块）
        │   ├── knowledge.json             # 知识库 /knowledge
        │   ├── mes-oversight.json         # MES 监管 /mes-oversight
        │   ├── support.json               # 客服中心 /support
        │   ├── marketing-cms.json         # 营销页面管理 /marketing-cms
        │   ├── permissions.json           # 平台权限 /permissions
        │   ├── analytics.json             # 数据分析 /analytics
        │   ├── finance.json               # 财务管理 /finance
        │   └── settings.json              # 系统设置 /settings
        └── en/                # 英文页正文（文件名与 zh/ 同构）
```

---

## 框架归类（Framework）

| Framework ID | 说明 | 共享 React | 共享样式 / 数据 | 覆盖静态页 |
|--------------|------|------------|-----------------|------------|
| `F-admin-workspace` | 顶栏 + 侧栏 + 主区 | `AdminShell` · `AdminHtmlPage` | `admin-workspace.css` · `shell.json` · `locales/*` · Tailwind CDN | **全部 16 页** |

---

## 页面盘点表

| 中文静态 HTML | React 路由 | 状态 | JSON | Framework | 备注 |
|---------------|------------|------|------|-----------|------|
| `后台首页.html` | `/` | React 已迁 | `locales/*/home.json` | `F-admin-workspace` | |
| `用户管理后台.html` | `/users` | React 已迁 | `locales/*/users.json` | `F-admin-workspace` | |
| `客户管理页面.html` | `/customers` | React 已迁 | `locales/*/customers.json` | `F-admin-workspace` | |
| `客户管理页面——企业用户.html` | `/customers/enterprise` | React 已迁 | `locales/*/customers-enterprise.json` | `F-admin-workspace` | 侧栏无独立项 |
| `供应商管理.html` | `/suppliers` | React 已迁 | `locales/*/suppliers.json` | `F-admin-workspace` | |
| `供应管理.html` | `/supply` | React 已迁 | `locales/*/supply.json` | `F-admin-workspace` | |
| `RFQ管理.html` | `/rfq` | React 已迁 | `locales/*/rfq.json` | `F-admin-workspace` | |
| `MES监管.html` | `/mes-oversight` | React 已迁 | `locales/*/mes-oversight.json` | `F-admin-workspace` | |
| `客服中心.html` | `/support` | React 已迁 | `locales/*/support.json` | `F-admin-workspace` | Tabs 已复现 |
| `平台权限中心.html` | `/permissions` | React 已迁 | `locales/*/permissions.json` | `F-admin-workspace` | |
| `数据分析页面.html` | `/analytics` | React 已迁 | `locales/*/analytics.json` | `F-admin-workspace` | |
| `财务管理页面.html` | `/finance` | React 已迁 | `locales/*/finance.json` | `F-admin-workspace` | |
| `知识库管理页面.html` | `/knowledge` | React 已迁 | `locales/*/knowledge.json` | `F-admin-workspace` | |
| `ai管理页面.html` | `/ai` | React 已迁 | `locales/*/ai.json` | `F-admin-workspace` | 营销 AI 五模块 |
| `营销页面管理.html` | `/marketing-cms` | React 已迁 | `locales/*/marketing-cms.json` | `F-admin-workspace` | |
| `系统设置.html` | `/settings` | React 已迁 | `locales/*/settings.json` | `F-admin-workspace` | |

英文：`后台（已核对）/EN/` → `locales/en/`。

---

## 汇总

| 状态 | 数量 |
|------|------|
| React 已迁 | 16 |
| 待迁 | 0 |
| 中文 HTML 总数 | 16 |
| 英文 HTML 总数 | 16 |

**结论：** 后台 HTML 已全部落入 `F-admin-workspace`。后续只做对稿/交互增强。
