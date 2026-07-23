import { NavLink, Outlet, useLocation } from 'react-router-dom'
import shell from '../data/shell.json'
import { MES_ROUTES, getMesPage } from '../data/pages'
import { useMesLocale } from '../i18n/LocaleContext'

function isNavActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function slugForPath(pathname: string): string | undefined {
  return MES_ROUTES.find((r) => r.route === pathname)?.slug
}

export function MesShell() {
  const { locale, isEnglish, toggleLocale } = useMesLocale()
  const { pathname } = useLocation()
  const slug = slugForPath(pathname)
  const page = slug ? getMesPage(slug, locale) : undefined

  const brand = shell.brand[locale]
  const brandSub = shell.brandSub[locale]
  const searchPh = shell.searchPlaceholder[locale]
  const userName = shell.userName[locale]
  const userRole = shell.userRole[locale]

  return (
    <div className="h-full min-h-screen bg-background text-on-surface antialiased">
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full flex-col p-md overflow-y-auto bg-surface-container-lowest border-r border-outline-variant w-72 z-50"
        aria-label={isEnglish ? 'Navigation' : '导航'}
      >
        <div className="flex items-center gap-sm px-sm py-lg mb-md">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-on-primary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              factory
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-[20px] leading-[24px] font-bold text-primary tracking-tight truncate">{brand}</h2>
            <p className="text-[12px] leading-[16px] text-secondary truncate">{brandSub}</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-xs overflow-y-auto custom-scrollbar">
          {shell.nav.map((item) => {
            const active = isNavActive(pathname, item.to)
            const label = isEnglish ? item.labelEn : item.labelZh
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === '/'}
                className={`flex items-center gap-md px-md py-sm rounded transition-all ${
                  active
                    ? 'bg-secondary-container text-primary font-bold opacity-90'
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

      <header className="fixed top-0 md:left-72 right-0 flex justify-between items-center px-lg h-16 z-40 bg-surface-container-lowest border-b border-outline-variant transition-all">
        <div className="flex items-center gap-md flex-1 min-w-0">
          <button type="button" className="md:hidden p-sm hover:bg-surface-container rounded-full transition-colors" aria-label="Menu">
            <span className="material-symbols-outlined text-on-surface-variant">menu</span>
          </button>
          <div className="relative hidden sm:block w-full max-w-md">
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
        <div className="flex items-center gap-md shrink-0">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-outline-variant text-[12px] text-on-surface-variant hover:bg-surface-container transition-colors"
            onClick={toggleLocale}
          >
            {isEnglish ? '中文' : 'EN'}
          </button>
          <button
            type="button"
            className="relative p-sm text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-sm pl-sm border-l border-outline-variant">
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

      {/* Offset only — page JSON owns padding/flex (AI 助手需左右分栏直挂在此层) */}
      <main className="md:ml-72 mt-16 min-h-0 h-[calc(100vh-64px)] overflow-hidden">
        <div
          className={
            page?.mainClass
              ? `${page.mainClass} h-full`
              : 'h-full overflow-y-auto bg-background'
          }
          data-mes-main={slug || ''}
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}
