import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminLocale } from '../i18n/LocaleContext'

export type AdminPagePayload = {
  slug: string
  route: string
  docTitle: string
  navLabel: string
  mainHtml: string
}

type Props = {
  page: AdminPagePayload
}

function initSupportTabs(root: HTMLElement) {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-service-tab]')
  const panels = root.querySelectorAll<HTMLElement>('[data-service-panel]')
  if (!buttons.length || !panels.length) return

  const activate = (id: string) => {
    buttons.forEach((btn) => {
      const on = btn.dataset.serviceTab === id
      btn.classList.toggle('bg-primary', on)
      btn.classList.toggle('text-on-primary', on)
      btn.classList.toggle('bg-surface-container', !on)
    })
    panels.forEach((panel) => {
      panel.classList.toggle('hidden', panel.dataset.servicePanel !== id)
    })
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activate(btn.dataset.serviceTab || ''))
  })
  activate(buttons[0]?.dataset.serviceTab || 'customer-panel')
}

export function AdminHtmlPage({ page }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { locale } = useAdminLocale()

  useEffect(() => {
    document.title = page.docTitle
  }, [page.docTitle])

  useEffect(() => {
    const root = ref.current
    if (!root) return

    if (page.slug === 'support') initSupportTabs(root)

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
      className="admin-page-root"
      data-admin-page={page.slug}
      dangerouslySetInnerHTML={{ __html: page.mainHtml }}
    />
  )
}
