'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import Viewer from '@/components/viewer/Viewer';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export default function FlowWorkflow() {
  const { fileInfo } = useStore();

  if (!fileInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">请先上传文件</h3>
          <p className="text-gray-400">上传STEP文件后即可进行流动分析</p>
        </div>
      </div>
    );
  }

  const flowAnalysis = {
    fillTime: 2.5,
    pressure: 85,
    temperature: 220,
    coolingTime: 15,
    shearRate: 1200,
    issues: [
      {
        id: '1',
        type: 'info',
        description: '填充时间适中',
        severity: 3,
      },
      {
        id: '2',
        type: 'warning',
        description: '部分区域温度较高',
        severity: 5,
      },
    ],
  };

  return (
    <div className="flex h-full">
      <div className="w-80 bg-gray-900/95 border-r border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            流动分析
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              流动参数
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">填充时间</span>
                <span className="text-white font-medium">{flowAnalysis.fillTime} 秒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">注射压力</span>
                <span className="text-white font-medium">{flowAnalysis.pressure} MPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">熔体温度</span>
                <span className="text-white font-medium">{flowAnalysis.temperature} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">冷却时间</span>
                <span className="text-white font-medium">{flowAnalysis.coolingTime} 秒</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">剪切速率</span>
                <span className="text-white font-medium">{flowAnalysis.shearRate} s⁻¹</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              分析结果
            </h4>
            <div className="space-y-2">
              {flowAnalysis.issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-2 rounded ${
                    issue.type === 'warning' ? 'bg-orange-500/10' : 'bg-blue-500/10'
                  }`}
                >
                  <span className={`text-sm ${
                    issue.type === 'warning' ? 'text-orange-400' : 'text-blue-400'
                  }`}>
                    {issue.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <Viewer />
      </div>
    </div>
  );
}