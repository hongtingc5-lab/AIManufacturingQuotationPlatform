import type { UserPagePayload } from '../pages/UserHtmlPage'
import type { UserLocale } from '../i18n/LocaleContext'

const zhModules = import.meta.glob('../locales/zh/*.json', { eager: true, import: 'default' }) as Record<
  string,
  UserPagePayload
>
const enModules = import.meta.glob('../locales/en/*.json', { eager: true, import: 'default' }) as Record<
  string,
  UserPagePayload
>

function bySlug(modules: Record<string, UserPagePayload>) {
  const map = new Map<string, UserPagePayload>()
  for (const [path, payload] of Object.entries(modules)) {
    if (path.endsWith('registry.json')) continue
    if (payload?.slug) map.set(payload.slug, payload)
  }
  return map
}

const zhPages = bySlug(zhModules)
const enPages = bySlug(enModules)

export const USER_ROUTES: Array<{ slug: string; route: string }> = [
  { slug: 'home', route: '/' },
  { slug: 'ai-smart-quote', route: '/ai/smart-quote' },
  { slug: 'ai-text-to-3d', route: '/ai/text-to-3d' },
  { slug: 'ai-image-to-3d', route: '/ai/image-to-3d' },
  { slug: 'quote-upload', route: '/quotes/upload' },
  { slug: 'orders', route: '/orders' },
  { slug: 'quote-detail', route: '/quotes/detail' },
  { slug: 'quote-edit', route: '/quotes/edit' },
  { slug: 'models', route: '/models' },
  { slug: 'membership', route: '/membership' },
  { slug: 'account', route: '/account' },
  { slug: 'messages', route: '/messages' },
  { slug: 'analytics', route: '/analytics' },
]

export function getUserPage(slug: string, locale: UserLocale): UserPagePayload | undefined {
  const primary = locale === 'en' ? enPages : zhPages
  const fallback = locale === 'en' ? zhPages : enPages
  return primary.get(slug) ?? fallback.get(slug)
}
