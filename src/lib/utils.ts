import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 格式化数字（添加千位分隔符）
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// 格式化货币
export function formatCurrency(amount: number): string {
  return '¥' + formatNumber(amount, 2);
}

// 格式化日期
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 计算重量（基于体积和密度）
export function calculateWeight(
  volumeMm3: number,
  densityGPerCm3: number
): number {
  // volumeMm3: mm³
  // densityGPerCm3: g/cm³
  // 返回：g
  const volumeCm3 = volumeMm3 / 1000; // mm³ → cm³
  return volumeCm3 * densityGPerCm3;
}

// 常用材料密度 (g/cm³)
export const MATERIAL_DENSITY: Record<string, number> = {
  ABS: 1.04,
  PP: 0.9,
  PE: 0.95,
  PVC: 1.38,
  PA: 1.14,
  PC: 1.2,
  POM: 1.41,
  PMMA: 1.18,
  PBT: 1.31,
  PPS: 1.35,
  aluminum: 2.7,
  steel: 7.85,
  copper: 8.96,
  brass: 8.5,
};

// 获取材料密度
export function getMaterialDensity(material: string): number {
  return MATERIAL_DENSITY[material.toLowerCase()] || 1.0;
}