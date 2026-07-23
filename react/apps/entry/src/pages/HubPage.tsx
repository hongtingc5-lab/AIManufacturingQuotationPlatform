import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BrandLogo } from '../components/BrandLogo'
import { marketingUrl } from '../config/origins'
import type { Locale } from '../data/authPages'
import { localePathPrefix } from '../data/authPages'
import { getCatalog } from '../i18n/catalog'
import { pathHasEnPrefix, writeStoredLang } from '../i18n/lang'

/** Only customer workspace is linked for now; other portals stay listed as “later”. */
const systemRoutes: Record<
  string,
  { loginPath?: string; registerPath?: string; isMarketing?: boolean; linked: boolean }
> = {
  marketing: { loginPath: '/', isMarketing: true, linked: true },
  user: { loginPath: '/login', registerPath: '/register', linked: true },
  admin: { loginPath: '/admin/login', registerPath: '/admin/register', linked: false },
  mes: { loginPath: '/mes/login', registerPath: '/mes/register', linked: false },
  supplier: { loginPath: '/supplier/login', registerPath: '/supplier/register', linked: false },
}

export function HubPage({ locale: localeProp }: { locale?: Locale }) {
  const location = useLocation()
  const locale: Locale = pathHasEnPrefix(location.pathname) ? 'en' : localeProp === 'en' ? 'en' : 'zh'
  const catalog = getCatalog(locale)
  const t = catalog.hub
  const zhPath = '/hub'
  const enPath = '/en/hub'
  const marketingHome = marketingUrl('/', locale)

  useEffect(() => {
    document.title = t.title
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN'
  }, [locale, t.title])

  return (
    <div className="hub-page">
      <header className="hub-header">
        <div className="hub-brand">
          <span className="hub-brand-mark">
            <BrandLogo />
          </span>
          <span>
            <strong>{catalog.brand}</strong>
            <small>{catalog.tagline}</small>
          </span>
        </div>
        <nav className="hub-lang" aria-label={t.langAria}>
          <Link
            className={locale === 'zh' ? 'is-active' : ''}
            to={zhPath}
            onClick={() => writeStoredLang('zh')}
          >
            中文
          </Link>
          <Link
            className={locale === 'en' ? 'is-active' : ''}
            to={enPath}
            onClick={() => writeStoredLang('en')}
          >
            EN
          </Link>
        </nav>
      </header>

      <main className="hub-main">
        <section className="hub-hero">
          <p className="eyebrow">
            <span className="material-symbols-outlined">hub</span>
            {t.eyebrow}
          </p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
        </section>

        <section className="hub-grid" aria-label="Systems">
          {t.systems.map((system) => {
            const routes = systemRoutes[system.id]
            const linked = routes?.linked !== false
            return (
              <article className={`hub-card${linked ? '' : ' is-pending'}`} key={system.id}>
                <div className="hub-card-icon">
                  <span className="material-symbols-outlined">{system.icon}</span>
                </div>
                <h2>{system.title}</h2>
                <p>{system.description}</p>
                <div className="hub-card-actions">
                  {!linked ? (
                    <span className="hub-btn hub-btn-muted">{t.comingSoon}</span>
                  ) : routes?.isMarketing ? (
                    <a className="hub-btn hub-btn-primary" href={marketingHome}>
                      {t.visit}
                    </a>
                  ) : (
                    <>
                      <Link
                        className="hub-btn hub-btn-primary"
                        to={localePathPrefix(locale, routes?.loginPath || '/login')}
                      >
                        {t.login}
                      </Link>
                      {routes?.registerPath && (
                        <Link
                          className="hub-btn hub-btn-secondary"
                          to={localePathPrefix(locale, routes.registerPath)}
                        >
                          {t.register}
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      </main>

      <footer className="hub-footer">
        {t.footer}
        {' · '}
        <a href={marketingHome}>{locale === 'en' ? 'Marketing site' : '营销站点'}</a>
        {' · '}
        <Link to={localePathPrefix(locale, '/login')}>
          {locale === 'en' ? 'Customer login' : '客户登录'}
        </Link>
      </footer>
    </div>
  )
}
