'use client';

import React from 'react';
import { WorkflowStep, WORKFLOW_STEPS } from '@/types';
import { useStore } from '@/store/useStore';
import {
  Upload,
  Box,
  Layers,
  Settings,
  Grid,
  Activity,
  DollarSign,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Upload,
  Box,
  Layers,
  Settings,
  Grid,
  Activity,
  DollarSign,
  Sparkles,
};

export default function Header() {
  const { currentStep, setCurrentStep, fileInfo } = useStore();

  return (
    <header className="bg-gradient-to-r from-industrial-dark to-industrial-gray border-b border-blue-600/30 shadow-lg">
      {/* Logo区域 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-blue-600/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              AI Manufacturing Quotation Platform
            </h1>
            <p className="text-xs text-gray-400">
              智能制造报价系统 · Powered by Doubao AI
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {fileInfo && (
            <div className="text-sm text-gray-300">
              <span className="text-blue-400">{fileInfo.name}</span>
              <span className="ml-2 text-gray-500">
                ({(fileInfo.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
          <div className="text-xs text-gray-400">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </div>
        </div>
      </div>

      {/* 工作流标签 */}
      <div className="flex items-center px-6 py-2 space-x-1 overflow-x-auto">
        {WORKFLOW_STEPS.map((stepInfo, index) => {
          const Icon = iconMap[stepInfo.icon];
          const isActive = currentStep === stepInfo.step;
          const isCompleted = currentStep > stepInfo.step;

          return (
            <button
              key={stepInfo.step}
              onClick={() => fileInfo || stepInfo.step === WorkflowStep.UPLOAD ? setCurrentStep(stepInfo.step) : null}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200',
                'border border-transparent',
                isActive && 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30',
                isCompleted && 'bg-green-600/20 text-green-400 border-green-600/30',
                !isActive && !isCompleted && 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
                !fileInfo && stepInfo.step !== WorkflowStep.UPLOAD && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center space-x-2">
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {index + 1}. {stepInfo.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </header>
  );
}