import { create } from 'zustand';
import {
  WorkflowStep,
  STEPFileInfo,
  ModelGeometry,
  ModelQualityReview,
  StructureAnalysis,
  Quotation,
  AIAnalysis,
} from '@/types';

interface AppState {
  // 当前工作流步骤
  currentStep: WorkflowStep;
  setCurrentStep: (step: WorkflowStep) => void;

  // 文件信息
  fileInfo: STEPFileInfo | null;
  setFileInfo: (info: STEPFileInfo | null) => void;

  // 模型几何信息
  modelGeometry: ModelGeometry | null;
  setModelGeometry: (geometry: ModelGeometry | null) => void;

  // 模型质量审查
  modelQuality: ModelQualityReview | null;
  setModelQuality: (quality: ModelQualityReview | null) => void;

  // 结构分析
  structureAnalysis: StructureAnalysis | null;
  setStructureAnalysis: (analysis: StructureAnalysis | null) => void;

  // 报价信息
  quotation: Quotation | null;
  setQuotation: (quotation: Quotation | null) => void;

  // AI分析
  aiAnalysis: AIAnalysis | null;
  setAIAnalysis: (analysis: AIAnalysis | null) => void;

  // Viewer状态
  viewerReady: boolean;
  setViewerReady: (ready: boolean) => void;

  // 是否正在加载
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 错误信息
  error: string | null;
  setError: (error: string | null) => void;

  // 重置所有状态
  reset: () => void;
}

const initialState = {
  currentStep: WorkflowStep.UPLOAD,
  fileInfo: null,
  modelGeometry: null,
  modelQuality: null,
  structureAnalysis: null,
  quotation: null,
  aiAnalysis: null,
  viewerReady: false,
  isLoading: false,
  error: null,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),
  setFileInfo: (info) => set({ fileInfo: info }),
  setModelGeometry: (geometry) => set({ modelGeometry: geometry }),
  setModelQuality: (quality) => set({ modelQuality: quality }),
  setStructureAnalysis: (analysis) => set({ structureAnalysis: analysis }),
  setQuotation: (quotation) => set({ quotation: quotation }),
  setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
  setViewerReady: (ready) => set({ viewerReady: ready }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error: error }),

  reset: () => set(initialState),
}));