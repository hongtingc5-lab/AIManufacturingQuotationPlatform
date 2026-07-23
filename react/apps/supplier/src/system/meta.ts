/**
 * 供应商端。见 react/SYSTEMS.md 与 PAGE_MAP.md。
 */
export const systemMeta = {
  id: 'supplier',
  nameZh: '供应商端',
  nameEn: 'Supplier Portal',
  htmlSourceHint: '内容/代码/前端页面/供应商页面（已核对）',
} as const

export function applySystemIdentity(): void {
  document.documentElement.dataset.system = systemMeta.id
  document.documentElement.dataset.systemName = systemMeta.nameZh
}
