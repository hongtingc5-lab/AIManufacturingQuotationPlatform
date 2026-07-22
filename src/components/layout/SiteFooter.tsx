import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BrandSymbol } from './BrandSymbol'
import { PAYMENT_BRANDS } from './PaymentBrands'

type FooterMenu = { h4: string; links: string[] }

const MENU_HREFS: string[][] = [
  ['/capabilities', '/capabilities/service', '/capabilities/material', '/capabilities/finish'],
  ['/', '/solutions/instant-quoting', '/capabilities/service', '/about', '/#contact'],
  ['/industries', '/industries/aerospace', '/industries/medical', '/industries/automotive', '/industries/new-energy'],
  ['/solutions', '/solutions/instant-quoting', '/solutions/rapid-prototyping', '/solutions/dfm'],
  [
    '/resources',
    '/resources/process-guide',
    '/resources/material-handbook',
    '/resources/design-guidelines',
    '/resources/faq',
  ],
  ['/about', '/about', '/about/quality', '/about/privacy', '/about/terms'],
]

export default function SiteFooter() {
  const { t } = useTranslation()
  const menus = t('footer.menus', { returnObjects: true }) as FooterMenu[]
  const support = t('footer.support', { returnObjects: true }) as {
    contactTitle: string
    paymentTitle: string
    subscribeTitle: string
    subscribeDesc: string
    paymentNote: string
    contactLabels: string[]
    contactName: string
    contactAddress: string
    contactOnline: string
    payments: string[]
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid footer-grid--expanded">
          <div className="footer-brand">
            <Link className="brand" to="/" aria-label={t('meta.homeAria')}>
              <BrandSymbol />
              <span className="brand-wordmark">
                <strong>{t('meta.brand')}</strong>
                <span>{t('meta.brandEn')}</span>
              </span>
            </Link>
            <p>{t('footer.tagline')}</p>
          </div>

          {menus.map((menu, i) => (
            <div className="footer-menu" key={menu.h4}>
              <h4>{menu.h4}</h4>
              <ul>
                {menu.links.map((label, j) => {
                  const href = MENU_HREFS[i]?.[j] || '/'
                  return (
                    <li key={`${menu.h4}-${j}`}>
                      {href.startsWith('/#') || href.includes('#') ? (
                        <a href={href}>{label}</a>
                      ) : (
                        <Link to={href}>{label}</Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-support-grid">
          <section className="footer-support-card">
            <h4>{support.contactTitle}</h4>
            <div className="footer-contact-details">
              <p className="footer-contact-line">
                <b>{support.contactLabels[0]}</b>
                <span>{support.contactName}</span>
              </p>
              <p className="footer-contact-line">
                <b>{support.contactLabels[1]}</b>
                <a href="tel:18682088681">18682088681</a>
              </p>
              <p className="footer-contact-line">
                <b>{support.contactLabels[2]}</b>
                <a href="mailto:info@precision.com">info@precision.com</a>
              </p>
              <p className="footer-contact-line">
                <b>{support.contactLabels[3]}</b>
                <span className="footer-address-pending">{support.contactAddress}</span>
              </p>
              <p className="footer-contact-line">
                <b>{support.contactLabels[4]}</b>
                <a href="/#contact">{support.contactOnline}</a>
              </p>
            </div>
          </section>

          <section className="footer-support-card">
            <h4>{support.paymentTitle}</h4>
            <div className="footer-payment-brand-grid" aria-label="Supported payment methods">
              {PAYMENT_BRANDS.map((brand, i) => (
                <div key={brand.key} className={brand.className} title={brand.title}>
                  {brand.icon}
                  <span>{support.payments[i] ?? brand.title}</span>
                </div>
              ))}
            </div>
            <p className="footer-payment-note footer-payment-note--brands">{support.paymentNote}</p>
          </section>

          <section className="footer-support-card footer-support-card--subscribe">
            <h4>{support.subscribeTitle}</h4>
            <p>{support.subscribeDesc}</p>
            <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.subscribePlaceholder')}
                aria-label={t('footer.subscribePlaceholder')}
              />
              <button type="button" aria-label="subscribe">
                →
              </button>
            </form>
          </section>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">{t('footer.copyright')}</span>
          <span className="footer-policy-links">
            <Link to="/about/privacy">{t('footer.privacy')}</Link>
            <i aria-hidden="true" />
            <Link to="/about/terms">{t('footer.terms')}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
