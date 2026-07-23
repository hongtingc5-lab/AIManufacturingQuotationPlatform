import type { Resource } from 'i18next'

const zhDetailModules = import.meta.glob('../locales/zh/capabilities/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const enDetailModules = import.meta.glob('../locales/en/capabilities/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

function nestCapabilities(modules: Record<string, unknown>) {
  const details: Record<string, Record<string, unknown>> = {
    process: {},
    service: {},
    finish: {},
    material: {},
  }
  const hubs: Record<string, unknown> = {}

  for (const [path, data] of Object.entries(modules)) {
    const file = path.split('/').pop() || ''
    if (file.startsWith('hub__')) {
      const hub = file.replace(/^hub__/, '').replace(/\.json$/, '')
      hubs[hub] = data
      continue
    }
    const m = file.match(/^(process|service|finish|material)__(.+)\.json$/)
    if (!m) continue
    details[m[1]][m[2]] = data
  }

  return {
    capDetails: details,
    capabilitiesService: hubs.service,
    capabilitiesMaterial: hubs.material,
    capabilitiesFinish: hubs.finish,
  }
}

export function mergeCapabilityLocales<T extends Record<string, unknown>>(base: T, lang: 'zh' | 'en'): T {
  const modules = lang === 'zh' ? zhDetailModules : enDetailModules
  const nested = nestCapabilities(modules)
  const pages = {
    ...((base.pages as Record<string, unknown>) || {}),
    ...nested,
  }
  return { ...base, pages }
}

export type CapabilityCategory = 'process' | 'service' | 'finish' | 'material'

export const CAPABILITY_DETAIL_SLUGS: Record<CapabilityCategory, string[]> = {
  process: [
    'sheet-metal',
    'injection',
    'cnc',
    'polyurethane',
    'laser',
    'special',
    'micro-3d',
    'metal-3d',
    'medical',
  ],
  service: [
    'cnc',
    'mold',
    'custom',
    'stamping',
    'casting',
    'forging',
    '3d-printing',
    'rapid-prototype',
  ],
  finish: [
    'anodizing',
    'plating',
    'painting',
    'spray',
    'powder-coating',
    'passivation',
    'heat-treatment',
    'laser-marking',
    'polishing',
    'blackening',
  ],
  material: ['aluminum', 'stainless', 'carbon', 'copper', 'plastic', 'titanium', 'composite'],
}

export function isCapabilityDetail(
  category: string,
  slug: string,
): category is CapabilityCategory {
  return (
    (category === 'process' ||
      category === 'service' ||
      category === 'finish' ||
      category === 'material') &&
    CAPABILITY_DETAIL_SLUGS[category].includes(slug)
  )
}

/** unused helper kept for typing Resource merges */
export type CapabilityResource = Resource
