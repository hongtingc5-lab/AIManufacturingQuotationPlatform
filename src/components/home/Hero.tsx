import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section className="hero" id="home">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-slide hero-slide--first">
          <img src="/precision/factory-floor3.png" alt="" />
        </div>
        <div className="hero-slide hero-slide--second">
          <img src="/precision/factory-floor5.png" alt="" />
        </div>
      </div>
      <div className="hero-pane hero-pane--first">
        <div className="hero-inner">
          <div className="hero-copy hero-copy--first">
            <p className="hero-kicker">{t('hero.kicker1')}</p>
            <h1 dangerouslySetInnerHTML={{ __html: t('hero.title1') }} />
            <p dangerouslySetInnerHTML={{ __html: t('hero.desc1') }} />
            <div className="hero-actions">
              <a className="btn btn-primary" href="#quote">
                <span className="btn-icon" aria-hidden="true">
                  ↑
                </span>{' '}
                {t('hero.cta1')}
              </a>
              <Link className="btn btn-secondary" to="/solutions">
                {t('hero.cta1b')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-pane hero-pane--second">
        <div className="hero-inner">
          <div className="hero-copy hero-copy--second">
            <p className="hero-kicker">{t('hero.kicker2')}</p>
            <h1 dangerouslySetInnerHTML={{ __html: t('hero.title2') }} />
            <p dangerouslySetInnerHTML={{ __html: t('hero.desc2') }} />
            <div className="hero-actions">
              <a className="btn btn-primary" href="#quote">
                <span className="btn-icon" aria-hidden="true">
                  ↑
                </span>{' '}
                {t('hero.cta2')}
              </a>
              <Link className="btn btn-secondary" to="/solutions">
                {t('hero.cta2b')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
