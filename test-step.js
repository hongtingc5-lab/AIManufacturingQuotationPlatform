const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function testConvert() {
  const filePath = path.join(__dirname, 'SND-AI-100081-38-J6传动板.step');
  
  if (!fs.existsSync(filePath)) {
    console.error('文件不存在:', filePath);
    return;
  }
  
  const file = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  
  console.log('开始测试STEP转换...');
  console.log('文件名:', fileName);
  console.log('文件大小:', (file.length / 1024 / 1024).toFixed(2), 'MB');
  
  try {
    const formData = new (require('form-data'))();
    formData.append('file', file, {
      filename: fileName,
      contentType: 'application/octet-stream'
    });
    
    const response = await axios.post(
      'http://localhost:3003/api/convert-step',
      formData,
      {
        headers: { ...formData.getHeaders() },
        timeout: 180000
      }
    );
    
    const data = response.data;
    console.log('转换成功!');
    console.log('状态码:', response.status);
    console.log('处理时间:', data.processingTime, 'ms');
    console.log('Mesh数量:', data.meshCount);
    
    if (data.meshes && data.meshes.length > 0) {
      data.meshes.forEach((mesh, index) => {
        console.log(`\nMesh ${index + 1}: ${mesh.name}`);
        console.log('  顶点数:', (mesh.position?.length || 0) / 3);
        console.log('  法向量数:', (mesh.normal?.length || 0) / 3);
        console.log('  索引数:', mesh.index?.length || 0);
        console.log('  颜色:', mesh.color);
      });
      
      const outputPath = path.join(__dirname, 'output', 'step-mesh-data.json');
      if (!fs.existsSync(path.join(__dirname, 'output'))) {
        fs.mkdirSync(path.join(__dirname, 'output'), { recursive: true });
      }
      fs.writeFileSync(outputPath, JSON.stringify(data.meshes[0], null, 2));
      console.log('\n网格数据已保存:', outputPath);
    }
    
  } catch (error) {
    console.error('转换失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : '无');
    }
  }
}

async function testAnalyze() {
  const filePath = path.join(__dirname, 'SND-AI-100081-38-J6传动板.step');
  
  if (!fs.existsSync(filePath)) {
    console.error('文件不存在:', filePath);
    return;
  }
  
  const file = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  
  console.log('\n开始测试STEP分析...');
  
  try {
    const formData = new (require('form-data'))();
    formData.append('file', file, {
      filename: fileName,
      contentType: 'application/octet-stream'
    });
    
    const response = await axios.post(
      'http://localhost:3003/api/analyze-step',
      formData,
      {
        headers: { ...formData.getHeaders() },
        timeout: 60000
      }
    );
    
    console.log('分析成功!');
    console.log('处理时间:', response.data.processingTime, 'ms');
    console.log('模型名称:', response.data.model.name);
    console.log('格式:', response.data.model.format);
    console.log('点数量:', response.data.model.pointCount);
    console.log('尺寸:', response.data.dimensions.length, 'x', response.data.dimensions.width, 'x', response.data.dimensions.height, response.data.dimensions.unit);
    console.log('拓扑 - 面:', response.data.topology.faces, '边:', response.data.topology.edges, '顶点:', response.data.topology.vertices);
    console.log('表面积类型 - 平面:', response.data.surfaceTypes.planar, '圆柱:', response.data.surfaceTypes.cylindrical, 'B样条:', response.data.surfaceTypes.bspline);
    console.log('体积:', response.data.volume, '重量:', response.data.weight);
    
  } catch (error) {
    console.error('分析失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data));
    }
  }
}

async function main() {
  try {
    await axios.get('http://localhost:3003/api/health');
    console.log('后端服务运行正常\n');
  } catch {
    console.error('后端服务未运行，请先启动服务');
    return;
  }
  
  await testAnalyze();
  await testConvert();
}

main();