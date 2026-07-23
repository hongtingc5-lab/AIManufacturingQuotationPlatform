import type { SupplierLocale } from '../i18n/LocaleContext'

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

export const SUPPLIER_ROUTES: Array<{ slug: string; route: string }> = [
  { slug: 'home', route: '/' },
  { slug: 'onboarding', route: '/onboarding' },
  { slug: 'rfq', route: '/rfq' },
  { slug: 'orders-platform', route: '/orders/platform' },
  { slug: 'orders-crm', route: '/orders/crm' },
  { slug: 'enterprise', route: '/enterprise' },
  { slug: 'training', route: '/training' },
  { slug: 'assessment', route: '/assessment' },
  { slug: 'messages', route: '/messages' },
  { slug: 'help', route: '/help' },
]

export function getSupplierPage(slug: string, locale: SupplierLocale): PagePayload | undefined {
  const primary = locale === 'en' ? enPages : zhPages
  const fallback = locale === 'en' ? zhPages : enPages
  return primary.get(slug) ?? fallback.get(slug)
}
