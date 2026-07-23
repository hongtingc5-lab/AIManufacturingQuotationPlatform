import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type MesLocale = 'zh' | 'en'

type LocaleCtx = {
  locale: MesLocale
  isEnglish: boolean
  setLocale: (l: MesLocale) => void
  toggleLocale: () => void
}

const Ctx = createContext<LocaleCtx | null>(null)

function readInitial(): MesLocale {
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

function persist(locale: MesLocale) {
  try {
    localStorage.setItem('promakehub_lang', locale)
    document.cookie = `promakehub_lang=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
  } catch { /* ignore */ }
  document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<MesLocale>(readInitial)
  const value = useMemo<LocaleCtx>(
    () => ({
      locale,
      isEnglish: locale === 'en',
      setLocale: (l) => { setLocaleState(l); persist(l) },
      toggleLocale: () => {
        const next: MesLocale = locale === 'zh' ? 'en' : 'zh'
        setLocaleState(next)
        persist(next)
      },
    }),
    [locale],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useMesLocale() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMesLocale outside provider')
  return ctx
}
