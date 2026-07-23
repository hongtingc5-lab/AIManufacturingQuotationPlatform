# apps/marketing · 营销页系统（marketing）

> 五系统之一。全平台区分见 [`../../SYSTEMS.md`](../../SYSTEMS.md)。本目录只服务营销站。

| 项 | 值 |
|----|-----|
| systemId | `marketing` |
| 包名 | `@zhizao/frontend-marketing` |
| 运行时 | `html[data-system="marketing"]`（`src/system/meta.ts`） |
| 静态 HTML 对照源 | `D:\zhizao\内容\代码\前端页面\营销页（已核对）` |
| 上推目录 | `D:\zhizao\zhizao\marketing-react-main`（与 `react` 同级） |

## 开发与上推

```bash
cd D:\zhizao\zhizao\react
npm install
npm run dev:marketing    # 或 npm run build:marketing
```

上推：见 `../../上推git.txt`。

## 工程要点

- **一套路由** + **react-i18next**（`zh` / `en`），无 `/en/*` 镜像；语言存 `localStorage.promakehub_lang`。
- 页面正文主要在 `src/locales/{zh,en}/`；路由在 `src/App.tsx`。
- 静态资源在 `public/`（如 `precision/`）。
- 下载中心链接指向 `/downloads/*`；模型中心样例文件指向 `/models/*`；请把文件放到 `public/downloads/`、`public/models/`（名单见下）。

### 目录速览

> 本系统的「目录盘点」写在此处（营销不另建 `PAGE_MAP.md`）。

```
apps/marketing/
├── index.html              # Vite HTML 入口
├── package.json            # @zhizao/frontend-marketing
├── vite.config.ts
├── tsconfig.json
├── sync-to-push.ps1        # 同步到 marketing-react-main 上推目录
├── README.md               # 本文件（本系统唯一文档）
│
├── public/                 # 静态资源（原样映射到站点根路径）
│   ├── precision/          # 首页 / 能力 / 行业等配图
│   ├── partner-logos/      # 合作伙伴 Logo
│   ├── downloads/          # 下载中心附件（见下方应收清单）
│   └── models/             # 模型中心样例文件（见下方应收清单）
│
└── src/
    ├── main.tsx            # React 挂载 + i18n 初始化
    ├── App.tsx             # 全站路由
    ├── vite-env.d.ts
    │
    ├── system/
    │   └── meta.ts         # systemId / data-system="marketing"
    │
    ├── components/
    │   ├── layout/         # 全站壳层
    │   │   ├── SiteLayout.tsx / SiteHeader.tsx / SiteFooter.tsx
    │   │   ├── BrandSymbol.tsx / FloatingWidgets.tsx / PaymentBrands.tsx
    │   └── home/           # 首页区块
    │       ├── Hero.tsx / ServicesSection.tsx / ProcessSection.tsx
    │       ├── QuoteSection.tsx / WhySection.tsx / FactoryCapability.tsx
    │       ├── StatsPartners.tsx / MoreSections.tsx
    │
    ├── pages/              # 路由页面组件
    │   ├── Home.tsx
    │   ├── VerifiedHtmlPage.tsx          # 通用：渲染 locales 内 mainHtml
    │   ├── QuoteGuestPage.tsx            # /quote 访客报价上传
    │   ├── quoteGuestPageScript.js
    │   ├── SolutionsHome.tsx / SolutionDetailPage.tsx
    │   ├── CapabilitiesHome.tsx / CapabilitiesHub.tsx
    │   ├── CapabilitiesServiceHub.tsx / CapabilitiesMaterialHub.tsx
    │   ├── CapabilitiesFinishHub.tsx / CapabilityDetailPage.tsx
    │   ├── IndustriesHome.tsx / IndustryDetailPage.tsx
    │   ├── CaseDetailPage.tsx
    │   ├── ResourcesHome.tsx / ResourceDetailPage.tsx
    │   ├── ResourcesNewsHome.tsx / ResourcesNewsDetailPage.tsx
    │   └── AboutHome.tsx / AboutDetailPage.tsx
    │
    ├── locales/            # 中英文案与页面 HTML 片段（en/ 与 zh/ 同构）
    │   ├── zh/
    │   │   ├── translation.json          # 首页等公共文案
    │   │   ├── quote-guest.json          # 访客报价页
    │   │   ├── about/                    # company / home / privacy / quality / terms
    │   │   ├── capabilities/             # process__* / service__* / material__* / finish__* / hub__*
    │   │   ├── cases/                    # 行业案例详情 JSON
    │   │   ├── industries/               # home + 9 个行业详情
    │   │   ├── news/                     # home + 资讯详情
    │   │   ├── resources/                # home / downloads / model-center / guides…
    │   │   └── solutions/                # home + 各解决方案详情
    │   └── en/                           # 同上结构（英文）
    │
    ├── data/               # 非文案的结构化数据（registry / 案例库）
    │   ├── capabilities/registry.json
    │   ├── cases/registry.json / library.json
    │   └── news/registry.json
    │
    ├── i18n/               # i18next 装配 + 各频道 locale 注册
    │   ├── index.ts / LocaleContext.tsx
    │   ├── aboutLocales.ts / capabilityLocales.ts / caseLocales.ts
    │   ├── industryLocales.ts / newsLocales.ts / resourceLocales.ts
    │   └── solutionLocales.ts
    │
    ├── interactions/       # 页面增强脚本（筛选 / 弹窗 / 案例库等）
    │   ├── siteChrome.ts
    │   ├── homeInteractions.js (+ .d.ts)
    │   ├── industryCaseLibrary.ts        # 行业案例库筛选翻页
    │   └── resourcePageFilters.ts        # 下载 / 新闻 / 模型中心（含详情弹窗）
    │
    └── styles/
        ├── global.css / home.css / home-faq.css
        ├── homepage-runtime-fixes.css / en-overrides.css
        ├── resources-pages.css           # 资源 / 新闻 / 下载 / 模型中心
        └── quote-guest.css
```

### public/downloads 应收文件

- quote-preparation-checklist.pdf
- dfm-review-checklist.pdf
- engineering-drawing-guideline.pdf
- material-parameter-comparison.xlsx
- surface-finishing-selection.pdf
- first-article-inspection-template.xlsx
- batch-inspection-document-list.pdf
- 3d-model-submission-guideline.pdf
- project-requirement-template.docx

源期望路径：`前端页面/营销页（已核对）/downloads/`。

### public/models 应收文件

- precision-shaft.step
- lightweight-flange.stl
- sheet-metal-bracket.dxf
- complex-cavity.iges
- injection-shell.iges

源期望路径：`前端页面/营销页（已核对）/models/`（仓库里可能为空）。

---

# HTML ↔ React 迁移清单

对照源：`D:\zhizao\内容\代码\前端页面\营销页（已核对）`（只列中文 HTML）。  
「对应 JSON」列相对 `src/locales/zh/`（英文在 `locales/en/` 同名）。

## 汇总

| 状态 | 数量 |
|------|------|
| React 已迁 | 111 |
| 壳子迁了（Static） | 0 |
| 未迁 React | 0 |
| 不迁（已下线） | 1 |
| **表内合计** | **112** |
| 中文 HTML 文件总数 | 112 |

## 首页

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `营销页面.html` | `/` | React 已迁 | `translation.json（首页文案）` | Home.tsx |
| `报价模型上传页未登录.html` | `/quote` | React 已迁 | `quote-guest.json` | 原用户端页，已迁入营销；支持 `?mode=` + `#quote-upload` |

## 能力中心·入口

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `能力中心—能力中心部分.html` | `/capabilities` | React 已迁 | `translation.json#pages.capabilitiesHome` |  |
| `能力中心—工艺部分.html` | `/capabilities/process` | React 已迁 | `translation.json#pages.capabilities` |  |
| `能力中心—服务部分.html` | `/capabilities/service` | React 已迁 | `capabilities/hub__service.json` |  |
| `能力中心—材料部分.html` | `/capabilities/material` | React 已迁 | `capabilities/hub__material.json` |  |
| `能力中心—表面处理部分.html` | `/capabilities/finish` | React 已迁 | `capabilities/hub__finish.json` |  |

## 能力中心·入口变体

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `能力中心—工艺部分子页面.html` | `/capabilities/process/cnc` | React 已迁 | `capabilities/process__cnc.json` | 文件名像入口，实为数控加工详情 |
| `能力中心—材料部分子页面.html` | `/capabilities/material/aluminum` | React 已迁 | `capabilities/material__aluminum.json` | 文件名像入口，实为铝合金详情变体 |
| `能力中心—表面处理部分子页面.html` | `/capabilities/finish/anodizing` | React 已迁 | `capabilities/finish__anodizing.json` | 文件名像入口，实为阳极氧化详情变体 |

## 能力中心·工艺详情

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `能力中心—薄板加工子页面.html` | `/capabilities/process/sheet-metal` | React 已迁 | `capabilities/process__sheet-metal.json` |  |
| `能力中心—注塑成型子页面.html` | `/capabilities/process/injection` | React 已迁 | `capabilities/process__injection.json` |  |
| `能力中心—聚氨酯铸造子页面.html` | `/capabilities/process/polyurethane` | React 已迁 | `capabilities/process__polyurethane.json` |  |
| `能力中心—激光切割子页面.html` | `/capabilities/process/laser` | React 已迁 | `capabilities/process__laser.json` |  |
| `能力中心—异形零件加工子页面.html` | `/capabilities/process/special` | React 已迁 | `capabilities/process__special.json` |  |
| `能力中心—微纳3D打印子页面.html` | `/capabilities/process/micro-3d` | React 已迁 | `capabilities/process__micro-3d.json` |  |
| `能力中心—金属3D打印子页面.html` | `/capabilities/process/metal-3d` | React 已迁 | `capabilities/process__metal-3d.json` |  |
| `能力中心—医疗零件加工子页面.html` | `/capabilities/process/medical` | React 已迁 | `capabilities/process__medical.json` |  |
| `能力中心—水刀切割子页面.html` | `—` | 不迁（已下线） | — |  |

## 能力中心·服务详情

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `能力中心—CNC加工服务子页面.html` | `/capabilities/service/cnc` | React 已迁 | `capabilities/service__cnc.json` |  |
| `能力中心—模具成型服务子页面.html` | `/capabilities/service/mold` | React 已迁 | `capabilities/service__mold.json` |  |
| `能力中心—定制加工服务子页面.html` | `/capabilities/service/custom` | React 已迁 | `capabilities/service__custom.json` |  |
| `能力中心—金属冲压服务子页面.html` | `/capabilities/service/stamping` | React 已迁 | `capabilities/service__stamping.json` |  |
| `能力中心—金属铸造服务子页面.html` | `/capabilities/service/casting` | React 已迁 | `capabilities/service__casting.json` |  |
| `能力中心—金属锻造服务子页面.html` | `/capabilities/service/forging` | React 已迁 | `capabilities/service__forging.json` |  |
| `能力中心—3D打印服务子页面.html` | `/capabilities/service/3d-printing` | React 已迁 | `capabilities/service__3d-printing.json` |  |
| `能力中心—快速手板模型服务子页面.html` | `/capabilities/service/rapid-prototype` | React 已迁 | `capabilities/service__rapid-prototype.json` |  |

## 能力中心·表面处理详情

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `能力中心—阳极氧化表面处理子页面.html` | `/capabilities/finish/anodizing` | React 已迁 | `capabilities/finish__anodizing.json` |  |
| `能力中心—电镀表面处理子页面.html` | `/capabilities/finish/plating` | React 已迁 | `capabilities/finish__plating.json` |  |
| `能力中心—喷涂表面处理子页面.html` | `/capabilities/finish/painting` | React 已迁 | `capabilities/finish__painting.json` |  |
| `能力中心—粉末喷涂表面处理子页面.html` | `/capabilities/finish/powder-coating` | React 已迁 | `capabilities/finish__powder-coating.json` |  |
| `能力中心—钝化处理表面处理子页面.html` | `/capabilities/finish/passivation` | React 已迁 | `capabilities/finish__passivation.json` |  |
| `能力中心—热处理表面处理子页面.html` | `/capabilities/finish/heat-treatment` | React 已迁 | `capabilities/finish__heat-treatment.json` |  |
| `能力中心—激光打标表面处理子页面.html` | `/capabilities/finish/laser-marking` | React 已迁 | `capabilities/finish__laser-marking.json` |  |
| `能力中心—抛光表面处理子页面.html` | `/capabilities/finish/polishing` | React 已迁 | `capabilities/finish__polishing.json` |  |
| `能力中心—发黑处理表面处理子页面.html` | `/capabilities/finish/blackening` | React 已迁 | `capabilities/finish__blackening.json` |  |

## 能力中心·材料详情

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `能力中心—铝合金材料子页面.html` | `/capabilities/material/aluminum` | React 已迁 | `capabilities/material__aluminum.json` |  |
| `能力中心—不锈钢材料子页面.html` | `/capabilities/material/stainless` | React 已迁 | `capabilities/material__stainless.json` |  |
| `能力中心—碳钢材料子页面.html` | `/capabilities/material/carbon` | React 已迁 | `capabilities/material__carbon.json` |  |
| `能力中心—铜合金材料子页面.html` | `/capabilities/material/copper` | React 已迁 | `capabilities/material__copper.json` |  |
| `能力中心—工程塑料材料子页面.html` | `/capabilities/material/plastic` | React 已迁 | `capabilities/material__plastic.json` |  |
| `能力中心—钛合金材料子页面.html` | `/capabilities/material/titanium` | React 已迁 | `capabilities/material__titanium.json` |  |
| `能力中心—复合材料材料子页面.html` | `/capabilities/material/composite` | React 已迁 | `capabilities/material__composite.json` |  |

## 解决方案

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `解决方案中心—解决方案部分.html` | `/solutions` | React 已迁 | `solutions/home.json` |  |
| `解决方案中心—智能报价子页面.html` | `/solutions/instant-quoting` | React 已迁 | `solutions/instant-quoting.json` |  |
| `解决方案中心—快速报价子页面.html` | `/solutions/quick-quote` | React 已迁 | `solutions/quick-quote.json` |  |
| `解决方案中心—快速原型子页面.html` | `/solutions/rapid-prototyping` | React 已迁 | `solutions/rapid-prototyping.json` |  |
| `解决方案中心—DFM检查与设计子页面.html` | `/solutions/dfm` | React 已迁 | `solutions/dfm.json` |  |
| `解决方案中心—图生3D模型子页面.html` | `/solutions/image-to-3d` | React 已迁 | `solutions/image-to-3d.json` |  |
| `解决方案中心—文生3D模型子页面.html` | `/solutions/text-to-3d` | React 已迁 | `solutions/text-to-3d.json` |  |
| `解决方案中心—3D格式转换子页面.html` | `/solutions/format-conversion` | React 已迁 | `solutions/format-conversion.json` |  |
| `解决方案中心—3D转2D工程图子页面.html` | `/solutions/3d-to-2d` | React 已迁 | `solutions/3d-to-2d.json` |  |
| `解决方案中心—2D气泡图标注子页面.html` | `/solutions/bubble-annotation` | React 已迁 | `solutions/bubble-annotation.json` |  |

## 行业

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `行业中心—行业部分.html` | `/industries` | React 已迁 | `industries/home.json` |  |
| `行业中心—航空航天子页面.html` | `/industries/aerospace` | React 已迁 | `industries/aerospace.json` |  |
| `行业中心—医疗器械子页面.html` | `/industries/medical` | React 已迁 | `industries/medical.json` |  |
| `行业中心—汽车子页面.html` | `/industries/automotive` | React 已迁 | `industries/automotive.json` |  |
| `行业中心—机器人技术子页面.html` | `/industries/robotics` | React 已迁 | `industries/robotics.json` |  |
| `行业中心—电子子页面.html` | `/industries/electronics` | React 已迁 | `industries/electronics.json` |  |
| `行业中心—半导体子页面.html` | `/industries/semiconductor` | React 已迁 | `industries/semiconductor.json` |  |
| `行业中心—新能源子页面.html` | `/industries/new-energy` | React 已迁 | `industries/new-energy.json` |  |
| `行业中心—消费品子页面.html` | `/industries/consumer` | React 已迁 | `industries/consumer.json` |  |
| `行业中心—通信子页面.html` | `/industries/telecom` | React 已迁 | `industries/telecom.json` |  |

## 行业案例

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `行业案例—医疗器械PEEK定位块与测试夹具.html` | `/cases/医疗器械PEEK定位块与测试夹具` | React 已迁 | `cases/medical-device-peek-positioning-block-test-fixture.json` |  |
| `行业案例—医疗器械实验仪器铝合金腔体加工.html` | `/cases/医疗器械实验仪器铝合金腔体加工` | React 已迁 | `cases/medical-device-lab-instrument-aluminum-housing.json` |  |
| `行业案例—医疗器械研发样件与定位治具.html` | `/cases/医疗器械研发样件与定位治具` | React 已迁 | `cases/medical-device-rd-prototype-positioning-fixture.json` |  |
| `行业案例—半导体洁净包装精密备件.html` | `/cases/半导体洁净包装精密备件` | React 已迁 | `cases/semiconductor-clean-packaging-precision-spares.json` |  |
| `行业案例—半导体设备定位夹具小批量加工.html` | `/cases/半导体设备定位夹具小批量加工` | React 已迁 | `cases/semiconductor-equipment-positioning-fixture-low-volume.json` |  |
| `行业案例—半导体设备腔体周边结构件.html` | `/cases/半导体设备腔体周边结构件` | React 已迁 | `cases/semiconductor-equipment-chamber-structural-parts.json` |  |
| `行业案例—新能源储能模块测试夹具.html` | `/cases/新能源储能模块测试夹具` | React 已迁 | `cases/new-energy-storage-module-test-fixture.json` |  |
| `行业案例—新能源电池包绝缘隔离件.html` | `/cases/新能源电池包绝缘隔离件` | React 已迁 | `cases/new-energy-battery-pack-insulation-spacer.json` |  |
| `行业案例—新能源电驱控制器散热底板.html` | `/cases/新能源电驱控制器散热底板` | React 已迁 | `cases/new-energy-drive-controller-heat-sink-base.json` |  |
| `行业案例—机器人末端执行器安装座.html` | `/cases/机器人末端执行器安装座` | React 已迁 | `cases/robotics-end-effector-mounting-base.json` |  |
| `行业案例—机器人自动化产线检测治具.html` | `/cases/机器人自动化产线检测治具` | React 已迁 | `cases/robotics-automation-line-inspection-fixture.json` |  |
| `行业案例—机器人轻量化关节连接板.html` | `/cases/机器人轻量化关节连接板` | React 已迁 | `cases/robotics-lightweight-joint-connection-plate.json` |  |
| `行业案例—汽车传感器安装座小批交付.html` | `/cases/汽车传感器安装座小批交付` | React 已迁 | `cases/automotive-sensor-mount-low-volume-delivery.json` |  |
| `行业案例—汽车动力系统支架试制.html` | `/cases/汽车动力系统支架试制` | React 已迁 | `cases/automotive-powertrain-bracket-prototype.json` |  |
| `行业案例—汽车测试夹具与小批试制件.html` | `/cases/汽车测试夹具与小批试制件` | React 已迁 | `cases/automotive-test-fixture-low-volume-parts.json` |  |
| `行业案例—消费品外观样机与功能件试制.html` | `/cases/消费品外观样机与功能件试制` | React 已迁 | `cases/consumer-products-appearance-prototype-functional-parts.json` |  |
| `行业案例—消费品小家电内部支架小批试制.html` | `/cases/消费品小家电内部支架小批试制` | React 已迁 | `cases/consumer-products-small-appliance-internal-bracket.json` |  |
| `行业案例—消费品智能穿戴外壳样件.html` | `/cases/消费品智能穿戴外壳样件` | React 已迁 | `cases/consumer-products-smart-wearable-housing-prototype.json` |  |
| `行业案例—电子便携设备内部支架试制.html` | `/cases/电子便携设备内部支架试制` | React 已迁 | `cases/electronics-portable-device-internal-bracket.json` |  |
| `行业案例—电子铜合金连接件小批加工.html` | `/cases/电子铜合金连接件小批加工` | React 已迁 | `cases/electronics-copper-alloy-connector-low-volume.json` |  |
| `行业案例—电子铝合金外壳与散热结构.html` | `/cases/电子铝合金外壳与散热结构` | React 已迁 | `cases/electronics-aluminum-housing-thermal-structure.json` |  |
| `行业案例—航天星载设备安装板小批加工.html` | `/cases/航天星载设备安装板小批加工` | React 已迁 | `cases/aerospace-satellite-equipment-mounting-plate.json` |  |
| `行业案例—航天轻量化支架与复杂腔体.html` | `/cases/航天轻量化支架与复杂腔体` | React 已迁 | `cases/aerospace-lightweight-bracket-complex-cavity.json` |  |
| `行业案例—航天钛合金连接件首件验证.html` | `/cases/航天钛合金连接件首件验证` | React 已迁 | `cases/aerospace-titanium-connector-first-article.json` |  |
| `行业案例—通信户外设备安装支架.html` | `/cases/通信户外设备安装支架` | React 已迁 | `cases/telecommunications-outdoor-equipment-mounting-bracket.json` |  |
| `行业案例—通信散热基板与端盖加工.html` | `/cases/通信散热基板与端盖加工` | React 已迁 | `cases/telecommunications-thermal-baseplate-end-cover.json` |  |
| `行业案例—通信模块外壳与连接件配套.html` | `/cases/通信模块外壳与连接件配套` | React 已迁 | `cases/telecommunications-module-housing-connector-set.json` |  |

## 资源

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `资源中心—资源部分.html` | `/resources` | React 已迁 | `resources/home.json` |  |
| `资源中心—工艺指南子页面.html` | `/resources/process-guide` | React 已迁 | `resources/process-guide.json` |  |
| `资源中心—材料手册子页面.html` | `/resources/material-handbook` | React 已迁 | `resources/material-handbook.json` |  |
| `资源中心—设计规范子页面.html` | `/resources/design-guidelines` | React 已迁 | `resources/design-guidelines.json` |  |
| `资源中心—常见FAQ子页面.html` | `/resources/faq` | React 已迁 | `resources/faq.json` |  |
| `资源中心-模型中心.html` | `/resources/model-center` | React 已迁 | `resources/model-center.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—下载中心子页面.html` | `/resources/downloads` | React 已迁 | `resources/downloads.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态子页面.html` | `/resources/news` | React 已迁 | `news/home.json` | EN HTML 暂缺，英文暂镜像中文 |

## 资源·新闻

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `资源中心—新闻动态—DFM设计审查子页面.html` | `/resources/news/dfm-design-review` | React 已迁 | `news/dfm-design-review.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态—制造服务能力升级子页面.html` | `/resources/news/manufacturing-service-upgrade` | React 已迁 | `news/manufacturing-service-upgrade.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态—复杂零件五轴加工子页面.html` | `/resources/news/five-axis-complex-parts` | React 已迁 | `news/five-axis-complex-parts.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态—材料性能参数对比子页面.html` | `/resources/news/material-performance-comparison` | React 已迁 | `news/material-performance-comparison.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态—精密加工项目风险控制子页面.html` | `/resources/news/precision-machining-risk-control` | React 已迁 | `news/precision-machining-risk-control.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态—自动化零部件制造趋势子页面.html` | `/resources/news/automation-parts-trends` | React 已迁 | `news/automation-parts-trends.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态—铝合金不锈钢钛合金对比子页面.html` | `/resources/news/aluminum-stainless-titanium` | React 已迁 | `news/aluminum-stainless-titanium.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态—首件检测与CMM验收子页面.html` | `/resources/news/first-article-cmm` | React 已迁 | `news/first-article-cmm.json` | EN HTML 暂缺，英文暂镜像中文 |
| `资源中心—新闻动态—首件检测与批量验收子页面.html` | `/resources/news/first-article-batch` | React 已迁 | `news/first-article-batch.json` | EN HTML 暂缺，英文暂镜像中文 |

## 关于

| 中文静态 HTML | React 网址 | 状态 | 对应 JSON | 备注 |
|---------------|------------|------|-----------|------|
| `关于我们—关于部分.html` | `/about` | React 已迁 | `about/home.json` |  |
| `关于我们—公司介绍子页面.html` | `/about/company` | React 已迁 | `about/company.json` |  |
| `关于我们—质量保证子页面.html` | `/about/quality` | React 已迁 | `about/quality.json` |  |
| `关于我们—隐私政策子页面.html` | `/about/privacy` | React 已迁 | `about/privacy.json` |  |
| `关于我们—服务条款子页面.html` | `/about/terms` | React 已迁 | `about/terms.json` |  |

