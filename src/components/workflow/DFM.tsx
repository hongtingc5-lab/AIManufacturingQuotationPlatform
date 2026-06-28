'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Viewer from '@/components/viewer/Viewer';
import { Settings, AlertCircle, CheckCircle, TrendingUp, Loader, RefreshCw } from 'lucide-react';
import { analyzeDFM, getTokenUsage } from '@/lib/doubao';

export default function DFMWorkflow() {
  const { fileInfo, modelGeometry, setIsLoading, setError } = useStore();
  const [dfmData, setDfmData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const performDFMAnalysis = async () => {
    if (!modelGeometry) return;

    setIsAnalyzing(true);
    setIsLoading(true);
    setAnalysisError(null);

    try {
      const aiResult = await analyzeDFM(modelGeometry);
      setDfmData(aiResult);
      console.log('DFM分析完成，Token:', getTokenUsage());
    } catch (error: any) {
      setAnalysisError(error.message);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fileInfo && modelGeometry) performDFMAnalysis();
  }, [fileInfo, modelGeometry]);

  if (!fileInfo) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">请先上传文件</h3>
        <p className="text-gray-400">上传STEP文件后即可进行DFM分析</p>
      </div>
    </div>
  );

  if (isAnalyzing) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-xl font-semibold text-white mb-2">AI正在分析模型</h3>
        <p className="text-gray-400">进行可制造性评估...</p>
      </div>
    </div>
  );

  if (analysisError) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">分析失败</h3>
        <p className="text-red-400 mb-4">{analysisError}</p>
        <button onClick={performDFMAnalysis} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" />重新分析
        </button>
      </div>
    </div>
  );

  if (!dfmData) return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <button onClick={performDFMAnalysis} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
          开始DFM分析
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* 左侧 - DFM面板 */}
      <div className="w-80 bg-gray-900/95 border-r border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />AI DFM分析
          </h3>
          <div className="text-xs text-purple-400 mt-1">基于豆包AI评估</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* DFM评分 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">可制造性评分</h4>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-blue-500 opacity-20"></div>
                <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{dfmData.score}</div>
                    <div className="text-xs text-gray-400">分</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 壁厚分析 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">壁厚分析</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">最小壁厚</span>
                <span className="text-orange-400 font-medium">{dfmData.wallThickness?.min} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">最大壁厚</span>
                <span className="text-blue-400 font-medium">{dfmData.wallThickness?.max} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">平均壁厚</span>
                <span className="text-white font-medium">{dfmData.wallThickness?.average} mm</span>
              </div>
            </div>
          </div>

          {/* 问题列表 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />AI检出问题
            </h4>
            <div className="space-y-2">
              {dfmData.issues?.map((issue: any) => (
                <div key={issue.id} className={`p-2 rounded border ${
                  issue.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' :
                  issue.type === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      issue.type === 'warning' ? 'text-orange-400' :
                      issue.type === 'error' ? 'text-red-400' : 'text-blue-400'
                    }`}>{issue.category}</span>
                    <span className="text-xs text-gray-400">{issue.severity}</span>
                  </div>
                  <div className="text-xs text-gray-300">{issue.description}</div>
                  <div className="text-xs text-gray-400 italic">{issue.suggestion}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 重新分析按钮 */}
          <button onClick={performDFMAnalysis} disabled={isAnalyzing} 
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-4 py-2 rounded flex items-center justify-center">
            {isAnalyzing ? <><Loader className="w-4 h-4 mr-2 animate-spin" />分析中...</> : 
            <><RefreshCw className="w-4 h-4 mr-2" />重新分析</>}
          </button>
        </div>
      </div>

      {/* 中央 - 3D Viewer */}
      <div className="flex-1 relative"><Viewer /></div>

      {/* 右侧 - DFM详情 */}
      <div className="w-80 bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />DFM优化建议
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 拔模角度 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">拔模角度</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">推荐角度</span>
                <span className="text-white font-medium">{dfmData.draftAngle?.recommended}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">当前状态</span>
                <span className={dfmData.draftAngle?.needsImprovement ? 'text-orange-400' : 'text-green-400'}>
                  {dfmData.draftAngle?.needsImprovement ? '需要改进' : '符合要求'}
                </span>
              </div>
            </div>
          </div>

          {/* 其他评估 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">其他评估</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">倒扣特征</span>
                <div className="flex items-center">
                  {dfmData.undercuts ? <AlertCircle className="w-4 h-4 text-red-400 mr-1" /> : 
                  <CheckCircle className="w-4 h-4 text-green-400 mr-1" />}
                  <span className={dfmData.undercuts ? 'text-red-400' : 'text-green-400'}>
                    {dfmData.undercuts ? '存在' : '无'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">加强筋设计</span>
                <span className="text-white font-medium">{dfmData.ribDesign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">锐角数量</span>
                <span className="text-white font-medium">{dfmData.sharpCorners}</span>
              </div>
            </div>
          </div>

          {/* DFM等级 */}
          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-600/30">
            <h4 className="text-sm font-medium text-gray-300 mb-3">DFM等级</h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{dfmData.dfmGrade}</div>
              <div className="text-xs text-gray-400 mt-2">可制造性评级</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}