import type { Resource } from 'i18next'
import registry from '../data/news/registry.json'

const zhModules = import.meta.glob('../locales/zh/news/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const enModules = import.meta.glob('../locales/en/news/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

function nestNews(modules: Record<string, unknown>) {
  const news: Record<string, unknown> = {}
  for (const [path, data] of Object.entries(modules)) {
    const file = path.split('/').pop() || ''
    const key = file.replace(/\.json$/, '')
    if (!key) continue
    news[key] = data
  }
  return { news }
}

export function mergeNewsLocales<T extends Record<string, unknown>>(base: T, lang: 'zh' | 'en'): T {
  const modules = lang === 'zh' ? zhModules : enModules
  const nested = nestNews(modules)
  const pages = {
    ...((base.pages as Record<string, unknown>) || {}),
    ...nested,
  }
  return { ...base, pages }
}

export const NEWS_SLUGS = registry.slugs as string[]

export function isNewsSlug(slug: string): boolean {
  return NEWS_SLUGS.includes(slug)
}

/** unused helper kept for typing Resource merges */
export type NewsResource = Resource
