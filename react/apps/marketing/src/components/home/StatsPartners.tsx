import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

const PARTNER_LOGOS = [
  ['microport.png', 'MicroPort'],
  ['huawei.png', 'Huawei'],
  ['chinese-academy-of-sciences.png', 'CAS'],
  ['nvidia.png', 'NVIDIA'],
  ['tesla.png', 'Tesla'],
  ['lockheed-martin.png', 'Lockheed Martin'],
  ['geespace.png', 'GEESPACE'],
  ['geely.png', 'Geely'],
  ['nio.png', 'NIO'],
  ['agibot.png', 'AGIBOT'],
  ['mindray.png', 'Mindray'],
] as const

const STAT_ICONS: ReactNode[] = [
  <svg key="years" viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 26V9h8v17M18 26V5h8v21M3 26h26"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13h2M10 17h2M22 10h2M22 14h2M22 18h2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>,
  <svg key="customers" viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="22" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M6 24v-2c0-3.314 2.686-6 6-6M26 24v-2c0-3.314-2.686-6-6-6M12 24v-3c0-2.761 2.239-5 5-5h0c2.761 0 5 2.239 5 5v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>,
  <svg key="equipment" viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="24" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 16h6M18 16h6M13 10V7h6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="23.5" r="1.5" fill="currentColor" />
    <circle cx="23" cy="23.5" r="1.5" fill="currentColor" />
  </svg>,
  <svg key="regions" viewBox="0 0 32 32" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" />
    <path
      d="M5 16h22M16 5c3 3.5 4.5 7.167 4.5 11S19 23.5 16 27c-3-3.5-4.5-7.167-4.5-11S13 8.5 16 5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>,
]

export function StatsBar() {
  const { t } = useTranslation()
  const items = [
    { num: '20+', label: t('stats.years'), html: true },
    { num: '1200+', label: t('stats.customers') },
    { num: '280+', label: t('stats.equipment') },
    { num: '50+', label: t('stats.regions') },
  ]
  return (
    <section className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {items.map((item, i) => (
            <div className="stat-item" key={item.num}>
              <span className="icon-box" aria-hidden="true">
                {STAT_ICONS[i]}
              </span>
              <div>
                <div className="stat-number">{item.num}</div>
                {item.html ? (
                  <div className="stat-label" dangerouslySetInnerHTML={{ __html: item.label }} />
                ) : (
                  <div className="stat-label">{item.label}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Partners() {
  const { t } = useTranslation()
  const logos = (
    <div className="partner-logo-group">
      {PARTNER_LOGOS.map(([file, alt]) => (
        <span className="partner-logo-item" key={file}>
          <img src={`/partner-logos/${file}`} alt={alt} loading="lazy" decoding="async" />
        </span>
      ))}
    </div>
  )
  return (
    <section className="partners" aria-label={t('partnersAria')}>
      <div className="container partners-row">
        <div className="partners-label">{t('partners')}</div>
        <div className="partner-logos">
          <div className="partner-logo-track">
            {logos}
            <div className="partner-logo-group" aria-hidden="true">
              {PARTNER_LOGOS.map(([file]) => (
                <span className="partner-logo-item" key={`dup-${file}`}>
                  <img src={`/partner-logos/${file}`} alt="" loading="lazy" decoding="async" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
