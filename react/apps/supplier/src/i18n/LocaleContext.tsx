import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type SupplierLocale = 'zh' | 'en'

type LocaleCtx = {
  locale: SupplierLocale
  isEnglish: boolean
  setLocale: (l: SupplierLocale) => void
  toggleLocale: () => void
}

const Ctx = createContext<LocaleCtx | null>(null)

function readInitial(): SupplierLocale {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q?.toLowerCase().startsWith('en')) return 'en'
    if (q?.toLowerCase().startsWith('zh')) return 'zh'
    const c = document.cookie.match(/(?:^|; )promakehub_lang=([^;]*)/)
    if (c?.[1]?.toLowerCase().startsWith('en')) return 'en'
    const s = localStorage.getItem('promakehub_lang')
    if (s?.toLowerCase().startsWith('en')) return 'en'
  } catch { /* ignore */ }
  return 'zh'
}

function persist(locale: SupplierLocale) {
  try {
    localStorage.setItem('promakehub_lang', locale)
    document.cookie = `promakehub_lang=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
  } catch { /* ignore */ }
  document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupplierLocale>(readInitial)
  const value = useMemo<LocaleCtx>(
    () => ({
      locale,
      isEnglish: locale === 'en',
      setLocale: (l) => { setLocaleState(l); persist(l) },
      toggleLocale: () => {
        const next: SupplierLocale = locale === 'zh' ? 'en' : 'zh'
        setLocaleState(next)
        persist(next)
      },
    }),
    [locale],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSupplierLocale() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSupplierLocale outside provider')
  return ctx
}
