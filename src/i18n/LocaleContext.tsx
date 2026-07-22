import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import i18n, { getAppLanguage, toggleAppLanguage, type AppLanguage } from './index'

type LocaleContextValue = {
  locale: AppLanguage
  isEnglish: boolean
  toggleLocale: () => Promise<void>
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'zh',
  isEnglish: false,
  toggleLocale: async () => undefined,
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { i18n: i18nInstance } = useTranslation()
  const [locale, setLocale] = useState<AppLanguage>(getAppLanguage())

  useEffect(() => {
    const sync = (lng: string) => {
      const next: AppLanguage = lng.toLowerCase().startsWith('en') ? 'en' : 'zh'
      setLocale(next)
      document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN'
      document.body.classList.toggle('is-en', next === 'en')
    }
    sync(i18nInstance.language)
    i18nInstance.on('languageChanged', sync)
    return () => {
      i18nInstance.off('languageChanged', sync)
    }
  }, [i18nInstance])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isEnglish: locale === 'en',
      toggleLocale: async () => {
        await toggleAppLanguage()
      },
    }),
    [locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export { i18n }
