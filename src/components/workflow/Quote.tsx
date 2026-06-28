'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Viewer from '@/components/viewer/Viewer';
import { DollarSign, Calculator, FileText, Download, RefreshCw, Loader } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { analyzeQuotation, getTokenUsage } from '@/lib/doubao';

export default function QuoteWorkflow() {
  const { fileInfo, modelGeometry, quotation, setQuotation, setIsLoading, setError } = useStore();
  const [material, setMaterial] = useState('ABS');
  const [quantity, setQuantity] = useState(1000);
  const [process, setProcess] = useState('注塑');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // 调用AI进行真实报价分析
  const performQuotationAnalysis = async () => {
    if (!modelGeometry) {
      setAnalysisError('请先上传STEP文件');
      return;
    }

    setIsAnalyzing(true);
    setIsLoading(true);
    setAnalysisError(null);

    try {
      // 调用豆包AI进行报价分析
      const aiResult = await analyzeQuotation(modelGeometry, material, quantity, process);

      // 将AI返回的数据存入store
      setQuotation({
        id: `quote-${Date.now()}`,
        timestamp: new Date(),
        material,
        weight: aiResult.weight,
        quantity,
        process,
        costs: aiResult.costs,
        totalPrice: aiResult.totalPrice,
        unitPrice: aiResult.unitPrice,
        leadTime: aiResult.leadTime,
        validity: new Date(Date.now() + aiResult.validityDays * 24 * 60 * 60 * 1000),
        notes: aiResult.notes,
        moldDesign: aiResult.moldDesign, // 保存模具设计信息
      });

      console.log('报价分析完成，Token使用:', getTokenUsage());
    } catch (error: any) {
      console.error('报价分析失败:', error);
      setAnalysisError(error.message);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  // 自动触发分析（当文件和参数变化时）
  useEffect(() => {
    if (fileInfo && modelGeometry && material && quantity && process) {
      performQuotationAnalysis();
    }
  }, [fileInfo, modelGeometry, material, quantity, process]);

  if (!fileInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">请先上传文件</h3>
          <p className="text-gray-400">上传STEP文件后即可进行报价分析</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* 左侧 - 报价参数设置 */}
      <div className="w-80 bg-gray-900/95 border-r border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-400" />
            报价参数
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 材料选择 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">材料类型</label>
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
          </div>

          {/* 数量设置 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">生产数量</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              min="1"
              max="1000000"
            />
          </div>

          {/* 工艺选择 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-300 mb-2 block">生产工艺</label>
            <select
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="注塑">注塑成型</option>
              <option value="压铸">压铸</option>
              <option value="机加工">机加工</option>
              <option value="冲压">冲压</option>
            </select>
          </div>

          {/* 基本信息 */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">基本信息</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">材料</span>
                <span className="text-white font-medium">{material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">重量</span>
                <span className="text-white font-medium">{quotation?.weight || modelGeometry?.bodies?.[0]?.weight || 130} g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">数量</span>
                <span className="text-white font-medium">{formatNumber(quantity, 0)} 件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">工艺</span>
                <span className="text-white font-medium">{process}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 中央 - 3D Viewer */}
      <div className="flex-1 relative">
        <Viewer />
      </div>

      {/* 右侧 - 报价结果 */}
      <div className="w-80 bg-gray-900/95 border-l border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            报价结果
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {quotation && (
            <>
              {/* 总价 */}
              <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-600/30">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {formatCurrency(quotation.totalPrice)}
                  </div>
                  <div className="text-sm text-gray-300">总价</div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {formatCurrency(quotation.unitPrice)} / 件
                  </div>
                </div>
              </div>

              {/* 成本明细 */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">成本明细</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">材料费</span>
                    <span className="text-white font-medium">{formatCurrency(quotation.costs.material)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">人工费</span>
                    <span className="text-white font-medium">{formatCurrency(quotation.costs.labor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">加工费</span>
                    <span className="text-white font-medium">{formatCurrency(quotation.costs.processing)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">模具费</span>
                    <span className="text-white font-medium">{formatCurrency(quotation.costs.mold)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">运输费</span>
                    <span className="text-white font-medium">{formatCurrency(quotation.costs.transport)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">利润</span>
                    <span className="text-green-400 font-medium">{formatCurrency(quotation.costs.profit)}</span>
                  </div>
                </div>
              </div>

              {/* 其他信息 */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">其他信息</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">交期</span>
                    <span className="text-white font-medium">{quotation.leadTime} 天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">有效期</span>
                    <span className="text-white font-medium text-sm">
                      {quotation.validity?.toLocaleDateString('zh-CN') || `报价后${quotation.validityDays || 7}天内有效`}
                    </span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center">
                  <FileText className="w-4 h-4 mr-2" />
                  查看详情
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  导出PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}