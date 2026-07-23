#!/usr/bin/env node
/**
 * Reads ZH news locale JSON files and writes fully translated EN versions.
 * Run: node scripts/write-news-en-locales.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ZH_DIR = join(ROOT, 'apps/marketing/src/locales/zh/news');
const EN_DIR = join(ROOT, 'apps/marketing/src/locales/en/news');

const CN_RE = /[\u4e00-\u9fff]/g;

function countCn(value) {
  return (value.match(CN_RE) || []).length;
}

/** @type {Record<string, string>} */
const DOC_TITLES = {
  'manufacturing-service-upgrade':
    'One-Stop Precision Manufacturing Service Upgrade | News | ProMakeHub',
  'material-performance-comparison':
    'Machined Material Performance Parameter Comparison | News | ProMakeHub',
  'precision-machining-risk-control':
    'Precision Machining Full-Process Project Risk Control | News | ProMakeHub',
};

const DATA_PATH = join(__dirname, 'write-news-en-locales.data.json');

if (!existsSync(DATA_PATH)) {
  await import('./build-news-en-data.mjs');
}

/** Longest-first replacement map: Chinese text -> professional manufacturing English */
const REPLACEMENTS = Object.entries(
  JSON.parse(readFileSync(DATA_PATH, 'utf8')),
).sort((a, b) => b[0].length - a[0].length);

function cleanupEnglish(html) {
  return html
    .replace(/。/g, '.')
    .replace(/？/g, '?')
    .replace(/\?{2,}/g, '?')
    .replace(/\.{2,}/g, '.')
    .replace(/\.\s*\./g, '.');
}

function translateText(text) {
  let out = text;
  for (const [from, to] of REPLACEMENTS) {
    if (out.includes(from)) {
      out = out.split(from).join(to);
    }
  }
  return cleanupEnglish(out);
}

function translateArticle(zh) {
  return {
    docTitle: DOC_TITLES[zh.slug] ?? translateText(zh.docTitle),
    bodyClasses: zh.bodyClasses,
    mainHtml: translateText(zh.mainHtml),
    slug: zh.slug,
  };
}

const SOURCE_SLUGS = [
  'manufacturing-service-upgrade',
  'material-performance-comparison',
  'precision-machining-risk-control',
];

mkdirSync(EN_DIR, { recursive: true });

for (const slug of SOURCE_SLUGS) {
  const zhPath = join(ZH_DIR, `${slug}.json`);
  const zh = JSON.parse(readFileSync(zhPath, 'utf8'));
  const en = translateArticle(zh);
  const enPath = join(EN_DIR, `${slug}.json`);
  writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`, 'utf8');
  const cn = countCn(JSON.stringify(en));
  console.log(`Wrote ${slug}.json cn=${cn}`);
  if (cn > 0) {
    const remaining = [...JSON.stringify(en).matchAll(CN_RE)].map((m) => m[0]);
    console.error(`  Remaining Chinese chars: ${[...new Set(remaining)].join(', ')}`);
    process.exitCode = 1;
  }
}

const VERIFY_FILES = [
  'manufacturing-service-upgrade.json',
  'material-performance-comparison.json',
  'precision-machining-risk-control.json',
  'aluminum-stainless-titanium.json',
  'automation-parts-trends.json',
];

console.log('\nVerification:');
for (const file of VERIFY_FILES) {
  const content = readFileSync(join(EN_DIR, file), 'utf8');
  console.log(`${file}: cn=${countCn(content)}`);
}
