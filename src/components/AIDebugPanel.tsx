'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'request' | 'response' | 'error' | 'info';
  title: string;
  content: string;
  expanded?: boolean;
}

export default function AIDebugPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // 监听自定义事件
  useEffect(() => {
    const handleLog = (event: CustomEvent<LogEntry>) => {
      setLogs(prev => [...prev, { ...event.detail, id: Date.now().toString() }]);
    };

    const handleClear = () => {
      setLogs([]);
    };

    window.addEventListener('ai-log' as any, handleLog);
    window.addEventListener('ai-clear' as any, handleClear);

    return () => {
      window.removeEventListener('ai-log' as any, handleLog);
      window.removeEventListener('ai-clear' as any, handleClear);
    };
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const toggleExpand = (id: string) => {
    setLogs(prev => prev.map(log => 
      log.id === id ? { ...log, expanded: !log.expanded } : log
    ));
  };

  const copyContent = (log: LogEntry) => {
    navigator.clipboard.writeText(log.content);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'request': return 'text-blue-400';
      case 'response': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-yellow-400';
    }
  };

  const getTypeBgColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'request': return 'bg-blue-500/10 border-blue-500/30';
      case 'response': return 'bg-green-500/10 border-green-500/30';
      case 'error': return 'bg-red-500/10 border-red-500/30';
      case 'info': return 'bg-yellow-500/10 border-yellow-500/30';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg z-50"
      >
        <Terminal className="w-4 h-4" />
        AI调试面板
        {logs.length > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {logs.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[600px] max-h-[70vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">AI分析调试面板</h3>
          <span className="text-gray-400 text-sm">({logs.length}条日志)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setLogs([])}
            className="text-gray-400 hover:text-white text-sm"
          >
            清空
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 日志内容 */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[500px]">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              暂无日志记录...
            </div>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className={`border rounded-lg overflow-hidden ${getTypeBgColor(log.type)}`}
              >
                <div
                  className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-black/20"
                  onClick={() => toggleExpand(log.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getTypeColor(log.type)}`}>
                      {log.type.toUpperCase()}
                    </span>
                    <span className="text-gray-300 text-sm">{log.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyContent(log);
                      }}
                      className="p-1 hover:bg-gray-600 rounded"
                    >
                      {copiedId === log.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
                {(log.expanded || log.content.length < 200) && (
                  <div className="px-3 py-2 border-t border-gray-700/50">
                    <pre className="text-gray-300 text-xs whitespace-pre-wrap break-words font-mono bg-black/30 p-2 rounded">
                      {log.content}
                    </pre>
                  </div>
                )}
                {log.expanded && log.content.length >= 200 && (
                  <div className="px-3 py-2 border-t border-gray-700/50">
                    <pre className="text-gray-300 text-xs whitespace-pre-wrap break-words font-mono bg-black/30 p-2 rounded max-h-96 overflow-y-auto">
                      {log.content}
                    </pre>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}

// 辅助函数：记录AI日志
export function logAILog(type: LogEntry['type'], title: string, content: string) {
  window.dispatchEvent(new CustomEvent('ai-log', {
    detail: { type, title, content, timestamp: new Date(), expanded: false }
  }));
}

// 辅助函数：清除日志
export function clearAILogs() {
  window.dispatchEvent(new CustomEvent('ai-clear'));
}
