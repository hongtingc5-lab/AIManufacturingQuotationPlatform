import { NavLink, Outlet, useLocation } from 'react-router-dom'
import shell from '../data/shell.json'
import { USER_ROUTES, getUserPage } from '../data/pages'
import { useUserLocale } from '../i18n/LocaleContext'
import { BrandLogo } from './BrandLogo'

function isNavActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function slugForPath(pathname: string): string | undefined {
  const hit = USER_ROUTES.find((r) => r.route === pathname)
  return hit?.slug
}

export function UserShell() {
  const { locale, isEnglish, toggleLocale } = useUserLocale()
  const { pathname } = useLocation()
  const slug = slugForPath(pathname)
  const page = slug ? getUserPage(slug, locale) : undefined
  const mainClass = page?.mainClass
    ? `${page.mainClass} min-h-0`
    : 'flex-1 min-h-0 overflow-y-auto'

  const brand = shell.brand[locale]
  const brandSub = shell.brandSub[locale]
  const searchPh = shell.searchPlaceholder[locale]
  const ctaSmart = shell.ctaSmart[locale]
  const ctaPro = shell.ctaPro[locale]
  const userName = shell.userName[locale]
  const userRole = shell.userRole[locale]

  return (
    <div className="min-h-screen bg-surface-bright text-on-surface font-body-md text-body-md antialiased">
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-white border border-outline-variant">
            <BrandLogo className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <h1 className="text-headline-sm font-headline-sm font-bold text-on-surface truncate">{brand}</h1>
            <p className="text-label-sm font-label-sm text-secondary truncate">{brandSub}</p>
          </div>
        </div>

        <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto" aria-label={isEnglish ? 'Workspace' : '工作台导航'}>
          {shell.nav.map((item) => {
            const active = isNavActive(pathname, item.to)
            const label = isEnglish ? item.labelEn : item.labelZh
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === '/'}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container">
            <div className="w-10 h-10 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md shrink-0">
              {userName.slice(0, 1)}
            </div>
            <div className="overflow-hidden">
              <p className="text-label-md font-label-md font-bold truncate text-on-surface">{userName}</p>
              <p className="text-label-sm font-label-sm text-secondary truncate">{userRole}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-surface-container-lowest shadow-sm border-b border-outline-variant h-16 flex items-center px-6 shrink-0">
          <div className="flex-1 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="search"
                placeholder={searchPh}
                className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 font-body-sm text-body-sm focus:ring-2 focus:ring-primary transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <NavLink
                to="/ai/smart-quote"
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>{ctaSmart}</span>
              </NavLink>
              <NavLink
                to="/quotes/upload"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                <span>{ctaPro}</span>
              </NavLink>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                onClick={toggleLocale}
              >
                {isEnglish ? '中文' : 'EN'}
              </button>
              <button
                type="button"
                className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
              </button>
              <button
                type="button"
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
                aria-label="Settings"
              >
                <span className="material-symbols-outlined">settings</span>
              </button>
              <div className="h-8 w-px bg-outline-variant mx-1" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-label-md font-label-md font-bold text-on-surface">{userName}</p>
                  <p className="text-label-sm font-label-sm text-secondary">{userRole}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-outline-variant bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md">
                  {userName.slice(0, 1)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className={mainClass}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
