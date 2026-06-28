'use client';

import React, { useCallback, useState } from 'react';
import { useStore } from '@/store/useStore';
import { WorkflowStep, STEPFileInfo } from '@/types';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { STEPService } from '@/services/step-service';

export default function UploadWorkflow() {
  const { 
    setFileInfo, 
    setCurrentStep, 
    setIsLoading, 
    setError,
    setModelGeometry,
  } = useStore();
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleFile = useCallback(
    async (file: File) => {
      const validExtensions = ['.step', '.stp', '.STEP', '.STP', '.stl', '.STL'];
      const fileName = file.name.toLowerCase();
      const isValid = validExtensions.some((ext) => fileName.endsWith(ext.toLowerCase()));

      if (!isValid) {
        setError('请上传STEP或STL格式的文件（.step, .stp, .stl）');
        setUploadStatus('error');
        return;
      }

      setIsLoading(true);
      setUploadStatus('uploading');

      try {
        const fileInfo: STEPFileInfo = {
          name: file.name,
          size: file.size,
          lastModified: new Date(file.lastModified),
          file: file,
        };

        setFileInfo(fileInfo);

        setUploadStatus('analyzing');
        setAnalysisProgress(20);

        if (fileName.endsWith('.step') || fileName.endsWith('.stp')) {
          try {
            setAnalysisProgress(50);
            const analysisResult = await STEPService.analyzeSTEP(file);
            if (analysisResult.success) {
              const volume = parseFloat(analysisResult.volume);
              const surfaceArea = parseFloat(analysisResult.surfaceArea);
              const weight = parseFloat(analysisResult.weight);
              
              setModelGeometry({
                volume: volume,
                surfaceArea: surfaceArea,
                boundingBox: {
                  min: { 
                    x: parseFloat(analysisResult.boundingBox.min.x), 
                    y: parseFloat(analysisResult.boundingBox.min.y), 
                    z: parseFloat(analysisResult.boundingBox.min.z) 
                  },
                  max: { 
                    x: parseFloat(analysisResult.boundingBox.max.x), 
                    y: parseFloat(analysisResult.boundingBox.max.y), 
                    z: parseFloat(analysisResult.boundingBox.max.z) 
                  },
                },
                faceCount: analysisResult.topology.faces,
                edgeCount: analysisResult.topology.edges,
                vertexCount: analysisResult.topology.vertices,
                bodies: [{
                  id: 'body-1',
                  name: analysisResult.model.name || file.name.replace(/\.(step|stp|STEP|STP)$/, ''),
                  volume: volume,
                  surfaceArea: surfaceArea,
                  weight: weight,
                  material: 'ABS',
                  faceCount: analysisResult.topology.faces,
                  edgeCount: analysisResult.topology.edges,
                  boundingBox: {
                    min: { 
                      x: parseFloat(analysisResult.boundingBox.min.x), 
                      y: parseFloat(analysisResult.boundingBox.min.y), 
                      z: parseFloat(analysisResult.boundingBox.min.z) 
                    },
                    max: { 
                      x: parseFloat(analysisResult.boundingBox.max.x), 
                      y: parseFloat(analysisResult.boundingBox.max.y), 
                      z: parseFloat(analysisResult.boundingBox.max.z) 
                    },
                  },
                }],
              });
            }
          } catch (stepError) {
            console.warn('STEP分析失败:', stepError);
          }
        }

        setAnalysisProgress(100);
        setUploadStatus('success');

        setTimeout(() => {
          setCurrentStep(WorkflowStep.VIEWER_3D);
        }, 500);
      } catch (error) {
        console.error('处理失败:', error);
        setError(error instanceof Error ? error.message : '文件处理失败，请重试');
        setUploadStatus('error');
      } finally {
        setIsLoading(false);
      }
    },
    [setFileInfo, setCurrentStep, setIsLoading, setError, setModelGeometry]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* 上传区域 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative border-2 border-dashed rounded-xl p-12 transition-all duration-200',
            'bg-gradient-to-br from-gray-900/50 to-gray-800/50',
            dragActive
              ? 'border-blue-500 bg-blue-500/10 scale-105'
              : 'border-gray-600 hover:border-gray-500',
            uploadStatus === 'success' && 'border-green-500 bg-green-500/10',
            uploadStatus === 'error' && 'border-red-500 bg-red-500/10'
          )}
        >
          <input
            type="file"
            accept=".step,.stp,.STEP,.STP,.stl,.STL"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            {uploadStatus === 'idle' && (
              <>
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  上传CAD文件
                </h3>
                <p className="text-gray-400 mb-4">
                  拖拽文件到此处或点击选择文件
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    支持 .step, .stp, .stl 格式
                  </span>
                  <span>|</span>
                  <span>最大 100MB</span>
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  💡 <span className="text-amber-400">建议上传STL格式</span> 以获得最佳渲染效果，STEP文件仅显示包围盒
                </div>
              </>
            )}

            {uploadStatus === 'uploading' && (
              <>
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-600/20 flex items-center justify-center animate-spin">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  正在上传...
                </h3>
                <p className="text-gray-400">请稍候</p>
              </>
            )}

            {uploadStatus === 'analyzing' && (
              <>
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  正在解析模型...
                </h3>
                <p className="text-gray-400 mb-4">请稍候，正在提取几何信息</p>
                <div className="w-full max-w-xs mx-auto">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>进度</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    {analysisProgress >= 10 && <div>✓ 文件上传完成</div>}
                    {analysisProgress >= 20 && <div>⏳ STEP文件解析中...</div>}
                    {analysisProgress >= 50 && <div>✓ 几何特征提取完成</div>}
                    {analysisProgress >= 100 && <div>✓ 准备3D渲染...</div>}
                  </div>
                </div>
              </>
            )}

            {uploadStatus === 'success' && (
              <>
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-green-600/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  上传成功！
                </h3>
                <p className="text-gray-400">正在跳转到3D视图...</p>
              </>
            )}

            {uploadStatus === 'error' && (
              <>
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  上传失败
                </h3>
                <p className="text-gray-400">请检查文件格式后重试</p>
              </>
            )}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl mb-2">📐</div>
            <h4 className="font-semibold text-white mb-1">精准解析</h4>
            <p className="text-sm text-gray-400">
              支持STEP/STL格式解析，准确提取几何信息
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl mb-2">🔬</div>
            <h4 className="font-semibold text-white mb-1">智能分析</h4>
            <p className="text-sm text-gray-400">
              AI驱动的DFM分析和工艺路线规划
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-semibold text-white mb-1">精准报价</h4>
            <p className="text-sm text-gray-400">
              基于实际模型数据的成本估算
            </p>
          </div>
        </div>

        {/* 格式说明 */}
        <div className="mt-6 bg-gray-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">文件格式说明</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded bg-blue-600/20 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-blue-400 text-xs font-bold">STL</span>
              </div>
              <div>
                <div className="text-white font-medium">STL格式</div>
                <div className="text-gray-400">三角面片格式，3D渲染效果最佳</div>
                <div className="text-xs text-green-400">✅ 推荐使用</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded bg-green-600/20 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-green-400 text-xs font-bold">STEP</span>
              </div>
              <div>
                <div className="text-white font-medium">STEP格式</div>
                <div className="text-gray-400">参数化曲面格式，支持完整3D渲染</div>
                <div className="text-xs text-green-400">✅ 后端自动转换</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}