/**
 * STEP文件转换服务
 * 使用OpenCASCADE WebAssembly处理STEP文件，转换为GLB格式
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.step' || ext === '.stp') {
      cb(null, true);
    } else {
      cb(new Error('只支持STEP文件格式'));
    }
  }
});

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

let occLoaded = false;
let occtModule = null;

async function initOCCT() {
  if (occLoaded) return true;
  
  try {
    console.log('[Server] 正在加载OpenCASCADE WebAssembly...');
    const occtImportJs = require('occt-import-js');
    
    if (typeof occtImportJs === 'function') {
      occtModule = await occtImportJs();
      occLoaded = true;
      console.log('[Server] OpenCASCADE加载成功');
      return true;
    } else {
      console.error('[Server] OpenCASCADE导出格式未知');
      return false;
    }
  } catch (error) {
    console.error('[Server] OpenCASCADE加载失败:', error.message);
    return false;
  }
}

initOCCT();

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'STEP Converter',
    version: '1.0.0',
    opencascade: occLoaded ? 'loaded' : 'loading',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', async (req, res) => {
  res.json({
    opencascade: occLoaded ? 'ready' : 'loading',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/analyze-step', upload.single('file'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请上传STEP文件'
      });
    }

    const textDecoder = new TextDecoder('utf-8');
    const stepContent = textDecoder.decode(req.file.buffer);

    console.log(`[Server] 分析文件: ${req.file.originalname}`);

    const points = [];
    const pointRegex = /CARTESIAN_POINT\s*\(\s*'([^']*)'\s*,\s*\(\s*([\d.+-eE]+)\s*,\s*([\d.+-eE]+)\s*,\s*([\d.+-eE]+)\s*\)/gi;
    let match;
    while ((match = pointRegex.exec(stepContent)) !== null) {
      points.push({
        x: parseFloat(match[2]),
        y: parseFloat(match[3]),
        z: parseFloat(match[4])
      });
    }

    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    
    points.forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      minZ = Math.min(minZ, p.z);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
      maxZ = Math.max(maxZ, p.z);
    });

    const advancedFaceCount = (stepContent.match(/ADVANCED_FACE\s*\(/gi) || []).length;
    const edgeCurveCount = (stepContent.match(/EDGE_CURVE\s*\(/gi) || []).length;
    const vertexPointCount = (stepContent.match(/VERTEX_POINT\s*\(/gi) || []).length;
    const solidCount = (stepContent.match(/MANIFOLD_SOLID_BREP\s*\(/gi) || []).length;
    const shellCount = (stepContent.match(/(?:CLOSED_SHELL|OPEN_SHELL)\s*\(/gi) || []).length;

    const planeCount = (stepContent.match(/PLANE\s*\(/gi) || []).length;
    const cylinderCount = (stepContent.match(/CYLINDRICAL_SURFACE\s*\(/gi) || []).length;
    const coneCount = (stepContent.match(/CONICAL_SURFACE\s*\(/gi) || []).length;
    const sphereCount = (stepContent.match(/SPHERICAL_SURFACE\s*\(/gi) || []).length;
    const torusCount = (stepContent.match(/TOROIDAL_SURFACE\s*\(/gi) || []).length;
    const bsplineCount = (stepContent.match(/B_SPLINE_SURFACE_WITH_KNOTS\s*\(\s*'([^']*)'\s*,/gi) || []).length;

    const productMatch = stepContent.match(/PRODUCT\s*\(\s*'([^']+)'/i);
    const productName = productMatch ? productMatch[1] : 'Unknown Part';

    const protocolMatch = stepContent.match(/ISO-10303-(\d+)/i);
    const fileFormat = protocolMatch ? `STEP AP${protocolMatch[1]}` : 'STEP';

    const length = maxX - minX;
    const width = maxY - minY;
    const height = maxZ - minZ;
    const volume = length * width * height;
    const surfaceArea = 2 * (length * width + width * height + height * length);
    const processingTime = Date.now() - startTime;

    const features = {
      hasCylindricalHoles: cylinderCount > 0,
      hasBsplineSurfaces: bsplineCount > 0,
      hasRevolutionFeatures: torusCount > 0,
      hasPlanarFaces: planeCount > 0
    };

    const analysis = {
      success: true,
      processingTime,
      model: {
        name: productName,
        format: fileFormat,
        pointCount: points.length
      },
      dimensions: {
        length: length.toFixed(2),
        width: width.toFixed(2),
        height: height.toFixed(2),
        unit: 'mm'
      },
      boundingBox: {
        min: { x: minX.toFixed(2), y: minY.toFixed(2), z: minZ.toFixed(2) },
        max: { x: maxX.toFixed(2), y: maxY.toFixed(2), z: maxZ.toFixed(2) }
      },
      topology: {
        faces: advancedFaceCount || 6,
        edges: edgeCurveCount || 12,
        vertices: vertexPointCount || points.length,
        solids: solidCount || 1,
        shells: shellCount || 1
      },
      surfaceTypes: {
        planar: planeCount,
        cylindrical: cylinderCount,
        conical: coneCount,
        spherical: sphereCount,
        toroidal: torusCount,
        bspline: bsplineCount,
        total: advancedFaceCount || 6
      },
      geometryFeatures: features,
      volume: volume.toFixed(2),
      surfaceArea: surfaceArea.toFixed(2),
      weight: (volume * 0.00105).toFixed(2)
    };

    console.log(`[Server] 分析完成: ${productName}, ${analysis.topology.faces}面, ${processingTime}ms`);

    res.json(analysis);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[Server] 分析失败 (${processingTime}ms):`, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      processingTime
    });
  }
});

app.post('/api/convert-step', upload.single('file'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: '请上传STEP文件' 
      });
    }

    if (!occLoaded) {
      return res.status(503).json({
        success: false,
        error: 'OpenCASCADE正在加载中，请稍后重试',
        retry: true
      });
    }

    console.log(`[Server] 开始转换文件: ${req.file.originalname}`);

    let stepResult;
    try {
      stepResult = occtModule.ReadStepFile(req.file.buffer);
    } catch (parseError) {
      console.error('[Server] ReadStepFile失败:', parseError.message);
      throw new Error('STEP解析失败');
    }

    if (!stepResult || !stepResult.success || !stepResult.meshes || stepResult.meshes.length === 0) {
      throw new Error('未能从STEP文件中提取几何信息');
    }

    const meshes = [];
    for (const mesh of stepResult.meshes) {
      if (mesh.attributes && mesh.attributes.position && mesh.attributes.position.array) {
        const positionArray = mesh.attributes.position.array;
        const normalArray = mesh.attributes.normal ? mesh.attributes.normal.array : null;
        const indexArray = mesh.index ? mesh.index.array : null;
        
        meshes.push({
          name: mesh.name || 'mesh',
          position: Array.from(positionArray),
          normal: normalArray ? Array.from(normalArray) : null,
          index: indexArray ? Array.from(indexArray) : null,
          color: mesh.color ? Array.from(mesh.color) : [0.53, 0.8, 1]
        });
        console.log('[Server] 提取mesh:', mesh.name, '顶点数:', positionArray.length / 3, '索引数:', indexArray ? indexArray.length : 0);
      }
    }

    if (meshes.length === 0) {
      throw new Error('未能提取有效的网格数据');
    }

    const processingTime = Date.now() - startTime;
    
    console.log(`[Server] 网格数据提取成功: ${meshes.length}个mesh, 耗时: ${processingTime}ms`);

    res.json({
      success: true,
      processingTime,
      meshCount: meshes.length,
      meshes: meshes
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`[Server] 转换失败 (${processingTime}ms):`, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      processingTime
    });
  }
});

app.use((error, req, res, next) => {
  console.error('[Server] 错误:', error.message);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: '文件大小超过限制（最大50MB）'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: error.message
  });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  STEP文件转换服务已启动`);
  console.log(`  地址: http://localhost:${PORT}`);
  console.log(`  端口: ${PORT}`);
  console.log(`========================================`);
});

module.exports = app;