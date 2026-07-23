import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleContext'
import zh from '../locales/zh/quote-guest.json'
import en from '../locales/en/quote-guest.json'
import '../styles/quote-guest.css'
import quoteGuestScript from './quoteGuestPageScript.js?raw'
import { VERIFIED_HTML_BODY_CLASSES } from './VerifiedHtmlPage'
import { entryUrl } from '../system/origins'

type QuoteLocale = {
  docTitle?: string
  bodyClasses?: string[]
  mainHtml?: string
}

/**
 * Guest quote upload page (formerly under 用户端, now marketing).
 * Route: /quote?mode=…#quote-upload
 */
export default function QuoteGuestPage() {
  const { isEnglish } = useLocale()
  const location = useLocation()
  const navigate = useNavigate()
  const hostRef = useRef<HTMLElement>(null)
  const page = (isEnglish ? en : zh) as QuoteLocale
  const mainHtml = typeof page.mainHtml === 'string' ? page.mainHtml : ''
  const bodyClasses = Array.isArray(page.bodyClasses) ? page.bodyClasses : ['quote-guest-page']
  const mountKey = `${location.search}|${isEnglish ? 'en' : 'zh'}`

  useEffect(() => {
    // Remove legacy ?raw style tag if a previous session injected one.
    document.head.querySelectorAll('style[data-quote-guest-css]').forEach((el) => el.remove())
  }, [])

  useEffect(() => {
    if (!mainHtml) return
    document.title = page.docTitle || document.title
    document.documentElement.lang = isEnglish ? 'en' : 'zh-CN'
    document.body.classList.remove('is-home', ...VERIFIED_HTML_BODY_CLASSES, 'quote-guest-page')
    document.body.classList.add('is-static-page', ...bodyClasses)
    document.body.classList.toggle('is-en', isEnglish)
    return () => {
      document.body.classList.remove(...bodyClasses, 'quote-guest-page')
    }
  }, [mainHtml, page.docTitle, bodyClasses.join(' '), isEnglish])

  useEffect(() => {
    const host = hostRef.current
    if (!host || !mainHtml) return

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
      navigate(href)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [mainHtml, navigate, mountKey])

  useEffect(() => {
    if (!mainHtml) return
    const entryOrigin = new URL(entryUrl('/login', isEnglish ? 'en' : 'zh')).origin
    ;(window as Window & { __ZHIZAO_ENTRY_ORIGIN__?: string; __ZHIZAO_LANG__?: string }).__ZHIZAO_ENTRY_ORIGIN__ =
      entryOrigin
    ;(window as Window & { __ZHIZAO_LANG__?: string }).__ZHIZAO_LANG__ = isEnglish ? 'en' : 'zh'
    const script = document.createElement('script')
    script.setAttribute('data-quote-guest-script', '1')
    script.text = quoteGuestScript
    document.body.appendChild(script)

    const hash = location.hash
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ block: 'start' })
      })
    } else {
      window.scrollTo(0, 0)
    }

    return () => {
      script.remove()
    }
  }, [mainHtml, mountKey, location.hash, isEnglish])

  const html = useMemo(() => mainHtml, [mainHtml])

  if (!html) {
    return (
      <div className="container" style={{ padding: '120px 24px', color: '#69758a' }}>
        加载中…
      </div>
    )
  }

  return <main key={mountKey} ref={hostRef} className="quote-guest-page" dangerouslySetInnerHTML={{ __html: html }} />
}
