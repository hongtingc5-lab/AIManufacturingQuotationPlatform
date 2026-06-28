import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Manufacturing Quotation Platform',
  description: '智能制造报价系统 - 基于AI的CAD模型分析和报价平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">{children}</body>
    </html>
  );
}