import { NavLink, Outlet, useLocation } from 'react-router-dom'
import shell from '../data/shell.json'
import { useAdminLocale } from '../i18n/LocaleContext'
import { BrandLogo } from './BrandLogo'

function isNavActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

/** Match static <main> backgrounds/padding per route family */
function mainClassFor(pathname: string) {
  if (pathname === '/') return 'flex-1 overflow-y-auto min-h-0 p-gutter bg-background'
  if (pathname.startsWith('/ai')) return 'flex-1 overflow-y-auto min-h-0 p-gutter bg-surface-container-low'
  if (pathname.startsWith('/rfq')) return 'flex-1 overflow-y-auto min-h-0 p-gutter bg-surface-container-lowest'
  if (pathname.startsWith('/knowledge')) return 'flex-1 overflow-y-auto min-h-0 p-8 custom-scrollbar bg-background'
  if (pathname.startsWith('/users')) return 'flex-1 overflow-y-auto min-h-0 bg-background p-4 md:p-6 lg:p-8 space-y-6'
  if (pathname.startsWith('/analytics')) return 'flex-1 overflow-y-auto min-h-0 p-6 space-y-6'
  if (pathname.startsWith('/settings') || pathname.startsWith('/permissions')) {
    return 'flex-1 overflow-y-auto min-h-0 p-6 flex flex-col gap-6'
  }
  if (pathname.startsWith('/finance')) return 'flex-1 overflow-y-auto min-h-0 bg-background'
  if (
    pathname.startsWith('/customers') ||
    pathname.startsWith('/supply') ||
    pathname.startsWith('/support') ||
    pathname.startsWith('/marketing-cms')
  ) {
    return 'flex-1 overflow-y-auto min-h-0 p-gutter pb-24'
  }
  if (pathname.startsWith('/suppliers')) {
    return 'flex-1 overflow-y-auto min-h-0 p-4 md:p-8 w-full max-w-[1440px] mx-auto overflow-x-hidden'
  }
  if (pathname.startsWith('/mes-oversight')) {
    return 'flex-1 overflow-y-auto min-h-0 p-margin_mobile md:p-gutter'
  }
  return 'flex-1 overflow-y-auto min-h-0 p-gutter bg-surface-container-low'
}

export function AdminShell() {
  const { locale, isEnglish, toggleLocale } = useAdminLocale()
  const { pathname } = useLocation()

  const brand = shell.brand[locale]
  const brandSub = shell.brandSub[locale]
  const searchPh = shell.searchPlaceholder[locale]
  const adminName = shell.adminName[locale]
  const adminRole = shell.adminRole[locale]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface-bright text-on-surface font-body-md text-body-md antialiased">
      <nav
        className="docked h-full w-72 left-0 top-0 flex flex-col h-screen py-md overflow-y-auto bg-surface-dim dark:bg-inverse-surface border-r border-outline-variant dark:border-outline hidden md:flex shrink-0"
        aria-label={isEnglish ? 'Admin navigation' : '后台导航'}
      >
        <div className="px-lg py-md flex items-center gap-sm mb-6 mt-4 px-6">
          <BrandLogo className="w-8 h-8 shrink-0" />
          <div className="min-w-0">
            <h1 className="text-headline-sm font-headline-sm font-bold text-on-surface dark:text-on-primary-fixed truncate">
              {brand}
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{brandSub}</p>
          </div>
        </div>

        <ul className="flex-1 px-4 space-y-1">
          {shell.nav.map((item) => {
            const active = isNavActive(pathname, item.to)
            const label = isEnglish ? item.labelEn : item.labelZh
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors duration-200 ease-in-out ${
                    active
                      ? 'bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container'
                      : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant'
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
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background min-w-0">
        <header className="sticky top-0 z-40 flex justify-between items-center w-full pl-6 pr-10 py-sm h-16 bg-surface-bright dark:bg-surface-container-lowest border-b border-outline-variant dark:border-outline shadow-sm dark:shadow-none shrink-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              type="button"
              className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden md:flex items-center bg-surface-container dark:bg-inverse-surface rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary transition-colors duration-200 ease-in-out w-full max-w-md">
              <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
              <input
                type="search"
                placeholder={searchPh}
                className="bg-transparent border-none focus:ring-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-outline-variant font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              onClick={toggleLocale}
            >
              {isEnglish ? '中文' : 'EN'}
            </button>
            <button
              type="button"
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              type="button"
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="flex items-center gap-3 pl-2 ml-1 border-l border-outline-variant">
              <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md">
                A
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="font-label-md text-label-md text-on-surface">{adminName}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">{adminRole}</div>
              </div>
            </div>
          </div>
        </header>

        <main className={mainClassFor(pathname)}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
