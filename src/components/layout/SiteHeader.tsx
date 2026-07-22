import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../i18n/LocaleContext'
import { BrandSymbol } from './BrandSymbol'

const PROCESS_HREFS = [
  '/capabilities/process/sheet-metal',
  '/capabilities/process/injection',
  '/capabilities/process/cnc',
  '/capabilities/process/polyurethane',
  '/capabilities/process/laser',
  '/capabilities/process/special',
  '/capabilities/process/micro-3d',
  '/capabilities/process/metal-3d',
]
const SERVICE_HREFS = [
  '/capabilities/service/cnc',
  '/capabilities/service/mold',
  '/capabilities/service/custom',
  '/capabilities/service/stamping',
  '/capabilities/service/casting',
  '/capabilities/service/forging',
  '/capabilities/service/3d-printing',
  '/capabilities/service/rapid-prototype',
]
const MATERIAL_HREFS = [
  '/capabilities/material/aluminum',
  '/capabilities/material/copper',
  '/capabilities/material/stainless',
  '/capabilities/material/titanium',
  '/capabilities/material/plastic',
  '/capabilities/material/composite',
]
const FINISH_HREFS = [
  '/capabilities/finish/anodizing',
  '/capabilities/finish/plating',
  '/capabilities/finish/painting',
  '/capabilities/finish/powder-coating',
  '/capabilities/finish/passivation',
  '/capabilities/finish/heat-treatment',
]
const SOLUTION_HREFS = [
  '/solutions/instant-quoting',
  '/solutions/rapid-prototyping',
  '/solutions/dfm',
  '/solutions/quick-quote',
  '/solutions/image-to-3d',
  '/solutions/text-to-3d',
  '/solutions/format-conversion',
  '/solutions/3d-to-2d',
  '/solutions/bubble-annotation',
]
const INDUSTRY_HREFS = [
  '/industries',
  '/industries/aerospace',
  '/industries/medical',
  '/industries/automotive',
  '/industries#robotics',
  '/industries#electronics',
  '/industries#semiconductor',
  '/industries/new-energy',
]
const RESOURCE_HREFS = [
  '/resources/process-guide',
  '/resources',
  '/resources/material-handbook',
  '/resources/design-guidelines',
  '/resources/faq',
  '/resources#downloads',
  '/resources#news',
]
const ABOUT_HREFS = [
  '/about',
  '/about',
  '/about/quality',
  '/about#service',
  '/about/privacy',
  '/about/terms',
  '/about#contact',
]

const PREVIEW_HREFS = [
  '/capabilities/process',
  '/capabilities/service',
  '/capabilities/material',
  '/capabilities/finish',
]
const PREVIEW_IMGS = [
  '/precision/service-cnc.jpg',
  '/precision/manufacturing-service.png',
  '/precision/product-flange.jpg',
  '/precision/product-shaft.jpg',
]
const CAT_IMGS = PREVIEW_IMGS
const DROPDOWN_PREVIEW_IMGS = [
  '/precision/solution-cad-cnc-part.png',
  '/precision/case-aero.jpg',
  '/precision/insight-guide.jpg',
  '/precision/factory-floor.png',
]

type Preview = { h3: string; p: string; a: string }
type Intro = { strong: string; span: string }

export default function SiteHeader() {
  const { t } = useTranslation()
  const { toggleLocale } = useLocale()
  const { pathname } = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  /** Home = translucent/blue hero nav (home.css). Subpages = solid white nav (global.css + is-light). */
  const isHome = pathname === '/' || pathname === ''
  const isCapabilitiesActive = pathname === '/capabilities' || pathname.startsWith('/capabilities/')
  const isNavSectionActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  // SPA keeps header mounted — CSS :hover would keep mega open after clicks.
  // Lock menus on route change + any in-header link click; unlock only after pointer leaves.
  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    const lockMenus = () => {
      header.classList.add('is-menus-suppressed')
      const active = document.activeElement as HTMLElement | null
      if (active && header.contains(active)) active.blur()
    }

    const unlockMenus = () => {
      header.classList.remove('is-menus-suppressed')
    }

    lockMenus()

    const onClickCapture = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target?.closest?.('a, button.lang-link')) return
      lockMenus()
    }

    header.addEventListener('pointerleave', unlockMenus)
    header.addEventListener('click', onClickCapture, true)
    return () => {
      header.removeEventListener('pointerleave', unlockMenus)
      header.removeEventListener('click', onClickCapture, true)
      // Keep suppressed if pointer is still over header (avoids flash-open on route change)
    }
  }, [pathname])

  const processItems = t('mega.processItems', { returnObjects: true }) as string[]
  const serviceItems = t('mega.serviceItems', { returnObjects: true }) as string[]
  const materialItems = t('mega.materialItems', { returnObjects: true }) as string[]
  const finishItems = t('mega.finishItems', { returnObjects: true }) as string[]
  const previews = t('mega.previews', { returnObjects: true }) as Preview[]
  const intros = t('navMenus.intros', { returnObjects: true }) as Intro[]
  const solutions = t('navMenus.solutions', { returnObjects: true }) as string[]
  const industries = t('navMenus.industries', { returnObjects: true }) as string[]
  const resources = t('navMenus.resources', { returnObjects: true }) as string[]
  const aboutLinks = t('navMenus.about', { returnObjects: true }) as string[]
  const menuPreviews = t('navMenus.previews', { returnObjects: true }) as Intro[]

  const dropdowns: Array<{
    href: string
    labelKey: string
    links: string[]
    hrefs: string[]
    introIndex: number
    previewIndex: number
  }> = [
    {
      href: '/solutions',
      labelKey: 'nav.solutions',
      links: solutions,
      hrefs: SOLUTION_HREFS,
      introIndex: 0,
      previewIndex: 0,
    },
    {
      href: '/industries',
      labelKey: 'nav.industries',
      links: industries,
      hrefs: INDUSTRY_HREFS,
      introIndex: 1,
      previewIndex: 1,
    },
    {
      href: '/resources',
      labelKey: 'nav.resources',
      links: resources,
      hrefs: RESOURCE_HREFS,
      introIndex: 2,
      previewIndex: 2,
    },
    {
      href: '/about',
      labelKey: 'nav.about',
      links: aboutLinks,
      hrefs: ABOUT_HREFS,
      introIndex: 3,
      previewIndex: 3,
    },
  ]

  return (
    <header ref={headerRef} className={`site-header${isHome ? '' : ' is-light'}`}>
      <div className="topbar">
        <Link className="brand" to="/" aria-label={t('meta.homeAria')}>
          <BrandSymbol />
          <span className="brand-wordmark">
            <strong>{t('meta.brand')}</strong>
            <span>{t('meta.brandEn')}</span>
          </span>
        </Link>

        <nav className="nav" aria-label={t('nav.mainAria')}>
          <div className="nav-capability">
            {/* Top trigger navigates to hub; mega menu opens on hover/focus-within */}
            <Link
              className={`nav-item nav-item--capability${isCapabilitiesActive ? ' active' : ''}`}
              to="/capabilities"
              aria-current={isCapabilitiesActive ? 'page' : undefined}
            >
              {t('nav.capabilities')}
            </Link>
            <div className="capability-menu">
              <div className="capability-cats">
                {(
                  [
                    ['process', 'mega.process', 'mega.processDesc', '/capabilities/process'],
                    ['service', 'mega.service', 'mega.serviceDesc', '/capabilities/service'],
                    ['material', 'mega.material', 'mega.materialDesc', '/capabilities/material'],
                    ['finish', 'mega.finish', 'mega.finishDesc', '/capabilities/finish'],
                  ] as const
                ).map(([cat, titleKey, descKey, href], i) => (
                  <Link
                    key={cat}
                    className={`capability-cat${i === 0 ? ' is-active' : ''}`}
                    to={href}
                    data-menu-category={cat}
                  >
                    <span className="capability-cat-copy">
                      <strong>{t(titleKey)}</strong>
                      <span>{t(descKey)}</span>
                    </span>
                    <img src={CAT_IMGS[i]} alt={t(titleKey)} />
                  </Link>
                ))}
              </div>

              <div className="capability-main">
                <div className="capability-panel is-active" data-menu-panel="process">
                  <ul className="mega-grid mega-grid--process">
                    {processItems.map((label, i) => (
                      <li key={PROCESS_HREFS[i]}>
                        <Link to={PROCESS_HREFS[i]}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="capability-panel" data-menu-panel="service">
                  <ul className="mega-grid mega-grid--service">
                    {serviceItems.map((label, i) => (
                      <li key={SERVICE_HREFS[i]}>
                        <Link to={SERVICE_HREFS[i]}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="capability-panel" data-menu-panel="material">
                  <ul className="mega-grid">
                    {materialItems.map((label, i) => (
                      <li key={`mat-${i}`}>
                        <Link to={MATERIAL_HREFS[i]}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="capability-panel" data-menu-panel="finish">
                  <ul className="mega-grid">
                    {finishItems.map((label, i) => (
                      <li key={`fin-${i}`}>
                        <Link to={FINISH_HREFS[i]}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="capability-preview">
                {previews.map((item, i) => (
                  <div
                    key={PREVIEW_HREFS[i]}
                    className={`capability-preview-card${i === 0 ? ' is-active' : ''}`}
                    data-menu-preview={['process', 'service', 'material', 'finish'][i]}
                  >
                    <img src={PREVIEW_IMGS[i]} alt="" />
                    <div className="capability-preview-content">
                      <h3>{item.h3}</h3>
                      <p>{item.p}</p>
                      <Link className="btn btn-secondary" to={PREVIEW_HREFS[i]}>
                        {item.a}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {dropdowns.map((dd) => {
            const sectionActive = isNavSectionActive(dd.href)
            return (
            <div className="nav-dropdown" key={dd.href}>
              <Link
                className={`nav-item${sectionActive ? ' active' : ''}`}
                to={dd.href}
                aria-current={sectionActive ? 'page' : undefined}
              >
                {t(dd.labelKey)}
              </Link>
              <div className="nav-menu">
                <div className="nav-menu-intro">
                  <strong>{intros[dd.introIndex]?.strong}</strong>
                  <span>{intros[dd.introIndex]?.span}</span>
                </div>
                <div className="nav-menu-links nav-menu-links--wide">
                  {dd.links.map((label, i) => (
                    <Link key={`${dd.href}-${i}`} to={dd.hrefs[i] || dd.href}>
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="nav-menu-preview" aria-hidden="true">
                  <img src={DROPDOWN_PREVIEW_IMGS[dd.previewIndex]} alt="" />
                  <div className="nav-menu-preview-copy">
                    <strong>{menuPreviews[dd.previewIndex]?.strong}</strong>
                    <span>{menuPreviews[dd.previewIndex]?.span}</span>
                  </div>
                </div>
              </div>
            </div>
            )
          })}
        </nav>

        <div className="nav-actions">
          <a className="login-link" href="/login">
            {t('nav.login')}
          </a>
          <a className="btn btn-primary" href="/#quote">
            {t('nav.quote')}
          </a>
          <button
            type="button"
            className="lang-link"
            aria-label={t('nav.langAria')}
            onClick={() => void toggleLocale()}
          >
            {t('nav.lang')}
          </button>
        </div>
      </div>
    </header>
  )
}
