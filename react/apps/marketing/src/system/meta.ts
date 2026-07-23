/**
 * 本工程所属业务系统身份（五系统之一：营销页）。
 * 与用户端 / 后台 / MES / 供应商端严格区分，见 `react/SYSTEMS.md`。
 */
export const SYSTEM = {
  id: 'marketing',
  nameZh: '营销页',
  nameEn: 'Marketing',
  packageName: '@zhizao/frontend-marketing',
  htmlSourceHint: '前端页面/营销页（已核对）',
} as const

export type SystemId = 'marketing' | 'user' | 'admin' | 'mes' | 'supplier'

export function applySystemIdentity(root: HTMLElement = document.documentElement): void {
  root.dataset.system = SYSTEM.id
  root.dataset.systemName = SYSTEM.nameZh
}
