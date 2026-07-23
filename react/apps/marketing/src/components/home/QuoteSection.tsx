import { useTranslation } from 'react-i18next'

type Feature = { strong: string; span: string }

export default function QuoteSection() {
  const { t } = useTranslation()
  const features = t('quote.features', { returnObjects: true }) as Feature[]

  return (
    <section className="quote-section" id="quote">
      <div className="container">
        <div className="quote-tabs">
          <button className="quote-tab is-active" data-quote-tab="quick" type="button">
            {t('quote.quick')}
          </button>
          <button className="quote-tab" data-quote-tab="image" type="button">
            {t('quote.image')}
          </button>
          <button className="quote-tab" data-quote-tab="text" type="button">
            {t('quote.text')}
          </button>
          <button className="quote-tab" data-quote-tab="smart" type="button">
            {t('quote.smart')}
          </button>
        </div>
        <div className="quote-box-container" data-mode="quick">
          <div className="quote-header">
            <p className="eyebrow">{t('quote.eyebrow')}</p>
            <h2>{t('quote.title')}</h2>
            <p>{t('quote.desc')}</p>
          </div>
          <div className="quote-quick-panel" data-quote-panel="quick">
            <div className="quote-upload-area">
              <div className="upload-box" id="quick-upload-box">
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                    <path
                      d="M12 3v9M6.5 6.5 12 3l5.5 3.5M4 13.5h12v2.5H4z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>{t('quote.uploadTitle')}</h3>
                <p>{t('quote.uploadDesc')}</p>
                <span className="upload-status" data-upload-status="">
                  {t('quote.uploadStatus')}
                </span>
                <input type="file" id="quote-file-input" accept=".step,.iges,.stl,.igs" multiple />
              </div>
            </div>
            <div className="quote-features">
              {features.map((f) => (
                <div className="quote-feature" key={f.strong}>
                  <strong>{f.strong}</strong>
                  <span>{f.span}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="quote-ai-showcase" data-quote-panel="ai" hidden>
            <div className="quote-ai-copy">
              <span className="quote-ai-badge" data-showcase-badge="">
                AI
              </span>
              <h3 data-showcase-title="" />
              <p data-showcase-description="" />
              <ul className="quote-ai-benefits" data-showcase-benefits="" />
              <button className="btn btn-primary quote-ai-launch" type="button" data-open-quote-ai="">
                AI
              </button>
            </div>
            <div className="quote-ai-visual">
              <div className="quote-ai-demo-window">
                <div className="quote-ai-demo-head">
                  <i />
                  <i />
                  <i />
                  <span data-showcase-window-label="">AI</span>
                </div>
                <div className="quote-ai-prompt" data-showcase-prompt="" />
                <div className="quote-ai-output" data-showcase-output="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
