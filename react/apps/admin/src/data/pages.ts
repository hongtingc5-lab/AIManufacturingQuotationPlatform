import type { AdminPagePayload } from '../pages/AdminHtmlPage'
import type { AdminLocale } from '../i18n/LocaleContext'

const zhModules = import.meta.glob('../locales/zh/*.json', { eager: true, import: 'default' }) as Record<
  string,
  AdminPagePayload
>
const enModules = import.meta.glob('../locales/en/*.json', { eager: true, import: 'default' }) as Record<
  string,
  AdminPagePayload
>

function bySlug(modules: Record<string, AdminPagePayload>) {
  const map = new Map<string, AdminPagePayload>()
  for (const [path, payload] of Object.entries(modules)) {
    if (path.endsWith('registry.json')) continue
    if (payload?.slug) map.set(payload.slug, payload)
  }
  return map
}

const zhPages = bySlug(zhModules)
const enPages = bySlug(enModules)

export const ADMIN_ROUTES: Array<{ slug: string; route: string }> = [
  { slug: 'home', route: '/' },
  { slug: 'users', route: '/users' },
  { slug: 'customers', route: '/customers' },
  { slug: 'customers-enterprise', route: '/customers/enterprise' },
  { slug: 'suppliers', route: '/suppliers' },
  { slug: 'supply', route: '/supply' },
  { slug: 'rfq', route: '/rfq' },
  { slug: 'ai', route: '/ai' },
  { slug: 'knowledge', route: '/knowledge' },
  { slug: 'mes-oversight', route: '/mes-oversight' },
  { slug: 'support', route: '/support' },
  { slug: 'marketing-cms', route: '/marketing-cms' },
  { slug: 'permissions', route: '/permissions' },
  { slug: 'analytics', route: '/analytics' },
  { slug: 'finance', route: '/finance' },
  { slug: 'settings', route: '/settings' },
]

export function getAdminPage(slug: string, locale: AdminLocale): AdminPagePayload | undefined {
  const primary = locale === 'en' ? enPages : zhPages
  const fallback = locale === 'en' ? zhPages : enPages
  return primary.get(slug) ?? fallback.get(slug)
}
