# mes · PAGE_MAP

> MES 工作台盘点。规范见 [`../../SYSTEMS.md`](../../SYSTEMS.md)「PAGE_MAP 文档规范」。

| 项 | 值 |
|----|-----|
| systemId | `mes` |
| 包名 | `@zhizao/frontend-mes` |
| 开发端口 | **5177** |
| 本机地址 | http://localhost:5177 |
| 静态 HTML 源 | `D:\zhizao\内容\代码\前端页面\MES工作台（已核对）` |
| React 根 | `apps/mes/src` |
| 登录入口 | http://localhost:5175/mes/login |

## 端口与联调

| 用途 | URL |
|------|-----|
| MES 工作台 | http://localhost:5177/ |
| MES 登录 | http://localhost:5175/mes/login |
| 营销 / 入口 | :5173 / :5175 |

```bash
cd D:\zhizao\zhizao\react
npm run dev:mes
```

品牌以营销/入口为准（静态稿原「ForgeAI」已改为 **敏捷智造** / **AgileMakeAI**）。

---

## 目录盘点

> 粒度对齐营销 README「目录速览」：每个文件夹、关键文件都有 `#` 注释。

```
apps/mes/
├── index.html                 # Vite HTML 入口（Tailwind CDN + Material Symbols）
├── package.json               # @zhizao/frontend-mes
├── vite.config.ts             # 开发/预览端口 5177 · strictPort
├── tsconfig.json              # TS 编译选项
├── README.md                  # 怎么跑（短）；盘点不写这里
├── PAGE_MAP.md                # 本文件（本系统唯一盘点）
│
├── public/                    # 静态资源（原样映射到站点根路径）
│   └── tailwind-config.js     # Tailwind theme（自静态 MES首页抽取）
│
└── src/                       # React 源码根
    ├── main.tsx               # React 挂载 + BrowserRouter
    ├── App.tsx                # 全站路由（MesShell 内 10 页）
    ├── vite-env.d.ts          # Vite 类型声明
    │
    ├── system/                # 系统身份
    │   └── meta.ts            # systemId / data-system="mes"
    │
    ├── components/            # 壳层组件
    │   ├── MesShell.tsx       # 侧栏 w-72 + 顶栏搜索 / 语言切换
    │   └── BrandLogo.tsx      # 品牌 SVG（与营销/入口同标）
    │
    ├── pages/                 # 路由页面组件
    │   └── MesHtmlPage.tsx    # 渲染 locales mainHtml + SPA 内链改写
    │
    ├── data/                  # 非文案结构化配置
    │   ├── shell.json         # 品牌 / 侧栏导航 / 顶栏文案
    │   └── pages.ts           # 路由 registry + getMesPage()
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
        │   ├── home.json                  # MES 首页 /
        │   ├── work-orders.json           # 工单管理 /work-orders
        │   ├── operations.json            # 工序执行 /operations
        │   ├── equipment.json             # 设备管理 /equipment
        │   ├── quality.json               # 质量管理 /quality
        │   ├── inventory.json             # 物料库存 /inventory
        │   ├── ai-assistant.json          # AI 生产助手 /ai-assistant
        │   ├── alerts.json                # 告警中心 /alerts
        │   ├── analytics.json             # 数据分析 /analytics
        │   └── settings.json              # 系统管理 /settings
        └── en/                # 英文页正文（文件名与 zh/ 同构）
```

---

## 框架归类（Framework）

| Framework ID | 说明 | 共享 React | 共享样式 / 数据 | 覆盖静态页 |
|--------------|------|------------|-----------------|------------|
| `F-mes-workspace` | 侧栏 + 顶栏 + 主区 | `MesShell` · `MesHtmlPage` | `workspace.css` · `shell.json` · `locales/*` · Tailwind CDN | **全部 10 页** |

---

## 页面盘点表

| 中文静态 HTML | React 路由 | 状态 | JSON | Framework | 备注 |
|---------------|------------|------|------|-----------|------|
| `MES首页.html` | `/` | React 已迁 | `locales/*/home.json` | `F-mes-workspace` | |
| `工单管理.html` | `/work-orders` | React 已迁 | `locales/*/work-orders.json` | `F-mes-workspace` | |
| `工序执行页面.html` | `/operations` | React 已迁 | `locales/*/operations.json` | `F-mes-workspace` | |
| `设备管理.html` | `/equipment` | React 已迁 | `locales/*/equipment.json` | `F-mes-workspace` | |
| `质量管理.html` | `/quality` | React 已迁 | `locales/*/quality.json` | `F-mes-workspace` | |
| `物料库存.html` | `/inventory` | React 已迁 | `locales/*/inventory.json` | `F-mes-workspace` | |
| `ai生产助手.html` | `/ai-assistant` | React 已迁 | `locales/*/ai-assistant.json` | `F-mes-workspace` | |
| `告警中心.html` | `/alerts` | React 已迁 | `locales/*/alerts.json` | `F-mes-workspace` | |
| `数据分析.html` | `/analytics` | React 已迁 | `locales/*/analytics.json` | `F-mes-workspace` | |
| `系统管理.html` | `/settings` | React 已迁 | `locales/*/settings.json` | `F-mes-workspace` | |

英文：`MES工作台（已核对）/EN/` → `locales/en/`。

---

## 汇总

| 状态 | 数量 |
|------|------|
| React 已迁 | 10 |
| 待迁 | 0 |
| 中文 HTML 总数 | 10 |
| 英文 HTML 总数 | 10 |

**结论：** MES HTML 已落入 `F-mes-workspace`。后续对稿与脚本交互增强。
