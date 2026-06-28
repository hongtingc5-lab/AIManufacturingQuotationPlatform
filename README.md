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
- **AI集成**: 豆包AI (Doubao-Seed-Evolving)
- **后端服务**: Express + OpenCASCADE.js (STEP解析)
- **语言**: TypeScript

## 快速开始

### 1. 安装前端依赖

```bash
npm install
```

### 2. 安装后端依赖

```bash
cd server
npm install
cd ..
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填入您的豆包AI配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```env
DOUBAO_API_KEY=your_api_key_here
DOUBAO_ENDPOINT_ID=your_endpoint_id_here
```

### 4. 启动服务

**方式一：同时启动前端和后端（推荐）**

打开两个终端：

终端1 - 启动后端服务（STEP文件解析）:
```bash
cd server
node --max-old-space-size=4096 index.js
```

终端2 - 启动前端开发服务器:
```bash
npm run dev
```

### 5. 访问应用

打开浏览器访问: `http://localhost:3000`

## 项目结构

```
├── server/                    # 后端服务
│   ├── index.js              # STEP文件解析服务
│   └── package.json
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/ai/route.ts   # 豆包AI代理
│   │   ├── globals.css       # 全局样式
│   │   ├── layout.tsx        # 根布局
│   │   └── page.tsx          # 主页面
│   │
│   ├── components/
│   │   ├── layout/           # 布局组件
│   │   │   ├── Header.tsx    # 顶部导航
│   │   │   └ AIConsole.tsx   # AI对话控制台
│   │   │
│   │   ├── viewer/           # Three.js Viewer
│   │   │   └── Viewer.tsx    # 3D模型显示
│   │   │
│   │   └── workflow/         # 八个工作流模块
│   │       ├── Upload.tsx    # 文件上传
│   │       ├── Viewer3D.tsx  # 3D预览
│   │       ├── Structure.tsx # 结构分析
│   │       ├── DFM.tsx       # DFM分析
│   │       ├── Mold.tsx      # 模具设计
│   │       ├── Flow.tsx      # 流动分析
│   │       ├── Quote.tsx     # 报价系统
│   │       ├── Distillation.tsx # AI共创
│   │       └── WorkflowManager.tsx # 流程管理
│   │
│   ├── lib/
│   │   ├── doubao.ts         # 豆包AI集成
│   │   ├── occt-parser.ts    # OpenCASCADE解析器
│   │   └── utils.ts          # 工具函数
│   │
│   ├── services/
│   │   └── step-service.ts   # STEP文件服务
│   │
│   ├── store/
│   │   └ useStore.ts         # Zustand状态管理
│   │
│   └── types/
│       └ index.ts            # TypeScript类型定义
```

## 核心功能

### 1. STEP文件上传
- 支持拖拽上传
- 支持 .step, .stp, .stl 格式
- 文件信息实时显示

### 2. STEP文件完整解析（后端）
- 使用OpenCASCADE.js解析STEP文件
- 提取完整几何信息（顶点、法向量、索引）
- 支持AP214等工业标准格式

### 3. Three.js 3D预览
- OrbitControls（旋转、平移、缩放）
- Grid地面显示
- 环境光照和阴影
- 真实模型渲染（非包围盒）

### 4. 结构分析
- 真实壁厚分析
- 厚实度指数
- 重量估算
- 投影面积
- 自由边/修复
- 实体可信度
- 多实体信息
- 分类判断
- 螺牙判断

### 5. DFM可制造性分析
- DFM评分（0-100）
- 问题检出
- 优化建议
- 工艺推荐

### 6. 报价系统
- 材料选择
- 数量设置
- 工艺选择
- 成本明细
- 总价计算

### 7. 豆包AI集成
- 模型几何分析
- 工艺路线生成
- DFM分析
- 报价建议
- 实时对话交互

## 使用流程

1. **上传**: 点击或拖拽STEP文件到上传区域
2. **等待解析**: 系统会调用后端服务解析STEP文件
3. **查看3D**: 自动跳转到3D视图，显示真实模型
4. **结构分析**: 查看模型的几何属性和拓扑信息
5. **DFM分析**: 获取可制造性评分和优化建议
6. **模具设计**: 查看模具方案和参数
7. **流动分析**: 分析注塑流动参数
8. **报价**: 查看成本明细和价格
9. **AI共创**: 使用豆包AI进行智能分析

## 技术亮点

### STEP文件解析方案
- 使用OpenCASCADE.js后端服务
- 支持完整的STEP AP214格式解析
- 提取真实网格数据（顶点、法向量、索引）
- 前端直接渲染真实模型

### 工业软件架构
- 双核心架构：Viewer + Workflow
- Three.js永远保留在中央区域
- 右侧面板根据流程动态切换
- 专业CAD Viewer工具栏预留

## 配置说明

### 豆包AI配置
在火山方舟平台获取：
- API Key: 在API密钥管理中创建
- Endpoint ID: 创建推理接入点后获取

### 后端服务
- 端口: 3003
- API: `/api/analyze-step`, `/api/convert-step`
- 需要Node.js 18+

## 许可证

MIT
