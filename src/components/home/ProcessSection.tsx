import { useTranslation } from 'react-i18next'

const STEP_ICONS = ['↑', 'AI', '¥', 'CNC', '✓', '▣', '⌖']
const STATUS_TAGS = ['READY', 'TRACK', 'TRACE']

type Step = { h4: string; p: string }

export default function ProcessSection() {
  const { t } = useTranslation()
  const status = t('process.status', { returnObjects: true }) as string[]
  const steps = t('process.steps', { returnObjects: true }) as Step[]

  return (
    <section className="section-block process-band" id="process">
      <div className="container">
        <div className="process-shell">
          <div className="process-head">
            <div>
              <p className="eyebrow">{t('process.eyebrow')}</p>
              <h2 className="section-title">{t('process.title')}</h2>
            </div>
          </div>
          <div className="process-board" aria-label={t('process.eyebrow')}>
            <div className="process-visual">
              <div className="process-visual-top">
                <strong>{t('process.board')}</strong>
                <span>LIVE FLOW</span>
              </div>
              <div className="process-photo">
                <img src="/precision/manufacturing-process-flow.png" alt={t('process.eyebrow')} loading="lazy" />
                <div className="process-photo-mark">
                  <div>
                    <span>PROCESS</span>
                    <strong>{t('process.mark')}</strong>
                  </div>
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
                    <path
                      d="M4 16.5V7.5L12 3l8 4.5v9L12 21l-8-4.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path d="M4.5 7.8 12 12l7.5-4.2M12 12v8.5" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>
              <div className="process-status">
                {status.map((label, i) => (
                  <div className="process-status-row" key={label}>
                    <strong>{label}</strong>
                    <span>{STATUS_TAGS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="process-map">
              <div className="process-map-head">
                <h3>{t('process.mapHead')}</h3>
                <span>STEP 01—07</span>
              </div>
              <div className="process-step-grid">
                {steps.map((step, i) => (
                  <article className="process-step-card" key={step.h4}>
                    <span className="process-step-tag">STEP {i + 1}</span>
                    <strong className="process-step-number">{String(i + 1).padStart(2, '0')}</strong>
                    <span className="process-step-icon">{STEP_ICONS[i]}</span>
                    <h4>{step.h4}</h4>
                    <p>{step.p}</p>
                  </article>
                ))}
              </div>
              <div className="section-quote-cta">
                <a className="btn btn-primary" href="#quote">
                  {t('common.quote')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
