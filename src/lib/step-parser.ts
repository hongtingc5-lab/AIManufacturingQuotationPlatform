export interface ParsedSTEPModel {
  vertices: number[];
  indices: number[];
  faces: number;
  edges: number;
  solids: number;
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  volume: number;
}

export interface STEPAnalysis {
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
    size: { x: number; y: number; z: number };
  };
  topology: {
    faces: number;
    edges: number;
    vertices: number;
    solids: number;
    shells: number;
  };
  surfaceTypes: {
    planar: number;
    cylindrical: number;
    conical: number;
    spherical: number;
    toroidal: number;
    bspline: number;
    other: number;
    total: number;
  };
  geometryFeatures: {
    hasCylindricalHoles: boolean;
    hasPlanarFaces: boolean;
    hasBsplineSurfaces: boolean;
    hasRevolutionFeatures: boolean;
  };
  modelInfo: {
    productName: string;
    units: string;
    fileFormat: string;
  };
  estimatedVolume: number;
  estimatedSurfaceArea: number;
  estimatedWeight: number;
}

export function parseSTEP(fileBuffer: ArrayBuffer): ParsedSTEPModel {
  const textDecoder = new TextDecoder('utf-8');
  const stepContent = textDecoder.decode(fileBuffer);

  const points: { x: number; y: number; z: number }[] = [];
  const pointRegex = /CARTESIAN_POINT\s*\(\s*'([^']*)'\s*,\s*\(\s*([\d.+-eE]+)\s*,\s*([\d.+-eE]+)\s*,\s*([\d.+-eE]+)\s*\)/gi;

  let match;
  while ((match = pointRegex.exec(stepContent)) !== null) {
    points.push({
      x: parseFloat(match[2]),
      y: parseFloat(match[3]),
      z: parseFloat(match[4]),
    });
  }

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    minZ = Math.min(minZ, point.z);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
    maxZ = Math.max(maxZ, point.z);
  });

  const faceCount = (stepContent.match(/(?:FACE|ADVANCED_FACE)\s*\(/gi) || []).length;
  const edgeCount = (stepContent.match(/(?:EDGE|EDGE_CURVE)\s*\(/gi) || []).length;
  const solidCount = (stepContent.match(/(?:SOLID|COMPOSITE_SOLID|MANIFOLD_SOLID_BREP)\s*\(/gi) || []).length;

  let length = maxX - minX;
  let width = maxY - minY;
  let height = maxZ - minZ;
  
  if (length === 0) length = 1;
  if (width === 0) width = 1;
  if (height === 0) height = 1;

  const volume = length * width * height;

  const vertices: number[] = [];
  points.slice(0, 1000).forEach((p) => {
    vertices.push(p.x, p.y, p.z);
  });

  const indices: number[] = [];
  for (let i = 0; i < vertices.length / 3 - 2; i += 3) {
    indices.push(i, i + 1, i + 2);
  }

  return {
    vertices,
    indices,
    faces: faceCount || 6,
    edges: edgeCount || 12,
    solids: solidCount || 1,
    boundingBox: {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
    },
    volume,
  };
}

export function extractSTEPInfo(fileBuffer: ArrayBuffer): STEPAnalysis {
  const textDecoder = new TextDecoder('utf-8');
  const stepContent = textDecoder.decode(fileBuffer);

  // 提取所有坐标点
  const points: { x: number; y: number; z: number }[] = [];
  const pointRegex = /CARTESIAN_POINT\s*\(\s*'([^']*)'\s*,\s*\(\s*([\d.+-eE]+)\s*,\s*([\d.+-eE]+)\s*,\s*([\d.+-eE]+)\s*\)/gi;

  let match;
  while ((match = pointRegex.exec(stepContent)) !== null) {
    points.push({
      x: parseFloat(match[2]),
      y: parseFloat(match[3]),
      z: parseFloat(match[4]),
    });
  }

  // 计算包围盒
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    minZ = Math.min(minZ, point.z);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
    maxZ = Math.max(maxZ, point.z);
  });

  const length = maxX - minX;
  const width = maxY - minY;
  const height = maxZ - minZ;

  // 统计拓扑元素
  const advancedFaceCount = (stepContent.match(/ADVANCED_FACE\s*\(/gi) || []).length;
  const faceCount = (stepContent.match(/(?:^|#)FACE\s*\(/gim) || []).length;
  const edgeCount = (stepContent.match(/EDGE_CURVE\s*\(/gi) || []).length;
  const vertexPointCount = (stepContent.match(/VERTEX_POINT\s*\(/gi) || []).length;
  const solidCount = (stepContent.match(/MANIFOLD_SOLID_BREP\s*\(/gi) || []).length;
  const compSolidCount = (stepContent.match(/COMPOSITE_SOLID\s*\(/gi) || []).length;
  const shellCount = (stepContent.match(/(?:CLOSED_SHELL|OPEN_SHELL)\s*\(/gi) || []).length;

  // 统计曲面类型
  const planeCount = (stepContent.match(/PLANE\s*\(/gi) || []).length;
  const cylinderCount = (stepContent.match(/CYLINDRICAL_SURFACE\s*\(/gi) || []).length;
  const coneCount = (stepContent.match(/CONICAL_SURFACE\s*\(/gi) || []).length;
  const sphereCount = (stepContent.match(/SPHERICAL_SURFACE\s*\(/gi) || []).length;
  const torusCount = (stepContent.match(/TOROIDAL_SURFACE\s*\(/gi) || []).length;
  const bsplineSurfaceCount = (stepContent.match(/B_SPLINE_SURFACE_WITH_KNOTS\s*\(/gi) || []).length;
  const bsplineCurveCount = (stepContent.match(/B_SPLINE_CURVE_WITH_KNOTS\s*\(/gi) || []).length;
  const bezierSurfaceCount = (stepContent.match(/BEZIER_SURFACE\s*\(/gi) || []).length;
  const sweepCount = (stepContent.match(/(?:SWEPT_SURFACE|SURFACE_OF_LINEAR_EXTRUSION|SURFACE_OF_REVOLUTION)\s*\(/gi) || []).length;
  const offsetCount = (stepContent.match(/OFFSET_SURFACE\s*\(/gi) || []).length;
  const offsetCurveCount = (stepContent.match(/OFFSET_CURVE\s*\(/gi) || []).length;

  // 统计圆孔和圆柱特征
  const circleCount = (stepContent.match(/\bCIRCLE\s*\(/gi) || []).length;
  const ellipseCount = (stepContent.match(/\bELLIPSE\s*\(/gi) || []).length;
  const revolveCount = (stepContent.match(/REVOLVED_FEATURE\s*\(/gi) || []).length;

  // 识别几何特征
  const hasCylindricalHoles = circleCount > 0 || cylinderCount > 0;
  const hasPlanarFaces = planeCount > 0;
  const hasBsplineSurfaces = bsplineSurfaceCount > 0 || bezierSurfaceCount > 0 || sweepCount > 0;
  const hasRevolutionFeatures = revolveCount > 0 || torusCount > 0;

  // 检测单位
  let units = 'mm';
  const unitMatch = stepContent.match(/LENGTH_UNIT\s*\([^)]*METRE\s*\(\s*([\d.]+)\s*\)/i);
  if (unitMatch) {
    const meterValue = parseFloat(unitMatch[1]);
    if (meterValue === 1) units = 'm';
    else if (meterValue === 0.001) units = 'mm';
    else if (meterValue === 0.01) units = 'cm';
    else if (meterValue === 0.0254) units = 'inch';
  }

  // 提取产品名称
  const productNameMatch = stepContent.match(/PRODUCT\s*\(\s*'([^']+)'/i);
  const productName = productNameMatch ? productNameMatch[1] : 'Unknown Part';

  // 提取应用协议
  const protocolMatch = stepContent.match(/ISO-10303-(\d+)/i);
  const fileFormat = protocolMatch ? `STEP AP${protocolMatch[1]}` : 'STEP';

  // 估算体积和表面积（假设长方体）
  let estimatedVolume = length * width * height;
  let estimatedSurfaceArea = 2 * (length * width + width * height + height * length);

  // 如果有更多面信息，尝试更精确的计算
  if (advancedFaceCount > 0) {
    const avgFaceArea = estimatedSurfaceArea / Math.max(advancedFaceCount, 1);
    estimatedSurfaceArea = avgFaceArea * advancedFaceCount;
  }

  // 估算重量（假设材料密度为ABS塑料：1.05 g/cm³）
  const density = 0.00105; // g/mm³
  const estimatedWeight = estimatedVolume * density;

  return {
    boundingBox: {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
      size: { x: length, y: width, z: height },
    },
    topology: {
      faces: advancedFaceCount || faceCount || 6,
      edges: edgeCount || 12,
      vertices: vertexPointCount || points.length,
      solids: solidCount || compSolidCount || 1,
      shells: shellCount || 1,
    },
    surfaceTypes: {
      planar: planeCount,
      cylindrical: cylinderCount,
      conical: coneCount,
      spherical: sphereCount,
      toroidal: torusCount,
      bspline: bsplineSurfaceCount + bezierSurfaceCount + sweepCount,
      other: offsetCount + offsetCurveCount,
      total: advancedFaceCount || faceCount || 6,
    },
    geometryFeatures: {
      hasCylindricalHoles,
      hasPlanarFaces,
      hasBsplineSurfaces,
      hasRevolutionFeatures,
    },
    modelInfo: {
      productName,
      units,
      fileFormat,
    },
    estimatedVolume,
    estimatedSurfaceArea,
    estimatedWeight,
  };
}

export function generateStructurePrompt(analysis: STEPAnalysis): string {
  const { boundingBox, topology, surfaceTypes, geometryFeatures, modelInfo, estimatedVolume, estimatedWeight } = analysis;

  return `请分析以下机械零件的结构特征：

## 基本信息
- **产品名称**: ${modelInfo.productName}
- **文件格式**: ${modelInfo.fileFormat}
- **单位**: ${modelInfo.units}

## 几何尺寸
- **长度(X)**: ${boundingBox.size.x.toFixed(2)} ${modelInfo.units}
- **宽度(Y)**: ${boundingBox.size.y.toFixed(2)} ${modelInfo.units}
- **高度(Z)**: ${boundingBox.size.z.toFixed(2)} ${modelInfo.units}
- **包围盒体积**: ${(boundingBox.size.x * boundingBox.size.y * boundingBox.size.z).toFixed(2)} ${modelInfo.units}³

## 拓扑特征
- **面数**: ${topology.faces}
- **边数**: ${topology.edges}
- **顶点数**: ${topology.vertices}
- **实体数**: ${topology.solids}
- **壳数**: ${topology.shells}

## 曲面类型
- **平面**: ${surfaceTypes.planar}
- **圆柱面**: ${surfaceTypes.cylindrical}
- **圆锥面**: ${surfaceTypes.conical}
- **球面**: ${surfaceTypes.spherical}
- **环面**: ${surfaceTypes.toroidal}
- **B样条/自由曲面**: ${surfaceTypes.bspline}
- **其他曲面**: ${surfaceTypes.other}

## 几何特征识别
${geometryFeatures.hasCylindricalHoles ? '- ✓ 存在圆柱孔特征' : '- ✗ 未发现圆柱孔特征'}
${geometryFeatures.hasPlanarFaces ? '- ✓ 存在平面特征' : ''}
${geometryFeatures.hasBsplineSurfaces ? '- ✓ 存在B样条/自由曲面' : '- ✗ 无B样条曲面'}
${geometryFeatures.hasRevolutionFeatures ? '- ✓ 存在旋转特征' : ''}

## 估算参数
- **估算体积**: ${estimatedVolume.toFixed(2)} ${modelInfo.units}³
- **估算表面积**: ${(estimatedVolume * 6 / Math.pow(estimatedVolume, 2/3)).toFixed(2)} ${modelInfo.units}²
- **估算重量（ABS塑料）**: ${estimatedWeight.toFixed(2)} g

请提供：
1. 结构复杂度评估（简单/中等/复杂）
2. 主要几何特征分析
3. 可能的制造工艺
4. DFM可制造性建议
5. 壁厚评估
6. 材料建议（如果从几何判断）`;
}

export function generateDFMPrompt(analysis: STEPAnalysis): string {
  const { boundingBox, topology, surfaceTypes, geometryFeatures, modelInfo, estimatedVolume } = analysis;
  const wallThickness = Math.min(boundingBox.size.x, boundingBox.size.y, boundingBox.size.z);

  return `请进行DFM（可制造性）分析：

## 模型基本信息
- **产品名称**: ${modelInfo.productName}
- **外形尺寸**: ${boundingBox.size.x.toFixed(2)} × ${boundingBox.size.y.toFixed(2)} × ${boundingBox.size.z.toFixed(2)} ${modelInfo.units}
- **实体数量**: ${topology.solids}
- **面数**: ${topology.faces}

## 几何特征
${geometryFeatures.hasCylindricalHoles ? '- 存在圆柱孔/凸台' : ''}
${geometryFeatures.hasBsplineSurfaces ? '- 存在复杂曲面' : ''}
${geometryFeatures.hasPlanarFaces ? '- 以平面为主' : ''}

## 关键参数
- **最小壁厚估算**: ${wallThickness.toFixed(2)} ${modelInfo.units}
- **投影面积估算**: ${(boundingBox.size.x * boundingBox.size.y / 100).toFixed(2)} cm²
- **复杂度等级**: ${topology.faces > 100 ? '高' : topology.faces > 30 ? '中' : '低'}

请提供：
1. DFM评分（0-100）
2. 主要制造挑战
3. 建议的制造工艺（注塑/冲压/CNC等）
4. 需要优化的设计特征
5. 材料推荐
6. 模具设计建议`;
}

export function generateQuotationPrompt(analysis: STEPAnalysis): string {
  const { boundingBox, topology, surfaceTypes, geometryFeatures, modelInfo, estimatedVolume, estimatedWeight } = analysis;

  return `请根据以下参数提供报价建议：

## 产品信息
- **名称**: ${modelInfo.productName}
- **尺寸**: ${boundingBox.size.x.toFixed(1)} × ${boundingBox.size.y.toFixed(1)} × ${boundingBox.size.z.toFixed(1)} ${modelInfo.units}
- **复杂度**: ${topology.faces > 100 ? '高' : topology.faces > 30 ? '中' : '低'}
- **实体数**: ${topology.solids}

## 几何特征
- **曲面类型**: ${surfaceTypes.bspline > 0 ? '复杂曲面' : surfaceTypes.cylindrical > 0 ? '含圆柱特征' : '简单几何'}
- **孔特征**: ${geometryFeatures.hasCylindricalHoles ? '有' : '无'}
- **自由曲面**: ${surfaceTypes.bspline > 0 ? '存在' : '无'}

## 体积与重量
- **估算体积**: ${estimatedVolume.toFixed(2)} ${modelInfo.units}³
- **估算重量**: ${estimatedWeight.toFixed(1)} g

## 拓扑数据
- **面数**: ${topology.faces}
- **边数**: ${topology.edges}

请提供：
1. 推荐材料及单价
2. 模具成本估算
3. 单件生产成本估算
4. 批量价格（100/1000/10000件）
5. 交货周期
6. 整体报价范围`;
}