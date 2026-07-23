import type { Resource } from 'i18next'

const zhModules = import.meta.glob('../locales/zh/industries/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const enModules = import.meta.glob('../locales/en/industries/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

function nestIndustries(modules: Record<string, unknown>) {
  const industries: Record<string, unknown> = {}
  for (const [path, data] of Object.entries(modules)) {
    const file = path.split('/').pop() || ''
    const slug = file.replace(/\.json$/, '')
    if (!slug) continue
    industries[slug] = data
  }
  return { industries }
}

export function mergeIndustryLocales<T extends Record<string, unknown>>(base: T, lang: 'zh' | 'en'): T {
  const modules = lang === 'zh' ? zhModules : enModules
  const nested = nestIndustries(modules)
  const pages = {
    ...((base.pages as Record<string, unknown>) || {}),
    ...nested,
  }
  return { ...base, pages }
}

export const INDUSTRY_DETAIL_SLUGS = [
  'aerospace',
  'medical',
  'automotive',
  'robotics',
  'electronics',
  'semiconductor',
  'new-energy',
  'consumer',
  'telecom',
] as const

export type IndustryDetailSlug = (typeof INDUSTRY_DETAIL_SLUGS)[number]

export function isIndustryDetailSlug(slug: string): slug is IndustryDetailSlug {
  return (INDUSTRY_DETAIL_SLUGS as readonly string[]).includes(slug)
}

/** unused helper kept for typing Resource merges */
export type IndustryResource = Resource
