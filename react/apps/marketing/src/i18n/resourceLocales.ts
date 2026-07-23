import type { Resource } from 'i18next'

const zhModules = import.meta.glob('../locales/zh/resources/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const enModules = import.meta.glob('../locales/en/resources/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

function nestResources(modules: Record<string, unknown>) {
  const resources: Record<string, unknown> = {}
  for (const [path, data] of Object.entries(modules)) {
    const file = path.split('/').pop() || ''
    const slug = file.replace(/\.json$/, '')
    if (!slug) continue
    resources[slug] = data
  }
  return { resources }
}

export function mergeResourceLocales<T extends Record<string, unknown>>(base: T, lang: 'zh' | 'en'): T {
  const modules = lang === 'zh' ? zhModules : enModules
  const nested = nestResources(modules)
  const pages = {
    ...((base.pages as Record<string, unknown>) || {}),
    ...nested,
  }
  return { ...base, pages }
}

export const RESOURCE_DETAIL_SLUGS = [
  'process-guide',
  'material-handbook',
  'design-guidelines',
  'faq',
  'model-center',
  'downloads',
] as const

export type ResourceDetailSlug = (typeof RESOURCE_DETAIL_SLUGS)[number]

export function isResourceDetailSlug(slug: string): slug is ResourceDetailSlug {
  return (RESOURCE_DETAIL_SLUGS as readonly string[]).includes(slug)
}

/** unused helper kept for typing Resource merges */
export type ResourceLocaleResource = Resource
