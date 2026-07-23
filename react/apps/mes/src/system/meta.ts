/**
 * MES 工作台。见 react/SYSTEMS.md 与 PAGE_MAP.md。
 */
export const systemMeta = {
  id: 'mes',
  nameZh: 'MES 工作台',
  nameEn: 'MES Workspace',
  htmlSourceHint: '内容/代码/前端页面/MES工作台（已核对）',
} as const

export function applySystemIdentity(): void {
  document.documentElement.dataset.system = systemMeta.id
  document.documentElement.dataset.systemName = systemMeta.nameZh
}
