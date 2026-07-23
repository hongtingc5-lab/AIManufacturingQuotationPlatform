/**
 * 共用登录/注册入口（非五业务系统之一）。
 * 见 `react/SYSTEMS.md` — 与 marketing / user / admin / mes / supplier 区分。
 */
export const SYSTEM = {
  id: 'entry',
  nameZh: '共用入口',
  nameEn: 'Shared Entry Portal',
  packageName: '@zhizao/frontend-entry',
  htmlSourceHint: '前端页面/入口',
} as const

export type SystemId = 'entry' | 'marketing' | 'user' | 'admin' | 'mes' | 'supplier'

export function applySystemIdentity(root: HTMLElement = document.documentElement): void {
  root.dataset.system = SYSTEM.id
  root.dataset.systemName = SYSTEM.nameZh
}
