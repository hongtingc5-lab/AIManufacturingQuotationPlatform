import { useTranslation } from 'react-i18next'

type Card = { h3: string; body: string; h4: string; drawer: string; lis: string[] }

const CARD_META = [
  { href: '/capabilities/service/3d-printing', img: '/precision/3dprint.png', en: '3D PRINTING SERVICES' },
  { href: '/capabilities/service/cnc', img: '/precision/cnc-machining-service.png', en: 'CNC MACHINING' },
  { href: '/capabilities/service/rapid-prototype', img: '/precision/cnc-machining-service.png', en: 'RAPID PROTOTYPING' },
  { href: '/capabilities/service/mold', img: '/precision/molding-service.png', en: 'MOLDING SERVICES' },
  { href: '/capabilities/service/custom', img: '/precision/manufacturing-service.png', en: 'MANUFACTURING' },
  { href: '/capabilities/service/stamping', img: '/precision/stamping-service.png', en: 'STAMPING SERVICES' },
  { href: '/capabilities/service/casting', img: '/precision/casting-service.png', en: 'CASTING SERVICES' },
  { href: '/capabilities/service/forging', img: '/precision/forging-service.png', en: 'FORGING SERVICES' },
] as const

export default function ServicesSection() {
  const { t } = useTranslation()
  const cards = t('services.cards', { returnObjects: true }) as Card[]

  return (
    <section className="section-block section-soft" id="services">
      <div className="container split-section">
        <div>
          <p className="eyebrow">{t('services.eyebrow')}</p>
          <h2 className="section-title">{t('services.title')}</h2>
          <p className="section-desc">{t('services.desc')}</p>
          <div style={{ marginTop: 28 }}>
            <a className="btn btn-primary" href="#quote">
              {t('common.quote')}
            </a>
          </div>
        </div>
        <div className="service-grid">
          {cards.map((card, i) => (
            <article
              key={CARD_META[i].href}
              className="service-card"
              data-card-link={CARD_META[i].href}
              role="link"
              tabIndex={0}
            >
              <img src={CARD_META[i].img} alt={card.h3} loading="lazy" />
              <div className="service-body">
                <h3>{card.h3}</h3>
                <p>{card.body}</p>
              </div>
              <div className="service-drawer">
                <div>
                  <strong>{CARD_META[i].en}</strong>
                  <h4>{card.h4}</h4>
                  <p>{card.drawer}</p>
                </div>
                <ul>
                  {card.lis.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
