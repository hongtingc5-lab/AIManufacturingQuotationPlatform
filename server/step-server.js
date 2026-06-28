// STEP文件处理后端服务
// 使用OpenCASCADE进行STEP到GLB的转换

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// 简单的文件上传配置
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB限制
});

const app = express();
app.use(cors());
app.use(express.json());

// 导入occt-import-js进行STEP处理
const { loadThreeMesh } = require('occt-import-js');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter');

app.post('/api/convert-step', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传STEP文件' });
    }

    console.log('[Backend] 开始处理STEP文件:', req.file.originalname);
    
    // 使用occt-import-js解析STEP文件
    const meshes = await loadThreeMesh(req.file.buffer, {
      readDouble: true,
      verbosity: 0,
    });

    console.log('[Backend] STEP解析完成，网格数:', meshes.length);

    // 构建Three.js场景
    const THREE = require('three');
    const scene = new THREE.Scene();

    for (const meshData of meshes) {
      const { position, normal, color, size } = meshData;
      
      if (!position || position.length === 0) continue;

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
      
      if (normal && normal.length > 0) {
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
      } else {
        geometry.computeVertexNormals();
      }

      const material = new THREE.MeshPhongMaterial({
        color: color ? new THREE.Color(color[0], color[1], color[2]) : 0x88ccff,
        side: THREE.DoubleSide,
        flatShading: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      if (size) {
        mesh.scale.set(size[0], size[1], size[2]);
      }

      scene.add(mesh);
    }

    // 导出为GLB格式
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const buffer = Buffer.from(gltf);
        console.log('[Backend] GLB导出成功，大小:', buffer.length);
        
        res.setHeader('Content-Type', 'model/gltf-binary');
        res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.replace(/\.step$/i, '.glb')}"`);
        res.send(gltf);
      },
      (error) => {
        console.error('[Backend] GLB导出失败:', error);
        res.status(500).json({ error: 'GLB转换失败' });
      },
      { binary: true }
    );

  } catch (error) {
    console.error('[Backend] 处理失败:', error);
    res.status(500).json({ 
      error: 'STEP文件处理失败',
      details: error.message 
    });
  }
});

// 提取几何信息的轻量接口
app.post('/api/analyze-step', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传STEP文件' });
    }

    const textDecoder = new TextDecoder('utf-8');
    const stepContent = textDecoder.decode(req.file.buffer);

    // 提取基本信息
    const points = [];
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
    points.forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      minZ = Math.min(minZ, p.z);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
      maxZ = Math.max(maxZ, p.z);
    });

    // 统计拓扑
    const faceCount = (stepContent.match(/ADVANCED_FACE\s*\(/gi) || []).length;
    const edgeCount = (stepContent.match(/EDGE_CURVE\s*\(/gi) || []).length;
    const cylinderCount = (stepContent.match(/CYLINDRICAL_SURFACE\s*\(/gi) || []).length;
    const bsplineCount = (stepContent.match(/B_SPLINE_SURFACE_WITH_KNOTS\s*\(/gi) || []).length;
    const circleCount = (stepContent.match(/\bCIRCLE\s*\(/gi) || []).length;

    const productMatch = stepContent.match(/PRODUCT\s*\(\s*'([^']+)'/i);
    const productName = productMatch ? productMatch[1] : 'Unknown';

    res.json({
      success: true,
      analysis: {
        productName,
        boundingBox: {
          min: { x: minX, y: minY, z: minZ },
          max: { x: maxX, y: maxY, z: maxZ },
          size: {
            x: maxX - minX,
            y: maxY - minY,
            z: maxZ - minZ,
          },
        },
        topology: {
          faces: faceCount,
          edges: edgeCount,
          vertices: points.length,
        },
        features: {
          cylindricalHoles: cylinderCount,
          bsplineSurfaces: bsplineCount,
          circles: circleCount,
        },
        volume: (maxX - minX) * (maxY - minY) * (maxZ - minZ),
      },
    });

  } catch (error) {
    console.error('[Backend] 分析失败:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`[Backend] STEP处理服务运行在 http://localhost:${PORT}`);
});
