import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserLocale } from '../i18n/LocaleContext'

export type UserPagePayload = {
  slug: string
  route: string
  docTitle: string
  navLabel: string
  mainClass?: string
  mainHtml: string
}

type Props = {
  page: UserPagePayload
}

export function UserHtmlPage({ page }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { locale } = useUserLocale()

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
      className="user-page-root h-full"
      data-user-page={page.slug}
      dangerouslySetInnerHTML={{ __html: page.mainHtml }}
    />
  )
}
