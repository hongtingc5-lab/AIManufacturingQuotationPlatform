# marketing-react 项目文档

营销站 React 工程：**一套路由** + **react-i18next 双语言包**（`zh` / `en`），**无 `/en/*` 镜像页**。  
语言只写 `localStorage.promakehub_lang`，切换不改 URL。

本文档同时记录：**目录职责、文件作用、迁移进度、已知缺口、建议整理方向**。

---

## 1. 迁移进度总览

| 模块 | 状态 | 说明 |
|------|------|------|
| 共享壳 顶栏 / 页脚 / 浮层 | **已做好** | 全站一套，带语言按钮 |
| 首页 | **已做好** | 拆成多个区块组件 |
| `/capabilities` 能力中心首页 | **已按 HTML 抽文案** | 四个方向入口 |
| `/capabilities/process` 工艺入口 | **已按 HTML 抽文案** | 筛选 + 卡片 |
| `/capabilities/service` 等三个入口 | **已按 HTML 抽文案** | 服务 / 材料 / 表面处理 |
| `/capabilities/{process\|service\|finish\|material}/:slug` 详情 | **已按 HTML 抽文案 + 新页已上** | 医疗 / 发黑 / 材料×7；正文请人工再验 |
| 能力中心旧 JSON 快照 | **已删掉** | JSON 只是以前补洞用的，**不是**正式对照稿 |
| Footer 付款 logo | **已修** | `PaymentBrands.tsx` 补齐图标 |
| Header 点菜单跳转后收不起来 | **已修** | 跳转后先关菜单，鼠标离开顶栏再允许打开 |
| 子页大图 / 底部蓝条被首页样式撑坏 | **已修** | 运行时补丁里修过 |
| 行业等页面的 body 标记 | **已修** | 按网址补上对应 class |
| 解决方案 / 行业 / 资源 / 关于 / 案例 | **壳子迁了，正文还是旧快照** | 应对 `营销页（已核对）` 再迁，别拿 JSON 当主稿 |
| 中英文切换骨架 | **已通** | 能力中心已接文案；正文要对静态稿 |
| CSS 拆成三层 | **还没做** | 见第 7 节 |

**一句话**：顶栏页脚和能力中心网址已经能用 React 打开；**内容算不算对，要拿 `营销页（已核对）` 的 HTML 逐页对。** 明细见 [§1.1](#11-能力中心迁移清单)、[§3.1](#31-已经做成-react-的页面浏览器能直接打开)。

### 仍待推进

1. **人工验收**：对照 `营销页（已核对）` 点开入口 + 抽样详情（文案已重抽，不等于验完）。  
2. **结构补齐**：材料入口对比表、详情 aside 小标题等 HTML 有而组件未渲的块。  
3. **其它栏目**：解决方案 / 行业 / 资源 / 关于（同样以静态 HTML 为准）。  
4. **样式整理 / 手机端再验**。

---

## 1.1 能力中心迁移清单

### 迁移原则（必读）

| 优先级 | 路径 | 角色 |
|--------|------|------|
| **1. 唯一对照源** | `D:\zhizao\zhizao\react\营销页（已核对）\`（中文）+ `\EN\`（英文） | 迁移时**只认这份 HTML**，结构与文案以它为准 |
| 2. 产物 | `src/pages/*` + `src/locales/{zh,en}/**` + `App.tsx` 路由 | React 页面与 i18n |
| ~~中转~~ | `public/static-pages/*.json` | **不是迁移源**。只是历史补洞快照，易丢内容；能力中心相关已删。后续批次**禁止**再从 JSON 抽正文当主源 |

状态怎么读（别当成黑话）：

| 说法 | 人话 |
|------|------|
| **能打开了，正文还要对稿** | 浏览器输入这个网址已经是 React 页面了；但页面上的文字/版式还没拿 `营销页（已核对）` 里的 HTML 逐项对过，不能当成「验收通过」 |
| **还没做** | 参考文件夹里有这个 HTML，但工程里还没有对应网址，打开会 404 或进不到正确页 |
| **壳子迁了，正文还是旧快照** | 顶栏页脚已是 React；中间正文仍从 `public/static-pages` 的 JSON 里灌进来（解决方案/行业等还在这状态） |

以前写的「能打开了，正文还要对稿」= 上表第一行，下面清单里改成大白话。

### 总览

| 类别 | 参考 HTML 数量 | 工程状态 |
|------|----------------|----------|
| 能力中心首页 | 1 | **已按 HTML 抽文案**（中+英）；请人工点开再验 |
| 工艺 / 服务 / 材料 / 表面处理 四个入口页 | 4 | **已按 HTML 抽文案**（中+英）；材料筛选/顺序已对齐 |
| 工艺详情 | 9（含水刀、医疗；**水刀已下线**） | **8+医疗=9** 条已抽；水刀不做 |
| 服务详情 | 8 | **已按 HTML 抽文案**（中+英，含 `service-*.html`） |
| 表面处理详情 | 9（含发黑；入口无单独「spray」） | **发黑已上线**；`finish/spray` 仍保留旧路由作兼容 |
| 材料详情 | 7 | **已上线**（复用 `CapabilityDetailPage`） |

> 本轮用脚本从 `营销页（已核对）` 批量写入 locale；**不等于你已经点开每一页验过**。有出入以 HTML 为准再改 JSON。

---

### 对照表：参考 HTML → 网址 → 文案 JSON

中文参考路径前缀：`营销页（已核对）/`（英文在同目录 `EN/`，不另列）。  
入口页各自一个 React 文件；详情页多条网址**共用** `CapabilityDetailPage.tsx`，表里只写对应 JSON。

#### 1）四个入口页 + 能力中心首页（各一个 React 文件）

| 中文参考 HTML | 网址 | React 文件 | 对应 JSON / 文案 | 现在怎样 |
|---------------|------|------------|------------------|----------|
| `能力中心—能力中心部分.html` | `/capabilities` | `CapabilitiesHome.tsx` | `translation.json` → `pages.capabilitiesHome` | 已按 HTML 抽文案 |
| `能力中心—工艺部分.html` | `/capabilities/process` | `CapabilitiesHub.tsx` | `translation.json` → `pages.capabilities` | 已按 HTML 抽文案 |
| `能力中心—服务部分.html` | `/capabilities/service` | `CapabilitiesServiceHub.tsx` | `hub__service.json` | 已按 HTML 抽文案 |
| `能力中心—材料部分.html` | `/capabilities/material` | `CapabilitiesMaterialHub.tsx` | `hub__material.json` | 已按 HTML 抽文案 |
| `能力中心—表面处理部分.html` | `/capabilities/finish` | `CapabilitiesFinishHub.tsx` | `hub__finish.json` | 已按 HTML 抽文案（含发黑卡片） |

说明：带「子页面」字样的同名稿当作变体；**以「能力中心—某某部分.html」为准**。JSON 分片目录：`src/locales/{zh,en}/capabilities/`。  
重抽脚本：`scripts/sync_from_verified_html.py` + `scripts/fixup_capability_sync.py`。

#### 2）详情页（多条网址共用一个 React 文件：`CapabilityDetailPage.tsx`）

文案分片路径：`src/locales/{zh,en}/capabilities/<下表文件名>`。

| 中文参考 HTML | 网址 | 对应 JSON | 现在怎样 |
|---------------|------|-----------|----------|
| `能力中心—薄板加工子页面.html` | `/capabilities/process/sheet-metal` | `process__sheet-metal.json` | 已按 HTML 抽文案 |
| `能力中心—注塑成型子页面.html` | `/capabilities/process/injection` | `process__injection.json` | 已按 HTML 抽文案 |
| `能力中心—工艺部分子页面.html`（数控） | `/capabilities/process/cnc` | `process__cnc.json` | 已按 HTML 抽文案 |
| `能力中心—聚氨酯铸造子页面.html` | `/capabilities/process/polyurethane` | `process__polyurethane.json` | 已按 HTML 抽文案 |
| `能力中心—激光切割子页面.html` | `/capabilities/process/laser` | `process__laser.json` | 已按 HTML 抽文案 |
| `能力中心—异形零件加工子页面.html` | `/capabilities/process/special` | `process__special.json` | 已按 HTML 抽文案 |
| `能力中心—微纳3D打印子页面.html` | `/capabilities/process/micro-3d` | `process__micro-3d.json` | 已按 HTML 抽文案 |
| `能力中心—金属3D打印子页面.html` | `/capabilities/process/metal-3d` | `process__metal-3d.json` | 已按 HTML 抽文案 |
| `能力中心—医疗零件加工子页面.html` | `/capabilities/process/medical` | `process__medical.json` | **已上线** |
| `能力中心—CNC加工服务子页面.html` | `/capabilities/service/cnc` | `service__cnc.json` | 已按 HTML 抽文案 |
| `能力中心—模具成型服务子页面.html` | `/capabilities/service/mold` | `service__mold.json` | 已按 HTML 抽文案 |
| `能力中心—定制加工服务子页面.html` | `/capabilities/service/custom` | `service__custom.json` | 已按 HTML 抽文案 |
| `能力中心—金属冲压服务子页面.html` | `/capabilities/service/stamping` | `service__stamping.json` | 已按 HTML 抽文案 |
| `能力中心—金属铸造服务子页面.html` | `/capabilities/service/casting` | `service__casting.json` | 已按 HTML 抽文案 |
| `能力中心—金属锻造服务子页面.html` | `/capabilities/service/forging` | `service__forging.json` | 已按 HTML 抽文案 |
| `能力中心—3D打印服务子页面.html` | `/capabilities/service/3d-printing` | `service__3d-printing.json` | 已按 HTML 抽文案 |
| `能力中心—快速手板模型服务子页面.html` | `/capabilities/service/rapid-prototype` | `service__rapid-prototype.json` | 已按 HTML 抽文案 |
| `能力中心—阳极氧化表面处理子页面.html` | `/capabilities/finish/anodizing` | `finish__anodizing.json` | 已按 HTML 抽文案 |
| `能力中心—电镀表面处理子页面.html` | `/capabilities/finish/plating` | `finish__plating.json` | 已按 HTML 抽文案 |
| `能力中心—喷涂表面处理子页面.html` | `/capabilities/finish/painting` | `finish__painting.json` | 已按 HTML 抽文案 |
| （旧 spray 路由，入口已不展示） | `/capabilities/finish/spray` | `finish__spray.json` | 兼容保留 |
| `能力中心—粉末喷涂表面处理子页面.html` | `/capabilities/finish/powder-coating` | `finish__powder-coating.json` | 已按 HTML 抽文案 |
| `能力中心—钝化处理表面处理子页面.html` | `/capabilities/finish/passivation` | `finish__passivation.json` | 已按 HTML 抽文案 |
| `能力中心—热处理表面处理子页面.html` | `/capabilities/finish/heat-treatment` | `finish__heat-treatment.json` | 已按 HTML 抽文案 |
| `能力中心—激光打标表面处理子页面.html` | `/capabilities/finish/laser-marking` | `finish__laser-marking.json` | 已按 HTML 抽文案 |
| `能力中心—抛光表面处理子页面.html` | `/capabilities/finish/polishing` | `finish__polishing.json` | 已按 HTML 抽文案 |
| `能力中心—发黑处理表面处理子页面.html` | `/capabilities/finish/blackening` | `finish__blackening.json` | **已上线** |
| `能力中心—铝合金材料子页面.html` | `/capabilities/material/aluminum` | `material__aluminum.json` | **已上线** |
| `能力中心—不锈钢材料子页面.html` | `/capabilities/material/stainless` | `material__stainless.json` | **已上线** |
| `能力中心—碳钢材料子页面.html` | `/capabilities/material/carbon` | `material__carbon.json` | **已上线** |
| `能力中心—铜合金材料子页面.html` | `/capabilities/material/copper` | `material__copper.json` | **已上线** |
| `能力中心—工程塑料材料子页面.html` | `/capabilities/material/plastic` | `material__plastic.json` | **已上线** |
| `能力中心—钛合金材料子页面.html` | `/capabilities/material/titanium` | `material__titanium.json` | **已上线** |
| `能力中心—复合材料材料子页面.html` | `/capabilities/material/composite` | `material__composite.json` | **已上线** |

> **已下线**：水刀切割（原 `/capabilities/process/waterjet`、`process__waterjet.json`）已从路由 / 导航 / 文案移除。

---

### 工程产物目录（迁成了什么）

| 类型 | 路径 |
|------|------|
| 页面 | `src/pages/CapabilitiesHome.tsx`、`CapabilitiesHub.tsx`、`CapabilitiesServiceHub.tsx`、`CapabilitiesMaterialHub.tsx`、`CapabilitiesFinishHub.tsx`、`CapabilityDetailPage.tsx`（含 material） |
| 路由 | `src/App.tsx`（`/capabilities/:category/:slug` 已覆盖 material） |
| 元数据 | `src/data/capabilities/registry.json`（约 34 条详情） |
| 文案分片 | `src/locales/{zh,en}/capabilities/*.json`（入口 3 + 详情含材料） |
| i18n 合并 | `src/i18n/capabilityLocales.ts` + `src/i18n/index.ts` |
| 对稿脚本 | `scripts/sync_from_verified_html.py`、`scripts/fixup_capability_sync.py` |

**诚实说明**：本轮正文已从 `营销页（已核对）` **直接抽取覆盖**旧 JSON 抽数；请你按上表打开 React 页与 HTML 对照勾验。版式细差（如材料对比表、aside 小标题）若 HTML 有而组件未渲，再单独补组件。

### 下一批建议顺序

1. **人工点开验收**：入口 5 + 详情抽样（薄板 / CNC 服务 / 阳极 / 铝合金 / 医疗 / 发黑）。  
2. 材料入口对比表、详情 aside 标题等 HTML 有而 React 未渲的结构补齐。  
3. 其它栏目（解决方案 / 行业…）同样：**直接对照 HTML → React**，不要再经 JSON 中转。

---

## 2. 架构与数据流

```
main.tsx → i18n.init + App
App → LocaleProvider → SiteLayout
                      ├─ SiteHeader / SiteFooter / FloatingWidgets  (t)
                      ├─ Home | Capabilities* hubs/details（已 React）
                      └─ StaticMarketingPage ← routeAssetMap ← static-pages/*.json
```

| 路由类型 | 实现 | 语言 |
|----------|------|------|
| `/` | `Home` 组件树 | `t()` 全页 |
| `/capabilities` | `CapabilitiesHome` | `t('pages.capabilitiesHome.*')` |
| `/capabilities/process` | `CapabilitiesHub` | `t('pages.capabilities.*')` |
| `/capabilities/service` | `CapabilitiesServiceHub` | `t('pages.capabilitiesService.*')` |
| `/capabilities/material` | `CapabilitiesMaterialHub` | `t('pages.capabilitiesMaterial.*')` |
| `/capabilities/finish` | `CapabilitiesFinishHub` | `t('pages.capabilitiesFinish.*')` |
| `/capabilities/:category/:slug` | `CapabilityDetailPage` | `t('pages.capDetails.*')` |
| 其余已映射路径 | `StaticMarketingPage` 注入 HTML 快照 | 壳用 `t()`；正文多为中文快照 |
| 未映射路径 | 同上（可能报「未找到页面资源」） | — |

---

## 3. 目录总览（每个文件夹标注作用）

```
marketing-react/
├── index.html                 # Vite HTML 入口，挂载 #root
├── package.json               # 依赖与 npm 脚本
├── package-lock.json          # 锁版本
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite + React 插件；别名 @ → src
├── .gitignore                 # 忽略 node_modules / dist 等
├── FILE_MAP.md                # 本说明文档
│
├── public/                    # 【静态资源根】构建时原样拷到站点根路径，用 /xxx 引用
│   ├── partner-logos/         # 【首页合作方】滚动 logo 图片
│   ├── precision/             # 【全站图片库】hero / 工艺 / 案例 / 解决方案插图等
│   └── static-pages/          # 【旧快照】还没迁完的页面正文 JSON（能力中心那批已删光）
│
└── src/                       # 【应用源码】
    ├── main.tsx               # 程序入口：先加载中英文文案，再启动整个网站
    ├── App.tsx                # 网址怎么对应哪个页面（路由表）+ 语言切换
    ├── vite-env.d.ts          # 给 TypeScript / Vite 用的类型说明（可不管）
    │
    ├── components/            # 【可复用零件】
    │   ├── layout/            # 【全站外壳 · 已做好】顶栏、页脚、客服浮层等，所有页共用
    │   │   ├── SiteLayout.tsx           # 页面总框架
    │   │   ├── SiteHeader.tsx           # 顶部导航
    │   │   ├── SiteFooter.tsx           # 页脚
    │   │   ├── FloatingWidgets.tsx      # 右下角客服 / AI / 回顶
    │   │   ├── PaymentBrands.tsx        # 页脚付款方式图标
    │   │   └── BrandSymbol.tsx          # 品牌 Logo 图形
    │   └── home/              # 【只给首页用 · 已做好】首页一块块内容
    │       ├── Hero.tsx                 # 首页大图文第一屏
    │       ├── StatsPartners.tsx        # 数据条 + 合作方 Logo
    │       ├── ServicesSection.tsx      # 服务介绍
    │       ├── FactoryCapability.tsx    # 工厂 / 能力展示
    │       ├── ProcessSection.tsx       # 制造流程步骤
    │       ├── QuoteSection.tsx         # 报价区
    │       ├── WhySection.tsx           # 为什么选我们
    │       └── MoreSections.tsx         # 案例、评价、资讯、问答、底部号召
    │
    ├── pages/                 # 【一整页对应一个网址】下面 ✅=已做成 React；⏳=还在用旧快照
    │   ├── Home.tsx                         # ✅ 首页 `/`
    │   ├── CapabilitiesHome.tsx             # ✅ 能力中心首页 `/capabilities`
    │   ├── CapabilitiesHub.tsx              # ✅ 工艺入口 `/capabilities/process`
    │   ├── CapabilitiesServiceHub.tsx       # ✅ 服务入口 `/capabilities/service`
    │   ├── CapabilitiesMaterialHub.tsx      # ✅ 材料入口 `/capabilities/material`
    │   ├── CapabilitiesFinishHub.tsx        # ✅ 表面处理入口 `/capabilities/finish`
    │   ├── CapabilityDetailPage.tsx         # ✅ 能力中心各详情页（共 25 个网址，一套模板；水刀已下线）
    │   └── StaticMarketingPage.tsx          # ⏳ 还没迁的页面（约 57 个）临时用：从 JSON 灌正文
    │
    ├── interactions/          # 【页面上的交互脚本 · 不是页面本身】
    │   ├── homeInteractions.js (+ 类型声明)  # 菜单切换、报价 Tab、轮播等老逻辑
    │   └── siteChrome.ts                    # 顶栏滚动显隐、首页双图切换等
    │
    ├── data/                  # 【配置数据 · 一般不是给人读的文案】
    │   ├── routeAssetMap.json               # ⏳「还没迁完的网址 → 对应哪个 JSON」（能力中心已不在这里）
    │   └── capabilities/
    │       └── registry.json                # ✅ 能力中心详情页用哪张图、哪套标题样式
    │
    ├── i18n/                  # 【语言切换怎么工作】
    │   ├── index.ts                         # 启动中英文；把能力中心分片文案装进来
    │   ├── LocaleContext.tsx                # 页面里点「EN/中文」时用的上下文
    │   └── capabilityLocales.ts             # 把 capabilities 文件夹里的文案合并进总语言包
    │
    ├── locales/               # 【真正的中英文句子都在这】
    │   ├── zh/
    │   │   ├── translation.json             # 中文：顶栏页脚 + 首页 + 能力中心首页/工艺入口等
    │   │   └── capabilities/                # 中文：能力中心另外 28 份（3 个入口 + 25 个详情）
    │   └── en/
    │       ├── translation.json             # 英文总包（键名和中文一一对应）
    │       └── capabilities/                # 英文分片（结构同中文；正文还要拿静态稿对一遍）
    │
    └── styles/                # 【样式表】home / global / 运行时补丁 / 英文微调 / FAQ（细节见第 7 节）
```

### 3.1 已经做成 React 的页面（浏览器能直接打开）

> **注意**：能打开 ≠ 内容已验收。能力中心这些页要对照 `营销页（已核对）` 里的 HTML 再对一遍正文（人话见 §1.1 开头那张表）。

#### 全站外壳（每个网址都有，已做好）

| 做什么 | 文件在哪 |
|--------|----------|
| 顶栏、页脚、客服浮层、付款图标 | `components/layout/` 目录下 |

#### 首页（1 个网址）

| 网址 | 页面文件 | 内容块 |
|------|----------|--------|
| `/` | `pages/Home.tsx` | `components/home/` 里那一堆区块 |

#### 能力中心（5 个入口页 + 详情含材料 / 医疗 / 发黑）

| 网址 | 页面文件 | 文案在哪 |
|------|----------|----------|
| `/capabilities` | `CapabilitiesHome.tsx` | `translation.json` 里的 `pages.capabilitiesHome` |
| `/capabilities/process` | `CapabilitiesHub.tsx` | `pages.capabilities` |
| `/capabilities/service` | `CapabilitiesServiceHub.tsx` | `locales/.../capabilities/hub__service.json` |
| `/capabilities/material` | `CapabilitiesMaterialHub.tsx` | `hub__material.json` |
| `/capabilities/finish` | `CapabilitiesFinishHub.tsx` | `hub__finish.json` |
| 工艺详情 9 个（含医疗；水刀已下线） | `CapabilityDetailPage.tsx` | `process__某某.json` |
| 服务详情 8 个 | 同上 | `service__某某.json` |
| 表面处理详情 9+spray | 同上 | `finish__某某.json`（含发黑） |
| 材料详情 7 个 | 同上 | `material__某某.json` |

这些网址在 `App.tsx` 里已经走 React；正文本轮已从 `营销页（已核对）` 重抽。

### 3.2 还没迁完的页面（顶栏页脚是新的，中间正文还是旧 JSON）

`routeAssetMap.json` 里大概还有 **57** 条（**没有**能力中心了），按栏目：

| 栏目 | 大约几条 | 举例网址 | 现在怎样 |
|------|----------|----------|----------|
| 解决方案 | 10 | `/solutions`… | 壳子迁了，正文还是旧快照 |
| 行业 | 10 | `/industries`… | 同上 |
| 资源中心 | 5 | `/resources`… | 同上 |
| 关于 | 5 | `/about`… | 同上 |
| 案例 | 27 | `/cases/…` | 同上 |

完整名单看 `src/data/routeAssetMap.json`。以后迁这些页，请直接对照 `营销页（已核对）` 的 HTML，不要再拿 JSON 当主稿。

构建产物：`dist/`（本地 build 生成，不入库）。依赖：`node_modules/`（不入库）。

---

## 4. 根配置文件

| 文件 | 作用 |
|------|------|
| `index.html` | 挂载 `#root`，引入 `/src/main.tsx` |
| `package.json` | `dev` / `build` / `preview`；React 18、react-router、i18next |
| `package-lock.json` | npm 依赖锁定 |
| `vite.config.ts` | `@vitejs/plugin-react`；路径别名 `@` → `src` |
| `tsconfig.json` | TS / JSX 编译选项 |
| `.gitignore` | 忽略 `node_modules/`、`dist/` 等 |
| `FILE_MAP.md` | 本项目地图与进度文档 |

---

## 5. `src/` 源码（按文件夹）

### 5.1 `src/` 根文件

| 文件 | 作用 |
|------|------|
| `main.tsx` | 引入 `./i18n` 初始化语言，再 `createRoot` 渲染 `<App />` |
| `App.tsx` | `BrowserRouter` + `LocaleProvider`；**已迁**：`/` + 全部 `/capabilities*` React；**还没做**：其余走 `StaticMarketingPage`（约 57 条） |
| `vite-env.d.ts` | Vite 客户端类型（含 `*.css?raw` 等） |

### 5.2 `src/components/layout/` — 全站壳

| 文件 | 作用 |
|------|------|
| `SiteLayout.tsx` | 包裹 `Outlet`：Header + 正文 + Footer；Portal 浮层；注入 CSS；初始化 chrome/交互；站内链接与 `data-card-link` |
| `SiteHeader.tsx` | 顶栏、mega、下拉、登录/报价、语言切换；子页 `is-light`；路由变化 `is-menus-suppressed` 收起菜单 |
| `SiteFooter.tsx` | 页脚菜单、联系、付款区、订阅；文案 `footer.*` |
| `PaymentBrands.tsx` | 付款方式品牌 SVG + class（微信/支付宝/银联/Visa 等） |
| `FloatingWidgets.tsx` | AI 助手 / 在线客服 / 回顶；class 对齐 `homeInteractions.js` |
| `BrandSymbol.tsx` | 品牌 SVG（Header/Footer 共用） |

### 5.3 `src/components/home/` — 首页区块（仅 `/`）

| 文件 | 作用 |
|------|------|
| `Hero.tsx` | 双 pane Hero |
| `StatsPartners.tsx` | 数据条（含 SVG 图标）+ 合作方 logo 滚动 |
| `ServicesSection.tsx` | 服务卡片网格 |
| `FactoryCapability.tsx` | 工厂展示 + 能力轮播 |
| `ProcessSection.tsx` | 7 步制造流程 |
| `QuoteSection.tsx` | 报价 tabs / 上传区 |
| `WhySection.tsx` | Why us 滚动叙事 |
| `MoreSections.tsx` | 案例 / 客户评价 / 资讯 / FAQ / CTA |

文案命名空间：`hero.*`、`stats.*`、`services.*`、`factory.*`、`capability.*`、`process.*`、`quote.*`、`why.*`、`cases.*`、`testimonials.*`、`insights.*`、`faq.*`、`cta.*` 等。

### 5.4 `src/pages/` — 路由页面（已迁 / 未迁）

| 文件 | 覆盖路由 | 迁移状态 |
|------|----------|----------|
| `Home.tsx` | `/` | ✅ 已做成 React |
| `CapabilitiesHome.tsx` | `/capabilities` | ✅ 能打开了，正文还要对稿 |
| `CapabilitiesHub.tsx` | `/capabilities/process` | ✅ 能打开了，正文还要对稿 |
| `CapabilitiesServiceHub.tsx` | `/capabilities/service` | ✅ 能打开了，正文还要对稿 |
| `CapabilitiesMaterialHub.tsx` | `/capabilities/material` | ✅ 能打开了，正文还要对稿 |
| `CapabilitiesFinishHub.tsx` | `/capabilities/finish` | ✅ 能打开了，正文还要对稿 |
| `CapabilityDetailPage.tsx` | 能力中心 25 个详情网址 | ✅ 能打开了，正文还要对稿 |
| `StaticMarketingPage.tsx` | 解决方案/行业/资源/关于/案例等约 57 个 | ⏳ 壳子迁了，正文还是旧快照 |

一页看懂迁了哪些：见 [§3.1](#31-已经做成-react-的页面浏览器能直接打开) / [§3.2](#32-还没迁完的页面顶栏页脚是新的中间正文还是旧-json)。

### 5.5 `src/interactions/` — DOM 交互（非页面）

| 文件 | 作用 |
|------|------|
| `homeInteractions.js` | 旧静态脚本：mega 分类、报价 tab、FAQ、why-scroll、轮播等 |
| `homeInteractions.d.ts` | 上述 JS 的 TypeScript 声明 |
| `siteChrome.ts` | 顶栏滚动隐藏/显示、首页双 pane hero 轮播、`#quote` 跳转藏顶栏 |

### 5.6 `src/data/`

| 文件 | 作用 |
|------|------|
| `routeAssetMap.json` | `路径 → /static-pages/xxx.json`；**不含**已迁的 `/capabilities*` |
| `capabilities/registry.json` | 详情页 heroClass / mediaImg / parentHref |

### 5.7 `src/i18n/`

| 文件 | 作用 |
|------|------|
| `index.ts` | i18next + LanguageDetector；合并 capability locales；`getAppLanguage` / `toggleAppLanguage` |
| `LocaleContext.tsx` | `LocaleProvider` / `useLocale()` |
| `capabilityLocales.ts` | glob `locales/*/capabilities/*.json` → `pages.capDetails` / `pages.capabilitiesService|Material|Finish` |

### 5.8 `src/locales/`

| 路径 | 作用 |
|------|------|
| `zh/translation.json` / `en/translation.json` | 壳、首页、`pages.capabilities` / `pages.capabilitiesHome` 等 |
| `zh/capabilities/*.json` / `en/capabilities/*.json` | 能力中心 Hub×3 + 详情×25 分片（共 28×2）；由 `capabilityLocales.ts` 合并 |

约定：组件不写死中英句子；专业术语只改 JSON；URL 不因语言变化。  
能力中心正文验收以 `营销页（已核对）` HTML 为准（见 §1.1）。

### 5.9 `src/styles/`

| 文件 | 作用 | 维护建议 |
|------|------|----------|
| `home.css` | 首页主样式；目前还夹带顶栏/浮层大量规则，且被全站注入 | **应变成「仅首页」** |
| `global.css` | 子页通用（`.page-hero`、`.feature-card`、白底顶栏等） | 收敛为「子页 + 可抽 chrome」 |
| `homepage-runtime-fixes.css` | 叠层冲突补丁：Hero、服务图、浮层 z-index、**子页顶栏强制白底**、mega 可点 | 目标：整理后删掉 |
| `en-overrides.css` | 英文排版/间距 | 保留为 `en.css` |
| `home-faq.css` | FAQ 样式副本（与 `home.css` 重复）；Legacy 偶发注入 | 并入 `home.css` 后删除 |

---

## 6. `public/` 静态资源（按文件夹）

### 6.1 `public/partner-logos/`

首页合作方滚动条用图（如 Huawei、Tesla、NIO…）。组件路径：`/partner-logos/xxx.png`。

### 6.2 `public/precision/`

全站图片库：首页 hero/工厂、工艺卡、行业案例、解决方案插图、客户头像等。  
组件与快照统一用绝对路径：`/precision/xxx.png`。

### 6.3 `public/static-pages/` — Legacy 快照命名

每个 JSON 大致为：

```json
{
  "title": "页面标题",
  "hasInlineStyle": false,
  "inlineStyle": "",
  "body": "<header>...</header><main>...</main>...",
  "isEn": false
}
```

`StaticMarketingPage` 会剥掉 `header.site-header`、`footer.footer`、浮层，只留正文，外层已由 React `SiteLayout` 提供壳。

#### 文件名前缀 → 业务含义（**仅未迁栏目**；能力中心 JSON 已删）

| 文件名模式 | 对应路由族 | 状态 |
|------------|------------|------|
| `about.json` / `about__*` | `/about…` | ⏳ 还没迁正文 |
| `industries.json` / `industries__*` | `/industries…` | ⏳ 还没迁正文 |
| `solutions.json` / `solutions__*` | `/solutions…` | ⏳ 还没迁正文 |
| `resources.json` / `resources__*` | `/resources…` | ⏳ 还没迁正文 |
| `case_*.json` | `/cases/…` | ⏳ 还没迁正文 |
| ~~`capabilities__*.json`~~ | ~~`/capabilities…`~~ | ✅ **已删**；改 React（见 §3.1） |

> 能力中心 29 个 `capabilities__*.json` 已删除。命名规则（未迁栏目仍适用）：`__` = 路径分段。

完整映射以 `src/data/routeAssetMap.json` 为准（约 57 条，无 capabilities）。

---

## 7. CSS / JS 维护方向（规划，尚未完全落地）

### 目标结构

```
src/
  interactions/          # 从 pages/ 迁出的 DOM 交互脚本
    homeInteractions.js
    siteChrome.ts        # 可选：从 src 根迁入
  styles/
    chrome.css           # Header / Footer / Floats（全站）
    home.css             # 仅首页区块（单独维护）
    pages.css            # 子页 / Hub（现 global 收敛）
    en.css               # 英文覆盖
```

### 原则

- **首页样式单独一份**：首页和子页顶栏逻辑不同，不要再靠「注入整份 home.css + runtime 打补丁」。
- **壳样式共享**：顶栏/页脚/浮层一处维护。
- **交互与页面分离**：JS 不放在 `pages/` 里冒充页面。

---

## 8. 运行方式

```bash
cd marketing-react
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build → dist/
npm run preview  # 预览构建结果
```

语言：右上角切换 → 写入 `localStorage.promakehub_lang` → 刷新保持。硬刷新后再验视觉。

---

## 9. 验收对照（计划标准）

| # | 标准 | 当前 |
|---|------|------|
| 1 | 首页源码为 JSX，无整页 `dangerouslySetInnerHTML` | **已满足** |
| 2 | 切换语言仅重渲染，URL 不变；刷新记忆语言 | **已满足（已迁页）** |
| 3 | Header 语言按钮全站一致；已迁页全文 `t()` | **壳 + 首页 + capabilities 满足** |
| 4 | Footer 付款品牌有 logo | **已满足** |
| 5 | 跳转后 mega/下拉可收起 | **已满足（路由 suppress）** |
| 6 | 硬刷新后首页视觉无明显回归 | **改善中**；移动端建议再验 |
| 7 | 子页顶栏白底可用 | **已用 runtime 强制**；长期应拆 CSS |

---

*文档随迁移更新；改目录或迁完一类 Hub 后请同步改本节进度表与 `routeAssetMap` 说明。*
