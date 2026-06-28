'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Viewer from '@/components/viewer/Viewer';
import { Grid, Layers, Activity, Loader, RefreshCw } from 'lucide-react';
import { analyzeMoldDesign, getTokenUsage } from '@/lib/doubao';

export default function MoldWorkflow() {
  const { fileInfo, modelGeometry, setIsLoading, setError } = useStore();
  const [moldData, setMoldData] = useState<any>(null);
  const [material, setMaterial] = useState('ABS');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // 调用AI进行真实模具设计分析
  const performMoldAnalysis = async () => {
    if (!modelGeometry) {
      setAnalysisError('请先上传STEP文件');
      return;
    }

    setIsAnalyzing(true);
    setIsLoading(true);
    setAnalysisError(null);

    try {
      // 调用豆包AI进行模具设计分析
      const aiResult = await analyzeMoldDesign(modelGeometry, material);
      setMoldData(aiResult);

      console.log('模具设计分析完成，Token使用:', getTokenUsage());
    } catch (error: any) {
      console.error('模具设计分析失败:', error);
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
      performMoldAnalysis();
    }
  }, [fileInfo, modelGeometry, material]);

  if (!fileInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">请先上传文件</h3>
          <p className="text-gray-400">上传STEP文件后即可进行模具设计</p>
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
          <h3 className="text-xl font-semibold text-white mb-2">AI正在设计模具方案</h3>
          <p className="text-gray-400">生成最优模具参数...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (analysisError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Grid className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">分析失败</h3>
          <p className="text-red-400 mb-4">{analysisError}</p>
          <button
            onClick={performMoldAnalysis}
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
  if (!moldData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">等待分析</h3>
          <button
            onClick={performMoldAnalysis}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            开始模具设计分析
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-80 bg-gray-900/95 border-r border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Grid className="w-5 h-5 mr-2 text-blue-400" />
            AI模具设计
          </h3>
          <div className="text-xs text-purple-400 mt-1">基于豆包AI分析</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 材料选择 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">产品材料</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="ABS">ABS</option>
              <option value="PP">PP</option>
              <option value="PE">PE</option>
              <option value="PA">PA</option>
              <option value="PC">PC</option>
              <option value="POM">POM</option>
              <option value="PMMA">PMMA</option>
            </select>
            <div className="mt-2 text-xs text-gray-400">材料会影响模具设计方案</div>
          </div>

          {/* 重新分析按钮 */}
          <button
            onClick={performMoldAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-4 py-2 rounded flex items-center justify-center transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新分析
              </>
            )}
          </button>
        </div>
      </div>

      {/* 中央 - 3D Viewer */}
      <div className="flex-1 relative">
        <Viewer />
      </div>

      {/* 右侧 - AI模具设计方案 */}
      <div className="w-80 bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Layers className="w-5 h-5 mr-2 text-green-400" />
            AI模具设计方案
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 模具类型 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">模具类型</h4>
            <div className="bg-blue-600/20 rounded p-2 border border-blue-600/30">
              <span className="text-blue-400 font-medium">{moldData.moldType}</span>
            </div>
          </div>

          {/* 核心参数 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">核心参数</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">模腔数量</span>
                <span className="text-white font-medium">{moldData.cavities}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">模具材料</span>
                <span className="text-white font-medium">{moldData.moldMaterial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">预计寿命</span>
                <span className="text-white font-medium">{moldData.lifeExpectancy} 模次</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">冷却系统</span>
                <span className="text-white font-medium">{moldData.coolingSystem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">脱模方式</span>
                <span className="text-white font-medium">{moldData.ejectionMethod}</span>
              </div>
            </div>
          </div>

          {/* 浇注系统 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">浇注系统</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">分型面</span>
                <span className="text-white font-medium">{moldData.partingSurface}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">浇口类型</span>
                <span className="text-white font-medium">{moldData.gateType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">流道系统</span>
                <span className="text-white font-medium">{moldData.runnerSystem}</span>
              </div>
            </div>
          </div>

          {/* 模具费用估算 */}
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg p-4 border border-orange-600/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">AI估算模具费用</span>
              <span className="text-xs text-purple-400">动态计算</span>
            </div>
            <span className="text-2xl font-bold text-orange-400">¥{moldData.estimatedCost.toLocaleString()}</span>
            <div className="text-xs text-gray-400 mt-2">基于模型复杂度和材料特性</div>
          </div>

          {/* 设计特征 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">AI设计特征</h4>
            <div className="space-y-2">
              {moldData.designFeatures?.map((feature: string, index: number) => (
                <div key={index} className="flex items-start">
                  <Activity className="w-4 h-4 text-green-400 mr-2 mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 制造注意事项 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">制造注意事项</h4>
            <div className="space-y-2">
              {moldData.manufacturingConsiderations?.map((item: string, index: number) => (
                <div key={index} className="flex items-start">
                  <Grid className="w-4 h-4 text-orange-400 mr-2 mt-0.5" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 生产周期 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">生产周期</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">模具制造周期</span>
                <span className="text-white font-medium">{moldData.estimatedLeadTime} 天</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">维护周期</span>
                <span className="text-white font-medium text-sm">{moldData.maintenanceCycle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}