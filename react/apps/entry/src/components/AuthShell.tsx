import type { ReactNode } from 'react'
import { BrandLogo } from './BrandLogo'
import { marketingUrl } from '../config/origins'
import type { AuthVisual, Locale } from '../data/authPages'

export function AuthShell({
  visual,
  locale,
  children,
}: {
  visual: AuthVisual
  locale: Locale
  children: ReactNode
}) {
  const homeHref = marketingUrl('/', locale)
  const brand = locale === 'en' ? 'AgileMakeAI' : '敏捷智造'

  return (
    <main className="auth-shell">
      <section className="auth-visual" aria-label={visual.ariaLabel}>
        <div className="visual-inner">
          <a className="brand" href={homeHref} aria-label={brand}>
            <span className="brand-mark">
              <BrandLogo />
            </span>
            <span className="brand-copy">
              <strong>{brand}</strong>
              <small>AGILE MANUFACTURING CLOUD</small>
            </span>
          </a>
          <div className="visual-copy">
            <p className="eyebrow">
              <span className="material-symbols-outlined">{visual.eyebrowIcon}</span>
              {visual.eyebrow}
            </p>
            <h1>{visual.title}</h1>
            <p>{visual.description}</p>
            <div className="visual-stats" aria-label="capabilities">
              {visual.stats.map((stat) => (
                <div className="visual-stat" key={stat.label}>
                  <strong>{stat.label}</strong>
                  <span>{stat.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="auth-main">
        <a className="brand mobile-brand" href={homeHref} aria-label={brand}>
          <span className="brand-mark">
            <BrandLogo />
          </span>
          <span className="brand-copy">
            <strong>{brand}</strong>
            <small>AGILE MANUFACTURING CLOUD</small>
          </span>
        </a>
        {children}
      </section>
    </main>
  )
}
