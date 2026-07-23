/** Filter/search for download center, news hub, model center (verified HTML markup). */

function isEnglishUi() {
  return (
    document.documentElement.lang === 'en' ||
    document.body.classList.contains('is-en') ||
    (window.localStorage.getItem('promakehub_lang') || '').toLowerCase().startsWith('en')
  )
}

function setActive(buttons: Element[], active: Element) {
  buttons.forEach((btn) => {
    const on = btn === active
    btn.classList.toggle('is-active', on)
    btn.classList.toggle('active', on)
    if (btn instanceof HTMLElement) {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false')
    }
  })
}

function setCardHidden(card: HTMLElement, hide: boolean) {
  card.classList.toggle('is-hidden', hide)
  card.hidden = hide
}

/** Download center */
export function initDownloadCenterFilters(root: ParentNode = document): () => void {
  const buttons = Array.from(root.querySelectorAll('[data-download-filter], .download-filter-button'))
  const search = root.querySelector(
    '#downloadSearch, [data-download-search], input.download-search-input',
  ) as HTMLInputElement | null
  const cards = Array.from(root.querySelectorAll('.download-card')) as HTMLElement[]
  if (!cards.length) return () => {}

  let category = 'all'
  let query = ''

  const apply = () => {
    const q = query.trim().toLowerCase()
    cards.forEach((card) => {
      const cat = (card.getAttribute('data-download-category') || 'all').toLowerCase()
      const keywords = (card.getAttribute('data-download-keywords') || '').toLowerCase()
      const text = `${card.textContent || ''} ${keywords}`.toLowerCase()
      const okCat = category === 'all' || cat === category
      const okQ = !q || text.includes(q)
      setCardHidden(card, !(okCat && okQ))
    })
  }

  const onFilter = (event: Event) => {
    const btn = (event.target as HTMLElement | null)?.closest?.(
      '[data-download-filter], .download-filter-button',
    ) as HTMLElement | null
    if (!btn) return
    category = (btn.getAttribute('data-download-filter') || 'all').toLowerCase()
    setActive(buttons, btn)
    apply()
  }

  const onSearch = () => {
    query = search?.value || ''
    apply()
  }

  buttons.forEach((btn) => btn.addEventListener('click', onFilter))
  search?.addEventListener('input', onSearch)
  apply()

  return () => {
    buttons.forEach((btn) => btn.removeEventListener('click', onFilter))
    search?.removeEventListener('input', onSearch)
  }
}

/** News hub */
export function initNewsHubFilters(root: ParentNode = document): () => void {
  const buttons = Array.from(root.querySelectorAll('[data-news-filter], .news-filter-button'))
  const cards = Array.from(
    root.querySelectorAll('.news-list-card, .news-card, [data-news-category]'),
  ) as HTMLElement[]
  if (!buttons.length || !cards.length) return () => {}

  let category = 'all'

  const apply = () => {
    cards.forEach((card) => {
      const cat = (card.getAttribute('data-news-category') || 'all').toLowerCase()
      setCardHidden(card, !(category === 'all' || cat === category))
    })
  }

  const onFilter = (event: Event) => {
    const btn = (event.target as HTMLElement | null)?.closest?.(
      '[data-news-filter], .news-filter-button',
    ) as HTMLElement | null
    if (!btn) return
    category = (btn.getAttribute('data-news-filter') || 'all').toLowerCase()
    setActive(buttons, btn)
    apply()
  }

  buttons.forEach((btn) => btn.addEventListener('click', onFilter))
  apply()
  return () => buttons.forEach((btn) => btn.removeEventListener('click', onFilter))
}

function normalizeText(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
}

/** Model center — matches verified HTML: data-category cards + data-model-filter buttons + is-hidden */
export function initModelCenterFilters(root: ParentNode = document): () => void {
  const buttons = Array.from(root.querySelectorAll('.model-category-button, [data-model-filter]'))
  const cards = Array.from(root.querySelectorAll('.model-library-card, .mc-post-card')) as HTMLElement[]
  const searchInput = root.querySelector(
    '#model-search-input, #model-hero-search-input, [data-model-search]',
  ) as HTMLInputElement | null
  const heroSearchButton = root.querySelector('#model-hero-search-button') as HTMLButtonElement | null
  const clearFilterButton = root.querySelector('#model-clear-filter') as HTMLButtonElement | null
  const resultCount = root.querySelector('#model-result-count') as HTMLElement | null
  const emptyState = root.querySelector('#model-empty-state') as HTMLElement | null
  if (!cards.length) return () => {}

  let activeCategory = 'all'

  const apply = () => {
    const keyword = normalizeText(searchInput?.value || '')
    let visibleCount = 0
    cards.forEach((card) => {
      const category = (card.dataset.category || card.getAttribute('data-category') || '').toLowerCase()
      const text = normalizeText(
        `${card.dataset.title || ''} ${card.dataset.keywords || ''} ${card.textContent || ''}`,
      )
      const categoryMatched = activeCategory === 'all' || activeCategory === category
      const keywordMatched = !keyword || text.includes(keyword)
      const visible = categoryMatched && keywordMatched
      card.classList.toggle('is-hidden', !visible)
      if (visible) visibleCount += 1
    })
    if (resultCount) resultCount.textContent = String(visibleCount)
    if (emptyState) emptyState.classList.toggle('is-hidden', visibleCount > 0)
  }

  const onChannel = (event: Event) => {
    const btn = (event.target as HTMLElement | null)?.closest?.('button') as HTMLElement | null
    if (!btn || !buttons.includes(btn)) return
    activeCategory = (btn.getAttribute('data-model-filter') || 'all').toLowerCase()
    setActive(buttons, btn)
    apply()
  }

  const onSearch = () => apply()

  const onClear = () => {
    activeCategory = 'all'
    if (searchInput) searchInput.value = ''
    const allBtn = buttons.find((b) => b.getAttribute('data-model-filter') === 'all')
    if (allBtn) setActive(buttons, allBtn)
    apply()
  }

  buttons.forEach((btn) => btn.addEventListener('click', onChannel))
  searchInput?.addEventListener('input', onSearch)
  heroSearchButton?.addEventListener('click', (e) => {
    e.preventDefault()
    apply()
  })
  clearFilterButton?.addEventListener('click', onClear)
  apply()

  const shareClean = initModelShare(root)
  const modalClean = initModelDetailModal(root)

  return () => {
    buttons.forEach((btn) => btn.removeEventListener('click', onChannel))
    searchInput?.removeEventListener('input', onSearch)
    clearFilterButton?.removeEventListener('click', onClear)
    shareClean()
    modalClean()
  }
}

const MODEL_CATEGORY_LABELS_ZH: Record<string, string> = {
  all: '全部模型',
  cnc: 'CNC 加工',
  '3dprint': '3D 打印',
  sheet: '钣金加工',
  injection: '注塑模具',
  casting: '铸造结构',
}

const MODEL_CATEGORY_LABELS_EN: Record<string, string> = {
  all: 'All models',
  cnc: 'CNC machining',
  '3dprint': '3D printing',
  sheet: 'Sheet metal',
  injection: 'Injection mold',
  casting: 'Casting',
}

function modelCategoryLabel(category: string) {
  const map = isEnglishUi() ? MODEL_CATEGORY_LABELS_EN : MODEL_CATEGORY_LABELS_ZH
  const fallback = isEnglishUi() ? 'Model' : '模型'
  return map[category] || category || fallback
}

/** Detail modal: open from 查看详情 / comment / ?model= */
export function initModelDetailModal(root: ParentNode = document): () => void {
  const modal = root.querySelector('#model-detail-modal') as HTMLElement | null
  if (!modal) return () => {}

  const modalImage = modal.querySelector('#model-modal-image') as HTMLImageElement | null
  const modalTitle = modal.querySelector('#model-modal-title') as HTMLElement | null
  const modalDescription = modal.querySelector('#model-modal-description') as HTMLElement | null
  const modalCategory = modal.querySelector('#model-modal-category') as HTMLElement | null
  const modalFormat = modal.querySelector('#model-modal-format') as HTMLElement | null
  const modalMaterial = modal.querySelector('#model-modal-material') as HTMLElement | null
  const modalDownloads = modal.querySelector('#model-modal-downloads') as HTMLElement | null
  const modalInteractions = modal.querySelector('#model-modal-interactions') as HTMLElement | null
  const modalDownload = modal.querySelector('#model-modal-download') as HTMLAnchorElement | null
  const modalShare = modal.querySelector('#model-modal-share') as HTMLButtonElement | null
  const modalFav = modal.querySelector('#model-modal-fav') as HTMLButtonElement | null
  const commentList = modal.querySelector('#model-modal-comment-list') as HTMLElement | null
  const commentInput = modal.querySelector('.model-comment-form textarea') as HTMLTextAreaElement | null
  const commentSubmit = modal.querySelector('#model-modal-comment-submit') as HTMLButtonElement | null

  const cards = Array.from(root.querySelectorAll('.mc-post-card, .model-library-card')) as HTMLElement[]

  const getCard = (modelId: string) =>
    cards.find((card) => (card.dataset.modelId || card.getAttribute('data-model-id')) === modelId)

  const closeModal = () => {
    modal.hidden = true
    modal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('model-modal-open')
  }

  const openModal = (modelId: string) => {
    const card = getCard(modelId)
    if (!card) return

    const image = card.querySelector('.mc-preview-viewport img, .mc-post-preview img, .model-card-media img') as
      | HTMLImageElement
      | null
    const title = card.querySelector('h2, h3')
    const description = card.querySelector('.mc-post-main > p')
    const downloadLink = card.querySelector('.mc-post-file a[href]') as HTMLAnchorElement | null
    const category = (card.dataset.category || '').toLowerCase()

    if (modalImage) {
      modalImage.src = image?.src || ''
      modalImage.alt = title?.textContent?.trim() || ''
    }
    if (modalTitle) modalTitle.textContent = title?.textContent?.trim() || card.dataset.title || ''
    if (modalDescription) {
      modalDescription.textContent = description?.textContent?.trim() || ''
    }
    if (modalCategory) {
      modalCategory.textContent = modelCategoryLabel(category)
    }
    if (modalFormat) modalFormat.textContent = card.dataset.format || '-'
    if (modalMaterial) modalMaterial.textContent = card.dataset.material || '-'
    if (modalDownloads) modalDownloads.textContent = card.dataset.downloads || '0'
    if (modalInteractions) {
      const likes = card.dataset.likes || '0'
      const comments = card.dataset.comments || '0'
      modalInteractions.textContent = isEnglishUi()
        ? `${likes} likes / ${comments} comments`
        : `${likes} 点赞 / ${comments} 评论`
    }
    if (modalDownload && downloadLink) {
      modalDownload.href = downloadLink.getAttribute('href') || '#'
      modalDownload.setAttribute('download', '')
    }
    if (modalShare) {
      modalShare.setAttribute('data-model-id', modelId)
      modalShare.setAttribute('data-share-title', card.dataset.title || modalTitle?.textContent || '')
    }

    if (commentList) {
      const sourceComments = card.querySelectorAll('.mc-post-comments p')
      if (sourceComments.length) {
        commentList.innerHTML = Array.from(sourceComments)
          .map((p) => `<p>${p.innerHTML}</p>`)
          .join('')
      } else {
        commentList.innerHTML = isEnglishUi()
          ? '<p><strong>Community:</strong> No comments yet — share the first manufacturing tip.</p>'
          : '<p><strong>社区：</strong>暂无评论，来发布第一条制造建议吧。</p>'
      }
    }

    modal.hidden = false
    modal.setAttribute('aria-hidden', 'false')
    document.body.classList.add('model-modal-open')

    const url = new URL(window.location.href)
    url.searchParams.set('model', modelId)
    window.history.replaceState({}, '', url.toString())
  }

  const onTriggerClick = (event: Event) => {
    const trigger = (event.target as HTMLElement | null)?.closest?.(
      '.model-detail-trigger, .model-comment-button, [data-model-target]',
    ) as HTMLElement | null
    if (!trigger || !root.contains(trigger)) return
    // ignore share handled elsewhere
    if (trigger.matches('[data-model-share], .model-share-button')) return
    const modelId = trigger.getAttribute('data-model-target') || ''
    if (!modelId) return
    event.preventDefault()
    openModal(modelId)
  }

  const onCloseClick = (event: Event) => {
    const close = (event.target as HTMLElement | null)?.closest?.('[data-model-modal-close]')
    if (!close || !modal.contains(close as Node)) return
    closeModal()
    const url = new URL(window.location.href)
    url.searchParams.delete('model')
    window.history.replaceState({}, '', url.toString())
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal()
      const url = new URL(window.location.href)
      url.searchParams.delete('model')
      window.history.replaceState({}, '', url.toString())
    }
  }

  const onFav = () => {
    if (!modalFav) return
    const on = modalFav.classList.toggle('is-active')
    if (isEnglishUi()) {
      modalFav.textContent = on ? 'Saved' : 'Save model'
    } else {
      modalFav.textContent = on ? '已收藏' : '收藏模型'
    }
  }

  const onCommentSubmit = () => {
    if (!commentList || !commentInput) return
    const text = commentInput.value.trim()
    if (!text) return
    const p = document.createElement('p')
    const who = isEnglishUi() ? 'Me' : '我'
    p.innerHTML = `<strong>${who}：</strong>${text.replace(/</g, '&lt;')}`
    commentList.appendChild(p)
    commentInput.value = ''
  }

  root.addEventListener('click', onTriggerClick)
  modal.addEventListener('click', onCloseClick)
  document.addEventListener('keydown', onKeydown)
  modalFav?.addEventListener('click', onFav)
  commentSubmit?.addEventListener('click', onCommentSubmit)

  // deep link
  const initial = new URLSearchParams(window.location.search).get('model')
  if (initial) {
    requestAnimationFrame(() => openModal(initial))
  }

  return () => {
    root.removeEventListener('click', onTriggerClick)
    modal.removeEventListener('click', onCloseClick)
    document.removeEventListener('keydown', onKeydown)
    modalFav?.removeEventListener('click', onFav)
    commentSubmit?.removeEventListener('click', onCommentSubmit)
    document.body.classList.remove('model-modal-open')
  }
}

/** Per-post share: Web Share API or copy deep link `?model=<id>`. */
export function initModelShare(root: ParentNode = document): () => void {
  const onClick = async (event: Event) => {
    const btn = (event.target as HTMLElement | null)?.closest?.(
      '[data-model-share], .model-share-button',
    ) as HTMLButtonElement | null
    if (!btn || !root.contains(btn)) return

    event.preventDefault()
    const modelId = btn.getAttribute('data-model-id') || ''
    const title =
      btn.getAttribute('data-share-title') ||
      btn.closest('.mc-post-card')?.getAttribute('data-title') ||
      (isEnglishUi() ? 'Model community' : '模型社区')
    const url = new URL(window.location.href)
    url.pathname = '/resources/model-center'
    if (modelId) url.searchParams.set('model', modelId)
    else url.searchParams.delete('model')
    const shareUrl = url.toString()

    const label = btn.querySelector('span')
    const prev = label?.textContent || (isEnglishUi() ? 'Share' : '分享')

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: String(title), url: shareUrl, text: String(title) })
        return
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      btn.classList.add('is-copied')
      if (label) label.textContent = isEnglishUi() ? 'Link copied' : '已复制链接'
      window.setTimeout(() => {
        btn.classList.remove('is-copied')
        if (label) label.textContent = prev
      }, 1600)
    } catch {
      window.prompt(isEnglishUi() ? 'Copy share link:' : '复制分享链接：', shareUrl)
    }
  }

  root.addEventListener('click', onClick)
  return () => root.removeEventListener('click', onClick)
}
