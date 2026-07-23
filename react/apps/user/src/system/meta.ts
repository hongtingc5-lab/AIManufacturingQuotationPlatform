/**
 * 用户端（客户工作台）。见 react/SYSTEMS.md 与 PAGE_MAP.md。
 */
export const systemMeta = {
  id: 'user',
  nameZh: '用户端',
  nameEn: 'Customer Workspace',
  htmlSourceHint: '内容/代码/前端页面/用户（已核对）',
} as const

export function applySystemIdentity(): void {
  document.documentElement.dataset.system = systemMeta.id
  document.documentElement.dataset.systemName = systemMeta.nameZh
}
