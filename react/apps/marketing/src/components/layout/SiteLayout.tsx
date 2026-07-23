import { useEffect, useRef, type ReactNode } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import FloatingWidgets from './FloatingWidgets'
import { initSiteChrome } from '../../interactions/siteChrome'
import { initHomeInteractions } from '../../interactions/homeInteractions'
import { useLocale } from '../../i18n/LocaleContext'
import homeCss from '../../styles/home.css?raw'
import homepageRuntimeFixes from '../../styles/homepage-runtime-fixes.css?raw'
import enOverridesCss from '../../styles/en-overrides.css?raw'
import '../../styles/global.css'
import '../../styles/resources-pages.css'
/* Also load as normal CSS so industry shadow kills aren't only in raw inject order */
import '../../styles/homepage-runtime-fixes.css'

type Props = {
  children?: ReactNode
  hideFooter?: boolean
}

/**
 * Shared chrome for all marketing routes.
 * Home uses home.css hero-nav; subpages use global.css white nav (see runtime-fixes).
 */
export default function SiteLayout({ children, hideFooter }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const rootRef = useRef<HTMLDivElement>(null)
  const { isEnglish } = useLocale()
  const isHome = location.pathname === '/' || location.pathname === ''

  // home.css carries homepage + float widgets; runtime-fixes restore subpage header over it.
  // Always sync textContent — raw inject used to skip after first mount, so HMR never applied.
  useEffect(() => {
    const sync = (attr: string, css: string) => {
      let el = document.head.querySelector(`style[${attr}]`) as HTMLStyleElement | null
      if (!el) {
        el = document.createElement('style')
        el.setAttribute(attr, '1')
        document.head.appendChild(el)
      }
      el.textContent = css
      return el
    }
    sync('data-site-home-css', homeCss)
    sync('data-site-runtime-fixes', homepageRuntimeFixes)
    sync('data-site-en-overrides', enOverridesCss)
  }, [homeCss, homepageRuntimeFixes, enOverridesCss])

  useEffect(() => {
    document.documentElement.lang = isEnglish ? 'en' : 'zh-CN'
    document.body.classList.toggle('is-en', isEnglish)
  }, [isEnglish])

  useEffect(() => {
    document.body.classList.toggle('is-home', isHome)
    document.body.classList.toggle('is-static-page', !isHome)
    if (!isHome) {
      document.body.classList.remove('is-why-scroll-active', 'is-services-active')
    }
  }, [isHome])

  // Route changes: scroll to hash target or page top (same-page clicks handled in navigateHref).
  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1))
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      }, 0)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.search, location.hash, location.key])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const chromeCleanup = initSiteChrome(root)
    const abort = new AbortController()
    try {
      initHomeInteractions(abort.signal)
    } catch (err) {
      console.error('[SiteLayout] interactions failed', err)
    }

    const navigateHref = (href: string) => {
      let nextPath = href
      let nextHash = ''
      let nextSearch = ''
      try {
        const url = new URL(href, window.location.origin)
        nextPath = url.pathname
        nextHash = url.hash
        nextSearch = url.search
      } catch {
        // keep raw href
      }

      if (nextPath === '/en' || nextPath.startsWith('/en/')) {
        navigate(nextPath === '/en' ? '/' : nextPath.slice(3) || '/')
        return
      }

      const samePage =
        nextPath === location.pathname && nextSearch === (location.search || '')

      if (samePage) {
        if (nextHash) {
          const id = decodeURIComponent(nextHash.slice(1))
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
          })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        return
      }

      navigate(`${nextPath}${nextSearch}${nextHash}`)
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const card = target?.closest?.('[data-card-link]') as HTMLElement | null
      if (card && root.contains(card) && !target?.closest?.('a')) {
        const href = card.getAttribute('data-card-link')
        if (href && !href.startsWith('#')) {
          event.preventDefault()
          navigateHref(href)
          return
        }
      }

      const anchor = target?.closest?.('a') as HTMLAnchorElement | null
      if (!anchor || !root.contains(anchor)) return
      if (anchor.classList.contains('lang-link')) return
      const href = anchor.getAttribute('href')
      if (!href) return
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('weixin:')
      ) {
        return
      }
      if (href.startsWith('#')) return
      if (anchor.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }
      event.preventDefault()
      navigateHref(href)
    }

    const onCardKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const card = (event.target as HTMLElement | null)?.closest?.('[data-card-link]') as HTMLElement | null
      if (!card || !root.contains(card)) return
      if ((event.target as HTMLElement).closest('a')) return
      const href = card.getAttribute('data-card-link')
      if (!href || href.startsWith('#')) return
      event.preventDefault()
      navigateHref(href)
    }

    root.addEventListener('click', onClick)
    root.addEventListener('keydown', onCardKey)

    return () => {
      abort.abort()
      chromeCleanup()
      root.removeEventListener('click', onClick)
      root.removeEventListener('keydown', onCardKey)
    }
  }, [location.pathname, location.search, navigate])

  return (
    <div className={`site-layout${isHome ? ' is-home-layout' : ' is-subpage-layout'}`} ref={rootRef}>
      <SiteHeader />
      {children ?? <Outlet />}
      {!hideFooter && <SiteFooter />}
      {createPortal(<FloatingWidgets />, document.body)}
    </div>
  )
}
