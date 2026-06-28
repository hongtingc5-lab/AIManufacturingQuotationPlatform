'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Viewer from '@/components/viewer/Viewer';
import { Layers, Activity, AlertTriangle, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { analyzeStructure, getTokenUsage } from '@/lib/doubao';

export default function StructureWorkflow() {
  const { modelGeometry, fileInfo, setIsLoading, setError } = useStore();
  const [structureData, setStructureData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // 调用AI进行真实结构分析
  const performStructureAnalysis = async () => {
    if (!modelGeometry) {
      setAnalysisError('请先上传STEP文件');
      return;
    }

    setIsAnalyzing(true);
    setIsLoading(true);
    setAnalysisError(null);

    try {
      // 调用豆包AI进行结构分析
      const aiResult = await analyzeStructure(modelGeometry);
      setStructureData(aiResult);

      console.log('结构分析完成，Token使用:', getTokenUsage());
    } catch (error: any) {
      console.error('结构分析失败:', error);
      setAnalysisError(error.message);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  // 自动触发分析
  useEffect(() => {
    if (fileInfo && modelGeometry) {
      performStructureAnalysis();
    }
  }, [fileInfo, modelGeometry]);

  if (!fileInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">请先上传文件</h3>
          <p className="text-gray-400">上传STEP文件后即可进行结构分析</p>
        </div>
      </div>
    );
  }

  // 分析中状态
  if (isAnalyzing) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-white mb-2">AI正在分析模型结构</h3>
          <p className="text-gray-400">提取几何特征和拓扑信息...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (analysisError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">分析失败</h3>
          <p className="text-red-400 mb-4">{analysisError}</p>
          <button
            onClick={performStructureAnalysis}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新分析
          </button>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!structureData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">等待分析</h3>
          <button
            onClick={performStructureAnalysis}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            开始结构分析
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* 左侧 - 结构分析面板 */}
      <div className="w-80 bg-gray-900/95 border-r border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Layers className="w-5 h-5 mr-2 text-blue-400" />
            结构分析
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 壁厚分析 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              壁厚分析
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">最小壁厚</span>
                <span className="text-orange-400 font-medium">{structureData.wallThickness.min} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">最大壁厚</span>
                <span className="text-blue-400 font-medium">{structureData.wallThickness.max} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">平均壁厚</span>
                <span className="text-white font-medium">{structureData.wallThickness.average} mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">均匀性</span>
                <div className="flex items-center">
                  {structureData.wallThickness.uniform ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-400 mr-1" />
                  )}
                  <span className={structureData.wallThickness.uniform ? 'text-green-400' : 'text-orange-400'}>
                    {structureData.wallThickness.uniform ? '良好' : '不均匀'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 基本参数 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">基本参数</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">厚实度指数</span>
                <span className="text-white font-medium">{structureData.thicknessIndex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">重量估算</span>
                <span className="text-white font-medium">{structureData.weight} g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">投影面积</span>
                <span className="text-white font-medium">{formatNumber(structureData.projectedArea / 100, 2)} cm²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">单位</span>
                <span className="text-white font-medium">{structureData.units}</span>
              </div>
            </div>
          </div>

          {/* 拓扑状态 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">拓扑状态</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">自由边数量</span>
                <div className="flex items-center">
                  {structureData.freeEdges === 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-400 mr-1" />
                  )}
                  <span className="text-white font-medium">{structureData.freeEdges}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">自动修复</span>
                <span className="text-green-400 font-medium">已完成</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">实体可信度</span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">{structureData.solidConfidence}%</span>
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${structureData.solidConfidence}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 分类判断 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">分类判断</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">类别候选</span>
                <span className="text-blue-400 font-medium">{structureData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">类别依据</span>
                <span className="text-gray-300 text-sm">{structureData.categoryReason}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">螺牙判断</span>
                <div className="flex items-center">
                  {structureData.hasThread ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                  <span className="text-gray-300 text-sm">{structureData.threadReason}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 多实体信息 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">多实体信息</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">实体数量</span>
                <span className="text-white font-medium">{structureData.multiBody.count}</span>
              </div>
              {structureData.multiBody.bodies.map((body: {id: string; name: string; type: string}) => (
                <div key={body.id} className="bg-gray-900/50 rounded p-2">
                  <div className="text-sm text-white">{body.name}</div>
                  <div className="text-xs text-gray-400">{body.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 工艺路线 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">工艺路线建议</h4>
            <div className="bg-blue-600/20 rounded p-2 border border-blue-600/30">
              <span className="text-blue-400 font-medium">{structureData.processRoute}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 中央 - 3D Viewer */}
      <div className="flex-1 relative">
        <Viewer />
      </div>
    </div>
  );
}