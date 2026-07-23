import { useLayoutEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  pathHasEnPrefix,
  resolvePreferredLang,
  stripEnPrefix,
  withEnPrefix,
  writeStoredLang,
  type AppLocale,
} from './lang'

function buildUrl(path: string, search: string, hash: string): string {
  return `${path}${search ? `?${search}` : ''}${hash}`
}

/**
 * Align route prefix (/en) with shared language preference from marketing
 * (?lang= / /en path / cookie / localStorage promakehub_lang).
 *
 * Locale mismatches use a hard navigation. Client-side navigate() was updating
 * window.location to /en while React Router location stayed on /, so Hub kept
 * rendering Chinese after marketing→entry handoff.
 */
export function LangSync({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    const preferred = resolvePreferredLang(location.pathname, location.search)
    writeStoredLang(preferred)
    document.documentElement.lang = preferred === 'en' ? 'en' : 'zh-CN'

    const pathLocale: AppLocale = pathHasEnPrefix(location.pathname) ? 'en' : 'zh'
    const params = new URLSearchParams(location.search)
    const hadLangParam = params.has('lang')
    params.delete('lang')
    const search = params.toString()

    if (preferred !== pathLocale) {
      const nextPath =
        preferred === 'en' ? withEnPrefix(stripEnPrefix(location.pathname)) : stripEnPrefix(location.pathname)
      window.location.replace(buildUrl(nextPath, search, location.hash))
      return
    }

    if (hadLangParam) {
      navigate(buildUrl(location.pathname, search, location.hash), { replace: true })
    }
  }, [location.pathname, location.search, location.hash, navigate])

  return <>{children}</>
}
