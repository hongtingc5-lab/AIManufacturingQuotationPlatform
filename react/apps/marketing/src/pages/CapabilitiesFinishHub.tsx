import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../i18n/LocaleContext'

const FILTERS = [
  { key: 'all', strongZh: '全部工艺', spanZh: '查看所有表面处理', strongEn: 'All finishes', spanEn: 'Browse all options' },
  { key: 'appearance', strongZh: '外观与颜色', spanZh: '阳极、喷涂、抛光', strongEn: 'Appearance', spanEn: 'Anodize, paint, polish' },
  { key: 'corrosion', strongZh: '防腐耐蚀', spanZh: '阳极、电镀、钝化', strongEn: 'Corrosion', spanEn: 'Anodize, plate, passivate' },
  { key: 'wear', strongZh: '耐磨硬化', spanZh: '硬质阳极、电镀、热处理', strongEn: 'Wear', spanEn: 'Hardcoat, plate, heat treat' },
  { key: 'marking', strongZh: '标识追溯', spanZh: '激光打标', strongEn: 'Marking', spanEn: 'Laser marking' },
  { key: 'clean', strongZh: '清洁稳定', spanZh: '钝化、抛光', strongEn: 'Cleanliness', spanEn: 'Passivate, polish' },
] as const

type FinishCard = {
  id: string
  tags?: string[]
  groups?: string[]
  img: string
  href: string
  title?: string
  h3?: string
  body?: string
  p?: string
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

/** /capabilities/finish hub — cards from 营销页（已核对） */
export default function CapabilitiesFinishHub() {
  const { t, i18n } = useTranslation()
  const { isEnglish } = useLocale()
  const [filter, setFilter] = useState('all')
  const p = 'pages.capabilitiesFinish'

  const cards = (t(`${p}.cards`, { returnObjects: true }) as FinishCard[]) || []
  const heroStats = (t(`${p}.heroStats`, { returnObjects: true }) as Array<{ value: string; label: string }>) || []
  const faq = t(`${p}.faq`, { returnObjects: true }) as {
    title: string
    desc: string
    items: Array<{ q: string; a: string }>
  }

  const visible = useMemo(
    () =>
      cards.filter((c) => {
        const tags = c.tags?.length ? c.tags : c.groups || []
        return filter === 'all' || tags.includes(filter)
      }),
    [filter, cards],
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
      <section className="page-hero finish">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>{t(`${p}.heroTitle`)}</h1>
            <p>{t(`${p}.heroDesc`)}</p>
            <div className="hero-stats">
              {heroStats.map((s) => (
                <div className="hero-stat" key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section soft finish-directory">
        <div className="container">
          <div className="section-head">
            <h2>{t(`${p}.sectionTitle`)}</h2>
            <p>{t(`${p}.sectionDesc`)}</p>
          </div>
          <div className="finish-content-layout">
            <aside className="finish-filter-panel">
              <h3>{isEnglish ? 'Filter by goal' : '按处理目标筛选'}</h3>
              <div className="finish-filter-list">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`finish-filter-button${filter === f.key ? ' active' : ''}`}
                    data-finish-filter={f.key}
                    onClick={() => setFilter(f.key)}
                  >
                    <strong>{isEnglish ? f.strongEn : f.strongZh}</strong>
                    <span>{isEnglish ? f.spanEn : f.spanZh}</span>
                  </button>
                ))}
              </div>
            </aside>
            <div className="card-grid">
              {visible.map((card) => {
                const title = card.title || card.h3 || ''
                const body = card.body || card.p || ''
                return (
                  <article className="process-card finish-card" id={card.id} key={card.id}>
                    <img src={card.img} alt={title} />
                    <div className="card-body">
                      <h3>{title}</h3>
                      <p>{body}</p>
                      <Link className="text-link" to={card.href}>
                        {isEnglish ? 'Learn more' : '了解更多'} <ArrowIcon />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

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

      <section className="cta-band finish-cta">
        <div className="container cta-inner">
          <div>
            <h2>{t(`${p}.ctaTitle`)}</h2>
            <p>{t(`${p}.ctaDesc`)}</p>
          </div>
          <a className="light-btn" href="/quote#quote-upload">
            {t(`${p}.ctaButton`)}
          </a>
        </div>
      </section>
    </main>
  )
}
