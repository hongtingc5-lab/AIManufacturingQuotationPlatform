import libraryData from '../data/cases/library.json'

type CaseItem = {
  slug: string
  href: string
  hrefEn?: string
  title: string
  titleEn?: string
  industry: string
  industryEn?: string
  tags: string
  desc: string
  descEn?: string
  image: string
}

const pageSize = libraryData.pageSize || 9
const allCases = libraryData.cases as CaseItem[]

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function normalize(text: string) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, '')
}

function isEnglishUi() {
  return (
    document.documentElement.lang === 'en' ||
    document.body.classList.contains('is-en') ||
    (window.localStorage.getItem('promakehub_lang') || '').toLowerCase().startsWith('en')
  )
}

/**
 * Industry hub case library — matches verified HTML script
 * (#caseLibraryGrid / #casePrev / #caseNext / filters / search / reset).
 */
export function initIndustryCaseLibrary(root: ParentNode = document): () => void {
  const grid = root.querySelector('#caseLibraryGrid') as HTMLElement | null
  const search = root.querySelector('#caseSearch') as HTMLInputElement | null
  const filters = root.querySelector('#caseIndustryFilters') as HTMLElement | null
  const count = root.querySelector('#caseResultCount') as HTMLElement | null
  const reset = root.querySelector('#caseReset') as HTMLButtonElement | null
  const prev = root.querySelector('#casePrev') as HTMLButtonElement | null
  const next = root.querySelector('#caseNext') as HTMLButtonElement | null
  const pageInfo = root.querySelector('#casePageInfo') as HTMLElement | null
  if (!grid || !search || !filters) return () => {}

  const state = { industry: 'all', query: '', page: 1 }

  const getFiltered = () => {
    const q = normalize(state.query)
    const en = isEnglishUi()
    return allCases.filter((item) => {
      const industryMatched = state.industry === 'all' || item.industry === state.industry
      const haystack = en
        ? [item.industryEn || item.industry, item.titleEn || item.title, item.descEn || item.desc, item.tags]
        : [item.industry, item.title, item.desc, item.tags]
      const text = normalize(haystack.join(' '))
      return industryMatched && (!q || text.includes(q))
    })
  }

  const createCard = (item: CaseItem) => {
    const en = isEnglishUi()
    const industryLabel = en ? item.industryEn || item.industry : item.industry
    const title = en ? item.titleEn || item.title : item.title
    const desc = en ? item.descEn || item.desc : item.desc
    // Keep Chinese slug href so /cases/:slug resolves via registry; EN locales keyed by same slug.
    const href = item.href
    const article = document.createElement('article')
    article.className = 'case-library-card'
    article.dataset.industry = item.industry
    article.innerHTML =
      `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(title)}" loading="lazy">` +
      `<div><span>${escapeHtml(industryLabel)}${en ? ' case' : '案例'}</span>` +
      `<h3>${escapeHtml(title)}</h3>` +
      `<p>${escapeHtml(desc)}</p>` +
      `<a class="text-link" href="${escapeHtml(href)}">${en ? 'View case details' : '查看案例详情'}</a></div>`
    return article
  }

  const render = () => {
    const en = isEnglishUi()
    const list = getFiltered()
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize))
    if (state.page > totalPages) state.page = totalPages
    const start = (state.page - 1) * pageSize
    const pageItems = list.slice(start, start + pageSize)
    grid.innerHTML = ''
    pageItems.forEach((item) => grid.appendChild(createCard(item)))
    if (!pageItems.length) {
      grid.innerHTML = `<div class="case-empty">${en ? 'No matching cases.' : '没有匹配的案例。'}</div>`
    }
    if (count) {
      count.textContent = en ? `${list.length} cases` : `共 ${list.length} 个案例`
    }
    if (pageInfo) pageInfo.textContent = `${state.page} / ${totalPages}`
    if (prev) prev.disabled = state.page <= 1
    if (next) next.disabled = state.page >= totalPages
  }

  const onSearch = () => {
    state.query = search.value
    state.page = 1
    render()
  }

  const onFilterClick = (event: Event) => {
    const button = (event.target as HTMLElement | null)?.closest?.('button[data-industry]') as HTMLElement | null
    if (!button) return
    state.industry = button.dataset.industry || 'all'
    state.page = 1
    filters.querySelectorAll('button').forEach((item) => {
      item.classList.toggle('is-active', item === button)
    })
    render()
  }

  const onReset = () => {
    state.industry = 'all'
    state.query = ''
    state.page = 1
    search.value = ''
    filters.querySelectorAll('button').forEach((item) => {
      item.classList.toggle('is-active', (item as HTMLElement).dataset.industry === 'all')
    })
    render()
  }

  const onPrev = () => {
    if (state.page > 1) {
      state.page -= 1
      render()
    }
  }
  const onNext = () => {
    state.page += 1
    render()
  }

  search.addEventListener('input', onSearch)
  filters.addEventListener('click', onFilterClick)
  reset?.addEventListener('click', onReset)
  prev?.addEventListener('click', onPrev)
  next?.addEventListener('click', onNext)
  render()

  return () => {
    search.removeEventListener('input', onSearch)
    filters.removeEventListener('click', onFilterClick)
    reset?.removeEventListener('click', onReset)
    prev?.removeEventListener('click', onPrev)
    next?.removeEventListener('click', onNext)
  }
}
