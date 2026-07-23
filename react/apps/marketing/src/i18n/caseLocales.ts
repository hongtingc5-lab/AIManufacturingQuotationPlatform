import type { Resource } from 'i18next'
import registry from '../data/cases/registry.json'

const zhModules = import.meta.glob('../locales/zh/cases/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, { slug?: string }>

const enModules = import.meta.glob('../locales/en/cases/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, { slug?: string }>

function nestCases(modules: Record<string, { slug?: string }>) {
  const cases: Record<string, unknown> = {}
  for (const data of Object.values(modules)) {
    const slug = typeof data?.slug === 'string' ? data.slug : ''
    if (!slug) continue
    cases[slug] = data
  }
  return { cases }
}

export function mergeCaseLocales<T extends Record<string, unknown>>(base: T, lang: 'zh' | 'en'): T {
  const modules = lang === 'zh' ? zhModules : enModules
  const nested = nestCases(modules)
  const pages = {
    ...((base.pages as Record<string, unknown>) || {}),
    ...nested,
  }
  return { ...base, pages }
}

export const CASE_SLUGS = registry.slugs as string[]

export function isCaseSlug(slug: string): boolean {
  return CASE_SLUGS.includes(slug)
}

/** unused helper kept for typing Resource merges */
export type CaseResource = Resource
