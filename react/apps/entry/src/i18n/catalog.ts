import zh from '../locales/zh.json'
import en from '../locales/en.json'
import type { AppLocale } from './lang'

const catalogs = { zh, en } as const

export type EntryCatalog = typeof zh

export function getCatalog(locale: AppLocale): EntryCatalog {
  return catalogs[locale] ?? catalogs.zh
}
