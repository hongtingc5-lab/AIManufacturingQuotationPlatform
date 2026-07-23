import { useTranslation } from 'react-i18next'

type Caption = { span: string; strong: string }

const FACTORY_CARDS = [
  { img: '/precision/precision-machining-floor.png', href: '/about' },
  { img: '/precision/standardized-warehouse-flow.png', href: '/about' },
  { img: '/precision/stable-delivery-cadence.png', href: '/about' },
  { img: '/precision/end-to-end-quality-tracking.png', href: '/about' },
] as const

const CAP_HREFS = [
  '/capabilities/process/sheet-metal',
  '/capabilities/process/injection',
  '/capabilities/process/cnc',
  '/capabilities/process/polyurethane',
  '/capabilities/process/laser',
  '/capabilities/process/special',
  '/capabilities/process/micro-3d',
  '/capabilities/process/metal-3d',
]
const CAP_IMGS = [
  '/precision/sheet-metal-fabrication.png',
  '/precision/injection-molding.png',
  '/precision/cnc-machining.png',
  '/precision/urethane-casting.png',
  '/precision/laser-cutting.png',
  '/precision/factory-floor3.png',
  '/precision/3dprint.png',
  '/precision/3dprint.png',
]
const DECK_CLASS = ['is-active', 'is-next', 'is-third', 'is-fourth', 'is-fifth', '', '', '']

type CapCard = { span: string; strong: string; p: string }

export function FactorySection() {
  const { t } = useTranslation()
  const captions = t('factory.captions', { returnObjects: true }) as Caption[]
  return (
    <section className="section-block factory-dark-section" id="about">
      <div className="container factory-layout">
        <div className="factory-image-large">
          {FACTORY_CARDS.map((c, i) => (
            <div
              key={c.img}
              className="factory-visual-card"
              data-card-link={c.href}
              role="link"
              tabIndex={0}
            >
              <img src={c.img} alt={captions[i]?.strong} loading="lazy" />
              <div className="factory-visual-caption">
                <span>{captions[i]?.span}</span>
                <strong>{captions[i]?.strong}</strong>
              </div>
            </div>
          ))}
        </div>
        <div className="factory-card">
          <p className="eyebrow">{t('factory.eyebrow')}</p>
          <h2 className="section-title">{t('factory.title')}</h2>
          <p className="section-desc">{t('factory.desc')}</p>
          <div style={{ marginTop: 28 }}>
            <a className="btn btn-primary" href="#quote">
              {t('common.quote')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CapabilitySection() {
  const { t } = useTranslation()
  const index = t('capability.index', { returnObjects: true }) as string[]
  const cards = t('capability.cards', { returnObjects: true }) as CapCard[]
  return (
    <section className="section-block section-soft" id="capability">
      <div className="container quality-layout">
        <div className="capability-copy">
          <p className="eyebrow">{t('capability.eyebrow')}</p>
          <h2 className="section-title">{t('capability.title')}</h2>
          <p className="section-desc">{t('capability.desc')}</p>
          <div className="capability-index" aria-label={t('capability.eyebrow')}>
            {index.map((label, i) => (
              <a key={CAP_HREFS[i]} href={CAP_HREFS[i]}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                {label}
              </a>
            ))}
          </div>
          <div className="section-quote-cta">
            <a className="btn btn-primary" href="#quote">
              {t('common.quote')}
            </a>
          </div>
        </div>
        <div className="quality-image quality-deck" data-quality-deck="" aria-label={t('capability.title')}>
          {cards.map((card, i) => (
            <figure
              key={CAP_HREFS[i]}
              className={`quality-card ${DECK_CLASS[i]}`.trim()}
              data-deck-card=""
              tabIndex={i === 0 ? 0 : -1}
              role="button"
            >
              <img src={CAP_IMGS[i]} alt={card.strong} />
              <figcaption className="quality-card-label">
                <span>{card.span}</span>
                <strong>{card.strong}</strong>
                <p>{card.p}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
