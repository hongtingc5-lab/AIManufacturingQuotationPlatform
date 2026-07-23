import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../i18n/LocaleContext'
import { isCapabilityDetail, type CapabilityCategory } from '../i18n/capabilityLocales'
import registry from '../data/capabilities/registry.json'

type Stat = { value: string; label: string }
type Panel = { title: string; subtitle?: string; body: string }
type Step = { index: string; title: string; body: string }
type AsideItem = { label: string; value: string }
type RelatedItem = { img?: string; title: string; body: string; href: string; link: string }
type FaqItem = { q: string; a: string }

const PARENT_LABEL: Record<CapabilityCategory, { zh: string; en: string }> = {
  process: { zh: '工艺', en: 'Processes' },
  service: { zh: '服务', en: 'Services' },
  finish: { zh: '表面处理', en: 'Finishes' },
  material: { zh: '材料', en: 'Materials' },
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

/** Shared detail page for /capabilities/{process|service|finish|material}/:slug */
export default function CapabilityDetailPage() {
  const { category = '', slug = '' } = useParams()
  const { t, i18n } = useTranslation()
  const { isEnglish } = useLocale()
  const valid = isCapabilityDetail(category, slug)
  const cat = (valid ? category : 'process') as CapabilityCategory
  const sl = valid ? slug : 'cnc'

  const meta = registry.details[`${cat}/${sl}` as keyof typeof registry.details]
  const p = `pages.capDetails.${cat}.${sl}`
  const heroClass = meta?.heroClass || `detail-${cat}`
  const mediaImg = meta?.mediaImg || '/precision/service-cnc.jpg'
  const parentHref = meta?.parentHref || `/capabilities/${cat}`
  const parentLabel = isEnglish ? PARENT_LABEL[cat].en : PARENT_LABEL[cat].zh

  const heroStats = (t(`${p}.heroStats`, { returnObjects: true }) as Stat[]) || []
  const pills = (t(`${p}.pills`, { returnObjects: true }) as string[]) || []
  const panels = (t(`${p}.panels`, { returnObjects: true }) as Panel[]) || []
  const tableRows = (t(`${p}.tableRows`, { returnObjects: true }) as string[][]) || []
  const steps = (t(`${p}.steps`, { returnObjects: true }) as Step[]) || []
  const asideItems = (t(`${p}.asideItems`, { returnObjects: true }) as AsideItem[]) || []
  const related = t(`${p}.related`, { returnObjects: true }) as {
    title: string
    desc: string
    items: RelatedItem[]
  }
  const faq = t(`${p}.faq`, { returnObjects: true }) as {
    title: string
    desc: string
    items: FaqItem[]
  }
  const asideCta = t(`${p}.asideCta`, { returnObjects: true }) as {
    title: string
    body: string
    button: string
  }

  useEffect(() => {
    if (!valid) return
    document.title = t(`${p}.docTitle`)
    document.documentElement.lang = isEnglish ? 'en' : 'zh-CN'
    document.body.classList.remove('is-home')
    document.body.classList.add('capability-hub-page', 'is-static-page')
    document.body.classList.toggle('finish-detail-page', cat === 'finish')
    document.body.classList.toggle('material-detail-page', cat === 'material')
    document.body.classList.toggle('is-en', isEnglish)
    return () => {
      document.body.classList.remove('capability-hub-page', 'finish-detail-page', 'material-detail-page')
    }
  }, [t, i18n.language, isEnglish, p, cat, valid])

  if (!valid) {
    return <Navigate to="/capabilities" replace />
  }

  const tableHead = tableRows[0] || []
  const tableBody = tableRows.slice(1)

  return (
    <main>
      <section className={`page-hero ${heroClass}`}>
        <div className="container hero-inner">
          <div className="breadcrumb">
            <Link to="/">{isEnglish ? 'Home' : '首页'}</Link>
            <span>/</span>
            <Link to={parentHref}>{parentLabel}</Link>
            <span>/</span>
            <b>{t(`${p}.heroTitle`)}</b>
          </div>
          <div className="hero-copy">
            <h1>{t(`${p}.heroTitle`)}</h1>
            <p>{t(`${p}.heroDesc`)}</p>
            <div className="hero-stats">
              {heroStats.map((s) => (
                <div className="hero-stat" key={`${s.value}-${s.label}`}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="container detail-layout">
          <div className="detail-main">
            <img className="detail-media" src={mediaImg} alt={t(`${p}.heroTitle`)} />
            <div className="detail-body">
              <h2>{t(`${p}.bodyTitle`)}</h2>
              <p>{t(`${p}.bodyDesc`)}</p>
              {pills.length > 0 && (
                <div className="pill-row">
                  {pills.map((pill) => (
                    <span className="pill" key={pill}>
                      {pill}
                    </span>
                  ))}
                </div>
              )}
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
              {tableBody.length > 0 && (
                <div className="table-card">
                  <div className="table-title">
                    <h3>{t(`${p}.tableTitle`)}</h3>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          {tableHead.map((cell) => (
                            <th key={cell}>{cell}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableBody.map((row) => (
                          <tr key={row.join('|')}>
                            {row.map((cell, i) => (
                              <td key={`${i}-${cell}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {steps.length > 0 && (
                <div className="step-list">
                  {steps.map((step) => (
                    <div className="step-item" key={step.index + step.title}>
                      <b>{step.index}</b>
                      <strong>{step.title}</strong>
                      <span>{step.body}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <aside className="detail-aside">
            {asideItems.length > 0 && (
              <ul className="aside-list">
                {asideItems.map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            )}
            <div className="aside-cta">
              <h4>{asideCta?.title}</h4>
              <p>{asideCta?.body}</p>
              <a className="light-btn" href="/quote#quote-upload">
                {asideCta?.button}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {related?.items?.length > 0 && (
        <section className="section soft">
          <div className="container">
            <div className="section-head">
              <h2>{related.title}</h2>
              <p>{related.desc}</p>
            </div>
            <div className="related-grid">
              {related.items.map((item) => (
                <article className="related-card" key={item.title}>
                  {item.img ? <img src={item.img} alt={item.title} /> : null}
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <Link className="text-link" to={item.href || parentHref}>
                      {item.link || (isEnglish ? 'View details' : '查看详情')} <ArrowIcon />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {faq?.items?.length > 0 && (
        <section className="section geo-faq-section" data-geo-faq="true">
          <div className="container">
            <div className="section-head">
              <h2>{faq.title}</h2>
              <p>{faq.desc}</p>
            </div>
            <div className="faq-list">
              {faq.items.map((item) => (
                <details className="faq-item" key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
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
