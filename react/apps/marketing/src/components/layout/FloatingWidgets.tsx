import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type Module = { span: string; small: string }

/** AI / support / back-top — class names match homeInteractions.js */
export default function FloatingWidgets() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  /** /quote already has upload + chat entry — hide the smart-quote FAB/panel */
  const hideSmartQuoteFab = pathname === '/quote' || pathname.startsWith('/quote/')
  const modules = t('ai.modules', { returnObjects: true }) as Module[]
  const processLabels = t('ai.processLabels', { returnObjects: true }) as string[]
  const processValues = t('ai.processValues', { returnObjects: true }) as string[]
  const quoteLabels = t('ai.quoteLabels', { returnObjects: true }) as string[]
  const quoteValues = t('ai.quoteValues', { returnObjects: true }) as string[]
  const imageLabels = t('ai.imageLabels', { returnObjects: true }) as string[]
  const imageValues = t('ai.imageValues', { returnObjects: true }) as string[]
  const textLabels = t('ai.textLabels', { returnObjects: true }) as string[]
  const textValues = t('ai.textValues', { returnObjects: true }) as string[]
  const dfmLabels = t('ai.dfmLabels', { returnObjects: true }) as string[]
  const dfmValues = t('ai.dfmValues', { returnObjects: true }) as string[]
  const moduleKeys = ['process', 'quote', 'image', 'text', 'dfm'] as const

  return (
    <>
      <div className="floating-support is-collapsed" aria-label={t('ai.aria.supportPanel')}>
        <div className="support-bubble-hint">{t('ai.supportHint')}</div>
        <div className="support-card" id="support-chat-window">
          <div className="support-head">
            <span className="support-avatar" aria-hidden="true">
              赵
            </span>
            <div className="support-title">
              <strong>{t('ai.supportTitle')}</strong>
              <span>{t('ai.supportSub')}</span>
            </div>
            <button className="support-close" id="support-close-btn" type="button" aria-label={t('ai.aria.supportClose')}>
              ×
            </button>
          </div>
          <p className="support-tip">{t('ai.supportTip')}</p>
          <div className="support-input">
            <input type="text" placeholder={t('ai.supportPlaceholder')} aria-label={t('ai.aria.supportInput')} />
            <button className="support-send" type="button" aria-label={t('ai.aria.supportSend')}>
              →
            </button>
          </div>
        </div>
        <button
          className="support-fab"
          id="support-toggle-btn"
          type="button"
          aria-label={t('ai.aria.supportOpen')}
          aria-expanded="false"
        >
          <svg id="support-toggle-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
            <path d="M5 6.5h14v9H9l-4 3v-12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M9 10h6M9 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {!hideSmartQuoteFab && (
        <div className="floating-ai is-collapsed" aria-label={t('ai.aria.aiPanel')}>
          <div className="ai-bubble-hint">{t('ai.hint')}</div>
          <div className="ai-panel" id="ai-chat-window" data-guest-quota="3">
            <div className="ai-head">
              <div className="ai-head-left">
                <span className="support-avatar" aria-hidden="true">
                  AI
                </span>
                <div className="ai-title">
                  <strong>{t('ai.title')}</strong>
                  <span className="ai-status">{t('ai.status')}</span>
                </div>
              </div>
              <button className="ai-close" id="close-chat" type="button" aria-label={t('ai.aria.aiClose')}>
                ×
              </button>
            </div>

            <div className="ai-module-tabs" role="tablist" aria-label={t('ai.aria.aiModules')}>
              {modules.map((m, i) => (
                <button
                  key={moduleKeys[i]}
                  className={`ai-module-tab${i === 0 ? ' is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={i === 0}
                  data-ai-module={moduleKeys[i]}
                >
                  <span>{m.span}</span>
                  <small>{m.small}</small>
                </button>
              ))}
            </div>

            <div className="ai-context-strip">
              <span>{t('ai.contextIndependent')}</span>
              <strong data-ai-context-label="">{t('ai.contextLabel')}</strong>
              <em data-ai-quota-text="">{t('ai.quotaText')}</em>
            </div>

            <div className="ai-thread is-active" data-ai-thread="process" role="tabpanel">
              <div className="ai-messages">
                <div className="ai-message bot">
                  <span className="support-avatar" aria-hidden="true">
                    AI
                  </span>
                  <div className="ai-bubble">{t('ai.processIntro')}</div>
                </div>
                <div className="ai-message user">
                  <div className="ai-bubble">{t('ai.processUser')}</div>
                </div>
                <div className="ai-message bot">
                  <span className="support-avatar" aria-hidden="true">
                    AI
                  </span>
                  <div className="ai-analysis-card">
                    <div className="ai-file">Gear_Housing_v2.step</div>
                    <div className="ai-model-preview">
                      <img src="/precision/upload-model.jpg" alt="" loading="lazy" />
                    </div>
                    <div className="ai-analysis-grid">
                      {processLabels.map((label, i) => (
                        <div key={label}>
                          <span>{label}</span>
                          <strong>{processValues[i]}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(
              [
                ['quote', 'ai.quoteIntro', 'ai.quoteCardTitle', quoteLabels, quoteValues, 'ai.quoteNote'],
                ['image', 'ai.imageIntro', 'ai.imageCardTitle', imageLabels, imageValues, 'ai.imageNote'],
                ['text', 'ai.textIntro', 'ai.textCardTitle', textLabels, textValues, 'ai.textNote'],
                ['dfm', 'ai.dfmIntro', 'ai.dfmCardTitle', dfmLabels, dfmValues, 'ai.dfmNote'],
              ] as const
            ).map(([key, intro, title, labels, values, note]) => (
              <div key={key} className="ai-thread" data-ai-thread={key} role="tabpanel" hidden>
                <div className="ai-messages">
                  <div className="ai-message bot">
                    <span className="support-avatar" aria-hidden="true">
                      AI
                    </span>
                    <div className="ai-bubble">{t(intro)}</div>
                  </div>
                  <div className="ai-message bot">
                    <span className="support-avatar" aria-hidden="true">
                      AI
                    </span>
                    <div className="ai-generated-card">
                      <h4>{t(title)}</h4>
                      <div className="ai-result-grid">
                        {labels.map((label, i) => (
                          <div key={label}>
                            <span>{label}</span>
                            <strong>{values[i]}</strong>
                          </div>
                        ))}
                      </div>
                      <p>{t(note)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="ai-input-shell">
              <div className="ai-login-overlay">
                <strong>{t('ai.loginTitle')}</strong>
                <span>{t('ai.loginDesc')}</span>
                <a className="btn btn-primary" href="#contact">
                  {t('ai.loginCta')}
                </a>
              </div>
              <div className="ai-input-row">
                <input type="text" placeholder={t('ai.aiPlaceholder')} aria-label={t('ai.aria.aiInput')} />
                <button className="ai-send" type="button" aria-label={t('ai.aria.aiSend')}>
                  →
                </button>
              </div>
            </div>
          </div>
          <button className="ai-fab" id="ai-toggle-btn" type="button" aria-label={t('ai.aria.aiOpen')}>
            <svg id="toggle-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path
                d="M12 3.5 13.8 9l5.7 1.2-5.7 1.2L12 17l-1.8-5.6-5.7-1.2L10.2 9 12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      <a className="back-top" href="#top" aria-label={t('ai.aria.backTop')}>
        ↑
      </a>
    </>
  )
}
