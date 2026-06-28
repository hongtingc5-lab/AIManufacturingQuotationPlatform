'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import Viewer from '@/components/viewer/Viewer';
import { Sparkles, Send, RefreshCw, Copy } from 'lucide-react';
import { analyzeModelGeometry } from '@/lib/doubao';

export default function DistillationWorkflow() {
  const { fileInfo, modelGeometry, aiAnalysis, setAIAnalysis, setIsLoading, setError } = useStore();
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalysis = async () => {
    if (!modelGeometry) return;

    setIsAnalyzing(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeModelGeometry(modelGeometry);
      setAiResponse(response);
      
      setAIAnalysis({
        id: 'ai-001',
        timestamp: new Date(),
        model: 'doubao-lite-4k',
        input: {
          geometry: modelGeometry,
          quality: useStore.getState().modelQuality!,
          structure: useStore.getState().structureAnalysis!,
        },
        output: {
          manufacturingProcess: ['注塑成型'],
          dfmRecommendations: ['增加最小壁厚', '设置拔模角度'],
          costEstimation: {
            material: 2.6,
            labor: 500,
            processing: 1000,
            mold: 15000,
            total: 16502.6,
          },
          qualityRisks: ['壁厚不均风险'],
          optimizationSuggestions: ['优化加强筋设计'],
        },
        confidence: 85,
      });
    } catch (error) {
      setError('AI分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  if (!fileInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">请先上传文件</h3>
          <p className="text-gray-400">上传STEP文件后即可进行AI共创蒸馏</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-80 bg-gray-900/95 border-r border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            AI共创蒸馏
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-4 py-3 rounded font-medium transition-colors flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  正在分析...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  开始AI分析
                </>
              )}
            </button>
          </div>

          {aiResponse && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">AI分析结果</h4>
              <div className="bg-gray-900 rounded p-3 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{aiResponse}</pre>
              </div>
              <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center">
                <Copy className="w-3 h-3 mr-2" />
                复制结果
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        <Viewer />
      </div>
    </div>
  );
}