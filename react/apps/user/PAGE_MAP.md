# user · PAGE_MAP

> 用户端（客户工作台）盘点。规范见 [`../../SYSTEMS.md`](../../SYSTEMS.md)「PAGE_MAP 文档规范」。

| 项 | 值 |
|----|-----|
| systemId | `user` |
| 包名 | `@zhizao/frontend-user` |
| 开发端口 | **5174** |
| 本机地址 | http://localhost:5174 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\用户（已核对）` |
| React 根 | `apps/user/src` |
| 登录入口 | http://localhost:5175/login |

## 端口与联调

| 用途 | URL |
|------|-----|
| 用户端 | http://localhost:5174/ |
| 登录 | http://localhost:5175/login?lang=… |
| 营销 | http://localhost:5173/（访客报价 `/quote`） |

```bash
cd D:\zhizao\zhizao\react
npm run dev:user
```

---

## 目录盘点

> 粒度对齐营销 README「目录速览」：每个文件夹、关键文件都有 `#` 注释。

```
apps/user/
├── index.html                 # Vite HTML 入口（Tailwind CDN + Material Symbols）
├── package.json               # @zhizao/frontend-user
├── vite.config.ts             # 开发/预览端口 5174 · strictPort
├── tsconfig.json              # TS 编译选项
├── README.md                  # 怎么跑（短）；盘点不写这里
├── PAGE_MAP.md                # 本文件（本系统唯一盘点）
│
├── public/                    # 静态资源（原样映射到站点根路径）
│   └── tailwind-config.js     # Tailwind theme（自静态用户首页抽取）
│
└── src/                       # React 源码根
    ├── main.tsx               # React 挂载 + BrowserRouter
    ├── App.tsx                # 全站路由（UserShell 内 13 页）
    ├── vite-env.d.ts          # Vite 类型声明
    │
    ├── system/                # 系统身份
    │   └── meta.ts            # systemId / data-system="user"
    │
    ├── components/            # 壳层组件
    │   ├── UserShell.tsx      # 侧栏 w-64 + 顶栏搜索 / 智能·专业报价 CTA / 语言
    │   └── BrandLogo.tsx      # 品牌 SVG（与营销/入口同标）
    │
    ├── pages/                 # 路由页面组件
    │   └── UserHtmlPage.tsx   # 渲染 locales mainHtml + SPA 内链改写
    │
    ├── data/                  # 非文案结构化配置
    │   ├── shell.json         # 品牌 / 侧栏导航 / 顶栏 CTA 文案
    │   └── pages.ts           # 路由 registry + getUserPage()
    │
    ├── i18n/                  # 语言切换
    │   └── LocaleContext.tsx  # zh/en · Cookie/localStorage promakehub_lang
    │
    ├── styles/                # 全局样式
    │   └── workspace.css      # Material Symbols / scrollbar-hide
    │
    └── locales/               # 中英文案与页面 HTML 片段（en/ 与 zh/ 同构）
        ├── zh/                # 中文页正文 JSON
        │   ├── registry.json              # slug → 文件名清单
        │   ├── home.json                  # 工作台 /
        │   ├── ai-smart-quote.json        # 智能工作台 /ai/smart-quote
        │   ├── ai-text-to-3d.json         # 文字转 3D /ai/text-to-3d
        │   ├── ai-image-to-3d.json        # 图片转 3D /ai/image-to-3d
        │   ├── quote-upload.json          # 专业报价上传 /quotes/upload
        │   ├── orders.json                # 订单中心 /orders
        │   ├── quote-detail.json          # 报价详情模板 /quotes/detail
        │   ├── quote-edit.json            # 报价修改 /quotes/edit
        │   ├── models.json                # 模型中心 /models
        │   ├── membership.json            # 会员中心 /membership
        │   ├── account.json               # 账号中心 /account
        │   ├── messages.json              # 消息中心 /messages
        │   └── analytics.json             # 数据分析 /analytics
        └── en/                # 英文页正文（文件名与 zh/ 同构）
```

静态源另有 `quote-linkage.js`（工具页脚本，尚未迁入 `src/interactions/`）。

---

## 框架归类（Framework）

| Framework ID | 说明 | 共享 React | 共享样式 / 数据 | 覆盖静态页 |
|--------------|------|------------|-----------------|------------|
| `F-user-workspace` | 顶栏 + 侧栏 + 主区 | `UserShell` · `UserHtmlPage` | `workspace.css` · `shell.json` · `locales/*` · Tailwind CDN | **本包 13 页** |
| — | 访客报价未登录 | **不在本包** | — | → marketing `/quote` |

---

## 页面盘点表

| 中文静态 HTML | React 路由 | 状态 | JSON | Framework | 备注 |
|---------------|------------|------|------|-----------|------|
| `用户系统首页.html` | `/` | React 已迁 | `locales/*/home.json` | `F-user-workspace` | |
| `ai模型智能报价.html` | `/ai/smart-quote` | React 已迁 | `locales/*/ai-smart-quote.json` | `F-user-workspace` | |
| `ai文字转模型.html` | `/ai/text-to-3d` | React 已迁 | `locales/*/ai-text-to-3d.json` | `F-user-workspace` | 侧栏无独立项 |
| `ai图片转模型.html` | `/ai/image-to-3d` | React 已迁 | `locales/*/ai-image-to-3d.json` | `F-user-workspace` | 侧栏无独立项 |
| `报价模型上传页.html` | `/quotes/upload` | React 已迁 | `locales/*/quote-upload.json` | `F-user-workspace` | 已登录上传 |
| `报价订单中心.html` | `/orders` | React 已迁 | `locales/*/orders.json` | `F-user-workspace` | |
| `报价详情.html` | `/quotes/detail` | React 已迁 | `locales/*/quote-detail.json` | `F-user-workspace` | 模板；动态 `:id` 后续 |
| `报价详情二级-报价信息修改.html` | `/quotes/edit` | React 已迁 | `locales/*/quote-edit.json` | `F-user-workspace` | |
| `模型中心.html` | `/models` | React 已迁 | `locales/*/models.json` | `F-user-workspace` | |
| `会员中心.html` | `/membership` | React 已迁 | `locales/*/membership.json` | `F-user-workspace` | |
| `账号中心.html` | `/account` | React 已迁 | `locales/*/account.json` | `F-user-workspace` | |
| `消息中心.html` | `/messages` | React 已迁 | `locales/*/messages.json` | `F-user-workspace` | |
| `数据分析页面.html` | `/analytics` | React 已迁 | `locales/*/analytics.json` | `F-user-workspace` | |
| `报价模型上传页未登录.html` | — | 已并入他系统 | marketing `quote-guest.json` | — | → marketing `/quote` |

英文：`用户（已核对）/EN/` → `locales/en/`。

---

## 汇总

| 状态 | 数量 |
|------|------|
| React 已迁 | 13 |
| 已并入他系统 | 1 |
| 待迁 | 0 |
| 中文 HTML 总数 | 14 |
| 英文 HTML 总数 | 14 |

**结论：** 用户端 HTML 已落入 `F-user-workspace`。后续对稿、工具页脚本与报价动态路由。
