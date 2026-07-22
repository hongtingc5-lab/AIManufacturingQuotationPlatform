import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../i18n/LocaleContext'
import '../styles/global.css'

const HERO_STAT_VALUES = ['10+', '200+', '50+', '99.8%'] as const

const FILTERS = [
  { key: 'all', href: '#all' },
  { key: 'precision', href: '#all' },
  { key: 'sheet', href: '#all' },
  { key: 'molding', href: '#all' },
  { key: 'additive', href: '#all' },
] as const

const CARDS = [
  {
    id: 'sheet-metal',
    group: 'sheet',
    img: '/precision/sheet-metal-fabrication.png',
    href: '/capabilities/process/sheet-metal',
  },
  {
    id: 'injection-molding',
    group: 'molding',
    img: '/precision/injection-molding.png',
    href: '/capabilities/process/injection',
  },
  {
    id: 'cnc-machining',
    group: 'precision',
    img: '/precision/cnc-machining.png',
    href: '/capabilities/process/cnc',
  },
  {
    id: 'urethane-casting',
    group: 'molding',
    img: '/precision/urethane-casting.png',
    href: '/capabilities/process/polyurethane',
  },
  {
    id: 'laser-cutting',
    group: 'sheet',
    img: '/precision/laser-cutting.png',
    href: '/capabilities/process/laser',
  },
  {
    id: 'complex-parts',
    group: 'precision',
    img: '/precision/factory-floor3.png',
    href: '/capabilities/process/special',
  },
  {
    id: 'micro-nano-3d-printing',
    group: 'additive',
    img: '/precision/3dprint.png',
    href: '/capabilities/process/micro-3d',
  },
  {
    id: 'metal-3d-printing',
    group: 'additive',
    img: '/precision/3dprint.png',
    href: '/capabilities/process/metal-3d',
  },
] as const

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** /capabilities process hub — React + pages.capabilities JSON */
export default function CapabilitiesHub() {
  const { t, i18n } = useTranslation()
  const { isEnglish } = useLocale()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')
  const p = 'pages.capabilities'

  const filters = t(`${p}.filters`, { returnObjects: true }) as Array<{ strong: string; span: string }>
  const cards = t(`${p}.cards`, { returnObjects: true }) as Array<{ h3: string; p: string }>
  const stats = t(`${p}.heroStats`, { returnObjects: true }) as string[]
  const faq = t(`${p}.faq`, { returnObjects: true }) as Array<{ q: string; a: string }>

  const visibleCount = useMemo(
    () => CARDS.filter((c) => filter === 'all' || c.group === filter).length,
    [filter],
  )

  useEffect(() => {
    document.title = t(`${p}.docTitle`)
    document.documentElement.lang = isEnglish ? 'en' : 'zh-CN'
    document.body.classList.remove('is-home')
    document.body.classList.add('capability-hub-page', 'is-static-page')
    document.body.classList.toggle('is-en', isEnglish)
    return () => {
      document.body.classList.remove('capability-hub-page')
    }
  }, [t, i18n.language, isEnglish, p])

  return (
    <main>
      <section className="page-hero process">
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

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{t(`${p}.sectionTitle`)}</h2>
            <p>{t(`${p}.sectionDesc`)}</p>
          </div>
          <div className="content-layout">
            <aside className="side-menu process-selector" aria-label={t(`${p}.filterTitle`)}>
              <b className="process-selector-title">{t(`${p}.filterTitle`)}</b>
              {FILTERS.map((f, i) => (
                <a
                  key={f.key}
                  href={f.href}
                  className={filter === f.key ? 'active' : undefined}
                  data-process-filter={f.key}
                  onClick={(e) => {
                    e.preventDefault()
                    setFilter(f.key)
                  }}
                >
                  <strong>{filters[i]?.strong}</strong>
                  <span>{filters[i]?.span}</span>
                </a>
              ))}
              <div className="process-filter-note">
                <strong>{t(`${p}.tipTitle`)}</strong>
                <span>{t(`${p}.tipBody`)}</span>
              </div>
            </aside>
            <div className="card-grid" id="all">
              {CARDS.map((meta, i) => {
                const hidden = filter !== 'all' && meta.group !== filter
                return (
                  <article
                    key={meta.id}
                    className={`feature-card${hidden ? ' is-filtered' : ''}`}
                    id={meta.id}
                    data-process-group={meta.group}
                    hidden={hidden}
                  >
                    <img src={meta.img} alt={cards[i]?.h3} />
                    <div className="card-body">
                      <h3>{cards[i]?.h3}</h3>
                      <p>{cards[i]?.p}</p>
                      <Link className="text-link" to={meta.href}>
                        {t(`${p}.learnMore`)}
                        <ArrowIcon />
                      </Link>
                    </div>
                  </article>
                )
              })}
              <p className="process-filter-empty" hidden={visibleCount > 0}>
                {t(`${p}.empty`)}
              </p>
            </div>
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
