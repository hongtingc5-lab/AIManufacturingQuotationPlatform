#!/usr/bin/env node
/** Generates write-news-en-locales.data.json from the translation map below. */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CN_STRINGS = JSON.parse(
  readFileSync(join(__dirname, '../tmp-cn-strings.json'), 'utf8'),
);

/** @type {Record<string, string>} */
const T = {
  '一站式精密制造服务能力升级 | 新闻动态 | 敏捷智造':
    'One-Stop Precision Manufacturing Service Upgrade | News | ProMakeHub',
  '机加工常用材料性能参数对照表 | 新闻动态 | 敏捷智造':
    'Machined Material Performance Parameter Comparison | News | ProMakeHub',
  '精密加工全流程项目风险控制方案 | 新闻动态 | 敏捷智造':
    'Precision Machining Full-Process Project Risk Control | News | ProMakeHub',
  '资源中心': 'Resources',
  '新闻动态': 'Newsroom',
  '企业动态': 'Company News',
  '材料知识': 'Material Knowledge',
  '制造洞察': 'Manufacturing Insights',
  '文章信息': 'A R T I C L E  I N F O',
  '文章内容快速索引': 'Article content quick index',
  '文章目录': 'Post catalogue',
  '本文适合': 'This article is for',
  '素材参考': 'Material Reference',
  '内容分类': 'Entry Category',
  '适用对象': 'Who',
  '核心主题': 'Core Theme',
  '覆盖材料': 'Covered Materials',
  '相关阅读': 'Read Next: ',
  '立即报价': 'Quote now',
  '敏捷智造': 'ProMakeHub',
  '服务升级': 'Service Upgrade',
  '质量交付': 'Quality Delivery',
  '一站式制造': 'One-Stop Manufacturing',
  '材料选型': 'Material Selection',
  '工程塑料': 'Engineering Plastics',
  '项目风险': 'Project Risk',
  '工艺评估': 'Process Evaluation',
  '升级总览': 'Upgrade Overview',
  '服务价值': 'Service Value',
  '升级板块': 'Upgrade Area',
  '核心内容': 'Core Content',
  '客户价值': 'Customer Value',
  '硬件产能': 'Hardware Capacity',
  '工艺体系': 'Process System',
  '质量管控': 'Quality Control',
  '客户服务': 'Client Services',
  '设备 / 检测': 'Equipment / Inspection',
  '材料 / 参数': 'Materials / Parameters',
  '检验 / 追溯': 'Inspection / Traceability',
  'DFM / 选材 / 交付': 'DFM / Material Selection / Delivery',
  '质量升级重点': 'Quality Upgrade Focus',
  '硬件产能升级': 'Hardware Capacity Upgrade',
  '工艺体系升级': 'Process System Upgrade',
  '全链路品控': 'End-to-End Quality Control',
  '客户配套服务': 'Client Support Services',
  '服务升级结论': 'Service Upgrade Conclusion',
  '获取制造方案': 'Get Manufacturing Plan',
  '需要一站式制造服务？': 'Need one-stop manufacturing services?',
  '金属材料对比': 'Metal Material Comparison',
  '选型参数表': 'Selection Parameter Table',
  '工程塑料特点': 'Engineering Plastic Characteristics',
  '六项选材指标': 'Six Selection Criteria',
  '主要优势': 'Key Advantages',
  '主要限制': 'Main Limitations',
  '表面处理': 'Surface Finishing',
  '典型用途': 'Typical Applications',
  '加工注意': 'Machining Notes',
  '加工效率': 'Machining Efficiency',
  '成本表现': 'Cost Profile',
  '加工要求': 'Machining Requirements',
  '核心特点': 'Key Characteristics',
  '抗拉强度': 'Tensile Strength',
  '加工硬化': 'Work Hardening',
  '切削难度': 'Machining Difficulty',
  '耐腐蚀表现': 'Corrosion Performance',
  '切削加工特点': 'Machining Characteristics',
  '典型应用方向': 'Typical Application Areas',
  '需要材料选型建议？': 'Need material selection advice?',
  '获取选材建议': 'Get Material Selection Advice',
  '金属材料参数对比': 'Metal Material Parameter Comparison',
  '常用金属选型对照': 'Common Metal Selection Reference',
  '工程塑料参数特点': 'Engineering Plastic Parameter Characteristics',
  '六项核心选材指标': 'Six Core Selection Criteria',
  '选材结论与建议': 'Selection Conclusions and Recommendations',
  '塑料加工注意事项': 'Engineering Plastic Machining Notes',
  '风险总览': 'Risk Overview',
  '设计前置风险': 'Upfront Design Risk',
  '工艺生产风险': 'Process Production Risk',
  '质量验收风险': 'Quality Acceptance Risk',
  '供应链交付风险': 'Supply Chain Delivery Risk',
  '现场安全风险': 'Workshop Safety Risk',
  '项目协同机制': 'Project Coordination Model',
  '需要项目风险评估？': 'Need a project risk assessment?',
  '风险类型': 'Risk Type',
  '常见表现': 'Typical Symptoms',
  '可能后果': 'Potential Consequences',
  '关键管控动作': 'Key Control Actions',
  '管控建议': 'Control Recommendations',
  '图纸 / DFM': 'Drawings / DFM',
  '机床 / 刀具 / 装夹': 'Machine / Tooling / Fixturing',
  '首件 / 巡检': 'First Article / In-Process Inspection',
  '材料 / 外协 / 物流': 'Material / Outsourcing / Logistics',
  '车间作业': 'Shop-Floor Operations',
  '风险控制 / 稳定交付': 'Risk Control / Reliable Delivery',
  '采购 / 项目 / 供应链': 'Procurement / Project / Supply Chain',
  '研发 / 结构设计 / 采购': 'R&D / Structural Design / Procurement',
  '研发 / 采购 / 项目管理': 'R&D / Procurement / Project Management',
  '金属 / 工程塑料': 'Metals / Engineering Plastics',
  '一站式制造 / 服务升级': 'One-Stop Manufacturing / Service Upgrade',
  '碳钢': 'Carbon Steel',
  '铝合金': 'Aluminum Alloy',
  '不锈钢': 'Stainless Steel',
  '钛合金': 'Titanium Alloy',
  '尼龙': 'Nylon',
  '密度': 'Density',
  '导热率': 'Thermal Conductivity',
  '约为铝合金的 30%～50%': 'About 30% to 50% of aluminum alloy efficiency',
  'CNC 零件 DFM 可制造性设计审查要点':
    'CNC Parts DFM Manufacturability Design Review Points',
  '材料': 'Material',
  '突出': 'Excellent',
  '约为铝合金的': 'About',
  '加工': 'Machining',
  '图纸': 'Drawings',
  '钢': 'Steel',
  '全方位制造服务能力升级，打造从图纸到成品交付一站式精密加工解决方案':
    'Comprehensive Manufacturing Service Upgrade: Building a One-Stop Precision Machining Solution from Drawing to Finished Delivery',
  '单纯的 CNC 切削加工已经无法满足客户一体化需求。\n\n      客户更需要“图纸审核 → 选材建议 → 加工制造 → 表面处理 → 精密检测 → 打包交付”\n\n      的全链条配套服务。':
    'CNC machining alone can no longer meet customers\' integrated needs.\n\n      Customers need full-chain support covering drawing review → material selection advice → machining → surface finishing → precision inspection → packaging and delivery.',
  '从单一 CNC 加工，到图纸到成品交付的一站式制造服务':
    'From Standalone CNC Machining to One-Stop Manufacturing from Drawing to Finished Delivery',
  '仅提供 CNC 切削加工，已经无法满足越来越多客户的一体化交付需求。\n\n      对研发和采购团队来说，更理想的制造伙伴需要覆盖图纸审核、选材建议、\n\n      加工制造、表面处理、精密检测、包装交付和项目协同等完整链条。\n\n      敏捷智造持续迭代软硬件配置与服务体系，升级整体精密制造服务能力。':
    'Providing CNC machining alone can no longer meet the integrated delivery needs of more and more customers.\n\n      For R&D and procurement teams, an ideal manufacturing partner should cover drawing review, material selection advice,\n\n      machining, surface finishing, precision inspection, packaging, delivery, and project coordination across the full chain.\n\n      ProMakeHub continues to iterate its hardware, software, and service systems to upgrade overall precision manufacturing capabilities.',
  '企业采购、研发项目负责人、供应链团队、长期配套客户及制造项目管理人员':
    'Corporate procurement, R&D project leaders, supply chain teams, long-term supporting customers, and manufacturing project managers',
  '制造服务升级围绕硬件、工艺、品控和客户协同展开':
    'The manufacturing service upgrade spans hardware, process systems, quality control, and client collaboration',
  '精密制造项目越来越多地要求供应商提供完整解决方案。\n\n      客户不仅关注能否加工零件，还关注前期是否能审核图纸、\n\n      是否能推荐材料和表面处理方案、是否能输出检测报告、\n\n      是否能稳定配合样品试制与长期批量供货。':
    'Precision manufacturing projects increasingly require suppliers to provide complete solutions.\n\n      Customers care not only about whether parts can be machined, but also whether drawings can be reviewed upfront,\n\n      whether material and surface finishing options can be recommended, whether inspection reports can be delivered,\n\n      and whether prototype trials and long-term batch supply can be supported reliably.',
  '本次制造服务能力升级主要分为四个板块：\n\n      硬件设备升级、工艺技术沉淀、品质管控升级和配套增值服务升级。\n\n      这些能力共同构成从图纸到成品交付的一站式精密加工解决方案。':
    'This manufacturing service upgrade is organized into four areas:\n\n      hardware upgrades, process technology development, quality control enhancement, and value-added support services.\n\n      Together, these capabilities form a one-stop precision machining solution from drawing to finished delivery.',
  '五轴、车铣复合、恒温车间、三坐标等设备升级':
    'Upgrades to five-axis machines, turn-mill centers, temperature-controlled workshops, and CMM equipment',
  '适配复杂零件和高精度订单': 'Supports complex parts and high-precision orders',
  '沉淀金属和工程塑料标准化切削工艺库':
    'Build standardized machining process libraries for metals and engineering plastics',
  '提高加工稳定性和方案评估效率':
    'Improves machining stability and process evaluation efficiency',
  '来料、首件、过程巡检和终检四级流程':
    'Four-level workflow covering incoming inspection, first article, in-process patrol, and final inspection',
  '提升批量一致性和验收可信度':
    'Improves batch consistency and acceptance confidence',
  '图纸审查、材料选型、工艺评估和项目进度协同':
    'Drawing review, material selection, process evaluation, and project progress coordination',
  '降低沟通成本，提升交付透明度':
    'Reduces communication overhead and improves delivery transparency',
  '硬件产能升级：适配复杂异形零件与高精度加工需求':
    'Hardware capacity upgrade: supporting complex geometries and high-precision machining requirements',
  '硬件能力是精密制造服务的基础。\n\n      通过新增高精度五轴联动加工中心和数控车铣复合设备，\n\n      可提升复杂异形零件、多面加工零件和高精度结构件的加工能力。':
    'Hardware capability is the foundation of precision manufacturing services.\n\n      By adding high-precision five-axis machining centers and CNC turn-mill equipment,\n\n      we can improve machining capability for complex geometries, multi-face parts, and high-precision structural components.',
  '同时，恒温精密加工车间面积扩充，有助于控制温度变化对尺寸稳定性的影响。\n\n      对高精度零件来说，环境温度、机床热变形和检测条件都会影响最终尺寸结果，\n\n      因此恒温环境是高稳定性交付的重要基础。':
    'At the same time, expanding the temperature-controlled precision machining area helps control the impact of temperature variation on dimensional stability.\n\n      For high-precision parts, ambient temperature, machine thermal drift, and inspection conditions all affect final dimensions,\n\n      so a temperature-controlled environment is an important foundation for stable delivery.',
  '检测设备方面，配套升级桥式三坐标、粗糙度仪、硬度检测仪等精密检测设备，\n\n      可强化出厂检测硬件实力，为客户提供更完整的质量验证能力。':
    'On the inspection side, adding bridge CMMs, surface roughness testers, hardness testers, and other precision inspection equipment\n\n      strengthens outgoing inspection capability and provides customers with more complete quality verification.',
  '工艺体系升级：沉淀材料切削工艺库和特殊结构加工方案':
    'Process system upgrade: building material machining libraries and special-structure process plans',
  '精密加工不只是依赖设备，还依赖工艺经验积累。\n\n      不同材料的切削性能差异明显，例如铝合金切削效率高，\n\n      不锈钢容易加工硬化，钛合金切削热集中，工程塑料又容易受温度影响产生变形。\n\n      因此，建立材料切削工艺库能够提升报价和工艺评估效率。':
    'Precision machining depends not only on equipment, but also on accumulated process experience.\n\n      Cutting performance varies significantly by material. For example, aluminum alloys machine efficiently,\n\n      stainless steel work-hardens easily, titanium alloys concentrate cutting heat, and engineering plastics deform easily under temperature influence.\n\n      Building material machining libraries therefore improves quoting and process evaluation efficiency.',
  '敏捷智造持续沉淀铝合金、不锈钢、钛合金和各类工程塑料的标准化切削工艺库。\n\n      针对薄壁件、深腔件和易变形零件，形成专属加工参数方案，\n\n      帮助项目在试制阶段就降低变形、振刀和尺寸不稳定风险。':
    'ProMakeHub continues to build standardized machining libraries for aluminum alloys, stainless steel, titanium alloys, and various engineering plastics.\n\n      Dedicated machining parameter plans for thin-wall parts, deep cavities, and deformation-prone components\n\n      help projects reduce deformation, chatter, and dimensional instability risks during prototyping.',
  '此外，表面处理通常是影响最终交付的重要节点。\n\n      同步优化阳极氧化、电镀、钝化、喷砂等外协表面处理对接流程，\n\n      可以更好地统筹表面处理品质与工期。':
    'Surface finishing is also often a critical milestone affecting final delivery.\n\n      Optimizing outsourced anodizing, plating, passivation, sandblasting, and related finishing workflows in parallel\n\n      helps better coordinate finishing quality and lead time.',
  '全链路品控升级：每笔订单形成独立质量档案':
    'End-to-end quality control upgrade: every order gets an independent quality record',
  '客户对精密零件的质量要求已经不只停留在“尺寸合格”。\n\n      许多项目需要材料证明、首件报告、过程巡检记录、终检记录、\n\n      CMM 检测报告和加工履历资料。\n\n      因此，质量管理必须从单次检测升级为全链路记录。':
    'Customer quality requirements for precision parts no longer stop at "dimensions within tolerance."\n\n      Many projects require material certificates, first-article reports, in-process inspection records, final inspection records,\n\n      CMM reports, and machining history documentation.\n\n      Quality management must therefore evolve from one-time inspection to end-to-end traceability.',
  '敏捷智造落地全流程品质台账管理，\n\n      将来料检验、首件检验、过程巡检和成品终检四级质检流程标准化。\n\n      每一笔订单生成独立质量档案，加工和检测资料长期存档保管，\n\n      满足客户内审审核和质量追溯需求。':
    'ProMakeHub implements full-process quality ledger management,\n\n      standardizing incoming inspection, first-article inspection, in-process patrol, and final inspection.\n\n      Every order generates an independent quality record, with machining and inspection data archived long term\n\n      to support customer audits and quality traceability.',
  '从“最后测一下”升级为“全过程留痕”，让材料、加工、检测和交付数据能够被追溯。':
    'Moving from "final check only" to "full-process traceability" so material, machining, inspection, and delivery data can be traced.',
  '客户配套服务升级：覆盖图纸审核、选材分析与交付协同':
    'Client support upgrade: covering drawing review, material analysis, and delivery coordination',
  '对客户来说，项目前期最需要的是快速判断图纸能不能加工、材料选得是否合适、\n\n      工艺方案是否会影响成本和交期。\n\n      因此，敏捷智造免费开放 DFM 图纸审查、材料选型分析和加工工艺评估三项前置技术服务。':
    'For customers, the most important early-stage need is quickly determining whether a drawing is manufacturable, whether the material choice is appropriate,\n\n      and whether the process plan will affect cost and lead time.\n\n      ProMakeHub therefore provides free upfront technical services for DFM drawing review, material selection analysis, and machining process evaluation.',
  '在交付层面，支持样品加急打样、批量订单分批发货，\n\n      并可随货提供材质证明、检测报告等全套交付资料。\n\n      对长期配套客户，还可配备专属项目对接专员，实时同步订单加工进度。':
    'On the delivery side, we support expedited prototype runs, partial shipments for batch orders,\n\n      and complete delivery documentation including material certificates and inspection reports.\n\n      Long-term supporting customers can also receive dedicated project coordinators with real-time order progress updates.',
  '这种服务模式可以减少客户在设计、采购、加工、外协和检测之间反复沟通的成本，\n\n      让制造过程更透明，也更容易控制整体项目节奏。':
    'This service model reduces repeated communication across design, procurement, machining, outsourcing, and inspection,\n\n      making manufacturing more transparent and easier to control at the project level.',
  '一站式制造服务的价值：减少断点，提高交付确定性':
    'The value of one-stop manufacturing: fewer handoffs, greater delivery certainty',
  '单一加工代工模式下，客户往往需要自行协调图纸审核、材料采购、机加工、\n\n      表面处理、检测和物流等多个环节。\n\n      环节越多，沟通成本越高，不确定性也越大。':
    'In a single-process outsourcing model, customers often coordinate drawing review, material procurement, machining,\n\n      surface finishing, inspection, and logistics on their own.\n\n      The more steps involved, the higher the communication cost and uncertainty.',
  '一站式精密制造服务的价值在于减少流程断点。\n\n      从前期图纸审核到后期检测交付，由同一项目团队统筹推进，\n\n      可以更快发现风险、更快反馈进度，也更容易保证最终交付质量。':
    'The value of one-stop precision manufacturing lies in reducing process breakpoints.\n\n      From early drawing review to final inspection and delivery, one project team coordinates the full workflow,\n\n      enabling faster risk identification, faster progress feedback, and more reliable final delivery quality.',
  '制造能力升级的目标，是从加工执行转向技术型交付':
    'The goal of the capability upgrade is to move from machining execution to technical delivery',
  '依托多年精密机加工行业经验，\n\n      敏捷智造完成从单一加工代工向技术型一站式精密制造服务商升级，\n\n      兼顾样品研发试制与长期批量配套供货服务。':
    'Backed by years of precision machining experience,\n\n      ProMakeHub has evolved from single-process outsourcing to a technical one-stop precision manufacturing partner,\n\n      supporting both prototype development and long-term batch supply.',
  '欢迎各类企业洽谈样品试制、长期零部件配套合作，\n\n      可立即提交图纸获取精准报价与工艺方案。':
    'Companies are welcome to discuss prototype trials and long-term component supply partnerships.\n\n      Submit drawings now for accurate quotes and process recommendations.',
  '澎湃新闻智能工厂建设资讯、上观新闻智造工艺升级报道、\n\n      宁波经信局专精特新企业数字化升级文件。':
    'The Paper smart factory coverage, Shanghai Observer advanced manufacturing process reports,\n\n      and Ningbo Economic and Information Bureau specialized-enterprise digital upgrade guidance.',
  '精密制造服务能力升级': 'Precision manufacturing service capability upgrade',
  '提交图纸、数量和交付要求，\n\n      获取从工艺到成品交付的整体方案。':
    'Submit drawings, quantities, and delivery requirements\n\n      to receive an end-to-end plan from process planning to finished delivery.',
  '继续了解金属材料选择、设计规范和精密加工工艺。':
    'Continue to learn about metal material selection, design specifications, and precision machining processes.',
  '铝合金不锈钢钛合金材料对比':
    'Comparison of aluminum alloy, stainless steel, and titanium alloy materials',
  '铝合金、不锈钢、钛合金如何进行选型取舍？':
    'How do you choose between aluminum, stainless steel, and titanium alloys?',
  '从重量、强度、耐腐蚀、加工难度和成本等维度，\n\n                横向比较三类常用金属。':
    'Compare three common metals horizontally across weight, strength, corrosion resistance, machining difficulty, and cost.',
  'DFM 可制造性设计审查': 'DFM Manufacturability Design Review',
  '从结构、公差、壁厚、圆角和装夹可行性识别加工风险。':
    'Identify machining risks from structure, tolerances, wall thickness, fillets, and fixturing feasibility.',
  '复杂曲面、型腔零件的五轴加工工艺解析':
    'Analysis of five-axis machining processes for complex surfaces and cavity parts',
  '复杂零件五轴加工': 'Five-axis machining of complex parts',
  '了解复杂结构零件采用五轴联动加工的优势与工艺重点。':
    'Understand the advantages and process priorities of five-axis linkage machining for complex structural parts.',
  '需要对应零件材料选型比对方案？':
    'Need a matching plan for part material selection?',
  '上传零件使用工况、受力要求与加工需求，\n\n            获取专业选材和工艺建议。':
    'Upload part operating conditions, load requirements, and machining needs\n\n            to receive expert material selection and process advice.',
  '机加工常用材料性能参数对照表，选材、切削工艺选型参考指南':
    'Machined Material Performance Parameter Comparison: Material Selection and Machining Process Reference Guide',
  '材料的力学性能、导热系数、硬度、耐腐蚀性、切削加工性能，\n\n          直接决定零件使用寿命、加工成本与加工方式。汇总碳钢、不锈钢、\n\n          铝合金、钛合金、常规工程塑料核心参数对比数据，\n\n          为零部件选材提供直观参考依据。':
    'Mechanical properties, thermal conductivity, hardness, corrosion resistance, and machinability\n\n          directly determine part service life, machining cost, and processing approach. This guide summarizes core comparison data for carbon steel, stainless steel,\n\n          aluminum alloys, titanium alloys, and common engineering plastics\n\n          to provide a practical reference for component material selection.',
  '材料参数是加工工艺规划的基础':
    'Material parameters are the foundation of machining process planning',
  '在 CNC 加工、钣金、3D 打印加工场景中，材料参数是工艺规划的基础依据。\n\n      材料的密度、强度、导热性、加工硬化、耐腐蚀能力和切削难度，\n\n      会共同影响零件的使用性能、加工费用与最终交付周期。':
    'In CNC machining, sheet metal, and 3D printing scenarios, material parameters are the basis for process planning.\n\n      Density, strength, thermal conductivity, work hardening, corrosion resistance, and machining difficulty\n\n      jointly affect part performance, machining cost, and final delivery lead time.',
  '研发工程师、结构设计人员、采购人员及制造工艺人员':
    'R&D engineers, structural designers, procurement staff, and manufacturing process engineers',
  '金属类材料核心参数对比': 'Core parameter comparison of metal materials',
  '常用机加工金属在密度、导热、耐腐蚀和切削性能方面差异明显。\n\n      同一种零件结构选用不同材料，会带来不同的加工难度、表面处理要求、\n\n      成本水平和交付结果。':
    'Common machined metals differ significantly in density, thermal conductivity, corrosion resistance, and machinability.\n\n      Choosing different materials for the same part structure leads to different machining difficulty, surface finishing requirements,\n\n      cost levels, and delivery outcomes.',
  '碳钢密度约为 7.85g/cm³，性价比较高，切削难度相对较低，\n\n          适合普通结构支撑件。45# 钢调质后强度进一步提升，\n\n          常用于轴类及常规机械零件。':
    'Carbon steel has a density of about 7.85 g/cm³, offers strong value, and is relatively easy to machine,\n\n          making it suitable for general structural supports. Quenched-and-tempered 45# steel provides higher strength\n\n          and is commonly used for shafts and conventional mechanical parts.',
  '成本较低、切削性能较好': 'Lower cost and good machinability',
  '耐腐蚀性能较弱': 'Weaker corrosion resistance',
  '发黑、镀锌等防锈处理': 'Black oxide, galvanizing, and other rust-prevention treatments',
  '支撑件、轴类及普通结构件': 'Supports, shafts, and general structural parts',
  '铝合金密度约为 2.7g/cm³，轻量化优势突出，导热系数高，\n\n          切削顺畅且刀具损耗较小，是自动化设备和新能源壳体常用材料。':
    'Aluminum alloy has a density of about 2.7 g/cm³, strong lightweight advantages, and high thermal conductivity.\n\n          It machines smoothly with relatively low tool wear and is commonly used for automation equipment and new energy enclosures.',
  '重量轻、散热好、加工效率高': 'Light weight, good heat dissipation, high machining efficiency',
  '刚性偏弱、热膨胀较明显': 'Lower rigidity and more noticeable thermal expansion',
  '薄壁件需要控制装夹和切削变形':
    'Thin-wall parts require controlled fixturing and machining deformation',
  '设备壳体、模组、散热件和支架':
    'Equipment housings, modules, heat dissipation parts, and brackets',
  '不锈钢耐腐蚀性能优异，其中 316 可适配潮湿和部分酸碱工况。\n\n          但不锈钢导热性较差，加工硬化明显，切削过程中容易出现粘刀现象。':
    'Stainless steel offers excellent corrosion resistance, with 316 suitable for humid and some acid/alkali environments.\n\n          However, stainless steel has poor thermal conductivity, obvious work hardening, and a tendency to built-up edge during cutting.',
  '耐腐蚀性和结构刚性较好': 'Good corrosion resistance and structural rigidity',
  '导热较差、容易产生加工硬化': 'Poor thermal conductivity and significant work hardening',
  '约为铝合金的 30%～50%': 'About 30% to 50% of aluminum alloy efficiency',
  '加工费用通常高于铝合金': 'Machining cost is usually higher than aluminum alloy',
  '钛合金比强度高、耐腐蚀性突出，常用于医疗植入件和航空结构件。\n\n          由于导热系数较低，切削热容易集中在刀尖，是典型的难加工材料。':
    'Titanium alloy offers high specific strength and outstanding corrosion resistance, commonly used for medical implants and aerospace structural parts.\n\n          Because of its low thermal conductivity, cutting heat concentrates at the tool tip, making it a typical difficult-to-machine material.',
  '比强度高、耐腐蚀性能突出': 'High specific strength and outstanding corrosion resistance',
  '切削热集中、刀具损耗较大': 'Concentrated cutting heat and higher tool wear',
  '需要专用刀具、冷却和切削参数':
    'Requires dedicated tooling, cooling, and cutting parameters',
  '医疗、航空及高端耐腐蚀零件':
    'Medical, aerospace, and high-end corrosion-resistant parts',
  '常用机加工材料选型对照': 'Common machined material selection reference',
  '以下表格用于项目前期快速筛选。具体牌号仍需结合零件载荷、\n\n      工作温度、腐蚀环境、尺寸公差和预算进行进一步评估。':
    'The table below supports early-stage project screening. Specific grades still require further evaluation based on part loads,\n\n      operating temperature, corrosion environment, dimensional tolerances, and budget.',
  '强度与成本平衡，通用性较高': 'Balanced strength and cost with broad applicability',
  '较弱，通常需要防锈处理': 'Weak; rust-prevention treatment is usually required',
  '切削难度较低，加工成本可控': 'Lower machining difficulty and controllable cost',
  '结构支撑件、轴类零件': 'Structural supports and shaft parts',
  '轻量、导热、切削效率高': 'Lightweight, thermally conductive, and efficient to machine',
  '可通过阳极氧化等方式提升': 'Can be improved through anodizing and similar treatments',
  '切削顺畅，刀具损耗相对较小': 'Smooth cutting with relatively low tool wear',
  '自动化部件、新能源壳体': 'Automation components and new energy enclosures',
  '刚性与耐腐蚀性能均衡': 'Balanced rigidity and corrosion resistance',
  '优异，316 适配更严苛环境': 'Excellent; 316 suits harsher environments',
  '加工硬化明显、粘刀、效率较低':
    'Obvious work hardening, built-up edge, and lower efficiency',
  '阀体、紧固件、耐腐蚀部件': 'Valve bodies, fasteners, and corrosion-resistant components',
  '比强度高、重量和性能平衡': 'High specific strength with balanced weight and performance',
  '难切削，刀具和冷却要求较高':
    'Difficult to machine; higher tooling and cooling requirements',
  '医疗、航空及高端精密零件':
    'Medical, aerospace, and high-end precision parts',
  '工程塑料的性能与加工特点':
    'Performance and machining characteristics of engineering plastics',
  '工程塑料重量轻，并具备绝缘、耐磨或自润滑等特点，\n\n      常用于齿轮、滑块、绝缘结构件和非金属机械零件。\n\n      不同塑料在耐温性、吸湿性和尺寸稳定性方面差异较大。':
    'Engineering plastics are lightweight and offer insulation, wear resistance, or self-lubrication,\n\n      commonly used for gears, sliders, insulating structures, and non-metal mechanical parts.\n\n      Different plastics vary significantly in temperature resistance, moisture absorption, and dimensional stability.',
  '具备耐高温、高强度和耐磨特性，\n\n          适合对使用温度及机械性能要求较高的零件。':
    'Offers high temperature resistance, high strength, and wear resistance,\n\n          suitable for parts with demanding temperature and mechanical performance requirements.',
  '自润滑性能较好，常用于齿轮、滑动配件及低摩擦机械结构。':
    'Good self-lubrication, commonly used for gears, sliding components, and low-friction mechanical structures.',
  '韧性和抗冲击性能较好，成本相对较低，\n\n          适合常规非金属结构件。':
    'Good toughness and impact resistance at relatively lower cost,\n\n          suitable for conventional non-metal structural parts.',
  '塑料零件容易受切削温度影响产生软化或熔融变形。\n\n        加工转速、刀具锋利度、装夹方式和冷却方案需要根据材料单独调整。':
    'Plastic parts can soften or melt under cutting temperature.\n\n        Spindle speed, tool sharpness, fixturing method, and cooling strategy must be adjusted for each material.',
  '材料选型需要同时关注六项指标':
    'Material selection requires attention to six criteria at once',
  '密度直接影响零件重量，是轻量化结构设计首先需要比较的参数。':
    'Density directly affects part weight and is the first parameter to compare in lightweight structural design.',
  '根据零件受力、载荷形式和安全系数判断材料是否满足结构强度要求。':
    'Determine whether a material meets structural strength requirements based on part loading, load type, and safety factor.',
  '导热率既会影响零件使用过程中的散热，也会影响切削热的传递方式。':
    'Thermal conductivity affects both in-service heat dissipation and how cutting heat is transferred during machining.',
  '加工硬化越明显，越容易增加刀具损耗并降低连续加工效率。':
    'The more pronounced the work hardening, the greater the tool wear and the lower the continuous machining efficiency.',
  '应结合潮湿、盐雾、酸碱介质和户外环境等实际工况进行判断。':
    'Evaluate based on actual conditions such as humidity, salt spray, acid/alkali exposure, and outdoor environments.',
  '切削难度会影响机床时间、刀具消耗、报价水平和交付周期。':
    'Machining difficulty affects machine time, tool consumption, quoting level, and delivery lead time.',
  '材料选择会同步影响报价、周期与成品质量':
    'Material selection directly affects quoting, lead time, and finished-part quality',
  '同一种零件选用不同材料，加工报价、交付周期和成品品质都会出现明显差异。\n\n      项目前期需要先确定零件的使用环境、受力需求、重量限制和目标成本，\n\n      再进一步匹配材料牌号和加工工艺。':
    'The same part made from different materials can show significant differences in machining quote, delivery lead time, and finished quality.\n\n      Early in the project, define the operating environment, load requirements, weight limits, and target cost\n\n      before matching material grades and machining processes.',
  '敏捷智造已整理常用金属与工程塑料的材料参数和加工经验，\n\n      可根据零件使用工况提供材料牌号及加工方式建议。':
    'ProMakeHub has compiled material parameters and machining experience for common metals and engineering plastics\n\n      and can recommend material grades and processing methods based on part operating conditions.',
  '昆山镁富新机电、大连富泓机械材料科普文章、\n\n      人人文库材料参数手册。':
    'Kunshan Meifuxin Electromechanical, Dalian Fuhong Machinery material articles,\n\n      and Renrenwenku material parameter handbooks.',
  '机加工常用材料与精密零部件':
    'Common machined materials and precision components',
  '提交零件使用工况、受力要求和预算范围，\n\n            获取材料牌号与加工方案建议。':
    'Submit part operating conditions, load requirements, and budget range\n\n            to receive material grade and machining recommendations.',
  '精密加工全流程项目风险控制方案，规避报废、延期与成本超标问题':
    'Precision Machining Full-Process Project Risk Control: Preventing Scrap, Delays, and Cost Overruns',
  '精密零部件试制、批量加工项目中，设计偏差、工艺失控、检测疏漏、\n\n        供应链波动都会直接造成经济损失。结合精密机加工实战经验，\n\n        从五大维度拆解项目风险点与落地管控方式。':
    'In prototype and batch machining projects for precision components, design deviations, process loss of control, inspection gaps,\n\n        and supply chain volatility can directly cause financial loss. Based on practical precision machining experience,\n\n        this article breaks down project risks and control methods across five dimensions.',
  '研发工程师、采购人员、项目管理人员、质量负责人及制造供应链团队':
    'R&D engineers, procurement staff, project managers, quality leaders, and manufacturing supply chain teams',
  '精密加工项目风险不是单点问题，而是全流程协同问题':
    'Precision machining project risk is not a single-point issue, but a full-process coordination challenge',
  '精密零部件试制和批量加工项目中，任何一个环节的偏差都可能传导到最终交付结果。\n\n        图纸设计不合理会增加加工难度，工艺参数波动会造成尺寸持续偏移，\n\n        检测流程缺失会放大批量不良风险，材料和外协工序不稳定则可能引发延期与成本超标。\n\n        因此，项目风险控制需要贯穿图纸对接、工艺评估、生产执行、品质检测、物流交付和现场安全管理全链条。':
    'In prototype and batch machining projects for precision components, deviation in any step can propagate to the final delivery outcome.\n\n        Poor drawing design increases machining difficulty, process parameter drift causes ongoing dimensional offset,\n\n        missing inspection steps amplifies batch defect risk, and unstable material or outsourced steps can trigger delays and cost overruns.\n\n        Project risk control must therefore span drawing coordination, process evaluation, production execution, quality inspection, logistics delivery, and shop-floor safety.',
  '精密加工项目中常见的五类风险':
    'Five common risk categories in precision machining projects',
  '精密加工项目中的风险通常并不是孤立发生的。图纸阶段的过度公差会影响报价和加工路径，\n\n        工艺阶段的装夹和刀具问题会影响尺寸稳定性，质量阶段的检测疏漏会导致批量不良品流出，\n\n        而供应链和物流问题又会影响交期与客户验收体验。':
    'Risks in precision machining projects are usually not isolated. Over-tight tolerances at the drawing stage affect quoting and machining paths,\n\n        fixturing and tooling issues during processing affect dimensional stability, inspection gaps during quality control allow batch defects to escape,\n\n        and supply chain and logistics issues affect lead time and customer acceptance.',
  '从项目管理角度看，风险控制应拆解为五个板块：\n\n        设计前置风险、工艺生产风险、质量验收风险、供应链与交付风险、现场安全作业风险。\n\n        每个板块都需要对应的预审、过程监控、数据留存和异常处理机制。':
    'From a project management perspective, risk control should be divided into five areas:\n\n        upfront design risk, process production risk, quality acceptance risk, supply chain and delivery risk, and shop-floor safety risk.\n\n        Each area requires corresponding pre-review, in-process monitoring, data retention, and exception handling.',
  '公差过度收紧、薄壁结构、圆角不合理':
    'Over-tight tolerances, thin-wall structures, and unreasonable fillets',
  '加工难度增加、报价升高、样件失败':
    'Increased machining difficulty, higher quotes, and prototype failure',
  '投产前完成 DFM 预审': 'Complete DFM pre-review before production release',
  '刀具磨损、机床温漂、切削参数不稳定':
    'Tool wear, machine thermal drift, and unstable cutting parameters',
  '尺寸持续偏移、批量返工': 'Ongoing dimensional drift and batch rework',
  '过程监控、在线校准、参数补偿':
    'Process monitoring, in-line calibration, and parameter compensation',
  '首件缺失、巡检不足、量具未校准':
    'Missing first article, insufficient patrol inspection, and uncalibrated gauges',
  '批量不良品、客户验收争议':
    'Batch defects and customer acceptance disputes',
  '首件三检、过程抽检、数据留存':
    'First-article triple inspection, in-process sampling, and data retention',
  '供应链风险': 'Supply chain risk',
  '材料牌号不符、表面处理延期、运输磕碰':
    'Incorrect material grade, delayed surface finishing, and shipping damage',
  '交付延期、返修、额外成本':
    'Delivery delays, rework, and additional cost',
  '来料复检、节点锁定、缓冲周期':
    'Incoming re-inspection, milestone locking, and buffer time',
  '切削液泄漏、粉尘、旋转部件风险':
    'Cutting fluid leaks, dust, and rotating equipment hazards',
  '人员伤害、停工、安全事故':
    'Personnel injury, downtime, and safety incidents',
  '区域管控、持证上岗、安全巡检':
    'Zone control, certified operators, and safety patrols',
  '设计前置风险：图纸阶段决定后续加工难度':
    'Upfront design risk: the drawing stage determines downstream machining difficulty',
  '在精密加工项目中，很多生产阶段的问题其实早在图纸阶段就已经埋下隐患。\n\n        例如整张图纸全部标注高精度公差，内部腔体设计成标准刀具无法直接加工的直角，\n\n        薄壁结构没有考虑装夹变形，深槽结构没有考虑刀具刚性，\n\n        这些都会在报价、编程、装夹和实际切削阶段不断放大成本。':
    'In precision machining projects, many production-stage problems are seeded at the drawing stage.\n\n        For example, marking the entire drawing with tight tolerances, designing internal cavities with sharp corners standard tools cannot reach directly,\n\n        ignoring fixturing deformation in thin-wall structures, or ignoring tool rigidity in deep slots\n\n        all amplify cost during quoting, programming, fixturing, and actual cutting.',
  '设计前置风险的典型表现包括：图纸公差过度收紧、结构不满足 DFM 加工逻辑、\n\n        壁厚与圆角设计不合理、缺少可靠装夹基准、局部结构容易变形或无法加工。\n\n        对研发和采购团队来说，如果这些问题在投产之后才暴露，往往会造成重新改图、\n\n        重新报价、重新排产，甚至样件报废。':
    'Typical upfront design risks include over-tight tolerances, structures that do not follow DFM logic,\n\n        unreasonable wall thickness and fillet design, missing reliable fixturing datums, and local structures prone to deformation or impossible to machine.\n\n        For R&D and procurement teams, if these issues surface only after release, they often lead to drawing revisions,\n\n        re-quoting, re-scheduling, and even prototype scrap.',
  '项目启动前应完成图纸 DFM 预审，优先识别无法加工、容易变形、\n\n          需要特殊工艺或会显著增加成本的结构，并在报价前与设计方完成优化确认。':
    'Before project launch, complete DFM pre-review on drawings and prioritize structures that cannot be machined, deform easily,\n\n          require special processes, or significantly increase cost, then confirm optimizations with the design team before quoting.',
  '工艺生产风险：尺寸稳定性来自过程控制':
    'Process production risk: dimensional stability comes from process control',
  '精密加工并不是“程序正确就一定稳定”。实际生产过程中，刀具磨损、机床温漂、\n\n        装夹应力、材料批次差异和切削参数波动，都可能导致尺寸持续偏移。\n\n        尤其在批量加工中，如果缺少过程监控，早期微小偏差很容易扩散为整批返工或报废。':
    'Precision machining is not stable just because the program is correct. In actual production, tool wear, machine thermal drift,\n\n        fixturing stress, material lot variation, and cutting parameter fluctuation can all cause ongoing dimensional drift.\n\n        In batch production especially, without process monitoring, small early deviations can quickly spread into full-batch rework or scrap.',
  '常见的工艺生产风险包括：刀具寿命评估不足，换刀节点不清晰；\n\n        机床长时间运行后出现热变形；夹具夹紧力过大导致薄壁件变形；\n\n        切削参数不适配材料特性，引发振刀、毛刺、表面纹路或尺寸漂移。':
    'Common process production risks include insufficient tool life assessment and unclear tool-change timing;\n\n        thermal deformation after long machine runtime; excessive clamping force causing thin-wall deformation;\n\n        and cutting parameters mismatched to material characteristics, causing chatter, burrs, surface lines, or dimensional drift.',
  '对高精密项目而言，单纯依靠终检并不够。更可靠的方式是在加工过程中实时识别趋势，\n\n        通过恒温车间、机床热补偿系统、加工在线探针校准和 SPC 过程数据监控，\n\n        提前捕捉尺寸变化趋势，并在问题扩大前完成参数补偿。':
    'For high-precision projects, final inspection alone is not enough. A more reliable approach is real-time trend recognition during machining,\n\n        using temperature-controlled workshops, machine thermal compensation, in-process probe calibration, and SPC monitoring\n\n        to capture dimensional trends early and apply parameter compensation before issues escalate.',
  '针对关键尺寸建立过程监控点。换刀、换料、改程序、重装夹后，\n\n          应重新确认首件或关键尺寸，并记录过程数据，避免尺寸偏移在量产阶段持续放大。':
    'Establish process monitoring points for critical dimensions. After tool changes, material changes, program revisions, or re-fixturing,\n\n          reconfirm the first article or critical dimensions and record process data to prevent dimensional drift from amplifying in production.',
  '质量验收风险：首件和巡检是阻隔批量不良的核心':
    'Quality acceptance risk: first article and patrol inspection are the core barriers to batch defects',
  '质量验收风险的本质，是“问题没有在正确时间被发现”。\n\n        如果首件检测流程缺失，错误程序或错误装夹可能直接进入批量生产；\n\n        如果巡检频次不足，刀具磨损和温漂导致的尺寸偏移也可能直到终检才被发现；\n\n        如果检测量具未校准，检测数据本身也会失去可信度。':
    'The essence of quality acceptance risk is that problems are not discovered at the right time.\n\n        Without first-article inspection, incorrect programs or fixturing can go straight into batch production;\n\n        with insufficient patrol frequency, dimensional drift from tool wear and thermal drift may not be found until final inspection;\n\n        and if inspection gauges are not calibrated, the measurement data itself loses credibility.',
  '标准化质量管控应覆盖首件检测、过程巡检和成品终检。\n\n        首件阶段重点确认图纸尺寸、公差、材料、外观和关键功能面；\n\n        量产阶段需要固定频次抽样复测关键尺寸；\n\n        终检阶段则对整批零件的外观、尺寸和表面处理效果进行综合验收。':
    'Standardized quality control should cover first-article inspection, in-process patrol, and final inspection.\n\n        First article focuses on drawing dimensions, tolerances, material, appearance, and key functional surfaces;\n\n        production requires fixed-frequency sampling of critical dimensions;\n\n        final inspection verifies appearance, dimensions, and surface finishing for the full batch.',
  '严格执行首件三检制度。换料、换刀、修改程序或调整工艺后，\n\n          必须重新做首件验证。量产阶段应留存批量抽检记录，为后续追溯和客户验收提供依据。':
    'Strictly enforce the first-article triple-inspection system. After material changes, tool changes, program revisions, or process adjustments,\n\n          first-article verification must be repeated. Production should retain batch sampling records for traceability and customer acceptance.',
  '供应链与交付风险：材料、外协和物流节点都要前置锁定':
    'Supply chain and delivery risk: material, outsourcing, and logistics milestones must be locked in early',
  '精密加工项目通常不只包含机床切削，还可能涉及材料采购、热处理、\n\n        阳极氧化、电镀、钝化、喷砂、清洗、包装和物流等多个协同环节。\n\n        任何一个外部节点出现波动，都可能造成交付延期或质量争议。':
    'Precision machining projects usually involve more than machine cutting and may include material procurement, heat treatment,\n\n        anodizing, plating, passivation, sandblasting, cleaning, packaging, and logistics.\n\n        Volatility at any external milestone can cause delivery delays or quality disputes.',
  '常见风险包括：原材料牌号与图纸要求不一致，材料证明不完整；\n\n        外协表面处理工期延误，导致最终交付被动；\n\n        表面处理后颜色、膜厚或外观不符合预期；\n\n        物流环节包装保护不足，引发工件磕碰和划伤。':
    'Common risks include raw material grades that do not match drawing requirements and incomplete material certificates;\n\n        delayed outsourced surface finishing that puts final delivery under pressure;\n\n        post-finishing color, coating thickness, or appearance that does not meet expectations;\n\n        and insufficient packaging protection during logistics causing part impact and scratches.',
  '因此，供应链风险控制不应等到出货前才处理，而应在项目启动阶段就同步锁定。\n\n        对材料、外协工序和物流交付节点建立清晰时间表，并预留合理缓冲周期，\n\n        才能降低交付不确定性。':
    'Supply chain risk control should not wait until shipment. It should be locked in at project launch.\n\n        Establish clear schedules for material, outsourced steps, and logistics milestones with reasonable buffer time\n\n        to reduce delivery uncertainty.',
  '建立来料材质复检机制，同步确认外协表面处理交期和验收标准。\n\n          对易划伤、易变形或高表面要求零件，应提前确定包装方案。':
    'Establish incoming material re-inspection and confirm outsourced surface finishing lead times and acceptance standards in parallel.\n\n          For scratch-prone, deformation-prone, or high-appearance parts, define packaging plans in advance.',
  '现场安全作业风险：安全管理也是稳定交付的一部分':
    'Shop-floor safety risk: safety management is also part of reliable delivery',
  '精密加工车间中存在高速旋转设备、切削液、金属粉尘、锋利毛刺、\n\n        高温切屑和吊装搬运等多类现场风险。如果安全管理不到位，\n\n        不仅会造成作业人员伤害，也可能引发停机、停产和项目延期。':
    'Precision machining shops contain high-speed rotating equipment, cutting fluid, metal dust, sharp burrs,\n\n        hot chips, and lifting/handling hazards. Poor safety management can cause worker injury\n\n        and also trigger downtime, production stoppages, and project delays.',
  '现场安全作业风险主要来自切削液泄漏、金属粉尘、机床旋转部件、\n\n        不规范上下料、未佩戴防护用品、非授权人员进入加工区域等。\n\n        对批量订单来说，安全隐患还会影响产线连续性和交付节奏。':
    'Shop-floor safety risks mainly come from cutting fluid leaks, metal dust, rotating machine components,\n\n        improper loading/unloading, missing PPE, and unauthorized access to machining areas.\n\n        For batch orders, safety hazards can also disrupt line continuity and delivery rhythm.',
  '车间应执行分级区域管控、人员持证上岗制度和常态化安全巡检。\n\n          对高风险设备、材料和工序建立明确操作规范，减少因现场事故导致的交付波动。':
    'Shops should enforce zone-based access control, certified operator requirements, and routine safety patrols.\n\n          Define clear operating standards for high-risk equipment, materials, and processes to reduce delivery disruption from shop-floor incidents.',
  '精密加工风险控制的核心，是让问题在前期暴露、在过程闭环':
    'The core of precision machining risk control is exposing issues early and closing the loop in process',
  '精密加工项目要降低报废、延期和成本超标风险，需要将 DFM 预审、工艺评估、\n\n        首件检测、过程巡检、材料复检、外协节点管控和交付资料留存组合成完整闭环。\n\n        单靠某一个部门或某一次终检，无法覆盖全流程风险。':
    'To reduce scrap, delay, and cost overrun risks in precision machining projects, DFM pre-review, process evaluation,\n\n        first-article inspection, in-process patrol, material re-inspection, outsourced milestone control, and delivery documentation must form a closed loop.\n\n        No single department or final inspection alone can cover full-process risk.',
  '敏捷智造针对每个加工项目建立专属项目对接群，\n\n        工艺、质检、项目专员全程跟进，\n\n        在图纸、工艺、生产、检测和交付阶段持续识别并前置化解潜在风险，\n\n        保障零件按时、按质交付。':
    'ProMakeHub establishes a dedicated project coordination channel for each machining project,\n\n        with process, quality, and project specialists following through end to end,\n\n        continuously identifying and resolving potential risks across drawing, process, production, inspection, and delivery stages\n\n        to ensure on-time, quality delivery.',
  '赛为安全官网、中国工控网、CSDN 机械加工风险分析文献。':
    'Safeway Safety website, China Industrial Control Network, and CSDN machining risk analysis literature.',
  '精密加工项目风险控制': 'Precision machining project risk control',
  '提交图纸、材料、数量和交付要求，\n\n        获取工程师前期工艺方案审核。':
    'Submit drawings, material, quantity, and delivery requirements\n\n        to receive upfront engineer process review.',
  '铝合金、不锈钢、钛合金如何进行选型取舍':
    'How do you choose between aluminum, stainless steel, and titanium alloys?',
  '零件 DFM 可制造性设计审查要点':
    'Parts DFM Manufacturability Design Review Points',
  '可制造性设计审查': 'Manufacturability Design Review',
  '选材 / 交付': 'Material Selection / Delivery',
  '耐腐蚀能力': 'Corrosion Resistance',
  '材料参数是加工工艺规划的基础':
    'Material parameters are the foundation of machining process planning',
};

function lookupTranslation(cn) {
  if (T[cn]) return T[cn];
  if (T[`${cn}。`]) return T[`${cn}。`];
  if (cn.endsWith('。') && T[cn.slice(0, -1)]) return T[cn.slice(0, -1)];
  if (T[`${cn}？`]) return T[`${cn}？`];
  if (cn.endsWith('？') && T[cn.slice(0, -1)]) return T[cn.slice(0, -1)];
  return undefined;
}

/** @type {Record<string, string>} */
const OUT = { ...T };
const missing = [];
for (const cn of CN_STRINGS) {
  const value = lookupTranslation(cn);
  if (!value) {
    missing.push(cn);
    continue;
  }
  OUT[cn] = value;
}

if (missing.length) {
  console.error('Missing translations:', missing.length);
  missing.forEach((s) => console.error(JSON.stringify(s)));
  process.exit(1);
}

writeFileSync(
  join(__dirname, 'write-news-en-locales.data.json'),
  `${JSON.stringify(OUT, null, 2)}\n`,
  'utf8',
);
console.log(`Wrote ${Object.keys(OUT).length} translations`);
