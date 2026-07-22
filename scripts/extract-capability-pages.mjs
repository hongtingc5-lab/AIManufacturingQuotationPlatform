/**
 * Extract capability hub/detail copy from public/static-pages JSON into
 * structured locale drafts under src/locales/{zh,en}/capabilities/
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const staticDir = path.join(root, 'public', 'static-pages')

const DETAIL_MAP = [
  ['process', 'sheet-metal', 'capabilities__process__sheet-metal.json'],
  ['process', 'injection', 'capabilities__process__injection.json'],
  ['process', 'cnc', 'capabilities__process__cnc.json'],
  ['process', 'polyurethane', 'capabilities__process__polyurethane.json'],
  ['process', 'laser', 'capabilities__process__laser.json'],
  ['process', 'special', 'capabilities__process__special.json'],
  ['process', 'micro-3d', 'capabilities__process__micro-3d.json'],
  ['process', 'metal-3d', 'capabilities__process__metal-3d.json'],
  ['service', 'cnc', 'capabilities__service__cnc.json'],
  ['service', 'mold', 'capabilities__service__mold.json'],
  ['service', 'custom', 'capabilities__service__custom.json'],
  ['service', 'stamping', 'capabilities__service__stamping.json'],
  ['service', 'casting', 'capabilities__service__casting.json'],
  ['service', 'forging', 'capabilities__service__forging.json'],
  ['service', '3d-printing', 'capabilities__service__3d-printing.json'],
  ['service', 'rapid-prototype', 'capabilities__service__rapid-prototype.json'],
  ['finish', 'anodizing', 'capabilities__finish__anodizing.json'],
  ['finish', 'plating', 'capabilities__finish__plating.json'],
  ['finish', 'painting', 'capabilities__finish__painting.json'],
  ['finish', 'spray', 'capabilities__finish__spray.json'],
  ['finish', 'powder-coating', 'capabilities__finish__powder-coating.json'],
  ['finish', 'passivation', 'capabilities__finish__passivation.json'],
  ['finish', 'heat-treatment', 'capabilities__finish__heat-treatment.json'],
  ['finish', 'laser-marking', 'capabilities__finish__laser-marking.json'],
  ['finish', 'polishing', 'capabilities__finish__polishing.json'],
]

const HUB_MAP = [
  ['service', 'capabilities__service.json'],
  ['material', 'capabilities__material.json'],
  ['finish', 'capabilities__finish.json'],
]

function stripTags(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripKeepBr(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '<br>')
    .replace(/<(?!br\b)[^>]+>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function first(html, re) {
  const m = html.match(re)
  return m ? m[1] : ''
}

function all(html, re) {
  const flags = re.flags.includes('g') ? re.flags : `${re.flags}g`
  return [...html.matchAll(new RegExp(re.source, flags))]
}

function extractMain(body) {
  const m = body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  if (m) return m[1]
  // finish pages may miss opening <main>
  const idx = body.search(/<section\b[^>]*class="[^"]*page-hero/i)
  const end = body.lastIndexOf('</main>')
  if (idx >= 0 && end > idx) return body.slice(idx, end)
  return body
}

function extractDetail(body, title) {
  const main = extractMain(body)
  const hero = first(main, /(<section\b[^>]*class="[^"]*page-hero[\s\S]*?<\/section>)/i) || main
  const crumb = first(hero, /<(?:div|nav)[^>]*class="breadcrumb"[^>]*>([\s\S]*?)<\/(?:div|nav)>/i)
  const crumbParts = crumb
    ? all(crumb, /<(?:a|b|span)[^>]*>([\s\S]*?)<\/(?:a|b|span)>/gi)
        .map((x) => stripTags(x[1]))
        .filter((t) => t && t !== '/')
    : []
  const h1 = stripTags(first(hero, /<h1[^>]*>([\s\S]*?)<\/h1>/i))
  const heroDesc = stripTags(first(hero, /<div class="hero-copy"[\s\S]*?<p>([\s\S]*?)<\/p>/i))
  const stats = all(
    hero,
    /<div class="hero-stat"[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi,
  ).map((m) => ({ value: stripTags(m[1]), label: stripTags(m[2]) }))

  const detailSec =
    first(main, /(<section\b[^>]*class="[^"]*detail-section[\s\S]*?<\/section>)/i) || ''
  const mediaImg =
    first(detailSec, /<img[^>]*class="[^"]*detail-media[^"]*"[^>]*src="([^"]+)"/i) ||
    first(detailSec, /detail-media[^>]*src="([^"]+)"/i) ||
    first(detailSec, /<img[^>]+src="([^"]+)"/i)
  const bodyH2 = stripTags(first(detailSec, /detail-body[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i))
  const bodyP = stripTags(
    first(detailSec, /detail-body[\s\S]*?<h2[^>]*>[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/i),
  )

  const pillBlock = first(detailSec, /<div class="pill-row"[^>]*>([\s\S]*?)<\/div>/i)
  const pills = pillBlock
    ? all(pillBlock, /<(?:span|a|li)[^>]*>([\s\S]*?)<\/(?:span|a|li)>/gi)
        .map((m) => stripTags(m[1]))
        .filter(Boolean)
    : []

  let panels = all(
    detailSec,
    /<div class="info-panel"[^>]*>\s*<h3[^>]*>([\s\S]*?)<\/h3>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi,
  ).map((m) => ({ title: stripTags(m[1]), subtitle: stripTags(m[2]), body: stripTags(m[3]) }))
  if (!panels.length) {
    panels = all(
      detailSec,
      /<div class="info-panel"[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p>([\s\S]*?)<\/p>/gi,
    ).map((m) => ({ title: stripTags(m[1]), subtitle: '', body: stripTags(m[2]) }))
  }

  const tableCard = first(detailSec, /(<div class="table-card"[\s\S]*?<\/div>\s*<\/div>)/i) ||
    first(detailSec, /(<div class="table-card"[\s\S]*?<\/table>[\s\S]*?<\/div>)/i)
  const tableTitle = stripTags(
    first(tableCard, /<(?:h2|h3|strong)[^>]*>([\s\S]*?)<\/(?:h2|h3|strong)>/i),
  )
  const tableRows = all(tableCard, /<tr[^>]*>([\s\S]*?)<\/tr>/gi).map((row) =>
    all(row[1], /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi).map((c) => stripTags(c[1])),
  )

  const stepItems = all(
    detailSec,
    /<div class="step-item"[^>]*>\s*(?:<b[^>]*>([\s\S]*?)<\/b>)?\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi,
  ).map((m) => ({
    index: stripTags(m[1] || ''),
    title: stripTags(m[2]),
    body: stripTags(m[3]),
  }))
  if (!stepItems.length) {
    const alt = all(
      detailSec,
      /<(?:li|div)[^>]*class="[^"]*step-item[^"]*"[^>]*>[\s\S]*?<strong>([\s\S]*?)<\/strong>[\s\S]*?<span>([\s\S]*?)<\/span>/gi,
    ).map((m, i) => ({
      index: String(i + 1).padStart(2, '0'),
      title: stripTags(m[1]),
      body: stripTags(m[2]),
    }))
    stepItems.push(...alt)
  }

  const stepsHeading = stripTags(
    first(
      detailSec,
      /<(?:h2|h3|b)[^>]*>([\s\S]*?)<\/(?:h2|h3|b)>\s*(?:<div class="step-list"|<ol class="step-list")/i,
    ),
  )

  const asideList = all(detailSec, /aside-list[\s\S]*?<\/ul>/i)[0]?.[0]
  let asideItems = asideList
    ? all(
        asideList,
        /<li[^>]*>\s*<span>([\s\S]*?)<\/span>\s*<strong>([\s\S]*?)<\/strong>/gi,
      ).map((m) => ({ label: stripTags(m[1]), value: stripTags(m[2]) }))
    : []
  if (!asideItems.length && asideList) {
    asideItems = all(
      asideList,
      /<li[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi,
    ).map((m) => ({ label: stripTags(m[1]), value: stripTags(m[2]) }))
  }

  const asideCtaBlock = first(detailSec, /(<div class="aside-cta"[\s\S]*?<\/div>)/i)
  const asideCta = {
    title: stripTags(first(asideCtaBlock, /<(?:h3|h4|strong)[^>]*>([\s\S]*?)<\/(?:h3|h4|strong)>/i)),
    body: stripTags(first(asideCtaBlock, /<p>([\s\S]*?)<\/p>/i)),
    button: stripTags(first(asideCtaBlock, /<a[^>]*>([\s\S]*?)<\/a>/i)),
  }

  // related section
  const softSections = all(
    main,
    /<section\b[^>]*class="[^"]*section[^"]*soft[^"]*"[^>]*>([\s\S]*?)<\/section>/gi,
  )
  let related = { title: '', desc: '', items: [] }
  let faq = { title: '', desc: '', items: [] }
  for (const sec of softSections) {
    const html = sec[1]
    if (/faq-list|geo-faq|faq-item/i.test(html) || /常见问题|FAQ/i.test(html)) {
      faq = {
        title: stripTags(first(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
        desc: stripTags(first(html, /section-head[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
        items: all(
          html,
          /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/gi,
        ).map((m) => ({ q: stripTags(m[1]), a: stripTags(m[2]) })),
      }
    } else if (/related-grid|related-card|相关/i.test(html)) {
      related = {
        title: stripTags(first(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
        desc: stripTags(first(html, /section-head[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
        items: all(
          html,
          /<article class="related-card">\s*<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<a class="text-link" href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
        ).map((m) => ({
          img: m[1],
          title: stripTags(m[3] || m[2]),
          body: stripTags(m[4]),
          href: m[5],
          link: stripTags(m[6]),
        })),
      }
    }
  }

  // dedicated geo-faq section
  const faqSec = first(main, /(<section\b[^>]*geo-faq[\s\S]*?<\/section>)/i)
  if (faqSec) {
    faq = {
      title: stripTags(first(faqSec, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
      desc: stripTags(first(faqSec, /section-head[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
      items: all(
        faqSec,
        /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/gi,
      ).map((m) => ({ q: stripTags(m[1]), a: stripTags(m[2]) })),
    }
  }

  const cta = first(main, /(<section\b[^>]*class="[^"]*cta-band[\s\S]*?<\/section>)/i)
  const ctaTitle = stripTags(first(cta, /<h2[^>]*>([\s\S]*?)<\/h2>/i))
  const ctaDesc = stripTags(first(cta, /<p>([\s\S]*?)<\/p>/i))
  const ctaButton = stripTags(first(cta, /<a[^>]*>([\s\S]*?)<\/a>/i))

  return {
    docTitle: title,
    breadcrumb: crumbParts,
    heroTitle: h1,
    heroDesc,
    heroStats: stats,
    mediaImg,
    bodyTitle: bodyH2,
    bodyDesc: bodyP,
    pills,
    panels,
    tableTitle,
    tableRows,
    stepsTitle: stepsHeading,
    steps: stepItems,
    asideItems,
    asideCta,
    related,
    faq,
    ctaTitle: ctaTitle || asideCta.title || '需要匹配制造能力方案？',
    ctaDesc: ctaDesc || asideCta.body || '上传图纸或说明项目需求，我们会协助评估更合适的制造路径。',
    ctaButton: ctaButton || asideCta.button || '立即报价',
  }
}

function extractHubCards(main, cardClass) {
  return all(
    main,
    new RegExp(
      `<a[^>]*class="[^"]*${cardClass}[^"]*"[^>]*(?:href="([^"]*)")?[^>]*>[\\s\\S]*?(?:<img[^>]+src="([^"]+)"[\\s\\S]*?)?<h3[^>]*>([\\s\\S]*?)<\\/h3>[\\s\\S]*?<p>([\\s\\S]*?)<\\/p>`,
      'gi',
    ),
  ).map((m) => ({
    href: m[1] || '',
    img: m[2] || '',
    title: stripTags(m[3]),
    body: stripTags(m[4]),
  }))
}

function extractServiceHub(body, title) {
  const main = extractMain(body)
  const hero = first(main, /(<section\b[^>]*page-hero[\s\S]*?<\/section>)/i)
  const filters = all(
    main,
    /data-service-filter="([^"]+)"[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi,
  ).map((m) => ({ key: m[1], strong: stripTags(m[2]), span: stripTags(m[3]) }))
  const tipStrong = stripTags(first(main, /process-filter-note[\s\S]*?<strong>([\s\S]*?)<\/strong>/i))
  const tipBody = stripTags(first(main, /process-filter-note[\s\S]*?<span>([\s\S]*?)<\/span>/i))
  const cards = all(
    main,
    /<article class="feature-card"[^>]*(?:id="([^"]*)")?[^>]*(?:data-service-stage="([^"]*)")?[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>[\s\S]*?<a class="text-link" href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
  ).map((m) => ({
    id: m[1] || '',
    group: (m[2] || 'all').split(/\s+/)[0] || 'all',
    groups: (m[2] || 'all').split(/\s+/).filter(Boolean),
    img: m[3],
    h3: stripTags(m[5]),
    p: stripTags(m[6]),
    href: m[7],
    link: stripTags(m[8]).replace(/查看服务.*/, '查看服务'),
  }))
  const soft = first(main, /(<section\b[^>]*class="[^"]*section soft[^"]*"[^>]*>([\s\S]*?)<\/section>)/i)
  const softTitle = stripTags(first(soft, /<h2[^>]*>([\s\S]*?)<\/h2>/i))
  const softDesc = stripTags(first(soft, /section-head[\s\S]*?<p>([\s\S]*?)<\/p>/i))
  const panels = all(
    soft,
    /<div class="info-panel"[^>]*>\s*<h3[^>]*>([\s\S]*?)<\/h3>\s*(?:<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>|<p>([\s\S]*?)<\/p>)/gi,
  ).map((m) => ({
    title: stripTags(m[1]),
    subtitle: stripTags(m[2] || ''),
    body: stripTags(m[3] || m[4] || ''),
  }))
  const steps = all(
    soft,
    /step-item[\s\S]*?<strong>([\s\S]*?)<\/strong>[\s\S]*?<span>([\s\S]*?)<\/span>/gi,
  ).map((m, i) => ({ index: String(i + 1).padStart(2, '0'), title: stripTags(m[1]), body: stripTags(m[2]) }))
  const faqSec = first(main, /(<section\b[^>]*geo-faq[\s\S]*?<\/section>)/i)
  const faq = {
    title: stripTags(first(faqSec, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
    desc: stripTags(first(faqSec, /section-head[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
    items: all(faqSec, /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/gi).map(
      (m) => ({ q: stripTags(m[1]), a: stripTags(m[2]) }),
    ),
  }
  const cta = first(main, /(<section\b[^>]*cta-band[\s\S]*?<\/section>)/i)
  return {
    docTitle: title,
    heroTitle: stripTags(first(hero, /<h1[^>]*>([\s\S]*?)<\/h1>/i)),
    heroDesc: stripTags(first(hero, /hero-copy[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
    heroStats: all(
      hero,
      /hero-stat[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi,
    ).map((m) => ({ value: stripTags(m[1]), label: stripTags(m[2]) })),
    sectionTitle: stripTags(first(main, /section-head[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i)),
    sectionDesc: stripTags(first(main, /section-head[\s\S]*?<h2[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/i)),
    filterTitle: stripTags(first(main, /process-selector-title[^>]*>([\s\S]*?)</i)),
    filters,
    tipTitle: tipStrong,
    tipBody,
    cards,
    softTitle,
    softDesc,
    panels,
    steps,
    faq,
    ctaTitle: stripTags(first(cta, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
    ctaDesc: stripTags(first(cta, /<p>([\s\S]*?)<\/p>/i)),
    ctaButton: stripTags(first(cta, /<a[^>]*>([\s\S]*?)<\/a>/i)),
  }
}

function extractMaterialHub(body, title) {
  const main = extractMain(body)
  const hero = first(main, /(<section\b[^>]*page-hero[\s\S]*?<\/section>)/i)
  let chips = all(
    main,
    /material-filter-chip[^>]*data-material-filter="([^"]*)"[^>]*>([\s\S]*?)<\/button>/gi,
  ).map((m) => ({ key: m[1], label: stripTags(m[2]) }))
  if (!chips.length) {
    chips = all(main, /data-material-filter="([^"]*)"[^>]*>([\s\S]*?)<\//gi).map((m) => ({
      key: m[1],
      label: stripTags(m[2]),
    }))
  }
  const cards = all(
    main,
    /<article class="material-card"[^>]*id="([^"]+)"[^>]*(?:data-material-tags="([^"]*)")?[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<small>([\s\S]*?)<\/small>[\s\S]*?<img[^>]+src="([^"]+)"/gi,
  ).map((m) => ({
    id: m[1],
    tags: (m[2] || '').split(/\s+/).filter(Boolean),
    title: stripTags(m[3]),
    grades: stripTags(m[4]),
    body: stripTags(m[5]),
    img: m[6],
  }))
  const faqSec = first(main, /(<section\b[^>]*geo-faq[\s\S]*?<\/section>)/i)
  const cta = first(main, /(<section\b[^>]*cta-band[\s\S]*?<\/section>)/i)
  return {
    docTitle: title,
    heroTitle: stripTags(first(hero, /<h1[^>]*>([\s\S]*?)<\/h1>/i)),
    heroDesc: stripTags(first(hero, /hero-copy[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
    heroStats: all(
      hero,
      /hero-stat[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi,
    ).map((m) => ({ value: stripTags(m[1]), label: stripTags(m[2]) })),
    searchPlaceholder: first(hero, /placeholder="([^"]*)"/i) || '搜索材料',
    sectionTitle: stripTags(first(main, /section-head[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i)),
    sectionDesc: stripTags(first(main, /section-head[\s\S]*?<h2[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/i)),
    chips,
    cards,
    faq: {
      title: stripTags(first(faqSec, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
      desc: stripTags(first(faqSec, /section-head[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
      items: all(faqSec, /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/gi).map(
        (m) => ({ q: stripTags(m[1]), a: stripTags(m[2]) }),
      ),
    },
    ctaTitle: stripTags(first(cta, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
    ctaDesc: stripTags(first(cta, /<p>([\s\S]*?)<\/p>/i)),
    ctaButton: stripTags(first(cta, /<a[^>]*>([\s\S]*?)<\/a>/i)),
  }
}

function extractFinishHub(body, title) {
  const main = extractMain(body)
  const hero = first(main, /(<section\b[^>]*page-hero[\s\S]*?<\/section>)/i)
  const filters = all(
    main,
    /data-finish-filter="([^"]*)"[^>]*>\s*(?:<strong>)?([\s\S]*?)(?:<\/strong>)?(?:\s*<span>([\s\S]*?)<\/span>)?/gi,
  ).map((m) => ({ key: m[1], strong: stripTags(m[2]), span: stripTags(m[3] || '') }))
  const cards = all(
    main,
    /<article class="[^"]*finish-card[^"]*"[^>]*(?:data-finish-tags="([^"]*)")?[^>]*(?:id="([^"]*)")?[^>]*>\s*<img[^>]+src="([^"]+)"[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>[\s\S]*?<a class="text-link" href="([^"]*)"/gi,
  ).map((m) => ({
    tags: (m[1] || '').split(/\s+/).filter(Boolean),
    id: m[2] || '',
    img: m[3],
    title: stripTags(m[4]),
    body: stripTags(m[5]),
    href: m[6],
  }))
  const faqSec = first(main, /(<section\b[^>]*geo-faq[\s\S]*?<\/section>)/i)
  const cta = first(main, /(<section\b[^>]*cta-band[\s\S]*?<\/section>)/i)
  return {
    docTitle: title,
    heroTitle: stripTags(first(hero, /<h1[^>]*>([\s\S]*?)<\/h1>/i)),
    heroDesc: stripTags(first(hero, /hero-copy[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
    heroStats: all(
      hero,
      /hero-stat[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi,
    ).map((m) => ({ value: stripTags(m[1]), label: stripTags(m[2]) })),
    sectionTitle: stripTags(first(main, /section-head[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i)),
    sectionDesc: stripTags(first(main, /section-head[\s\S]*?<h2[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/i)),
    filters,
    cards,
    faq: {
      title: stripTags(first(faqSec, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
      desc: stripTags(first(faqSec, /section-head[\s\S]*?<p>([\s\S]*?)<\/p>/i)),
      items: all(faqSec, /<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/gi).map(
        (m) => ({ q: stripTags(m[1]), a: stripTags(m[2]) }),
      ),
    },
    ctaTitle: stripTags(first(cta, /<h2[^>]*>([\s\S]*?)<\/h2>/i)),
    ctaDesc: stripTags(first(cta, /<p>([\s\S]*?)<\/p>/i)),
    ctaButton: stripTags(first(cta, /<a[^>]*>([\s\S]*?)<\/a>/i)),
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

const outZh = path.join(root, 'src', 'locales', 'zh', 'capabilities')
const outEn = path.join(root, 'src', 'locales', 'en', 'capabilities')
const outMeta = path.join(root, 'src', 'data', 'capabilities')
fs.mkdirSync(outZh, { recursive: true })
fs.mkdirSync(outEn, { recursive: true })
fs.mkdirSync(outMeta, { recursive: true })

const meta = { details: {}, hubs: {} }

for (const [category, slug, file] of DETAIL_MAP) {
  const full = path.join(staticDir, file)
  const j = JSON.parse(fs.readFileSync(full, 'utf8'))
  const data = extractDetail(j.body, j.title)
  const key = `${category}__${slug}`
  writeJson(path.join(outZh, `${key}.json`), data)
  // EN stub = same structure; fill from EN HTML later where available
  writeJson(path.join(outEn, `${key}.json`), data)
  meta.details[`${category}/${slug}`] = {
    category,
    slug,
    heroClass:
      category === 'process' ? 'detail-process' : category === 'service' ? 'detail-service' : 'detail-finish',
    mediaImg: data.mediaImg || '/precision/service-cnc.jpg',
    parentHref: `/capabilities/${category}`,
    parentLabelKey: category,
  }
  console.log('detail', key, 'h1=', data.heroTitle, 'stats=', data.heroStats.length, 'faq=', data.faq.items.length)
}

for (const [hub, file] of HUB_MAP) {
  const full = path.join(staticDir, file)
  const j = JSON.parse(fs.readFileSync(full, 'utf8'))
  let data
  if (hub === 'service') data = extractServiceHub(j.body, j.title)
  else if (hub === 'material') data = extractMaterialHub(j.body, j.title)
  else data = extractFinishHub(j.body, j.title)
  writeJson(path.join(outZh, `hub__${hub}.json`), data)
  writeJson(path.join(outEn, `hub__${hub}.json`), data)
  meta.hubs[hub] = {
    cards: (data.cards || []).map((c) => ({
      href: c.href,
      img: c.img,
      id: c.id,
      group: c.group,
    })),
  }
  console.log('hub', hub, 'cards=', (data.cards || []).length, 'title=', data.heroTitle)
}

writeJson(path.join(outMeta, 'registry.json'), meta)
console.log('done')
