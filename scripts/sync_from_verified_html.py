# -*- coding: utf-8 -*-
"""Extract capability page copy from 营销页（已核对） into locale JSON."""
from __future__ import annotations

import json
import re
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(r"D:\zhizao\zhizao\react")
HTML_DIR = ROOT / "营销页（已核对）"
EN_DIR = HTML_DIR / "EN"
OUT_ZH = ROOT / "marketing-react" / "src" / "locales" / "zh" / "capabilities"
OUT_EN = ROOT / "marketing-react" / "src" / "locales" / "en" / "capabilities"
TRANS_ZH = ROOT / "marketing-react" / "src" / "locales" / "zh" / "translation.json"
TRANS_EN = ROOT / "marketing-react" / "src" / "locales" / "en" / "translation.json"

# Chinese detail HTML → (category, slug, out json stem)
DETAIL_ZH = {
    "能力中心—薄板加工子页面.html": ("process", "sheet-metal"),
    "能力中心—注塑成型子页面.html": ("process", "injection"),
    "能力中心—工艺部分子页面.html": ("process", "cnc"),  # CNC
    "能力中心—聚氨酯铸造子页面.html": ("process", "polyurethane"),
    "能力中心—激光切割子页面.html": ("process", "laser"),
    "能力中心—异形零件加工子页面.html": ("process", "special"),
    "能力中心—微纳3D打印子页面.html": ("process", "micro-3d"),
    "能力中心—金属3D打印子页面.html": ("process", "metal-3d"),
    "能力中心—医疗零件加工子页面.html": ("process", "medical"),
    "能力中心—CNC加工服务子页面.html": ("service", "cnc"),
    "能力中心—模具成型服务子页面.html": ("service", "mold"),
    "能力中心—定制加工服务子页面.html": ("service", "custom"),
    "能力中心—金属冲压服务子页面.html": ("service", "stamping"),
    "能力中心—金属铸造服务子页面.html": ("service", "casting"),
    "能力中心—金属锻造服务子页面.html": ("service", "forging"),
    "能力中心—3D打印服务子页面.html": ("service", "3d-printing"),
    "能力中心—快速手板模型服务子页面.html": ("service", "rapid-prototype"),
    "能力中心—阳极氧化表面处理子页面.html": ("finish", "anodizing"),
    "能力中心—电镀表面处理子页面.html": ("finish", "plating"),
    "能力中心—喷涂表面处理子页面.html": ("finish", "painting"),
    "能力中心—粉末喷涂表面处理子页面.html": ("finish", "powder-coating"),
    "能力中心—钝化处理表面处理子页面.html": ("finish", "passivation"),
    "能力中心—热处理表面处理子页面.html": ("finish", "heat-treatment"),
    "能力中心—激光打标表面处理子页面.html": ("finish", "laser-marking"),
    "能力中心—抛光表面处理子页面.html": ("finish", "polishing"),
    "能力中心—发黑处理表面处理子页面.html": ("finish", "blackening"),
    "能力中心—铝合金材料子页面.html": ("material", "aluminum"),
    "能力中心—不锈钢材料子页面.html": ("material", "stainless"),
    "能力中心—碳钢材料子页面.html": ("material", "carbon"),
    "能力中心—铜合金材料子页面.html": ("material", "copper"),
    "能力中心—工程塑料材料子页面.html": ("material", "plastic"),
    "能力中心—钛合金材料子页面.html": ("material", "titanium"),
    "能力中心—复合材料材料子页面.html": ("material", "composite"),
    # also misnamed aluminum duplicate
    "能力中心—材料部分子页面.html": ("material", "aluminum"),
    "能力中心—表面处理部分子页面.html": ("finish", "anodizing"),
}

# EN detail HTML → (category, slug)
DETAIL_EN = {
    "capability-sheet-metal.html": ("process", "sheet-metal"),
    "capability-injection-molding.html": ("process", "injection"),
    "capability-cnc-machining.html": ("process", "cnc"),
    "capability-urethane-casting.html": ("process", "polyurethane"),
    "capability-laser-cutting.html": ("process", "laser"),
    "capability-complex-parts.html": ("process", "special"),
    "capability-micro-3d-printing.html": ("process", "micro-3d"),
    "capability-metal-3d-printing.html": ("process", "metal-3d"),
    "capability-medical-parts.html": ("process", "medical"),
    "finish-anodizing.html": ("finish", "anodizing"),
    "capability-surface-finishing.html": ("finish", "anodizing"),
    "finish-black-oxide.html": ("finish", "blackening"),
    "material-aluminum-alloys.html": ("material", "aluminum"),
    "capability-materials.html": ("material", "aluminum"),
    "material-stainless-steel.html": ("material", "stainless"),
    "material-carbon-steel.html": ("material", "carbon"),
    "material-copper-alloys.html": ("material", "copper"),
    "material-engineering-plastics.html": ("material", "plastic"),
    "material-titanium-alloys.html": ("material", "titanium"),
    "material-composites.html": ("material", "composite"),
}

# href rewrite for related cards
HREF_MAP = {
    "capability-sheet-metal.html": "/capabilities/process/sheet-metal",
    "capability-laser-cutting.html": "/capabilities/process/laser",
    "capability-waterjet-cutting.html": "/capabilities/process/laser",  # waterjet removed
    "capability-injection-molding.html": "/capabilities/process/injection",
    "capability-cnc-machining.html": "/capabilities/process/cnc",
    "capability-urethane-casting.html": "/capabilities/process/polyurethane",
    "capability-complex-parts.html": "/capabilities/process/special",
    "capability-micro-3d-printing.html": "/capabilities/process/micro-3d",
    "capability-metal-3d-printing.html": "/capabilities/process/metal-3d",
    "capability-medical-parts.html": "/capabilities/process/medical",
    "capabilities-finishes.html": "/capabilities/finish",
    "capabilities-processes.html": "/capabilities/process",
    "capabilities-services.html": "/capabilities/service",
    "capabilities-materials.html": "/capabilities/material",
    "material-aluminum-alloys.html": "/capabilities/material/aluminum",
    "material-stainless-steel.html": "/capabilities/material/stainless",
    "material-carbon-steel.html": "/capabilities/material/carbon",
    "material-copper-alloys.html": "/capabilities/material/copper",
    "material-engineering-plastics.html": "/capabilities/material/plastic",
    "material-titanium-alloys.html": "/capabilities/material/titanium",
    "material-composites.html": "/capabilities/material/composite",
    "finish-anodizing.html": "/capabilities/finish/anodizing",
    "finish-black-oxide.html": "/capabilities/finish/blackening",
}

WATERJET_REPLACE_ZH = {
    "img": "/precision/cnc-machining.png",
    "title": "数控加工",
    "body": "适合精密结构件与复杂曲面加工。",
    "href": "/capabilities/process/cnc",
    "link": "查看工艺详情",
}
WATERJET_REPLACE_EN = {
    "img": "/precision/cnc-machining.png",
    "title": "CNC machining",
    "body": "Precision parts and complex surfaces.",
    "href": "/capabilities/process/cnc",
    "link": "View process details",
}


def text(el: Tag | None) -> str:
    if el is None:
        return ""
    return " ".join(el.get_text(" ", strip=True).split())


def first(soup: BeautifulSoup, sel: str) -> Tag | None:
    return soup.select_one(sel)


def img_src(src: str | None) -> str:
    if not src:
        return ""
    src = src.replace("\\", "/")
    # ../precision/x.png or ./precision/x.png → /precision/x.png
    m = re.search(r"(?:^|/)precision/([^/?#]+)$", src)
    if m:
        return f"/precision/{m.group(1)}"
    if src.startswith("../"):
        return "/" + src[3:]
    if src.startswith("./"):
        return "/" + src[2:]
    return src


def resolve_href(href: str | None, lang: str) -> str:
    if not href:
        return "#"
    href = href.strip()
    if href.startswith("/"):
        if "waterjet" in href:
            return "/capabilities/process/cnc"
        return href
    if href.startswith("#"):
        return href
    name = href.split("/")[-1].split("?")[0]
    if name in HREF_MAP:
        return HREF_MAP[name]
    # Chinese relative like 能力中心—激光切割子页面.html — leave mapped by title heuristics later
    if "激光" in name or "laser" in name.lower():
        return "/capabilities/process/laser"
    if "薄板" in name or "sheet" in name.lower():
        return "/capabilities/process/sheet-metal"
    if "水刀" in name or "waterjet" in name.lower():
        return "/capabilities/process/cnc"
    if "表面" in name or "finish" in name.lower():
        return "/capabilities/finish"
    if "数控" in name or "cnc" in name.lower():
        return "/capabilities/process/cnc"
    if "注塑" in name or "injection" in name.lower():
        return "/capabilities/process/injection"
    return "#"


def extract_detail(path: Path, lang: str, category: str, slug: str) -> dict:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "lxml")
    title = text(first(soup, "title")) or ""
    hero = first(soup, "section.page-hero")
    hero_h1 = text(hero.select_one("h1")) if hero else ""
    hero_p = ""
    if hero:
        # first p under hero-copy
        copy = hero.select_one(".hero-copy") or hero
        ps = copy.select("p")
        hero_p = text(ps[0]) if ps else ""
    hero_stats = []
    if hero:
        for st in hero.select(".hero-stat"):
            hero_stats.append(
                {"value": text(st.select_one("strong")), "label": text(st.select_one("span"))}
            )

    detail = first(soup, "section.detail-section") or first(soup, ".detail-section")
    media = ""
    body_title = ""
    body_desc = ""
    pills: list[str] = []
    panels: list[dict] = []
    table_title = ""
    table_rows: list[list[str]] = []
    steps: list[dict] = []
    aside_items: list[dict] = []
    aside_cta = {"title": "", "body": "", "button": ""}

    if detail:
        media_el = detail.select_one("img.detail-media") or detail.select_one(".detail-main img")
        media = img_src(media_el.get("src") if media_el else None)
        body = detail.select_one(".detail-body") or detail.select_one(".detail-main")
        if body:
            h2 = body.select_one("h2")
            body_title = text(h2)
            # first direct-ish paragraph after h2
            for p in body.find_all("p", recursive=True):
                # skip aside
                if p.find_parent(class_="detail-aside"):
                    continue
                body_desc = text(p)
                if body_desc:
                    break
            for pill in body.select(".pill-row .pill, .pill"):
                t = text(pill)
                if t and t not in pills:
                    pills.append(t)
            for panel in body.select(".info-panel"):
                panels.append(
                    {
                        "title": text(panel.select_one("h3")),
                        "subtitle": text(panel.select_one("strong")),
                        "body": text(panel.select_one("span")) or text(panel.select_one("p")),
                    }
                )
            table_card = body.select_one(".table-card")
            if table_card:
                table_title = text(table_card.select_one(".table-title h3, h3"))
                table = table_card.select_one("table")
                if table:
                    for tr in table.select("tr"):
                        cells = [text(c) for c in tr.select("th, td")]
                        if cells:
                            table_rows.append(cells)
            for step in body.select(".step-item"):
                steps.append(
                    {
                        "index": text(step.select_one("b")),
                        "title": text(step.select_one("strong")),
                        "body": text(step.select_one("span")),
                    }
                )
        aside = detail.select_one(".detail-aside")
        if aside:
            for li in aside.select(".aside-list li"):
                aside_items.append(
                    {"label": text(li.select_one("span")), "value": text(li.select_one("strong"))}
                )
            cta = aside.select_one(".aside-cta")
            if cta:
                aside_cta = {
                    "title": text(cta.select_one("h4, h3")),
                    "body": text(cta.select_one("p")),
                    "button": text(cta.select_one("a, button")),
                }

    # related
    related = {"title": "", "desc": "", "items": []}
    for sec in soup.select("section.section"):
        head = sec.select_one(".section-head")
        grid = sec.select_one(".related-grid")
        if not grid:
            continue
        related["title"] = text(head.select_one("h2")) if head else ""
        related["desc"] = text(head.select_one("p")) if head else ""
        for card in grid.select(".related-card"):
            a = card.select_one("a.text-link, a")
            href = resolve_href(a.get("href") if a else None, lang)
            img = card.select_one("img")
            item = {
                "img": img_src(img.get("src") if img else None),
                "title": text(card.select_one("h3")),
                "body": text(card.select_one("p")),
                "href": href,
                "link": text(a) if a else ("View details" if lang == "en" else "查看详情"),
            }
            # strip arrow text noise
            item["link"] = re.sub(r"\s+", " ", item["link"]).strip()
            if "水刀" in item["title"] or "Waterjet" in item["title"] or "waterjet" in (item["href"] or ""):
                item = dict(WATERJET_REPLACE_EN if lang == "en" else WATERJET_REPLACE_ZH)
            related["items"].append(item)
        break

    # FAQ
    faq = {"title": "", "desc": "", "items": []}
    faq_sec = first(soup, "section.geo-faq-section") or first(soup, "[data-geo-faq]")
    if faq_sec:
        head = faq_sec.select_one(".section-head")
        faq["title"] = text(head.select_one("h2")) if head else ""
        faq["desc"] = text(head.select_one("p")) if head else ""
        for d in faq_sec.select("details.faq-item, details"):
            faq["items"].append({"q": text(d.select_one("summary")), "a": text(d.select_one("p"))})

    # bottom CTA if present
    cta_band = first(soup, "section.cta-band")
    cta_title = text(cta_band.select_one("h2")) if cta_band else ""
    cta_desc = text(cta_band.select_one("p")) if cta_band else ""
    cta_button = text(cta_band.select_one("a")) if cta_band else ""
    if not cta_title:
        # synthesize from aside / defaults
        if lang == "en":
            cta_title = "Need a manufacturing plan?"
            cta_desc = "Share drawings and requirements — our engineers will recommend a stable process route."
            cta_button = "Get a quote"
        else:
            cta_title = "需要加工方案？"
            cta_desc = "提交图纸与需求后，工程师会结合结构、材料和批量给出更稳妥的工艺建议。"
            cta_button = "立即咨询"

    doc_title = title if title else f"{hero_h1} | {'ProMakeHub' if lang == 'en' else '敏捷智造'}"

    return {
        "docTitle": doc_title,
        "heroTitle": hero_h1,
        "heroDesc": hero_p,
        "heroStats": hero_stats,
        "mediaImg": media,
        "bodyTitle": body_title,
        "bodyDesc": body_desc,
        "pills": pills,
        "panels": panels,
        "tableTitle": table_title,
        "tableRows": table_rows,
        "steps": steps,
        "asideItems": aside_items,
        "asideCta": aside_cta,
        "related": related,
        "faq": faq,
        "ctaTitle": cta_title,
        "ctaDesc": cta_desc,
        "ctaButton": cta_button,
        "_meta": {"category": category, "slug": slug, "source": path.name},
    }


def write_detail(data: dict, lang: str):
    meta = data.pop("_meta")
    cat, slug = meta["category"], meta["slug"]
    out_dir = OUT_ZH if lang == "zh" else OUT_EN
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{cat}__{slug}.json"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return path, data.get("mediaImg", "")


def extract_process_hub(path: Path, lang: str) -> dict:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "lxml")
    hero = first(soup, "section.page-hero")
    hero_title = text(hero.select_one("h1")) if hero else ""
    hero_desc = text(hero.select_one(".hero-copy p")) if hero else ""
    hero_stats = []
    if hero:
        for st in hero.select(".hero-stat"):
            # keep labels only for translation.json style (values are hardcoded in component for process)
            hero_stats.append(text(st.select_one("span")))

    section = None
    for sec in soup.select("section.section"):
        if sec.select_one(".feature-card, .card-grid, .process-selector"):
            section = sec
            break
    section_title = ""
    section_desc = ""
    filters = []
    tip_title = ""
    tip_body = ""
    cards = []
    if section:
        head = section.select_one(".section-head")
        section_title = text(head.select_one("h2")) if head else ""
        section_desc = text(head.select_one("p")) if head else ""
        for a in section.select(".process-selector a, aside.side-menu a"):
            filters.append({"strong": text(a.select_one("strong")), "span": text(a.select_one("span"))})
        note = section.select_one(".process-filter-note")
        if note:
            tip_title = text(note.select_one("strong"))
            tip_body = text(note.select_one("span"))
        for card in section.select(".feature-card"):
            # skip hidden waterjet if present
            h3 = text(card.select_one("h3"))
            if "水刀" in h3 or "Waterjet" in h3:
                continue
            cards.append({"h3": h3, "p": text(card.select_one("p"))})

    faq_sec = first(soup, "section.geo-faq-section")
    faq = []
    faq_title = ""
    faq_desc = ""
    if faq_sec:
        head = faq_sec.select_one(".section-head")
        faq_title = text(head.select_one("h2")) if head else ""
        faq_desc = text(head.select_one("p")) if head else ""
        for d in faq_sec.select("details"):
            faq.append({"q": text(d.select_one("summary")), "a": text(d.select_one("p"))})

    cta = first(soup, "section.cta-band")
    return {
        "docTitle": text(first(soup, "title")),
        "heroTitle": hero_title,
        "heroDesc": hero_desc,
        "heroStats": hero_stats,
        "sectionTitle": section_title,
        "sectionDesc": section_desc,
        "filterTitle": text(section.select_one(".process-selector-title")) if section else "",
        "filters": filters,
        "tipTitle": tip_title,
        "tipBody": tip_body,
        "learnMore": "Learn more" if lang == "en" else "了解更多",
        "cards": cards,
        "empty": (
            "No processes match this filter. Switch to All to see the full list."
            if lang == "en"
            else "当前分类暂无匹配工艺，请切换到“全部工艺”查看完整工艺列表。"
        ),
        "faqTitle": faq_title,
        "faqDesc": faq_desc,
        "faq": faq,
        "ctaTitle": text(cta.select_one("h2")) if cta else "",
        "ctaDesc": text(cta.select_one("p")) if cta else "",
        "ctaButton": text(cta.select_one("a")) if cta else "",
    }


def extract_capabilities_home(path: Path, lang: str) -> dict:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "lxml")
    hero = first(soup, "section.page-hero")
    hero_stats = []
    if hero:
        for st in hero.select(".hero-stat span"):
            hero_stats.append(text(st))
    overview = first(soup, ".capability-overview-section") or None
    section_title = ""
    section_desc = ""
    cards = []
    if overview:
        head = overview.select_one(".section-head")
        section_title = text(head.select_one("h2")) if head else ""
        section_desc = text(head.select_one("p")) if head else ""
        for card in overview.select(".capability-overview-card"):
            cards.append(
                {
                    "title": text(card.select_one("h3")),
                    "desc": text(card.select_one("p")),
                    "cta": text(card.select_one("b")),
                }
            )
    while len(cards) < 4:
        cards.append({"title": "", "desc": "", "cta": ""})

    faq_sec = first(soup, "section.geo-faq-section")
    faq = []
    faq_title = ""
    faq_desc = ""
    if faq_sec:
        head = faq_sec.select_one(".section-head")
        faq_title = text(head.select_one("h2")) if head else ""
        faq_desc = text(head.select_one("p")) if head else ""
        for d in faq_sec.select("details"):
            faq.append({"q": text(d.select_one("summary")), "a": text(d.select_one("p"))})
    cta = first(soup, "section.cta-band")
    return {
        "docTitle": text(first(soup, "title")),
        "heroTitle": text(hero.select_one("h1")) if hero else "",
        "heroDesc": text(hero.select_one(".hero-copy p")) if hero else "",
        "heroStats": hero_stats,
        "sectionTitle": section_title,
        "sectionDesc": section_desc,
        "process": cards[0]["title"],
        "processDesc": cards[0]["desc"],
        "processCta": cards[0]["cta"],
        "service": cards[1]["title"],
        "serviceDesc": cards[1]["desc"],
        "serviceCta": cards[1]["cta"],
        "material": cards[2]["title"],
        "materialDesc": cards[2]["desc"],
        "materialCta": cards[2]["cta"],
        "finish": cards[3]["title"],
        "finishDesc": cards[3]["desc"],
        "finishCta": cards[3]["cta"],
        "faqTitle": faq_title,
        "faqDesc": faq_desc,
        "faq": faq,
        "ctaTitle": text(cta.select_one("h2")) if cta else "",
        "ctaDesc": text(cta.select_one("p")) if cta else "",
        "ctaButton": text(cta.select_one("a")) if cta else "",
    }


def extract_service_or_finish_hub(path: Path, lang: str, kind: str) -> dict:
    """kind: service | finish"""
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "lxml")
    hero = first(soup, "section.page-hero")
    hero_stats = []
    if hero:
        for st in hero.select(".hero-stat"):
            hero_stats.append(
                {"value": text(st.select_one("strong")), "label": text(st.select_one("span"))}
            )
    section = None
    for sec in soup.select("section.section"):
        if sec.select_one(".feature-card, .finish-card, .card-grid"):
            section = sec
            break
    filters = []
    tip_title = tip_body = ""
    cards = []
    section_title = section_desc = filter_title = ""
    if section:
        head = section.select_one(".section-head")
        section_title = text(head.select_one("h2")) if head else ""
        section_desc = text(head.select_one("p")) if head else ""
        filter_title = text(section.select_one(".process-selector-title, .side-menu b, aside b"))
        for a in section.select(".process-selector a, aside.side-menu a, .finish-filter a"):
            key = a.get("data-process-filter") or a.get("data-finish-filter") or a.get("href", "").lstrip("#") or "all"
            filters.append(
                {
                    "key": key if key != "all" else "all",
                    "strong": text(a.select_one("strong")) or text(a),
                    "span": text(a.select_one("span")),
                }
            )
        note = section.select_one(".process-filter-note")
        if note:
            tip_title = text(note.select_one("strong"))
            tip_body = text(note.select_one("span"))
        for card in section.select(".feature-card, .finish-card"):
            a = card.select_one("a.text-link, a")
            img = card.select_one("img")
            h3 = text(card.select_one("h3"))
            cid = card.get("id") or re.sub(r"\s+", "-", h3.lower())
            group = card.get("data-process-group") or card.get("data-finish-group") or ""
            tags = (card.get("data-finish-tags") or card.get("data-material-tags") or "").split()
            href = resolve_href(a.get("href") if a else None, lang)
            # map Chinese relative links for services
            if href == "#" and a:
                href = resolve_href(a.get("href"), lang)
            item = {
                "id": cid,
                "group": group,
                "groups": tags if tags else ([group] if group else []),
                "tags": tags,
                "img": img_src(img.get("src") if img else None),
                "h3": h3,
                "title": h3,
                "p": text(card.select_one("p")),
                "body": text(card.select_one("p")),
                "href": href,
                "link": text(a) if a else ("Learn more" if lang == "en" else "了解更多"),
            }
            cards.append(item)

    faq_sec = first(soup, "section.geo-faq-section")
    faq = {"title": "", "desc": "", "items": []}
    if faq_sec:
        head = faq_sec.select_one(".section-head")
        faq["title"] = text(head.select_one("h2")) if head else ""
        faq["desc"] = text(head.select_one("p")) if head else ""
        for d in faq_sec.select("details"):
            faq["items"].append({"q": text(d.select_one("summary")), "a": text(d.select_one("p"))})
    cta = first(soup, "section.cta-band")
    return {
        "docTitle": text(first(soup, "title")),
        "heroTitle": text(hero.select_one("h1")) if hero else "",
        "heroDesc": text(hero.select_one(".hero-copy p")) if hero else "",
        "heroStats": hero_stats,
        "sectionTitle": section_title,
        "sectionDesc": section_desc,
        "filterTitle": filter_title,
        "filters": filters,
        "tipTitle": tip_title,
        "tipBody": tip_body,
        "learnMore": "Learn more" if lang == "en" else "了解更多",
        "cards": cards,
        "faq": faq,
        "ctaTitle": text(cta.select_one("h2")) if cta else "",
        "ctaDesc": text(cta.select_one("p")) if cta else "",
        "ctaButton": text(cta.select_one("a")) if cta else "",
    }


def extract_material_hub(path: Path, lang: str) -> dict:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "lxml")
    hero = first(soup, "section.page-hero")
    hero_stats = []
    if hero:
        for st in hero.select(".hero-stat"):
            hero_stats.append(
                {"value": text(st.select_one("strong")), "label": text(st.select_one("span"))}
            )
    search = hero.select_one("input[type=search], .hero-search input") if hero else None
    section = None
    for sec in soup.select("section.section"):
        if sec.select_one(".material-grid, .material-filter-panel"):
            section = sec
            break
    chips = []
    cards = []
    filter_copy_span = filter_copy_strong = filter_aria = ""
    section_title = section_desc = ""
    if section:
        head = section.select_one(".section-head")
        section_title = text(head.select_one("h2")) if head else ""
        section_desc = text(head.select_one("p")) if head else ""
        panel = section.select_one(".material-filter-panel")
        if panel:
            filter_aria = panel.get("aria-label") or ""
            copy = panel.select_one(".material-filter-copy")
            if copy:
                filter_copy_span = text(copy.select_one("span"))
                filter_copy_strong = text(copy.select_one("strong"))
            for btn in panel.select(".material-filter-chip"):
                key = btn.get("data-material-filter") or "all"
                label_el = btn.select("span")
                label = text(label_el[-1]) if label_el else text(btn)
                chips.append({"key": key, "label": label})
        for card in section.select(".material-card"):
            tags = (card.get("data-material-tags") or "").split()
            cid = card.get("id") or ""
            cards.append(
                {
                    "id": cid,
                    "tags": tags,
                    "title": text(card.select_one("h3")),
                    "grades": text(card.select_one(".card-body > p, p")),
                    "body": text(card.select_one("small")),
                    "img": img_src((card.select_one("img") or {}).get("src") if card.select_one("img") else None),
                }
            )
    # map card hrefs for learn more
    MATERIAL_HREF = {
        "aluminum": "/capabilities/material/aluminum",
        "stainless": "/capabilities/material/stainless",
        "carbon": "/capabilities/material/carbon",
        "copper": "/capabilities/material/copper",
        "plastic": "/capabilities/material/plastic",
        "titanium": "/capabilities/material/titanium",
        "composite": "/capabilities/material/composite",
    }
    for c in cards:
        c["href"] = MATERIAL_HREF.get(c["id"], f"/capabilities/material/{c['id']}")

    faq_sec = first(soup, "section.geo-faq-section")
    faq = {"title": "", "desc": "", "items": []}
    if faq_sec:
        head = faq_sec.select_one(".section-head")
        faq["title"] = text(head.select_one("h2")) if head else ""
        faq["desc"] = text(head.select_one("p")) if head else ""
        for d in faq_sec.select("details"):
            faq["items"].append({"q": text(d.select_one("summary")), "a": text(d.select_one("p"))})
    cta = first(soup, "section.cta-band")
    return {
        "docTitle": text(first(soup, "title")),
        "heroTitle": text(hero.select_one("h1")) if hero else "",
        "heroDesc": text(hero.select_one(".hero-copy p")) if hero else "",
        "heroStats": hero_stats,
        "searchPlaceholder": (search.get("placeholder") if search else "") or "",
        "sectionTitle": section_title,
        "sectionDesc": section_desc,
        "filterAria": filter_aria or ("按选型目标筛选" if lang == "zh" else "Filter by material selection goal"),
        "filterEyebrow": filter_copy_span,
        "filterTitle": filter_copy_strong,
        "chips": chips,
        "cards": cards,
        "faq": faq,
        "ctaTitle": text(cta.select_one("h2")) if cta else "",
        "ctaDesc": text(cta.select_one("p")) if cta else "",
        "ctaButton": text(cta.select_one("a")) if cta else "",
    }


def merge_translation(path: Path, key: str, payload: dict):
    data = json.loads(path.read_text(encoding="utf-8"))
    pages = data.setdefault("pages", {})
    pages[key] = payload
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    media_map: dict[str, str] = {}
    report = []

    # --- ZH details ---
    for fname, (cat, slug) in DETAIL_ZH.items():
        # prefer dedicated files over misnamed duplicates when writing aluminum/anodizing twice
        path = HTML_DIR / fname
        if not path.exists():
            report.append(f"MISSING ZH {fname}")
            continue
        # skip misnamed duplicates if dedicated file exists
        if fname in ("能力中心—材料部分子页面.html", "能力中心—表面处理部分子页面.html"):
            continue
        data = extract_detail(path, "zh", cat, slug)
        out, media = write_detail(data, "zh")
        if media:
            media_map[f"{cat}/{slug}"] = media
        report.append(f"ZH detail {cat}/{slug} ← {fname} → {out.name}")

    # --- EN details (only where EN file exists) ---
    done_en = set()
    for fname, (cat, slug) in DETAIL_EN.items():
        key = f"{cat}/{slug}"
        if key in done_en:
            continue
        path = EN_DIR / fname
        if not path.exists():
            report.append(f"MISSING EN {fname}")
            continue
        data = extract_detail(path, "en", cat, slug)
        out, media = write_detail(data, "en")
        if media and key not in media_map:
            media_map[key] = media
        done_en.add(key)
        report.append(f"EN detail {key} ← {fname} → {out.name}")

    # For EN-missing service/finish details, copy ZH as placeholder but leave zh as source of truth;
    # user asked EN after ZH — if no EN file, keep previous en or copy zh with note
    for fname, (cat, slug) in DETAIL_ZH.items():
        if fname.startswith("能力中心—材料部分") or fname.startswith("能力中心—表面处理部分子"):
            continue
        key = f"{cat}/{slug}"
        if key in done_en:
            continue
        zh_path = OUT_ZH / f"{cat}__{slug}.json"
        en_path = OUT_EN / f"{cat}__{slug}.json"
        if zh_path.exists() and not en_path.exists():
            # leave existing en if any; else copy zh (temporary)
            if not en_path.exists():
                en_path.write_text(zh_path.read_text(encoding="utf-8"), encoding="utf-8")
                report.append(f"EN fallback copy {key} from ZH (no EN HTML)")

    # --- hubs ZH ---
    home_zh = extract_capabilities_home(HTML_DIR / "能力中心—能力中心部分.html", "zh")
    merge_translation(TRANS_ZH, "capabilitiesHome", home_zh)
    process_zh = extract_process_hub(HTML_DIR / "能力中心—工艺部分.html", "zh")
    merge_translation(TRANS_ZH, "capabilities", process_zh)

    service_zh = extract_service_or_finish_hub(HTML_DIR / "能力中心—服务部分.html", "zh", "service")
    (OUT_ZH / "hub__service.json").write_text(
        json.dumps(service_zh, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    finish_zh = extract_service_or_finish_hub(HTML_DIR / "能力中心—表面处理部分.html", "zh", "finish")
    (OUT_ZH / "hub__finish.json").write_text(
        json.dumps(finish_zh, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    material_zh = extract_material_hub(HTML_DIR / "能力中心—材料部分.html", "zh")
    (OUT_ZH / "hub__material.json").write_text(
        json.dumps(material_zh, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    # --- hubs EN ---
    home_en = extract_capabilities_home(EN_DIR / "capabilities.html", "en")
    merge_translation(TRANS_EN, "capabilitiesHome", home_en)
    process_en = extract_process_hub(EN_DIR / "capabilities-processes.html", "en")
    merge_translation(TRANS_EN, "capabilities", process_en)
    service_en = extract_service_or_finish_hub(EN_DIR / "capabilities-services.html", "en", "service")
    (OUT_EN / "hub__service.json").write_text(
        json.dumps(service_en, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    finish_en = extract_service_or_finish_hub(EN_DIR / "capabilities-finishes.html", "en", "finish")
    (OUT_EN / "hub__finish.json").write_text(
        json.dumps(finish_en, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    material_en = extract_material_hub(EN_DIR / "capabilities-materials.html", "en")
    (OUT_EN / "hub__material.json").write_text(
        json.dumps(material_en, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    # dump media map for registry update
    media_path = ROOT / "marketing-react" / "scripts" / "_extracted_media.json"
    media_path.parent.mkdir(parents=True, exist_ok=True)
    media_path.write_text(json.dumps(media_map, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    report_path = ROOT / "marketing-react" / "scripts" / "_extract_report.txt"
    report_path.write_text("\n".join(report) + "\n", encoding="utf-8")
    print(f"done {len(report)} lines; media {len(media_map)}")
    for line in report[-15:]:
        print(line)


if __name__ == "__main__":
    main()
