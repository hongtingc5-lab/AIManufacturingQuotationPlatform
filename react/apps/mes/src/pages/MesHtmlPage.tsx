import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMesLocale } from '../i18n/LocaleContext'
import type { PagePayload } from '../data/pages'

type Props = { page: PagePayload }

/**
 * Use `display: contents` so multi-column page HTML (e.g. AI 助手)
 * participates in the shell main flex layout as direct children.
 */
export function MesHtmlPage({ page }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { locale } = useMesLocale()

  useEffect(() => {
    document.title = page.docTitle
  }, [page.docTitle])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
      if (!anchor || !root.contains(anchor)) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return
      if (anchor.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      navigate(href)
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [page.slug, page.mainHtml, navigate, locale])

  return (
    <div
      ref={ref}
      className="mes-page-root contents"
      data-mes-page={page.slug}
      dangerouslySetInnerHTML={{ __html: page.mainHtml }}
    />
  )
}
