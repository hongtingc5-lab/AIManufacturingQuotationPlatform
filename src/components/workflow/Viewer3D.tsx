'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import Viewer from '@/components/viewer/Viewer';
import { Box, Info, Settings, Ruler } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function Viewer3DWorkflow() {
  const { modelGeometry, fileInfo } = useStore();
  const [activeTab, setActiveTab] = useState<'geometry' | 'topology' | 'quality'>('geometry');

  if (!fileInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Box className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">请先上传文件</h3>
          <p className="text-gray-400">上传STEP文件后即可查看3D模型</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* 左侧面板 - 模型信息 */}
      <div className="w-80 bg-gray-900/95 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Box className="w-5 h-5 mr-2 text-blue-400" />
            模型信息
          </h3>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('geometry')}
            className={cn(
              'flex-1 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'geometry'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            几何
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={cn(
              'flex-1 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'topology'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            拓扑
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={cn(
              'flex-1 px-4 py-2 text-sm font-medium transition-colors',
              activeTab === 'quality'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            质量
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'geometry' && modelGeometry && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">基本尺寸</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">长度</span>
                    <span className="text-white font-medium">
                      {modelGeometry.boundingBox.length !== undefined 
                        ? `${formatNumber(modelGeometry.boundingBox.length, 2)} mm`
                        : modelGeometry.boundingBox.max && modelGeometry.boundingBox.min
                          ? `${formatNumber(modelGeometry.boundingBox.max.x - modelGeometry.boundingBox.min.x, 2)} mm`
                          : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">宽度</span>
                    <span className="text-white font-medium">
                      {modelGeometry.boundingBox.width !== undefined 
                        ? `${formatNumber(modelGeometry.boundingBox.width, 2)} mm`
                        : modelGeometry.boundingBox.max && modelGeometry.boundingBox.min
                          ? `${formatNumber(modelGeometry.boundingBox.max.y - modelGeometry.boundingBox.min.y, 2)} mm`
                          : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">高度</span>
                    <span className="text-white font-medium">
                      {modelGeometry.boundingBox.height !== undefined 
                        ? `${formatNumber(modelGeometry.boundingBox.height, 2)} mm`
                        : modelGeometry.boundingBox.max && modelGeometry.boundingBox.min
                          ? `${formatNumber(modelGeometry.boundingBox.max.z - modelGeometry.boundingBox.min.z, 2)} mm`
                          : '--'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">几何属性</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">体积</span>
                    <span className="text-white font-medium">
                      {formatNumber(modelGeometry.volume / 1000, 2)} cm³
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">表面积</span>
                    <span className="text-white font-medium">
                      {formatNumber(modelGeometry.surfaceArea / 100, 2)} cm²
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">实体列表</h4>
                <div className="space-y-2">
                  {modelGeometry.bodies?.map((body, index) => (
                    <div key={body.id} className="bg-gray-900/50 rounded p-2">
                      <div className="font-medium text-white text-sm">{body.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {body.faceCount} 面 · {body.edgeCount} 边
                      </div>
                    </div>
                  )) || (
                    <div className="text-gray-500 text-sm">暂无实体数据</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'topology' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">拓扑结构</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">面数量</span>
                    <span className="text-white font-medium">{modelGeometry?.faceCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">边数量</span>
                    <span className="text-white font-medium">{modelGeometry?.edgeCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">顶点数量</span>
                    <span className="text-white font-medium">{modelGeometry?.vertexCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">质量评估</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">几何置信度</span>
                      <span className="text-green-400 text-sm font-medium">95%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">拓扑状态</span>
                      <span className="text-green-400 text-sm font-medium">有效</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 中央 - 3D Viewer */}
      <div className="flex-1 relative">
        <Viewer />
      </div>
    </div>
  );
}