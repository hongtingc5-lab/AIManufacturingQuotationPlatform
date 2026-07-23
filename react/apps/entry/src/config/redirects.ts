import type { AuthPageConfig, Locale } from '../data/authPages'
import { localePathPrefix } from '../data/authPages'
import {
  adminOrigin,
  mesOrigin,
  supplierOrigin,
  userOrigin,
} from './origins'

export function getRedirectForPage(config: AuthPageConfig, locale: Locale): string | undefined {
  if (config.redirectTarget) return config.redirectTarget

  if (config.kind === 'register') {
    const loginPaths: Record<string, string> = {
      customer: '/login',
      admin: '/admin/login',
      mes: '/mes/login',
      supplier: '/supplier/login',
    }
    return localePathPrefix(locale, loginPaths[config.portal])
  }

  const loginRedirects: Record<string, string> = {
    customer: userOrigin,
    admin: adminOrigin,
    mes: mesOrigin,
    supplier: supplierOrigin,
  }

  return loginRedirects[config.portal]
}
