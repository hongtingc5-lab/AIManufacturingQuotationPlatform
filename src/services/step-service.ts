import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_STEP_SERVER_URL || 'http://localhost:3003';

const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 120000, // 2分钟超时
});

export interface STEPAnalysisResult {
  success: boolean;
  processingTime?: number;
  model: {
    name: string;
    format: string;
    pointCount: number;
  };
  dimensions: {
    length: string;
    width: string;
    height: string;
    unit: string;
  };
  boundingBox: {
    min: { x: string; y: string; z: string };
    max: { x: string; y: string; z: string };
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
    total: number;
  };
  geometryFeatures: {
    hasCylindricalHoles: boolean;
    hasBsplineSurfaces: boolean;
    hasRevolutionFeatures: boolean;
    hasPlanarFaces: boolean;
  };
  volume: string;
  surfaceArea: string;
  weight: string;
  error?: string;
  retry?: boolean;
}

export interface STEPMesh {
  name: string;
  position: number[];
  normal: number[] | null;
  index: number[] | null;
  color: number[];
}

export interface STEPConvertResult {
  success: boolean;
  processingTime?: number;
  meshCount?: number;
  meshes?: STEPMesh[];
  error?: string;
}

export class STEPService {
  /**
   * 检查服务端状态
   */
  static async getStatus(): Promise<{ status: string; opencascade: string }> {
    try {
      const response = await apiClient.get('/api/status');
      return response.data;
    } catch (error) {
      console.error('[STEP Service] 获取状态失败:', error);
      throw error;
    }
  }

  /**
   * 分析STEP文件几何信息
   */
  static async analyzeSTEP(file: File): Promise<STEPAnalysisResult> {
    try {
      console.log('[STEP Service] 开始分析文件:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<STEPAnalysisResult>(
        '/api/analyze-step',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 1分钟超时
        }
      );

      console.log('[STEP Service] 分析完成:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[STEP Service] 分析失败:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        error: error.message || 'STEP文件分析失败',
        model: { name: '', format: '', pointCount: 0 },
        dimensions: { length: '0', width: '0', height: '0', unit: 'mm' },
        boundingBox: {
          min: { x: '0', y: '0', z: '0' },
          max: { x: '0', y: '0', z: '0' }
        },
        topology: { faces: 0, edges: 0, vertices: 0, solids: 0, shells: 0 },
        surfaceTypes: { planar: 0, cylindrical: 0, conical: 0, spherical: 0, toroidal: 0, bspline: 0, total: 0 },
        geometryFeatures: { hasCylindricalHoles: false, hasBsplineSurfaces: false, hasRevolutionFeatures: false, hasPlanarFaces: false },
        volume: '0',
        surfaceArea: '0',
        weight: '0',
      };
    }
  }

  /**
   * 转换STEP文件为网格数据
   */
  static async convertToGLB(file: File): Promise<STEPConvertResult> {
    try {
      console.log('[STEP Service] 开始转换文件:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<STEPConvertResult>(
        '/api/convert-step',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 180000, // 3分钟超时
        }
      );

      console.log('[STEP Service] 转换完成:', {
        meshCount: response.data.meshCount,
        processingTime: response.data.processingTime
      });

      return response.data;
    } catch (error: any) {
      console.error('[STEP Service] 转换失败:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'STEP转换失败',
      };
    }
  }

  /**
   * 获取服务器健康状态
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/api/health', { timeout: 5000 });
      return response.data?.status === 'ok';
    } catch {
      return false;
    }
  }
}

export default STEPService;