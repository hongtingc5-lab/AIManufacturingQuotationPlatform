# supplier · PAGE_MAP

> 供应商端盘点。规范见 [`../../SYSTEMS.md`](../../SYSTEMS.md)「PAGE_MAP 文档规范」。

| 项 | 值 |
|----|-----|
| systemId | `supplier` |
| 包名 | `@zhizao/frontend-supplier` |
| 开发端口 | **5178** |
| 本机地址 | http://localhost:5178 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\供应商页面（已核对）` |
| React 根 | `apps/supplier/src` |
| 登录入口 | http://localhost:5175/supplier/login |

## 端口与联调

| 用途 | URL |
|------|-----|
| 供应商端 | http://localhost:5178/ |
| 供应商登录 | http://localhost:5175/supplier/login |
| 营销 / 入口 | :5173 / :5175 |

```bash
cd D:\zhizao\zhizao\react
npm run dev:supplier
```

品牌以营销/入口为准（静态稿原「ForgeAI」已改为 **敏捷智造** / **AgileMakeAI**）。

---

## 目录盘点

> 粒度对齐营销 README「目录速览」：每个文件夹、关键文件都有 `#` 注释。

```
apps/supplier/
├── index.html                 # Vite HTML 入口（Tailwind CDN + Material Symbols）
├── package.json               # @zhizao/frontend-supplier
├── vite.config.ts             # 开发/预览端口 5178 · strictPort
├── tsconfig.json              # TS 编译选项
├── README.md                  # 怎么跑（短）；盘点不写这里
├── PAGE_MAP.md                # 本文件（本系统唯一盘点）
│
├── public/                    # 静态资源（原样映射到站点根路径）
│   └── tailwind-config.js     # Tailwind theme（自静态首页抽取）
│
└── src/                       # React 源码根
    ├── main.tsx               # React 挂载 + BrowserRouter
    ├── App.tsx                # 全站路由（SupplierShell 内 10 页）
    ├── vite-env.d.ts          # Vite 类型声明
    │
    ├── system/                # 系统身份
    │   └── meta.ts            # systemId / data-system="supplier"
    │
    ├── components/            # 壳层组件
    │   ├── SupplierShell.tsx  # 侧栏 240px + 顶栏搜索 / 语言切换
    │   └── BrandLogo.tsx      # 品牌 SVG（与营销/入口同标）
    │
    ├── pages/                 # 路由页面组件
    │   └── SupplierHtmlPage.tsx # 渲染 locales mainHtml + SPA 内链改写
    │
    ├── data/                  # 非文案结构化配置
    │   ├── shell.json         # 品牌 / 侧栏导航 / 顶栏文案
    │   └── pages.ts           # 路由 registry + getSupplierPage()
    │
    ├── i18n/                  # 语言切换
    │   └── LocaleContext.tsx  # zh/en · Cookie/localStorage promakehub_lang
    │
    ├── styles/                # 全局样式
    │   └── workspace.css      # Material Symbols / scrollbar
    │
    └── locales/               # 中英文案与页面 HTML 片段（en/ 与 zh/ 同构）
        ├── zh/                # 中文页正文 JSON
        │   ├── registry.json              # slug → 文件名清单
        │   ├── home.json                  # 经营驾驶舱 /
        │   ├── onboarding.json            # 企业入驻 /onboarding
        │   ├── rfq.json                   # RFQ 竞价 /rfq
        │   ├── orders-platform.json       # 平台订单 /orders/platform
        │   ├── orders-crm.json            # 业务订单 CRM /orders/crm
        │   ├── enterprise.json            # 企业中心 /enterprise
        │   ├── training.json              # 培训中心 /training
        │   ├── assessment.json            # 考核中心 /assessment
        │   ├── messages.json              # 消息中心 /messages
        │   └── help.json                  # 帮助中心 /help
        └── en/                # 英文页正文（文件名与 zh/ 同构）
```

---

## 框架归类（Framework）

| Framework ID | 说明 | 共享 React | 共享样式 / 数据 | 覆盖静态页 |
|--------------|------|------------|-----------------|------------|
| `F-supplier-workspace` | 侧栏 + 顶栏 + 主区 | `SupplierShell` · `SupplierHtmlPage` | `workspace.css` · `shell.json` · `locales/*` · Tailwind CDN | **全部 10 页** |

---

## 页面盘点表

| 中文静态 HTML | React 路由 | 状态 | JSON | Framework | 备注 |
|---------------|------------|------|------|-----------|------|
| `首页.html` | `/` | React 已迁 | `locales/*/home.json` | `F-supplier-workspace` | 经营驾驶舱 |
| `企业入驻.html` | `/onboarding` | React 已迁 | `locales/*/onboarding.json` | `F-supplier-workspace` | |
| `RFQ竞价中心.html` | `/rfq` | React 已迁 | `locales/*/rfq.json` | `F-supplier-workspace` | |
| `平台订单页.html` | `/orders/platform` | React 已迁 | `locales/*/orders-platform.json` | `F-supplier-workspace` | |
| `业务订单CRM页.html` | `/orders/crm` | React 已迁 | `locales/*/orders-crm.json` | `F-supplier-workspace` | |
| `企业中心页.html` | `/enterprise` | React 已迁 | `locales/*/enterprise.json` | `F-supplier-workspace` | |
| `培训中心页面.html` | `/training` | React 已迁 | `locales/*/training.json` | `F-supplier-workspace` | |
| `考核中心页面.html` | `/assessment` | React 已迁 | `locales/*/assessment.json` | `F-supplier-workspace` | |
| `消息中心页面.html` | `/messages` | React 已迁 | `locales/*/messages.json` | `F-supplier-workspace` | |
| `帮助中心页面.html` | `/help` | React 已迁 | `locales/*/help.json` | `F-supplier-workspace` | |

英文：`供应商页面（已核对）/EN/` → `locales/en/`。

---

## 汇总

| 状态 | 数量 |
|------|------|
| React 已迁 | 10 |
| 待迁 | 0 |
| 中文 HTML 总数 | 10 |
| 英文 HTML 总数 | 10 |

**结论：** 供应商 HTML 已落入 `F-supplier-workspace`。后续对稿与表单交互增强。
