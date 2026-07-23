import type { MesLocale } from '../i18n/LocaleContext'

export type PagePayload = {
  slug: string
  route: string
  docTitle: string
  navLabel: string
  mainClass?: string
  mainHtml: string
}

const zhModules = import.meta.glob('../locales/zh/*.json', { eager: true, import: 'default' }) as Record<string, PagePayload>
const enModules = import.meta.glob('../locales/en/*.json', { eager: true, import: 'default' }) as Record<string, PagePayload>

function bySlug(modules: Record<string, PagePayload>) {
  const map = new Map<string, PagePayload>()
  for (const [path, payload] of Object.entries(modules)) {
    if (path.endsWith('registry.json')) continue
    if (payload?.slug) map.set(payload.slug, payload)
  }
  return map
}

const zhPages = bySlug(zhModules)
const enPages = bySlug(enModules)

export const MES_ROUTES: Array<{ slug: string; route: string }> = [
  { slug: 'home', route: '/' },
  { slug: 'work-orders', route: '/work-orders' },
  { slug: 'operations', route: '/operations' },
  { slug: 'equipment', route: '/equipment' },
  { slug: 'quality', route: '/quality' },
  { slug: 'inventory', route: '/inventory' },
  { slug: 'ai-assistant', route: '/ai-assistant' },
  { slug: 'alerts', route: '/alerts' },
  { slug: 'analytics', route: '/analytics' },
  { slug: 'settings', route: '/settings' },
]

export function getMesPage(slug: string, locale: MesLocale): PagePayload | undefined {
  const primary = locale === 'en' ? enPages : zhPages
  const fallback = locale === 'en' ? zhPages : enPages
  return primary.get(slug) ?? fallback.get(slug)
}
