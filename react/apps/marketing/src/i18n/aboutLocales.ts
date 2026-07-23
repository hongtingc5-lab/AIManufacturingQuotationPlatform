import type { Resource } from 'i18next'

const zhModules = import.meta.glob('../locales/zh/about/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const enModules = import.meta.glob('../locales/en/about/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

function nestAbout(modules: Record<string, unknown>) {
  const about: Record<string, unknown> = {}
  for (const [path, data] of Object.entries(modules)) {
    const file = path.split('/').pop() || ''
    const slug = file.replace(/\.json$/, '')
    if (!slug) continue
    about[slug] = data
  }
  return { about }
}

export function mergeAboutLocales<T extends Record<string, unknown>>(base: T, lang: 'zh' | 'en'): T {
  const modules = lang === 'zh' ? zhModules : enModules
  const nested = nestAbout(modules)
  const pages = {
    ...((base.pages as Record<string, unknown>) || {}),
    ...nested,
  }
  return { ...base, pages }
}

export const ABOUT_DETAIL_SLUGS = ['company', 'quality', 'privacy', 'terms'] as const

export type AboutDetailSlug = (typeof ABOUT_DETAIL_SLUGS)[number]

export function isAboutDetailSlug(slug: string): slug is AboutDetailSlug {
  return (ABOUT_DETAIL_SLUGS as readonly string[]).includes(slug)
}

/** unused helper kept for typing Resource merges */
export type AboutResource = Resource
