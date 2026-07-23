/**
 * Shared chrome behaviors matching static HTML:
 * - relocate header out of .hero (EN index embeds it inside)
 * - hide fixed header after hero / on scroll past page heroes
 * - homepage-style dual hero auto-rotation when .hero exists
 */

type Cleanup = () => void

function relocateHeader(root: ParentNode = document): void {
  const header = root.querySelector('.site-header') as HTMLElement | null
  const hero = root.querySelector('.hero') as HTMLElement | null
  if (!header || !hero) return
  if (header.parentElement === hero && hero.parentElement) {
    hero.parentElement.insertBefore(header, hero)
  }
}

function initHeaderVisibility(root: ParentNode = document): Cleanup {
  const header = root.querySelector('.site-header') as HTMLElement | null
  if (!header) return () => undefined

  const hero = root.querySelector('.hero') as HTMLElement | null
  const pageHero = root.querySelector(
    '.page-hero, .subpage-hero, .solution-command-hero, .template-hero, .case-hero, .supplement-hero',
  ) as HTMLElement | null

  let lastY = window.scrollY
  let ticking = false

  const sync = () => {
    ticking = false
    // Full-bleed homepage hero: hide once the hero has scrolled past the bar
    if (hero && document.body.contains(hero)) {
      const rect = hero.getBoundingClientRect()
      header.classList.toggle('is-hidden', rect.bottom <= 96)
      return
    }

    // Subpages: hide on scroll down after leaving the top; show on scroll up
    const y = window.scrollY
    const delta = y - lastY
    lastY = y

    if (y < 40) {
      header.classList.remove('is-hidden')
      return
    }

    // Keep bar visible while the page hero is still the main viewport
    if (pageHero && document.body.contains(pageHero)) {
      const rect = pageHero.getBoundingClientRect()
      if (rect.bottom > 120) {
        header.classList.remove('is-hidden')
        return
      }
    }

    if (delta > 8) header.classList.add('is-hidden')
    else if (delta < -8) header.classList.remove('is-hidden')
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(sync)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', sync)
  sync()

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', sync)
    header.classList.remove('is-hidden', 'is-jump-hidden')
  }
}

function initHeroRotation(root: ParentNode = document): Cleanup {
  const hero = root.querySelector('.hero') as HTMLElement | null
  if (!hero) return () => undefined

  let heroStage = hero.classList.contains('is-second') ? 1 : 0
  let rotationTimer: number | null = null
  let transitionLocked = false
  let touchStartY: number | null = null
  const rotationDelay = 6200

  const setHeroStage = (nextStage: number) => {
    if (nextStage === heroStage) return
    heroStage = nextStage
    hero.classList.toggle('is-second', heroStage === 1)
    transitionLocked = true
    window.setTimeout(() => {
      transitionLocked = false
    }, 980)
  }

  const stopAutoRotation = () => {
    if (rotationTimer != null) {
      window.clearTimeout(rotationTimer)
      rotationTimer = null
    }
  }

  const startAutoRotation = () => {
    stopAutoRotation()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) return
    rotationTimer = window.setTimeout(() => {
      setHeroStage(heroStage === 0 ? 1 : 0)
      startAutoRotation()
    }, rotationDelay)
  }

  const canControlHero = () => {
    const rect = hero.getBoundingClientRect()
    return rect.top <= 2 && rect.bottom > window.innerHeight * 0.58
  }

  const handleDirection = (deltaY: number, event: Event) => {
    if (!canControlHero()) return false
    if (transitionLocked) {
      event.preventDefault()
      return true
    }
    if (deltaY > 0 && heroStage === 0) {
      event.preventDefault()
      setHeroStage(1)
      startAutoRotation()
      return true
    }
    if (deltaY < 0 && heroStage === 1 && window.scrollY <= hero.offsetTop + 6) {
      event.preventDefault()
      setHeroStage(0)
      startAutoRotation()
      return true
    }
    return false
  }

  const onWheel = (event: WheelEvent) => {
    handleDirection(event.deltaY, event)
  }
  const onTouchStart = (event: TouchEvent) => {
    touchStartY = event.touches[0]?.clientY ?? null
  }
  const onTouchMove = (event: TouchEvent) => {
    if (touchStartY === null || !event.touches[0]) return
    const deltaY = touchStartY - event.touches[0].clientY
    if (Math.abs(deltaY) < 24) return
    if (handleDirection(deltaY, event)) touchStartY = event.touches[0].clientY
  }
  const onTouchEnd = () => {
    touchStartY = null
  }
  const onVisibility = () => {
    if (document.hidden) stopAutoRotation()
    else startAutoRotation()
  }

  hero.addEventListener('focusin', stopAutoRotation)
  hero.addEventListener('focusout', startAutoRotation)
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  startAutoRotation()

  return () => {
    stopAutoRotation()
    hero.removeEventListener('focusin', stopAutoRotation)
    hero.removeEventListener('focusout', startAutoRotation)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
    document.removeEventListener('visibilitychange', onVisibility)
    hero.classList.remove('is-second')
  }
}

function initQuoteJumpHide(root: ParentNode = document): Cleanup {
  const header = root.querySelector('.site-header') as HTMLElement | null
  if (!header) return () => undefined

  const links = Array.from(root.querySelectorAll('a[href="#quote"]')) as HTMLAnchorElement[]
  const onClick = () => {
    header.classList.add('is-hidden', 'is-jump-hidden')
    window.setTimeout(() => {
      header.classList.remove('is-jump-hidden')
    }, 420)
  }
  links.forEach((link) => link.addEventListener('click', onClick))
  return () => {
    links.forEach((link) => link.removeEventListener('click', onClick))
  }
}

/** Initialize site chrome; call returned cleanup on route unmount. */
export function initSiteChrome(root: ParentNode = document): Cleanup {
  relocateHeader(root)
  const cleanups = [
    initHeaderVisibility(root),
    initHeroRotation(root),
    initQuoteJumpHide(root),
  ]
  return () => {
    cleanups.forEach((fn) => fn())
  }
}
