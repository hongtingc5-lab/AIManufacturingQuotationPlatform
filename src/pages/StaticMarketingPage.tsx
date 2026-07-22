import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import routeAssetMap from '../data/routeAssetMap.json'
import { useLocale } from '../i18n/LocaleContext'
import homeFaqCss from '../styles/home-faq.css?raw'
import homepageRuntimeFixes from '../styles/homepage-runtime-fixes.css?raw'
import '../styles/global.css'

type PagePayload = {
  title: string
  hasInlineStyle: boolean
  inlineStyle: string
  body: string
  isEn: boolean
}

const HOME_STYLE_BRAND_FIX = `
.brand-wordmark strong,
.brand-wordmark span { color: inherit; }
.footer .brand-wordmark strong,
.footer .brand-wordmark span { color: inherit; }
body > .floating-ai,
body > .floating-support,
body > .back-top { z-index: 100001; }
`

/** Strip legacy header / footer / floats — SiteLayout owns chrome. */
function stripLegacyChrome(html: string): string {
  if (typeof DOMParser === 'undefined') return html
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc
    .querySelectorAll(
      'header.site-header, footer.footer, .floating-ai, .floating-support, a.back-top, .back-top',
    )
    .forEach((el) => el.remove())
  return doc.body.innerHTML
}

/** Body classes required by global.css page themes (lost when JSON only stores inner HTML). */
function bodyClassesForRoute(pathname: string): string[] {
  const path = pathname.replace(/\/$/, '') || '/'
  const classes: string[] = ['is-static-page']
  if (path === '/industries' || path.startsWith('/industries/')) {
    classes.push('industry-hub-page')
  }
  if (path === '/solutions' || path.startsWith('/solutions/')) {
    classes.push('solution-page')
  }
  if (path.startsWith('/capabilities')) {
    classes.push('capability-hub-page')
  }
  return classes
}

const PAGE_BODY_CLASSES = [
  'is-static-page',
  'industry-hub-page',
  'solution-page',
  'capability-hub-page',
]

/**
 * Legacy static marketing HTML (CN body) inside React SiteLayout.
 * Hubs migrated to React are removed from routeAssetMap.
 */
export default function StaticMarketingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const hostRef = useRef<HTMLDivElement>(null)
  const [payload, setPayload] = useState<PagePayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { isEnglish } = useLocale()
  const { i18n } = useTranslation()

  useEffect(() => {
    const path = location.pathname
    if (path === '/en' || path.startsWith('/en/')) {
      navigate(path === '/en' ? '/' : path.slice(3) || '/', { replace: true })
    }
  }, [location.pathname, navigate])

  const routeKey = location.pathname.replace(/\/$/, '') || '/'
  const assetUrl =
    (routeAssetMap as Record<string, string>)[routeKey] ||
    (routeAssetMap as Record<string, string>)[location.pathname]

  useEffect(() => {
    let cancelled = false
    setPayload(null)
    setError(null)

    if (!assetUrl) {
      setError(`未找到页面资源：${location.pathname}`)
      return
    }

    fetch(assetUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`加载失败 ${res.status}`)
        return res.json()
      })
      .then((data: PagePayload) => {
        if (cancelled) return
        if (data.isEn) {
          setError('该英文镜像页已下线，请使用右上角语言切换。')
          return
        }
        setPayload({
          ...data,
          body: stripLegacyChrome(data.body),
        })
        document.title = data.title || document.title
        document.body.classList.remove('is-home', ...PAGE_BODY_CLASSES)
        bodyClassesForRoute(location.pathname).forEach((c) => document.body.classList.add(c))
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
      PAGE_BODY_CLASSES.forEach((c) => document.body.classList.remove(c))
    }
  }, [assetUrl, location.pathname])

  useEffect(() => {
    if (!payload) return
    const host = hostRef.current
    if (!host) return

    const injected: HTMLStyleElement[] = []
    const appendStyle = (attr: string, css: string) => {
      const el = document.createElement('style')
      el.setAttribute(attr, '1')
      el.textContent = css
      document.head.appendChild(el)
      injected.push(el)
    }

    if (payload.hasInlineStyle && payload.inlineStyle) {
      document.body.id = 'top'
      appendStyle(
        'data-static-page-css',
        payload.inlineStyle
          .replace(/url\(\.\/precision\//g, 'url(/precision/')
          .replace(/url\('\.\/precision\//g, "url('/precision/")
          .replace(/url\(\.\.\/precision\//g, 'url(/precision/')
          .replace(/url\('\.\.\/precision\//g, "url('/precision/"),
      )
      appendStyle('data-static-brand-fix', HOME_STYLE_BRAND_FIX)
      if (payload.body.includes('home-faq') || payload.body.includes('geo-faq')) {
        appendStyle('data-home-faq-css', homeFaqCss)
      }
      appendStyle('data-home-runtime-fixes', homepageRuntimeFixes)
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest?.('a') as HTMLAnchorElement | null
      if (!anchor || !host.contains(anchor)) return

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
      if (href === '/en' || href.startsWith('/en/')) {
        navigate(href === '/en' ? '/' : href.slice(3) || '/')
        return
      }
      navigate(href)
    }

    document.addEventListener('click', onClick)
    window.scrollTo(0, 0)

    return () => {
      document.removeEventListener('click', onClick)
      injected.forEach((el) => el.remove())
      if (payload.hasInlineStyle) document.body.removeAttribute('id')
    }
  }, [payload, navigate])

  useEffect(() => {
    document.documentElement.lang = isEnglish ? 'en' : 'zh-CN'
    document.body.classList.toggle('is-en', isEnglish)
  }, [isEnglish, i18n.language])

  const bodyHtml = useMemo(() => payload?.body ?? '', [payload])

  if (error) {
    return (
      <div className="container" style={{ padding: '120px 24px' }}>
        <h1>页面暂不可用</h1>
        <p>{error}</p>
        <a href="/">返回首页</a>
      </div>
    )
  }

  if (!payload) {
    return (
      <div className="container" style={{ padding: '120px 24px', color: '#69758a' }}>
        加载中…
      </div>
    )
  }

  return (
    <div
      className={`static-marketing-page ${isEnglish ? 'is-en' : 'is-zh'}`}
      ref={hostRef}
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  )
}
