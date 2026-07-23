/**
 * 管理后台。见 react/SYSTEMS.md 与 PAGE_MAP.md。
 */
export const systemMeta = {
  id: 'admin',
  nameZh: '管理后台',
  nameEn: 'Admin Console',
  htmlSourceHint: '内容/代码/前端页面/后台（已核对）',
} as const

export function applySystemIdentity(): void {
  document.documentElement.dataset.system = systemMeta.id
  document.documentElement.dataset.systemName = systemMeta.nameZh
}
