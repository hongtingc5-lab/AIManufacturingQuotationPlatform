import { useTranslation } from 'react-i18next'

type CaseItem = { h3: string; p: string }
type Testimonial = { quote: string; name: string; role: string }
type Insight = { h3: string; p: string }

const CASE_META = [
  { href: '/industries/robotics', img: '/precision/Industrial_Automation.jpg' },
  { href: '/industries/medical', img: '/precision/Medical_devices.jpg' },
  { href: '/industries/aerospace', img: '/precision/Aerospace.jpg' },
  { href: '/industries/new-energy', img: '/precision/new_energy.jpg' },
] as const

const TESTIMONIAL_IMGS = [
  '/precision/Customer.png',
  '/precision/Customer1.png',
  '/precision/Customer2.jpg',
  '/precision/Customer3.png',
]

const INSIGHT_META = [
  { href: '/resources/process-guide', img: '/precision/Precision-Machining-Process-Guide.jpg' },
  { href: '/resources/material-handbook', img: '/precision/Material-Performance-Guide.jpg' },
  { href: '/resources/design-guidelines', img: '/precision/Equipment-Technology-Introduction.jpg' },
  { href: '/resources/news', img: '/precision/Industry-Trend-Analysis.jpg' },
] as const

export function CasesSection() {
  const { t } = useTranslation()
  const items = t('cases.items', { returnObjects: true }) as CaseItem[]
  return (
    <section className="section-block section-soft" id="cases">
      <div className="container split-section">
        <div>
          <p className="eyebrow">{t('cases.eyebrow')}</p>
          <h2 className="section-title">{t('cases.title')}</h2>
          <p className="section-desc">{t('cases.desc')}</p>
          <div style={{ marginTop: 28 }}>
            <a className="btn btn-primary" href="#quote">
              {t('common.quote')}
            </a>
          </div>
        </div>
        <div className="card-grid">
          {items.map((item, i) => (
            <article
              key={CASE_META[i].href}
              className="case-card"
              data-card-link={CASE_META[i].href}
              role="link"
              tabIndex={0}
            >
              <img src={CASE_META[i].img} alt={item.h3} loading="lazy" />
              <div className="case-body">
                <h3>{item.h3}</h3>
                <p>{item.p}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  const { t } = useTranslation()
  const items = t('testimonials.items', { returnObjects: true }) as Testimonial[]
  return (
    <section className="section-block" id="testimonials">
      <div className="container">
        <div className="case-section-head">
          <div>
            <p className="eyebrow">{t('testimonials.eyebrow')}</p>
            <h2 className="section-title">{t('testimonials.title')}</h2>
          </div>
        </div>
        <div className="testimonial-carousel" data-testimonial-carousel="">
          <button
            className="testimonial-nav testimonial-nav--prev"
            type="button"
            data-testimonial-prev=""
            aria-label="prev"
          >
            ←
          </button>
          <div className="testimonial-stage" aria-live="polite">
            {items.map((item, i) => (
              <article
                key={item.name}
                className={`testimonial-slide${i === 0 ? ' is-active' : ''}`}
                data-testimonial-slide=""
                aria-hidden={i !== 0}
              >
                <div className="testimonial-media">
                  <img src={TESTIMONIAL_IMGS[i]} alt={item.name} loading="lazy" />
                </div>
                <div className="testimonial-card">
                  <span className="testimonial-mark">“</span>
                  <p>{item.quote}</p>
                  <div className="testimonial-meta">
                    <div className="testimonial-stars" aria-label="5 stars">
                      ★★★★★
                    </div>
                    <div className="testimonial-author">
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <button
            className="testimonial-nav testimonial-nav--next"
            type="button"
            data-testimonial-next=""
            aria-label="next"
          >
            →
          </button>
          <div className="testimonial-dots" role="tablist">
            {items.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot${i === 0 ? ' is-active' : ''}`}
                type="button"
                data-testimonial-dot=""
                aria-current={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Insights() {
  const { t } = useTranslation()
  const items = t('insights.items', { returnObjects: true }) as Insight[]
  const metas = t('insights.metas', { returnObjects: true }) as string[][]
  return (
    <section className="section-block section-soft" id="insights">
      <div className="container insight-layout">
        <div>
          <p className="eyebrow">{t('insights.eyebrow')}</p>
          <h2 className="section-title">{t('insights.title')}</h2>
          <p className="section-desc">{t('insights.desc')}</p>
          <div style={{ marginTop: 28 }}>
            <a className="btn btn-primary" href="#quote">
              {t('common.quote')}
            </a>
          </div>
        </div>
        <div className="insight-grid">
          {items.map((item, i) => (
            <article
              key={INSIGHT_META[i].href}
              className="insight-card"
              data-card-link={INSIGHT_META[i].href}
              role="link"
              tabIndex={0}
            >
              <img src={INSIGHT_META[i].img} alt={item.h3} loading="lazy" />
              <div className="insight-body">
                <h3>{item.h3}</h3>
                <p>{item.p}</p>
                <div className="insight-meta">
                  <span>{metas[i]?.[0]}</span>
                  <a className="insight-entry" href={INSIGHT_META[i].href}>
                    {t('insights.readMore')}
                  </a>
                  <span>{metas[i]?.[1]}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const { t } = useTranslation()
  const items = [1, 2, 3, 4, 5].map((n) => ({
    q: t(`faq.q${n}`),
    a: t(`faq.a${n}`),
  }))
  return (
    <section className="section-block home-faq" id="faq" data-geo-faq="true">
      <div className="container home-faq-layout">
        <div className="home-faq-copy">
          <div className="home-faq-title-row">
            <h2 className="home-faq-title">
              <span className="home-faq-title-brand">{t('faq.brand')}</span>
              <span className="home-faq-title-main">{t('faq.title')}</span>
            </h2>
            <span className="home-faq-title-accent" aria-hidden="true" />
          </div>
        </div>
        <span className="home-faq-connector" aria-hidden="true" />
        <div className="home-faq-list">
          {items.map((item) => (
            <article className="home-faq-item" key={item.q}>
              <button className="home-faq-question" type="button" aria-expanded="false">
                {item.q}
              </button>
              <div className="home-faq-answer" role="region">
                <div className="home-faq-answer-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CtaBand() {
  const { t } = useTranslation()
  return (
    <section className="cta-band" id="contact">
      <div className="container cta-row">
        <div>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.desc')}</p>
        </div>
        <a className="btn btn-light" href="#quote">
          {t('cta.button')}
        </a>
      </div>
    </section>
  )
}
