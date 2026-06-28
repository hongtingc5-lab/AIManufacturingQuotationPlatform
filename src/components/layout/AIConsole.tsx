'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Send, Bot, User, AlertCircle, CheckCircle } from 'lucide-react';
import { analyzeModelGeometry, getTokenUsage } from '@/lib/doubao';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

export default function AIConsole() {
  const { modelGeometry, fileInfo, setIsLoading, setError } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: `AI助手已就绪 | 模型: Doubao-Seed-Evolving | Token限额: 50万`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (fileInfo) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'system',
          content: `文件 "${fileInfo.name}" 已上传，可以开始AI分析`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [fileInfo]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAIProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsAIProcessing(true);
    setIsLoading(true);

    try {
      if (modelGeometry) {
        const aiResponse = await analyzeModelGeometry({
          ...modelGeometry,
          userQuestion: inputMessage,
        });

        const tokenInfo = getTokenUsage();
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `${aiResponse}\n\n[Token使用: ${tokenInfo.used} / 500000 (${tokenInfo.percentage}%)]`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const systemMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: '请先上传STEP文件',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: `AI分析失败: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(`AI分析失败: ${error.message}`);
    } finally {
      setIsAIProcessing(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/95 border-t border-gray-700 flex flex-col h-48">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center">
          <Bot className="w-5 h-5 text-purple-400 mr-2" />
          <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-gray-400">Token: <span className="text-purple-400 font-medium">{getTokenUsage().used.toLocaleString()} / 500,000</span></span>
          <span className="text-green-400 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Doubao-Seed-Evolving
          </span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start space-x-2',
              message.type === 'user' && 'flex-row-reverse space-x-reverse'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                message.type === 'user' && 'bg-blue-600',
                message.type === 'ai' && 'bg-purple-600',
                message.type === 'system' && 'bg-gray-600'
              )}
            >
              {message.type === 'user' && <User className="w-3 h-3 text-white" />}
              {message.type === 'ai' && <Bot className="w-3 h-3 text-white" />}
              {message.type === 'system' && <AlertCircle className="w-3 h-3 text-white" />}
            </div>
            <div
              className={cn(
                'flex-1 p-2 rounded text-xs max-w-[85%]',
                message.type === 'user' && 'bg-blue-600/20 text-blue-300',
                message.type === 'ai' && 'bg-purple-600/20 text-purple-300',
                message.type === 'system' && 'bg-gray-600/20 text-gray-400'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="px-2 py-2 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="输入关于CAD模型的问题..."
            disabled={isAIProcessing}
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={isAIProcessing || !inputMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}