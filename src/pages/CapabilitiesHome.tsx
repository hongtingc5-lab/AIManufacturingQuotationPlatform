import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../i18n/LocaleContext'

const HERO_STAT_VALUES = ['4', '10+', '7', '9'] as const

const OVERVIEW = [
  {
    href: '/capabilities/process',
    img: '/precision/service-cnc.jpg',
    index: '01',
    titleKey: 'process',
    descKey: 'processDesc',
    ctaKey: 'processCta',
  },
  {
    href: '/capabilities/service',
    img: '/precision/manufacturing-service.png',
    index: '02',
    titleKey: 'service',
    descKey: 'serviceDesc',
    ctaKey: 'serviceCta',
  },
  {
    href: '/capabilities/material',
    img: '/precision/product-flange.jpg',
    index: '03',
    titleKey: 'material',
    descKey: 'materialDesc',
    ctaKey: 'materialCta',
  },
  {
    href: '/capabilities/finish',
    img: '/precision/product-shaft.jpg',
    index: '04',
    titleKey: 'finish',
    descKey: 'finishDesc',
    ctaKey: 'finishCta',
  },
] as const

/** /capabilities — capability center homepage (not process hub) */
export default function CapabilitiesHome() {
  const { t, i18n } = useTranslation()
  const { isEnglish } = useLocale()
  const p = 'pages.capabilitiesHome'
  const stats = t(`${p}.heroStats`, { returnObjects: true }) as string[]
  const faq = t(`${p}.faq`, { returnObjects: true }) as Array<{ q: string; a: string }>

  useEffect(() => {
    document.title = t(`${p}.docTitle`)
    document.documentElement.lang = isEnglish ? 'en' : 'zh-CN'
    document.body.classList.remove('is-home')
    document.body.classList.add('capability-hub-page', 'is-static-page')
    document.body.classList.toggle('is-en', isEnglish)
    return () => {
      document.body.classList.remove('capability-hub-page')
    }
  }, [t, i18n.language, isEnglish])

  return (
    <main>
      <section className="page-hero capability-hub">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>{t(`${p}.heroTitle`)}</h1>
            <p>{t(`${p}.heroDesc`)}</p>
            <div className="hero-stats">
              {HERO_STAT_VALUES.map((value, i) => (
                <div className="hero-stat" key={value}>
                  <strong>{value}</strong>
                  <span>{stats[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section capability-overview-section">
        <div className="container">
          <div className="section-head">
            <h2>{t(`${p}.sectionTitle`)}</h2>
            <p>{t(`${p}.sectionDesc`)}</p>
          </div>
          <div className="capability-overview-grid">
            {OVERVIEW.map((card) => (
              <Link key={card.href} className="capability-overview-card" to={card.href}>
                <img src={card.img} alt={t(`${p}.${card.titleKey}`)} />
                <span className="capability-overview-index">{card.index}</span>
                <div className="capability-overview-copy">
                  <h3>{t(`${p}.${card.titleKey}`)}</h3>
                  <p>{t(`${p}.${card.descKey}`)}</p>
                  <b>{t(`${p}.${card.ctaKey}`)}</b>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section geo-faq-section" data-geo-faq="true">
        <div className="container">
          <div className="section-head">
            <h2>{t(`${p}.faqTitle`)}</h2>
            <p>{t(`${p}.faqDesc`)}</p>
          </div>
          <div className="faq-list">
            {faq.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>{t(`${p}.ctaTitle`)}</h2>
            <p>{t(`${p}.ctaDesc`)}</p>
          </div>
          <a className="light-btn" href="/#quote">
            {t(`${p}.ctaButton`)}
          </a>
        </div>
      </section>
    </main>
  )
}
