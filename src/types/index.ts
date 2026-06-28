// 工作流步骤枚举
export enum WorkflowStep {
  UPLOAD = 1,
  VIEWER_3D = 2,
  STRUCTURE = 3,
  DFM = 4,
  MOLD = 5,
  FLOW = 6,
  QUOTE = 7,
  DISTILLATION = 8,
}

// 工作流步骤信息
export const WORKFLOW_STEPS = [
  { step: WorkflowStep.UPLOAD, label: '上传', icon: 'Upload' },
  { step: WorkflowStep.VIEWER_3D, label: '3D', icon: 'Box' },
  { step: WorkflowStep.STRUCTURE, label: '结构', icon: 'Layers' },
  { step: WorkflowStep.DFM, label: 'DFM', icon: 'Settings' },
  { step: WorkflowStep.MOLD, label: '模具', icon: 'Grid' },
  { step: WorkflowStep.FLOW, label: '流动', icon: 'Activity' },
  { step: WorkflowStep.QUOTE, label: '报价', icon: 'DollarSign' },
  { step: WorkflowStep.DISTILLATION, label: '共创蒸馏', icon: 'Sparkles' },
];

// STEP文件信息
export interface STEPFileInfo {
  name: string;
  size: number;
  lastModified: Date;
  file: File;
}

// 模型几何信息
export interface ModelGeometry {
  volume: number;
  surfaceArea: number;
  boundingBox: {
    min?: { x: number; y: number; z: number };
    max?: { x: number; y: number; z: number };
    length?: number;
    width?: number;
    height?: number;
  };
  faces?: number;
  vertices?: number;
  edges?: number;
  solids?: number;
  bodyCount?: number;
  faceCount?: number;
  edgeCount?: number;
  vertexCount?: number;
  bodies?: ModelBody[];
}

// 模型实体
export interface ModelBody {
  id: string;
  name: string;
  volume: number;
  surfaceArea: number;
  weight: number; // 重量（根据材料计算）
  material: string;
  faceCount: number;
  edgeCount: number;
  boundingBox: BoundingBox;
}

// 包围盒
export interface BoundingBox {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
}

// 模型质量审查
export interface ModelQualityReview {
  fileFormat: string;
  fileSource: string;
  units: string;
  closedEntities?: boolean;
  isClosedSolid?: boolean;
  topologyStatus: string;
  autoRepaired?: boolean;
  autoRepair?: boolean;
  geometricConfidence: number;
  outerDimensions?: {
    length: number;
    width: number;
    height: number;
  };
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  boundingBoxVolume: number;
  estimatedProductVolume: number;
  faceCount: number;
  surfaceTypes?: {
    planar?: number;
    cylindrical?: number;
    conical?: number;
    spherical?: number;
    torus?: number;
    freeform?: number;
    plane?: number;
    cylinder?: number;
    cone?: number;
    sphere?: number;
    freeForm?: number;
  };
}

// 结构分析
export interface StructureAnalysis {
  wallThickness: {
    min: number;
    max: number;
    average: number;
    uniform: boolean;
  };
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
  multiBody?: {
    count: number;
    bodies: {
      id: string;
      name: string;
      type: string;
    }[];
  };
  processRoute?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  boundingBox?: {
    volume: number;
  };
  estimatedVolume?: number;
  faces?: number;
  surfaceTypes?: {
    planar?: number;
    cylindrical?: number;
    conical?: number;
    spherical?: number;
    torus?: number;
    freeform?: number;
  };
}

// 多实体信息
export interface MultiBodyInfo {
  count: number;
  bodies: {
    id: string;
    name: string;
    type: string;
  }[];
}

// 工艺路线
export interface ProcessRoute {
  id: string;
  name: string;
  steps: ProcessStep[];
  estimatedTime: number; // 分钟
  estimatedCost: number; // 元
}

export interface ProcessStep {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
}

// DFM报告
export interface DFMReport {
  id: string;
  timestamp: Date;
  issues: DFMIssue[];
  score: number; // 0-100
  recommendations: string[];
}

export interface DFMIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: string;
  description: string;
  location?: string;
  severity: number; // 1-10
  suggestion: string;
}

// 模具设计方案
export interface MoldDesign {
  id: string;
  name: string;
  type: 'injection' | 'die_casting' | 'stamping';
  cavities: number;
  material: string;
  estimatedLife: number; // 模次
  coolingSystem: string;
  ejectionMethod: string;
  estimatedCost: number; // 元
}

// 报价信息
export interface Quotation {
  id?: string;
  timestamp?: Date;
  material?: string;
  weight: number;
  quantity?: number;
  process?: string;
  
  costs: {
    material: number;
    labor: number;
    processing: number;
    mold: number;
    transport: number;
    profit: number;
  };
  
  totalPrice: number;
  unitPrice: number;
  leadTime: number;
  validityDays?: number;
  validity?: Date;
  notes: string;
  
  dfmScore?: number;
  
  moldDesign?: {
    type?: string;
    moldType?: string;
    cavities: number;
    material: string;
    moldMaterial?: string;
    lifeExpectancy: number;
    estimatedLife?: number;
    coolingSystem: string;
    ejectionMethod: string;
    partingSurface?: string;
    gateType?: string;
    runnerSystem?: string;
    estimatedCost: number;
    designFeatures?: string[];
    manufacturingConsiderations?: string[];
    estimatedLeadTime?: number;
    maintenanceCycle?: string;
  };
}

// AI分析结果
export interface AIAnalysis {
  id?: string;
  timestamp?: Date;
  model?: string;
  dfm?: {
    score: number;
    issues: Array<{ id: string; type: string; category: string; description: string; severity: number; suggestion: string }>;
    wallThickness: { min: number; max: number; average: number; uniform: boolean };
    draftAngle: { recommended: number; current: number; needsImprovement: boolean };
    undercuts: boolean;
    ribDesign: string;
    sharpCorners: number;
    dfmGrade: string;
  };
  mold?: {
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
  flow?: {
    fillingTime: number;
    packingPressure: number;
    coolingTime: number;
    warpage: number;
    gateLocation: string;
    potentialIssues: string[];
  };
  engineeringReview?: {
    structuralConstraints: string[];
    structuralProcessing: string[];
    assemblyMethod: string;
    structuralChecks: string[];
  };
  input?: {
    geometry?: ModelGeometry;
    quality?: ModelQualityReview;
    structure?: StructureAnalysis;
  };
  output?: {
    manufacturingProcess?: string[];
    dfmRecommendations?: string[];
    costEstimation?: {
      material: number;
      labor: number;
      processing: number;
      mold: number;
      total: number;
    };
    qualityRisks?: string[];
    optimizationSuggestions?: string[];
  };
  confidence?: number;
}