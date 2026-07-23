/** Shared with marketing — keep key identical to apps/marketing i18n detection. */
export const SHARED_LANG_KEY = 'promakehub_lang'

export type AppLocale = 'zh' | 'en'

function normalizeLang(raw: string | null | undefined): AppLocale | null {
  if (!raw) return null
  return raw.toLowerCase().startsWith('en') ? 'en' : 'zh'
}

export function readCookieLang(): AppLocale | null {
  try {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp(`(?:^|; )${SHARED_LANG_KEY}=([^;]*)`))
    return normalizeLang(match?.[1] ? decodeURIComponent(match[1]) : null)
  } catch {
    return null
  }
}

function writeCookieLang(locale: AppLocale): void {
  try {
    if (typeof document === 'undefined') return
    // Cookies are shared across ports on the same host; localStorage is not.
    document.cookie = `${SHARED_LANG_KEY}=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`
  } catch {
    /* ignore */
  }
}

export function readStoredLang(): AppLocale | null {
  try {
    return normalizeLang(localStorage.getItem(SHARED_LANG_KEY))
  } catch {
    return null
  }
}

export function writeStoredLang(locale: AppLocale): void {
  try {
    localStorage.setItem(SHARED_LANG_KEY, locale)
  } catch {
    /* ignore */
  }
  writeCookieLang(locale)
}

export function readQueryLang(search: string): AppLocale | null {
  return normalizeLang(new URLSearchParams(search).get('lang'))
}

export function pathHasEnPrefix(pathname: string): boolean {
  return pathname === '/en' || pathname.startsWith('/en/')
}

/**
 * Prefer explicit handoff signals over stale same-origin storage.
 * Marketing (:5173) and entry (:5175) do NOT share localStorage, but they DO
 * share cookies on the same hostname — so cookie bridges the two apps.
 *
 * Order: ?lang= → /en path → cookie → localStorage → zh
 */
export function resolvePreferredLang(pathname: string, search: string): AppLocale {
  return (
    readQueryLang(search) ??
    (pathHasEnPrefix(pathname) ? 'en' : null) ??
    readCookieLang() ??
    readStoredLang() ??
    'zh'
  )
}

export function stripEnPrefix(pathname: string): string {
  if (pathname === '/en') return '/'
  return pathname.replace(/^\/en/, '') || '/'
}

export function withEnPrefix(pathname: string): string {
  if (pathname === '/' || pathname === '') return '/en'
  return pathname.startsWith('/en') ? pathname : `/en${pathname}`
}
