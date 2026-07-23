/** Independent entry portal origin (login / register). */
function defaultEntryOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const { protocol, hostname } = window.location
    return `${protocol}//${hostname}:5175`
  }
  return 'http://localhost:5175'
}

export const ENTRY_ORIGIN =
  (import.meta.env.VITE_ENTRY_ORIGIN as string | undefined)?.replace(/\/$/, '') || defaultEntryOrigin()

/** Shared with entry portal — keep in sync with apps/entry/src/i18n/lang.ts */
export const SHARED_LANG_KEY = 'promakehub_lang'

function normalizeLang(raw: string | null | undefined): 'zh' | 'en' | null {
  if (!raw) return null
  return raw.toLowerCase().startsWith('en') ? 'en' : 'zh'
}

function readCookieLang(): 'zh' | 'en' | null {
  try {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp(`(?:^|; )${SHARED_LANG_KEY}=([^;]*)`))
    return normalizeLang(match?.[1] ? decodeURIComponent(match[1]) : null)
  } catch {
    return null
  }
}

/** Persist language for marketing + entry (cookie bridges :5173 / :5175). */
export function persistSharedLang(lang: 'zh' | 'en'): void {
  try {
    localStorage.setItem(SHARED_LANG_KEY, lang)
  } catch {
    /* ignore */
  }
  try {
    if (typeof document !== 'undefined') {
      document.cookie = `${SHARED_LANG_KEY}=${encodeURIComponent(lang)}; Path=/; Max-Age=31536000; SameSite=Lax`
    }
  } catch {
    /* ignore */
  }
}

function resolveLang(lang?: 'zh' | 'en'): 'zh' | 'en' {
  if (lang === 'zh' || lang === 'en') return lang
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = normalizeLang(localStorage.getItem(SHARED_LANG_KEY))
      if (stored) return stored
    }
  } catch {
    /* ignore */
  }
  const cookie = readCookieLang()
  if (cookie) return cookie
  if (typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('en')) {
    return 'en'
  }
  return 'zh'
}

function resolveEntryOrigin(): string {
  const env = (import.meta.env.VITE_ENTRY_ORIGIN as string | undefined)?.replace(/\/$/, '')
  if (env) return env
  return defaultEntryOrigin()
}

/** Build entry portal URL with /en prefix + ?lang= for cross-origin handoff. */
export function entryUrl(path = '/login', lang?: 'zh' | 'en') {
  const p = path.startsWith('/') ? path : `/${path}`
  const resolved = resolveLang(lang)
  const localized = resolved === 'en' ? (p === '/' ? '/en' : `/en${p}`) : p
  const url = new URL(`${resolveEntryOrigin()}${localized}`)
  url.searchParams.set('lang', resolved)
  return url.toString()
}
