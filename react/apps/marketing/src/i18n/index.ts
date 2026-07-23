import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import zh from '../locales/zh/translation.json'
import en from '../locales/en/translation.json'
import { persistSharedLang } from '../system/origins'
import { mergeCapabilityLocales } from './capabilityLocales'
import { mergeSolutionLocales } from './solutionLocales'
import { mergeIndustryLocales } from './industryLocales'
import { mergeCaseLocales } from './caseLocales'
import { mergeResourceLocales } from './resourceLocales'
import { mergeNewsLocales } from './newsLocales'
import { mergeAboutLocales } from './aboutLocales'

const zhMerged = mergeAboutLocales(
  mergeNewsLocales(
    mergeResourceLocales(
      mergeCaseLocales(
        mergeIndustryLocales(mergeSolutionLocales(mergeCapabilityLocales(zh, 'zh'), 'zh'), 'zh'),
        'zh',
      ),
      'zh',
    ),
    'zh',
  ),
  'zh',
)
const enMerged = mergeAboutLocales(
  mergeNewsLocales(
    mergeResourceLocales(
      mergeCaseLocales(
        mergeIndustryLocales(mergeSolutionLocales(mergeCapabilityLocales(en, 'en'), 'en'), 'en'),
        'en',
      ),
      'en',
    ),
    'en',
  ),
  'en',
)

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
      // cookie bridges marketing (:5173) and entry (:5175) on the same host
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupCookie: 'promakehub_lang',
      lookupLocalStorage: 'promakehub_lang',
      caches: ['localStorage', 'cookie'],
      cookieMinutes: 60 * 24 * 365,
    },
  })

i18n.on('languageChanged', (lng) => {
  const next: AppLanguage = lng.toLowerCase().startsWith('en') ? 'en' : 'zh'
  persistSharedLang(next)
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
  persistSharedLang(next)
  document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN'
  return next
}
