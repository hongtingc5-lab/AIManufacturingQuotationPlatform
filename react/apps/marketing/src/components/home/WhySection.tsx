import { useTranslation } from 'react-i18next'

type Reason = { strong: string; span: string }

const METRIC_VALUES = ['99.8%', '0.01%', '30%', '24h']

export default function WhySection() {
  const { t } = useTranslation()
  const tags = t('why.tags', { returnObjects: true }) as string[]
  const reasons = t('why.reasons', { returnObjects: true }) as Reason[]
  const metrics = t('why.metrics', { returnObjects: true }) as string[]

  return (
    <section className="why-scroll-section" id="why-us" aria-label={t('why.intro')}>
      <div className="why-scroll-viewport">
        <div className="why-intro" aria-hidden="true">
          <h1>{t('why.intro')}</h1>
        </div>
        <div className="why-image-mask">
          <img src="/precision/process.png" alt={t('why.imageTitle')} />
          <div className="why-image-copy">
            <h2>{t('why.imageTitle')}</h2>
            <p>{t('why.imageDesc')}</p>
            <div className="why-image-tags" aria-label={t('why.intro')}>
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="why-final-panel">
          <div className="why-final-content">
            <div className="why-final-head">
              <p className="eyebrow">{t('why.finalEyebrow')}</p>
              <h2>{t('why.finalTitle')}</h2>
              <p>{t('why.finalDesc')}</p>
            </div>
            <div className="why-reason-grid">
              {reasons.map((r) => (
                <div className="why-reason" key={r.strong}>
                  <strong>{r.strong}</strong>
                  <span>{r.span}</span>
                </div>
              ))}
            </div>
            <div className="why-final-bottom">
              <div className="why-metrics" aria-label={t('why.intro')}>
                {metrics.map((label, i) => (
                  <div className="why-metric" key={label}>
                    <strong>{METRIC_VALUES[i]}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <div className="why-final-actions">
                <a className="btn btn-primary" href="#quote">
                  {t('common.quote')}
                </a>
                <a className="btn btn-secondary" href="/industries">
                  {t('why.secondary')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
