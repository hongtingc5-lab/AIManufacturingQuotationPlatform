import type { Resource } from 'i18next'

const zhModules = import.meta.glob('../locales/zh/solutions/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const enModules = import.meta.glob('../locales/en/solutions/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

function nestSolutions(modules: Record<string, unknown>) {
  const solutions: Record<string, unknown> = {}
  for (const [path, data] of Object.entries(modules)) {
    const file = path.split('/').pop() || ''
    const slug = file.replace(/\.json$/, '')
    if (!slug) continue
    solutions[slug] = data
  }
  return { solutions }
}

export function mergeSolutionLocales<T extends Record<string, unknown>>(base: T, lang: 'zh' | 'en'): T {
  const modules = lang === 'zh' ? zhModules : enModules
  const nested = nestSolutions(modules)
  const pages = {
    ...((base.pages as Record<string, unknown>) || {}),
    ...nested,
  }
  return { ...base, pages }
}

export const SOLUTION_DETAIL_SLUGS = [
  'instant-quoting',
  'quick-quote',
  'rapid-prototyping',
  'dfm',
  'image-to-3d',
  'text-to-3d',
  'format-conversion',
  '3d-to-2d',
  'bubble-annotation',
] as const

export type SolutionDetailSlug = (typeof SOLUTION_DETAIL_SLUGS)[number]

export function isSolutionDetailSlug(slug: string): slug is SolutionDetailSlug {
  return (SOLUTION_DETAIL_SLUGS as readonly string[]).includes(slug)
}

/** unused helper kept for typing Resource merges */
export type SolutionResource = Resource
