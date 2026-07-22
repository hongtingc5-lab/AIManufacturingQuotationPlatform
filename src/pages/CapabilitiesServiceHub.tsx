import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../i18n/LocaleContext'

type ServiceCard = {
  id: string
  groups?: string[]
  tags?: string[]
  img: string
  href: string
  h3?: string
  title?: string
  p?: string
  body?: string
  link?: string
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

/** /capabilities/service hub — cards/filters from 营销页（已核对） */
export default function CapabilitiesServiceHub() {
  const { t, i18n } = useTranslation()
  const { isEnglish } = useLocale()
  const [filter, setFilter] = useState('all')
  const p = 'pages.capabilitiesService'

  const filters = (t(`${p}.filters`, { returnObjects: true }) as Array<{
    key: string
    strong: string
    span: string
  }>) || []
  const cards = (t(`${p}.cards`, { returnObjects: true }) as ServiceCard[]) || []
  const heroStats = (t(`${p}.heroStats`, { returnObjects: true }) as Array<{ value: string; label: string }>) || []
  const panels = (t(`${p}.panels`, { returnObjects: true }) as Array<{ title: string; body: string; subtitle?: string }>) || []
  const steps = (t(`${p}.steps`, { returnObjects: true }) as Array<{ index: string; title: string; body: string }>) || []
  const faq = t(`${p}.faq`, { returnObjects: true }) as { title: string; desc: string; items: Array<{ q: string; a: string }> }
  const softTitle = t(`${p}.softTitle`, { defaultValue: '' })
  const softDesc = t(`${p}.softDesc`, { defaultValue: '' })

  const visible = useMemo(
    () =>
      cards.filter((c) => {
        const groups = c.groups?.length ? c.groups : c.tags || []
        return filter === 'all' || groups.includes(filter)
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

  const showSoft = Boolean(softTitle) && (panels.length > 0 || steps.length > 0)

  return (
    <main>
      <section className="page-hero service">
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

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{t(`${p}.sectionTitle`)}</h2>
            <p>{t(`${p}.sectionDesc`)}</p>
          </div>
          <div className="content-layout">
            <aside className="side-menu process-selector service-selector" aria-label={t(`${p}.filterTitle`)}>
              <b className="process-selector-title">{t(`${p}.filterTitle`)}</b>
              {filters.map((f) => (
                <a
                  key={`${f.key}-${f.strong}`}
                  href={`#${f.key}`}
                  className={filter === f.key ? 'active' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    setFilter(f.key)
                  }}
                >
                  <strong>{f.strong}</strong>
                  <span>{f.span}</span>
                </a>
              ))}
              <div className="process-filter-note">
                <strong>{t(`${p}.tipTitle`)}</strong>
                <span>{t(`${p}.tipBody`)}</span>
              </div>
            </aside>
            <div className="card-grid" id="all">
              {visible.map((card) => {
                const title = card.h3 || card.title || ''
                const body = card.p || card.body || ''
                return (
                  <article className="feature-card" id={card.id} key={card.id}>
                    <img src={card.img} alt={title} />
                    <div className="card-body">
                      <h3>{title}</h3>
                      <p>{body}</p>
                      <Link className="text-link" to={card.href}>
                        {card.link || (isEnglish ? 'View service' : '查看服务')} <ArrowIcon />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {showSoft && (
        <section className="section soft">
          <div className="container">
            <div className="section-head">
              <h2>{softTitle}</h2>
              <p>{softDesc}</p>
            </div>
            {panels.length > 0 && (
              <div className="info-grid">
                {panels.map((panel) => (
                  <div className="info-panel" key={panel.title}>
                    <h3>{panel.title}</h3>
                    {panel.subtitle ? <strong>{panel.subtitle}</strong> : null}
                    <span>{panel.body}</span>
                  </div>
                ))}
              </div>
            )}
            {steps.length > 0 && (
              <div className="step-list">
                {steps.map((step) => (
                  <div className="step-item" key={step.index}>
                    <b>{step.index}</b>
                    <strong>{step.title}</strong>
                    <span>{step.body}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

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
