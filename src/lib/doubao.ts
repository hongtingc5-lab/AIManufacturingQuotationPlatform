import axios from 'axios';

// 本地API代理客户端（绕过CORS问题）
const localClient = axios.create({
  baseURL: '/api/ai',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// 安全的日志函数 - 避免SSR时window未定义
function logAIEvent(type: 'request' | 'response' | 'error' | 'info', title: string, content: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ai-log', {
      detail: { type, title, content, timestamp: new Date() }
    }));
  }
}

// 请求拦截器
localClient.interceptors.request.use(
  (config) => {
    console.log('本地AI代理请求:', { url: config.url, method: config.method });
    logAIEvent('request', '发送AI请求', JSON.stringify({
      url: config.url,
      method: config.method,
      data: config.data
    }, null, 2));
    return config;
  },
  (error) => {
    console.error('请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
localClient.interceptors.response.use(
  (response) => {
    console.log('本地AI代理响应:', { status: response.status, success: response.data?.success });
    logAIEvent('response', 'AI响应成功', JSON.stringify({
      status: response.status,
      success: response.data?.success,
      data: response.data
    }, null, 2));
    return response;
  },
  (error) => {
    console.error('本地AI代理错误:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    logAIEvent('error', 'AI响应错误', JSON.stringify({
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    }, null, 2));
    return Promise.reject(error);
  }
);

export interface AIRequest {
  prompt: string;
  context?: any;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  id: string;
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  confidence: number;
}

// Token统计（用于监控50万限额）
let totalTokensUsed = 0;

// 调用AI（通过本地代理）
export async function callDoubaoAI(request: AIRequest): Promise<AIResponse> {
  logAIEvent('info', '开始AI调用', `Prompt长度: ${request.prompt.length}字符\nMaxTokens: ${request.maxTokens || '默认'}`);

  try {
    const response = await localClient.post('', {
      prompt: request.prompt,
      temperature: request.temperature,
      maxTokens: request.maxTokens,
    });

    // 检查代理响应
    if (!response.data.success) {
      throw new Error(response.data.error || 'AI代理请求失败');
    }

    const aiData = response.data.data;

    // 累加token使用
    const usedTokens = aiData.usage?.total_tokens || 0;
    totalTokensUsed += usedTokens;
    
    console.log(`豆包AI调用成功 - 本次使用: ${usedTokens} tokens | 累计使用: ${totalTokensUsed} / 500000 tokens (${(totalTokensUsed/500000*100).toFixed(2)}%)`);

    logAIEvent('info', 'AI调用完成', `Token使用: ${usedTokens}\n累计: ${totalTokensUsed} / 500000 (${(totalTokensUsed/500000*100).toFixed(2)}%)`);

    return {
      id: aiData.id,
      content: aiData.choices?.[0]?.message?.content || '',
      model: 'Doubao-Seed-Evolving',
      usage: {
        promptTokens: aiData.usage?.prompt_tokens || 0,
        completionTokens: aiData.usage?.completion_tokens || 0,
        totalTokens: usedTokens,
      },
      confidence: 0.85,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'AI分析服务暂时不可用';
    throw new Error(errorMessage);
  }
}

// 获取当前token使用情况
export function getTokenUsage() {
  return {
    used: totalTokensUsed,
    limit: 500000,
    percentage: (totalTokensUsed / 500000 * 100).toFixed(2),
    remaining: 500000 - totalTokensUsed,
  };
}

// 分析模型几何信息
export async function analyzeModelGeometry(geometryData: any): Promise<string> {
  const prompt = `分析以下CAD模型，给出简洁的工艺评估：

几何数据：${JSON.stringify(geometryData)}

请快速评估：
1. 主要尺寸和复杂度等级
2. 推荐工艺（注塑/压铸/机加工）
3. 关键DFM问题（最多3个）
4. 材料建议

用表格或列表形式，简洁明了。`;

  const response = await callDoubaoAI({ prompt, maxTokens: 800 });
  return response.content;
}

// 生成工艺路线
export async function generateProcessRoute(
  modelData: any,
  requirements: any
): Promise<string> {
  const prompt = `基于以下数据生成工艺路线：

模型：${JSON.stringify(modelData)}
要求：${JSON.stringify(requirements)}

请按以下格式输出：
1. 工艺流程（编号列表）
2. 关键参数（表格）
3. 预计工时
4. 质量控制点

简洁专业，避免重复信息。`;

  const response = await callDoubaoAI({ prompt, maxTokens: 1000 });
  return response.content;
}

// 生成报价建议
export async function generateQuotationSuggestion(
  modelData: any,
  processRoute: string,
  quantity: number
): Promise<string> {
  const prompt = `生成报价建议：

材料：${modelData.material || 'ABS'}
重量：${modelData.weight || 130}g
工艺：${processRoute}
数量：${quantity}件

请给出：
- 材料费/件
- 加工费/件  
- 模具费（如需）
- 总价和单价
- 成本优化建议

用表格列出，明细清晰。`;

  const response = await callDoubaoAI({ prompt, maxTokens: 800 });
  return response.content;
}

// DFM分析 - 返回结构化数据
export async function analyzeDFM(geometryData: any): Promise<any> {
  const prompt = `分析以下CAD模型，进行DFM可制造性评估：

几何数据：${JSON.stringify(geometryData)}

请以JSON格式返回：
{
  "score": 85,
  "issues": [
    {
      "id": "1",
      "type": "warning",
      "category": "壁厚",
      "description": "最小壁厚问题描述",
      "severity": 6,
      "suggestion": "改进建议"
    }
  ],
  "wallThickness": {
    "min": 2.5,
    "max": 12.0,
    "average": 5.2,
    "uniform": true
  },
  "draftAngle": {
    "recommended": 1.5,
    "current": 0,
    "needsImprovement": true
  },
  "undercuts": false,
  "ribDesign": "良好",
  "sharpCorners": 3,
  "dfmGrade": "B"
}

只返回JSON，不要其他文字。`;

  const response = await callDoubaoAI({ prompt, maxTokens: 800 });
  try {
    return JSON.parse(response.content);
  } catch (e) {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('AI返回的数据格式不正确');
  }
}

// 报价分析 - 返回结构化数据
export async function analyzeQuotation(
  modelData: any,
  material: string,
  quantity: number,
  process: string
): Promise<any> {
  const prompt = `基于以下模型信息生成详细报价：

模型数据：${JSON.stringify(modelData)}
材料：${material}
数量：${quantity}件
工艺：${process}

请以JSON格式返回：
{
  "weight": 130,
  "costs": {
    "material": 2.6,
    "labor": 500,
    "processing": 1000,
    "mold": 15000,
    "transport": 100,
    "profit": 262.5
  },
  "totalPrice": 17862.6,
  "unitPrice": 17.86,
  "leadTime": 15,
  "validityDays": 7,
  "notes": "报价说明",
  "moldDesign": {
    "type": "注塑模具",
    "cavities": 1,
    "material": "钢材P20",
    "lifeExpectancy": 50000,
    "coolingSystem": "冷却水道",
    "ejectionMethod": "顶针脱模",
    "partingSurface": "平面分型",
    "gateType": "侧浇口",
    "runnerSystem": "冷流道",
    "estimatedCost": 15000
  }
}

只返回JSON数据。`;

  const response = await callDoubaoAI({ prompt, maxTokens: 1200 });
  try {
    return JSON.parse(response.content);
  } catch (e) {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('报价数据格式不正确');
  }
}

// 结构分析 - 返回结构化数据
export async function analyzeStructure(geometryData: any): Promise<any> {
  const prompt = `分析以下CAD模型的结构特征：

几何数据：${JSON.stringify(geometryData)}

请以JSON格式返回：
{
  "wallThickness": {
    "min": 2.5,
    "max": 12.0,
    "average": 5.2,
    "uniform": true
  },
  "thicknessIndex": 0.78,
  "weight": 130,
  "projectedArea": 4500,
  "freeEdges": 0,
  "freeEdgesRepaired": true,
  "solidConfidence": 95,
  "units": "mm",
  "category": "传动部件",
  "categoryReason": "具有传动特征和安装孔位",
  "hasThread": false,
  "threadReason": "未检测到螺纹特征",
  "multiBody": {
    "count": 1,
    "bodies": [{"id": "1", "name": "传动板", "type": "solid"}]
  },
  "processRoute": "注塑成型",
  "dimensions": {
    "length": 150,
    "width": 100,
    "height": 50
  },
  "boundingBox": {
    "volume": 750000
  },
  "estimatedVolume": 650000,
  "faces": 45,
  "surfaceTypes": {
    "planar": 30,
    "cylindrical": 10,
    "conical": 2,
    "spherical": 0,
    "torus": 0,
    "freeform": 3
  }
}

只返回JSON数据。`;

  const response = await callDoubaoAI({ prompt, maxTokens: 1200 });
  try {
    return JSON.parse(response.content);
  } catch (e) {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('结构数据格式不正确');
  }
}

// 模具设计分析 - 返回结构化数据
export async function analyzeMoldDesign(geometryData: any, material: string): Promise<any> {
  const prompt = `基于以下模型设计注塑模具方案：

模型数据：${JSON.stringify(geometryData)}
材料：${material}

请以JSON格式返回：
{
  "moldType": "注塑模具",
  "cavities": 1,
  "moldMaterial": "钢材P20",
  "lifeExpectancy": 50000,
  "coolingSystem": "冷却水道",
  "ejectionMethod": "顶针脱模",
  "partingSurface": "平面分型",
  "gateType": "侧浇口",
  "runnerSystem": "冷流道",
  "estimatedCost": 15000,
  "designFeatures": [
    "一模一腔设计",
    "侧面进胶",
    "顶针脱模系统",
    "冷却水道布局"
  ],
  "manufacturingConsiderations": [
    "建议增加拔模角度1-2度",
    "注意壁厚均匀性",
    "考虑收缩率补偿"
  ],
  "estimatedLeadTime": 20,
  "maintenanceCycle": "每5000模次维护一次"
}

只返回JSON数据。`;

  const response = await callDoubaoAI({ prompt, maxTokens: 1000 });
  try {
    return JSON.parse(response.content);
  } catch (e) {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('模具设计数据格式不正确');
  }
}

// 综合报价分析 - 一次调用返回所有流程数据（参考抖音视频架构）
export interface ComprehensiveAnalysisResult {
  structure: {
    wallThickness: { min: number; max: number; average: number; uniform: boolean };
    thicknessIndex: number;
    weight: number;
    projectedArea: number;
    freeEdges: number;
    freeEdgesRepaired: boolean;
    solidConfidence: number;
    units: string;
    category: string;
    categoryReason: string;
    hasThread: boolean;
    threadReason: string;
    multiBody: { count: number; bodies: Array<{ id: string; name: string; type: string }> };
    processRoute: string;
    dimensions: { length: number; width: number; height: number };
    boundingBox: { volume: number };
    estimatedVolume: number;
    faces: number;
    surfaceTypes: { planar: number; cylindrical: number; conical: number; spherical: number; torus: number; freeform: number };
  };
  qualityReview: {
    fileFormat: string;
    fileSource: string;
    units: string;
    closedEntities: boolean;
    topologyStatus: string;
    autoRepaired: boolean;
    geometricConfidence: number;
    outerDimensions: { length: number; width: number; height: number };
    boundingBoxVolume: number;
    estimatedProductVolume: number;
    faceCount: number;
  };
  dfm: {
    score: number;
    issues: Array<{ id: string; type: string; category: string; description: string; severity: number; suggestion: string }>;
    wallThickness: { min: number; max: number; average: number; uniform: boolean };
    draftAngle: { recommended: number; current: number; needsImprovement: boolean };
    undercuts: boolean;
    ribDesign: string;
    sharpCorners: number;
    dfmGrade: string;
  };
  mold: {
    moldType: string;
    cavities: number;
    moldMaterial: string;
    lifeExpectancy: number;
    coolingSystem: string;
    ejectionMethod: string;
    partingSurface: string;
    gateType: string;
    runnerSystem: string;
    estimatedCost: number;
    designFeatures: string[];
    manufacturingConsiderations: string[];
    estimatedLeadTime: number;
    maintenanceCycle: string;
  };
  quote: {
    weight: number;
    costs: { material: number; labor: number; processing: number; mold: number; transport: number; profit: number };
    totalPrice: number;
    unitPrice: number;
    leadTime: number;
    validityDays: number;
    notes: string;
  };
  flowAnalysis: {
    fillingTime: number;
    packingPressure: number;
    coolingTime: number;
    warpage: number;
    gateLocation: string;
    potentialIssues: string[];
  };
  engineeringReview: {
    structuralConstraints: string[];
    structuralProcessing: string[];
    assemblyMethod: string;
    structuralChecks: string[];
  };
}

export async function analyzeComprehensive(
  geometryData: any,
  material: string,
  quantity: number
): Promise<ComprehensiveAnalysisResult> {
  const prompt = `你是一个专业的智能制造报价AI助手。请基于以下CAD模型信息，进行完整的报价分析。

模型几何数据：
${JSON.stringify(geometryData)}

材料：${material}
数量：${quantity}件

请按照以下结构返回JSON数据，包含完整的报价流程信息：

{
  "structure": {
    "wallThickness": { "min": 2.5, "max": 12.0, "average": 5.2, "uniform": true },
    "thicknessIndex": 0.78,
    "weight": 130,
    "projectedArea": 4500,
    "freeEdges": 0,
    "freeEdgesRepaired": true,
    "solidConfidence": 95,
    "units": "mm",
    "category": "传动部件",
    "categoryReason": "具有传动特征和安装孔位",
    "hasThread": false,
    "threadReason": "未检测到螺纹特征",
    "multiBody": { "count": 1, "bodies": [{"id": "1", "name": "传动板", "type": "solid"}] },
    "processRoute": "注塑成型",
    "dimensions": { "length": 150, "width": 100, "height": 50 },
    "boundingBox": { "volume": 750000 },
    "estimatedVolume": 650000,
    "faces": 45,
    "surfaceTypes": { "planar": 30, "cylindrical": 10, "conical": 2, "spherical": 0, "torus": 0, "freeform": 3 }
  },
  "qualityReview": {
    "fileFormat": "STEP AP214",
    "fileSource": "SolidWorks",
    "units": "mm",
    "closedEntities": true,
    "topologyStatus": "完整",
    "autoRepaired": false,
    "geometricConfidence": 98,
    "outerDimensions": { "length": 150, "width": 100, "height": 50 },
    "boundingBoxVolume": 750000,
    "estimatedProductVolume": 650000,
    "faceCount": 45
  },
  "dfm": {
    "score": 85,
    "issues": [
      {"id": "1", "type": "warning", "category": "壁厚", "description": "最小壁厚偏薄", "severity": 6, "suggestion": "建议增加壁厚至3mm"},
      {"id": "2", "type": "info", "category": "拔模角度", "description": "部分面缺少拔模角度", "severity": 4, "suggestion": "添加1-2度拔模"}
    ],
    "wallThickness": { "min": 2.5, "max": 12.0, "average": 5.2, "uniform": true },
    "draftAngle": { "recommended": 1.5, "current": 0, "needsImprovement": true },
    "undercuts": false,
    "ribDesign": "良好",
    "sharpCorners": 3,
    "dfmGrade": "B"
  },
  "mold": {
    "moldType": "注塑模具",
    "cavities": 1,
    "moldMaterial": "钢材P20",
    "lifeExpectancy": 50000,
    "coolingSystem": "冷却水道",
    "ejectionMethod": "顶针脱模",
    "partingSurface": "平面分型",
    "gateType": "侧浇口",
    "runnerSystem": "冷流道",
    "estimatedCost": 15000,
    "designFeatures": ["一模一腔设计", "侧面进胶", "顶针脱模系统", "冷却水道布局"],
    "manufacturingConsiderations": ["建议增加拔模角度1-2度", "注意壁厚均匀性", "考虑收缩率补偿"],
    "estimatedLeadTime": 20,
    "maintenanceCycle": "每5000模次维护一次"
  },
  "quote": {
    "weight": 130,
    "costs": { "material": 2.6, "labor": 500, "processing": 1000, "mold": 15000, "transport": 100, "profit": 262.5 },
    "totalPrice": 17862.6,
    "unitPrice": 17.86,
    "leadTime": 15,
    "validityDays": 7,
    "notes": "报价基于当前材料价格，批量生产可议价"
  },
  "flowAnalysis": {
    "fillingTime": 2.5,
    "packingPressure": 80,
    "coolingTime": 15,
    "warpage": 0.5,
    "gateLocation": "侧面",
    "potentialIssues": ["填充平衡需优化", "注意保压压力控制"]
  },
  "engineeringReview": {
    "structuralConstraints": ["需满足强度要求", "装配精度控制"],
    "structuralProcessing": ["表面处理", "尺寸公差"],
    "assemblyMethod": "螺栓连接",
    "structuralChecks": ["强度校核", "疲劳分析"]
  }
}

请仔细分析模型数据，给出合理的数值。只返回JSON数据，不要其他文字。`;

  const response = await callDoubaoAI({ prompt, maxTokens: 3000 });
  try {
    return JSON.parse(response.content);
  } catch (e) {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('综合分析数据格式不正确');
  }
}