import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupplierLocale } from '../i18n/LocaleContext'
import type { PagePayload } from '../data/pages'

type Props = { page: PagePayload }

export function SupplierHtmlPage({ page }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { locale } = useSupplierLocale()

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
      className="supplier-page-root h-full"
      data-supplier-page={page.slug}
      dangerouslySetInnerHTML={{ __html: page.mainHtml }}
    />
  )
}
