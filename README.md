# AI智能制造报价系统

基于 React + Next.js + Tailwind CSS + Three.js + 豆包AI 的智能制造报价平台

## 项目架构

```
AI智能制造报价系统
├── 前端架构 (React + Next.js + Tailwind)
│   ├── Header - 工作流标签导航
│   ├── Viewer - Three.js核心引擎
│   ├── WorkflowManager - 八个流程模块
│   └── AIConsole - 豆包AI对话控制台
│
├── 核心工作流
│   ├── 1. 上传 → STEP文件拖拽上传
│   ├── 2. 3D → 模型预览 + 几何信息
│   ├── 3. 结构 → 壁厚/重量/拓扑分析
│   ├── 4. DFM → 可制造性评分
│   ├── 5. 模具 → 模具设计方案
│   ├── 6. 流动 → 流动参数分析
│   ├── 7. 报价 → 成本明细 + 参数设置
│   └── 8. AI → 豆包智能分析（共创蒸馏）
│
└── 技术特色
    ├── Three.js永远保留（工业软件架构）
    ├── 右侧面板动态切换
    ├── 豆包AI免费模型集成
    └── 专业CAD Viewer预留
```

## 技术栈

- **前端框架**: React 18 + Next.js 14
- **样式**: Tailwind CSS
- **3D引擎**: Three.js + React Three Fiber + Drei
- **状态管理**: Zustand
- **AI集成**: 豆包AI (doubao-lite-4k)
- **语言**: TypeScript

## 快速开始

### 安装依赖
```bash
npm install
```

### 运行开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
│
├── components/
│   ├── layout/            # 布局组件
│   │   ├── Header.tsx     # 顶部导航
│   │   └ AIConsole.tsx    # AI对话控制台
│   │
│   ├── viewer/            # Three.js Viewer
│   │   └── Viewer.tsx     # 3D模型显示
│   │
│   └── workflow/          # 八个工作流模块
│       ├── Upload.tsx     # 文件上传
│       ├── Viewer3D.tsx   # 3D预览
│       ├── Structure.tsx  # 结构分析
│       ├── DFM.tsx        # DFM分析
│       ├── Mold.tsx       # 模具设计
│       ├── Flow.tsx       # 流动分析
│       ├── Quote.tsx      # 报价系统
│       ├── Distillation.tsx # AI共创
│       └── WorkflowManager.tsx # 流程管理
│
├── lib/
│   ├── doubao.ts          # 豆包AI集成
│   └── utils.ts           # 工具函数
│
├── store/
│   └ useStore.ts          # Zustand状态管理
│
└── types/
│   └ index.ts             # TypeScript类型定义
```

## 核心功能

### 1. STEP文件上传
- 支持拖拽上传
- 支持 .step, .stp 格式
- 文件信息实时显示

### 2. Three.js 3D预览
- OrbitControls（旋转、平移、缩放）
- Grid地面显示
- 环境光照和阴影
- 专业CAD Viewer预留

### 3. 结构分析
- 真实壁厚分析
- 厚实度指数
- 重量估算
- 投影面积
- 自由边/修复
- 实体可信度
- 多实体信息
- 分类判断
- 螺牙判断

### 4. DFM可制造性分析
- DFM评分（0-100）
- 问题检出
- 优化建议
- 工艺推荐

### 5. 报价系统
- 材料选择
- 数量设置
- 工艺选择
- 成本明细
- 总价计算

### 6. 豆包AI集成
- 模型几何分析
- 工艺路线生成
- DFM分析
- 报价建议
- 实时对话交互

## 设计理念

按照工业软件最佳实践：
- **双核心架构**: Viewer + Workflow
- **Three.js永远保留**: 中央区域始终显示模型
- **右侧动态切换**: 根据流程切换分析面板
- **专业CAD Viewer**: 预留完整API和工具栏

## 待完善功能

- [ ] 集成OpenCascade.js解析真实STEP文件
- [ ] 实现精确几何数据提取
- [ ] 完善专业Viewer工具栏（测量、剖切、爆炸等）
- [ ] 实现PDF导出功能
- [ ] 添加报价历史管理

## 开发说明

本项目为纯前端演示版本，所有数据均为模拟数据。真实STEP文件解析需要集成OpenCascade.js。

豆包AI使用免费模型 `doubao-lite-4k`，API密钥已配置。

## 许可证

MIT