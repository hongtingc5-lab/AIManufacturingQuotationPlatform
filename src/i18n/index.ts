import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import zh from '../locales/zh/translation.json'
import en from '../locales/en/translation.json'
import { mergeCapabilityLocales } from './capabilityLocales'

const zhMerged = mergeCapabilityLocales(zh, 'zh')
const enMerged = mergeCapabilityLocales(en, 'en')

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zhMerged },
      en: { translation: enMerged },
    },
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'promakehub_lang',
      caches: ['localStorage'],
    },
  })

export default i18n

export type AppLanguage = 'zh' | 'en'

export function getAppLanguage(): AppLanguage {
  const lng = (i18n.resolvedLanguage || i18n.language || 'zh').toLowerCase()
  return lng.startsWith('en') ? 'en' : 'zh'
}

export async function toggleAppLanguage(): Promise<AppLanguage> {
  const next: AppLanguage = getAppLanguage() === 'zh' ? 'en' : 'zh'
  await i18n.changeLanguage(next)
  document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN'
  return next
}
