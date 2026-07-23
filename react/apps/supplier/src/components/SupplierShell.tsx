import { NavLink, Outlet, useLocation } from 'react-router-dom'
import shell from '../data/shell.json'
import { SUPPLIER_ROUTES, getSupplierPage } from '../data/pages'
import { useSupplierLocale } from '../i18n/LocaleContext'

function isNavActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function slugForPath(pathname: string): string | undefined {
  return SUPPLIER_ROUTES.find((r) => r.route === pathname)?.slug
}

export function SupplierShell() {
  const { locale, isEnglish, toggleLocale } = useSupplierLocale()
  const { pathname } = useLocation()
  const slug = slugForPath(pathname)
  const page = slug ? getSupplierPage(slug, locale) : undefined
  const mainClass = page?.mainClass ? `${page.mainClass} min-h-0` : 'min-h-0 overflow-y-auto bg-surface'

  const brand = shell.brand[locale]
  const brandSub = shell.brandSub[locale]
  const searchPh = shell.searchPlaceholder[locale]
  const userName = shell.userName[locale]
  const userRole = shell.userRole[locale]

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <aside
        className="fixed left-0 top-0 h-full w-[240px] z-40 bg-surface-container-low border-r border-outline-variant flex flex-col py-6 px-4"
        aria-label={isEnglish ? 'Navigation' : '导航'}
      >
        <div className="mb-8 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-on-primary text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}
              >
                precision_manufacturing
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-[20px] leading-[24px] font-bold text-primary tracking-tight truncate">{brand}</h1>
              <p className="text-[12px] leading-[16px] text-on-surface-variant opacity-70 truncate">{brandSub}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {shell.nav.map((item) => {
            const active = isNavActive(pathname, item.to)
            const label = isEnglish ? item.labelEn : item.labelZh
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === '/'}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-[14px] leading-[20px]">{label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <header className="fixed top-0 left-[240px] w-[calc(100%-240px)] h-16 z-30 bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="search"
              placeholder={searchPh}
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-[14px] leading-[20px] outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-outline-variant text-[12px] text-on-surface-variant hover:bg-surface-container transition-colors"
            onClick={toggleLocale}
          >
            {isEnglish ? '中文' : 'EN'}
          </button>
          <button
            type="button"
            className="relative p-2 text-on-surface-variant hover:bg-surface-container rounded-full"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[14px] font-semibold">
              {userName.slice(0, 1)}
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-[14px] font-semibold text-on-surface">{userName}</div>
              <div className="text-[12px] text-on-surface-variant">{userRole}</div>
            </div>
          </div>
        </div>
      </header>

      <main className={`ml-[240px] pt-16 ${mainClass}`}>
        <Outlet />
      </main>
    </div>
  )
}
