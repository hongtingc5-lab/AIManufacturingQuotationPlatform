import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../i18n/LocaleContext'
import { initIndustryCaseLibrary } from '../interactions/industryCaseLibrary'
import {
  initDownloadCenterFilters,
  initModelCenterFilters,
  initNewsHubFilters,
} from '../interactions/resourcePageFilters'

/** Body theme classes used by verified HTML marketing pages. */
export const VERIFIED_HTML_BODY_CLASSES = [
  'solution-page',
  'solution-detail-page',
  'smart-quote-page',
  'supplement-page',
  'industry-hub-page',
  'industry-detail-page',
  'industry-case-page',
  'resource-page',
  'resource-detail-page',
  'news-hub-page',
  'news-detail-page',
  'model-center-page',
  'download-center-page',
  'about-page',
  'about-detail-page',
  'company-detail-page',
  'quote-guest-page',
  'is-static-page',
]

type VerifiedLocale = {
  docTitle?: string
  bodyClasses?: string[]
  mainHtml?: string
}

function isFileDownloadHref(href: string) {
  const path = href.split('?')[0].split('#')[0].toLowerCase()
  return (
    path.startsWith('/downloads/') ||
    path.startsWith('/models/') ||
    /\.(pdf|xlsx|xls|docx|doc|zip|step|stp|stl|iges|igs|dxf|obj)$/i.test(path)
  )
}

/** Shared renderer: locale JSON stores rewritten <main> inner HTML from verified pages. */
export function VerifiedHtmlPage({
  localeKey,
  fallbackBodyClasses = ['is-static-page'],
}: {
  localeKey: string
  fallbackBodyClasses?: string[]
}) {
  const { t, i18n } = useTranslation()
  const { locale, isEnglish } = useLocale()
  const navigate = useNavigate()
  const hostRef = useRef<HTMLElement>(null)

  // Bind explicitly to LocaleContext language so chrome + body never diverge.
  const page = t(localeKey, { returnObjects: true, lng: locale }) as VerifiedLocale
  const mainHtml = typeof page?.mainHtml === 'string' ? page.mainHtml : ''
  const bodyClassList = Array.isArray(page?.bodyClasses) ? page.bodyClasses : fallbackBodyClasses
  const bodyClassKey = bodyClassList.join(' ')
  const docTitle = typeof page?.docTitle === 'string' ? page.docTitle : ''

  useEffect(() => {
    if (!mainHtml) return
    document.title = docTitle || document.title
    document.documentElement.lang = isEnglish ? 'en' : 'zh-CN'
    document.body.classList.remove('is-home', ...VERIFIED_HTML_BODY_CLASSES)
    document.body.classList.add('is-static-page', ...bodyClassList)
    document.body.classList.toggle('is-en', isEnglish)
    return () => {
      document.body.classList.remove(...VERIFIED_HTML_BODY_CLASSES)
    }
  }, [mainHtml, docTitle, bodyClassKey, isEnglish, locale, i18n.language])

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
      if (anchor.hasAttribute('download') || isFileDownloadHref(href)) return
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
    const hash = window.location.hash.replace(/^#/, '')
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: 'start' })
      })
    } else {
      window.scrollTo(0, 0)
    }
    return () => document.removeEventListener('click', onClick)
  }, [mainHtml, navigate])

  useEffect(() => {
    const host = hostRef.current
    if (!host || !mainHtml) return

    let cancelled = false
    const cleanups: Array<() => void> = []

    const run = () => {
      if (cancelled || !hostRef.current) return
      const el = hostRef.current
      if (bodyClassList.includes('industry-hub-page') || el.querySelector('#caseLibraryGrid')) {
        cleanups.push(initIndustryCaseLibrary(el))
      }
      if (bodyClassList.includes('download-center-page') || el.querySelector('.download-card')) {
        cleanups.push(initDownloadCenterFilters(el))
      }
      if (bodyClassList.includes('news-hub-page') || el.querySelector('.news-filter-button')) {
        cleanups.push(initNewsHubFilters(el))
      }
      if (
        bodyClassList.includes('model-center-page') ||
        el.querySelector('.mc-post-card, .model-library-card')
      ) {
        cleanups.push(initModelCenterFilters(el))
      }
    }

    // Wait one frame so dangerouslySetInnerHTML nodes are queryable.
    const id = window.requestAnimationFrame(run)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(id)
      cleanups.forEach((fn) => fn())
    }
  }, [mainHtml, bodyClassKey])

  const html = useMemo(() => mainHtml, [mainHtml])
  const mainClassName = useMemo(
    () => ['verified-html-page', ...bodyClassList].filter(Boolean).join(' '),
    [bodyClassKey],
  )

  if (!html) {
    return (
      <div className="container" style={{ padding: '120px 24px', color: '#69758a' }}>
        加载中…
      </div>
    )
  }

  return <main ref={hostRef} className={mainClassName} dangerouslySetInnerHTML={{ __html: html }} />
}
