import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../i18n/LocaleContext'

const CARDS = [
  {
    id: 'aluminum',
    tags: ['lightweight', 'corrosion', 'finishing', 'strength'],
    img: '/precision/product-flange.jpg',
    href: '/capabilities/material/aluminum',
  },
  {
    id: 'stainless',
    tags: ['corrosion', 'strength', 'finishing'],
    img: '/precision/product-shaft.jpg',
    href: '/capabilities/material/stainless',
  },
  {
    id: 'carbon',
    tags: ['strength', 'finishing'],
    img: '/precision/product-bracket.jpg',
    href: '/capabilities/material/carbon',
  },
  {
    id: 'copper',
    tags: ['conductive', 'corrosion'],
    img: '/precision/cnc-turned-part-02.png',
    href: '/capabilities/material/copper',
  },
  {
    id: 'plastic',
    tags: ['lightweight', 'insulation'],
    img: '/precision/urethane-casting.png',
    href: '/capabilities/material/plastic',
  },
  {
    id: 'titanium',
    tags: ['lightweight', 'strength', 'corrosion'],
    img: '/precision/factory-floor3.png',
    href: '/capabilities/material/titanium',
  },
  {
    id: 'composite',
    tags: ['lightweight', 'strength', 'insulation'],
    img: '/precision/manufacturing-service.png',
    href: '/capabilities/material/composite',
  },
] as const

/** Icons from 营销页（已核对）材料部分.html */
const CHIP_ICONS: Record<string, ReactNode> = {
  all: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 4h5v5H4V4Zm7 0h5v5h-5V4ZM4 11h5v5H4v-5Zm7 0h5v5h-5v-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  lightweight: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3v14M6 7l4-4 4 4M5 15h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  corrosion: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3s5 4.3 5 8.3a5 5 0 1 1-10 0C5 7.3 10 3 10 3Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  conductive: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m11 2-6 10h5l-1 6 6-10h-5l1-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  strength: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5h10v10H5V5Z" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M2.8 10h14.4M10 2.8v14.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  insulation: (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 4h10v12H5V4Z" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 7v6M12 7v6M5 10h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
}

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

/** /capabilities/material hub — structure/style from 营销页（已核对） */
export default function CapabilitiesMaterialHub() {
  const { t, i18n } = useTranslation()
  const { isEnglish } = useLocale()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const p = 'pages.capabilitiesMaterial'

  const chips = (t(`${p}.chips`, { returnObjects: true }) as Array<{ key: string; label: string }>) || []
  const cards = (t(`${p}.cards`, { returnObjects: true }) as Array<{
    id: string
    title: string
    grades: string
    body: string
  }>) || []
  const heroStats = (t(`${p}.heroStats`, { returnObjects: true }) as Array<{ value: string; label: string }>) || []
  const faq = t(`${p}.faq`, { returnObjects: true }) as {
    title: string
    desc: string
    items: Array<{ q: string; a: string }>
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CARDS.map((c, i) => ({ ...c, copy: cards[i] })).filter((c) => {
      if (filter !== 'all' && !c.tags.includes(filter as never)) return false
      if (!q) return true
      const hay = `${c.copy?.title || ''} ${c.copy?.grades || ''} ${c.copy?.body || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [filter, query, cards])

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
      <section className="page-hero material">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>{t(`${p}.heroTitle`)}</h1>
            <p>{t(`${p}.heroDesc`)}</p>
            {heroStats.length > 0 && (
              <div className="hero-stats">
                {heroStats.map((s) => (
                  <div className="hero-stat" key={s.label}>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
            <label className="hero-search">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(`${p}.searchPlaceholder`)}
                data-material-search="true"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <h2>{t(`${p}.sectionTitle`)}</h2>
            <p>{t(`${p}.sectionDesc`)}</p>
          </div>
          <div className="material-filter-panel" aria-label={t(`${p}.filterAria`)}>
            <div className="material-filter-copy">
              <span>{t(`${p}.filterEyebrow`)}</span>
              <strong>{t(`${p}.filterTitle`)}</strong>
            </div>
            <div className="material-filter-controls">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  className={`material-filter-chip${filter === chip.key ? ' active' : ''}`}
                  data-material-filter={chip.key}
                  onClick={() => setFilter(chip.key)}
                >
                  <span className="material-filter-chip-icon">{CHIP_ICONS[chip.key]}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="material-grid" data-material-grid>
            {visible.map((card) => (
              <article className="material-card" id={card.id} key={card.id}>
                <div className="card-body">
                  <h3>{card.copy?.title}</h3>
                  <p>{card.copy?.grades}</p>
                  <small>{card.copy?.body}</small>
                  <Link className="text-link" to={card.href}>
                    {isEnglish ? 'Learn more' : '了解更多'}
                    <ArrowIcon />
                  </Link>
                </div>
                <img src={card.img} alt={card.copy?.title || ''} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ → CTA → footer；与工艺入口一致，勿把 CTA 夹在 FAQ 前面 */}
      <section className="section geo-faq-section" data-geo-faq="true">
        <div className="container">
          <div className="section-head">
            <h2>{faq?.title}</h2>
            <p>{faq?.desc}</p>
          </div>
          <div className="faq-list">
            {faq?.items?.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band material-cta">
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
