# STEP文件渲染问题解决方案

## 问题分析（用户分析完全正确）

您遇到的问题：上传STEP文件只显示长方体（包围盒），而不是真实的传动板实体模型。

### 根本原因

1. **STEP文件格式特性**
   - STEP是参数化曲面格式（B-Rep边界表示）
   - 包含NURBS样条曲面、圆柱面、圆锥面等复杂几何
   - 不是三角面片（如STL/OBJ），需要几何内核解析

2. **前端渲染限制**
   - 当前前端使用简单几何体占位（模拟）
   - 轻量JS解析器无法处理AP214 + B样条曲面
   - 没有几何内核进行网格化（Tessellation）

3. **典型症状**
   - 只读取到包围盒坐标
   - 无法三角化生成面片
   - 无法重建拓扑关系（面→环→边→点）

## 解决方案对比

### 方案1：后端预处理（推荐）

**优势**：最稳定、工业级精度、适合报价系统

**实现步骤**：
1. 后端用FreeCAD/OCCT读取STEP文件
2. 自动三角化导出STL/GLB网格文件
3. 前端Three.js直接加载网格
4. 提取体积、重量用于报价计算

**技术栈**：
```typescript
// 后端（Node.js + FreeCAD Python API）
import FreeCAD
import Part

def convert_step_to_stl(step_file, output_stl):
    doc = FreeCAD.newDocument()
    Part.read(step_file)
    # 三角化并导出STL
    ...
```

**前端**：
```typescript
// Three.js加载STL
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

const loader = new STLLoader()
loader.load('/api/convert/stl', (geometry) => {
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
})
```

### 方案2：前端OpenCascade.js（WASM）

**优势**：纯前端、无需后端

**缺点**：
- WASM体积大（~30MB）
- 配置复杂
- 部分STEP格式支持不完整

**实现步骤**：
1. 安装opencascade.js
2. 加载WASM引擎
3. 解析STEP并三角化
4. Three.js渲染网格

**示例代码**：
```typescript
import opencascade from 'opencascade.js'

const oc = await opencascade()
const reader = new oc.STEPControl_Reader()
reader.ReadFile('model.step')
reader.TransferRoots()
const shape = reader.OneShape()

// 三角化
const mesh = new oc.BRepMesh_IncrementalMesh(shape, 0.1)
// 提取三角面片
```

## 当前项目解决方案

### 建议：采用方案1（后端预处理）

因为：
1. 报价系统需要准确的体积、重量计算
2. 后端FreeCAD能提取准确的几何信息
3. 前端渲染更稳定、性能更好

### 实现路线

#### 第一步：添加后端API（Next.js API Routes）

```typescript
// src/app/api/convert/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  // 保存STEP文件
  const stepPath = path.join('/tmp', file.name)
  
  // 调用FreeCAD转换（需要安装FreeCAD）
  const stlPath = stepPath.replace('.step', '.stl')
  await exec(`freecadcmd convert_step.py ${stepPath} ${stlPath}`)
  
  // 返回STL文件和几何信息
  return NextResponse.json({
    stlUrl: `/api/files/${stlPath}`,
    geometry: {
      volume: ...,
      weight: ...,
      faces: ...
    }
  })
}
```

#### 第二步：前端修改Upload组件

```typescript
// src/components/workflow/Upload.tsx
const handleUpload = async (file: File) => {
  // 先发送到后端转换
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/convert', {
    method: 'POST',
    body: formData
  })
  
  const { stlUrl, geometry } = await response.json()
  
  // 加载STL网格
  const loader = new STLLoader()
  loader.load(stlUrl, (geometry) => {
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    
    // 存储几何信息用于报价
    setModelGeometry(geometry)
  })
}
```

### 临时替代方案

如果暂时无法配置FreeCAD后端，可以：

1. **手动转换**：用SolidWorks/FreeCAD导出STL，上传STL文件
2. **在线转换**：使用在线STEP转STL服务
3. **占位说明**：前端显示"3D预览需要STL格式"提示

## 下一步行动

1. **确认后端环境**：
   - 是否有FreeCAD/Python环境？
   - 是否可以部署Node.js后端？

2. **优先级排序**：
   - 如果报价系统优先 → 实现后端转换
   - 如果前端展示优先 → 实现STL上传支持

3. **技术选型**：
   - 后端：FreeCAD Python API（推荐）
   - 或在线转换服务API

---

**建议优先实现后端转换API，因为报价系统需要准确的几何信息，而这只有几何内核才能提供。**

需要我帮您实现后端API吗？