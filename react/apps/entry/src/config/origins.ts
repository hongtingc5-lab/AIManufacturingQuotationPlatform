function defaultMarketingOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const { protocol, hostname } = window.location
    return `${protocol}//${hostname}:5173`
  }
  return 'http://localhost:5173'
}

export const marketingOrigin =
  import.meta.env.VITE_MARKETING_ORIGIN || defaultMarketingOrigin()

export const userOrigin = import.meta.env.VITE_USER_ORIGIN || 'http://localhost:5174'

export const adminOrigin = import.meta.env.VITE_ADMIN_ORIGIN || 'http://localhost:5176'

export const mesOrigin = import.meta.env.VITE_MES_ORIGIN || 'http://localhost:5177'

export const supplierOrigin = import.meta.env.VITE_SUPPLIER_ORIGIN || 'http://localhost:5178'

export function resolveRedirect(target: string | undefined): string | undefined {
  if (!target || target === '#') return target
  if (/^https?:\/\//.test(target)) return target
  return target
}

function resolveMarketingOrigin(): string {
  const env = (import.meta.env.VITE_MARKETING_ORIGIN as string | undefined)?.replace(/\/$/, '')
  if (env) return env
  return defaultMarketingOrigin()
}

/** Marketing site URL with lang handoff (cookie + ?lang=; localStorage is not shared across ports). */
export function marketingUrl(path = '/', lang: 'zh' | 'en' = 'zh') {
  const p = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${resolveMarketingOrigin()}${p === '/' ? '/' : p}`)
  url.searchParams.set('lang', lang)
  return url.toString()
}
