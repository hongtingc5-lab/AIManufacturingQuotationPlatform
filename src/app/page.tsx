'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import WorkflowManager from '@/components/workflow/WorkflowManager';
import AIConsole from '@/components/layout/AIConsole';
import AIDebugPanel from '@/components/AIDebugPanel';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-industrial-dark via-industrial-gray to-industrial-accent">
      {/* Header */}
      <Header />

      {/* 主工作区域 */}
      <main className="flex-1 overflow-hidden">
        <WorkflowManager />
      </main>

      {/* AI Console */}
      <AIConsole />
      
      {/* AI调试面板 */}
      <AIDebugPanel />
    </div>
  );
}