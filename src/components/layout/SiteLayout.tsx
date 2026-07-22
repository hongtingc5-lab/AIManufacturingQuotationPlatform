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

  // home.css carries homepage + float widgets; runtime-fixes restore subpage header over it
  useEffect(() => {
    const injected: HTMLStyleElement[] = []
    const append = (attr: string, css: string) => {
      if (document.head.querySelector(`style[${attr}]`)) return
      const el = document.createElement('style')
      el.setAttribute(attr, '1')
      el.textContent = css
      document.head.appendChild(el)
      injected.push(el)
    }
    append('data-site-home-css', homeCss)
    append('data-site-runtime-fixes', homepageRuntimeFixes)
    append('data-site-en-overrides', enOverridesCss)
    return () => {
      injected.forEach((el) => el.remove())
    }
  }, [])

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
      if (href === '/en' || href.startsWith('/en/')) {
        navigate(href === '/en' ? '/' : href.slice(3) || '/')
        return
      }
      navigate(href)
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
  }, [location.pathname, navigate])

  return (
    <div className={`site-layout${isHome ? ' is-home-layout' : ' is-subpage-layout'}`} ref={rootRef}>
      <SiteHeader />
      {children ?? <Outlet />}
      {!hideFooter && <SiteFooter />}
      {createPortal(<FloatingWidgets />, document.body)}
    </div>
  )
}
