# -*- coding: utf-8 -*-
"""Post-fix hubs + re-extract EN service/finish details; patch registry."""
from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import unquote

from bs4 import BeautifulSoup

ROOT = Path(r"D:\zhizao\zhizao\react")
HTML_DIR = ROOT / "营销页（已核对）"
EN_DIR = HTML_DIR / "EN"
OUT_ZH = ROOT / "marketing-react" / "src" / "locales" / "zh" / "capabilities"
OUT_EN = ROOT / "marketing-react" / "src" / "locales" / "en" / "capabilities"
REG = ROOT / "marketing-react" / "src" / "data" / "capabilities" / "registry.json"
MEDIA = ROOT / "marketing-react" / "scripts" / "_extracted_media.json"

from sync_from_verified_html import extract_detail, write_detail  # noqa: E402

SERVICE_EN = {
    "service-cnc-machining.html": ("service", "cnc"),
    "service-molding.html": ("service", "mold"),
    "service-custom-manufacturing.html": ("service", "custom"),
    "service-metal-stamping.html": ("service", "stamping"),
    "service-metal-casting.html": ("service", "casting"),
    "service-metal-forging.html": ("service", "forging"),
    "service-3d-printing.html": ("service", "3d-printing"),
    "service-rapid-prototypes.html": ("service", "rapid-prototype"),
}

FINISH_EN = {
    "finish-anodizing.html": ("finish", "anodizing"),
    "finish-electroplating.html": ("finish", "plating"),
    "finish-painting.html": ("finish", "painting"),
    "finish-powder-coating.html": ("finish", "powder-coating"),
    "finish-passivation.html": ("finish", "passivation"),
    "finish-heat-treatment.html": ("finish", "heat-treatment"),
    "finish-laser-marking.html": ("finish", "laser-marking"),
    "finish-polishing.html": ("finish", "polishing"),
    "finish-black-oxide.html": ("finish", "blackening"),
}

SERVICE_HREF = {
    "cnc-service": "/capabilities/service/cnc",
    "molding-service": "/capabilities/service/mold",
    "custom-service": "/capabilities/service/custom",
    "stamping-service": "/capabilities/service/stamping",
    "casting-service": "/capabilities/service/casting",
    "forging-service": "/capabilities/service/forging",
    "printing-service": "/capabilities/service/3d-printing",
    "prototype-service": "/capabilities/service/rapid-prototype",
}

FINISH_HREF = {
    "anodizing": "/capabilities/finish/anodizing",
    "electroplating": "/capabilities/finish/plating",
    "plating": "/capabilities/finish/plating",
    "painting": "/capabilities/finish/painting",
    "powder": "/capabilities/finish/powder-coating",
    "powder-coating": "/capabilities/finish/powder-coating",
    "passivation": "/capabilities/finish/passivation",
    "heat": "/capabilities/finish/heat-treatment",
    "heat-treatment": "/capabilities/finish/heat-treatment",
    "laser-marking": "/capabilities/finish/laser-marking",
    "polishing": "/capabilities/finish/polishing",
    "black-oxide": "/capabilities/finish/blackening",
    "blackening": "/capabilities/finish/blackening",
}

SERVICE_FILTER_KEYS = ["all", "prototype", "production", "metal", "integrated"]

TITLE_HREF_HINTS = [
    (r"CNC|数控", "/capabilities/service/cnc"),
    (r"模具|Mold", "/capabilities/service/mold"),
    (r"定制|Custom", "/capabilities/service/custom"),
    (r"冲压|Stamp", "/capabilities/service/stamping"),
    (r"铸造|Cast", "/capabilities/service/casting"),
    (r"锻造|Forg", "/capabilities/service/forging"),
    (r"3D|打印|Print", "/capabilities/service/3d-printing"),
    (r"手板|原型|Prototype|Rapid", "/capabilities/service/rapid-prototype"),
    (r"阳极|Anodiz", "/capabilities/finish/anodizing"),
    (r"电镀|Plating|Electro", "/capabilities/finish/plating"),
    (r"粉末|Powder", "/capabilities/finish/powder-coating"),
    (r"喷涂|Painting|Paint", "/capabilities/finish/painting"),
    (r"钝化|Passivat", "/capabilities/finish/passivation"),
    (r"热处|Heat", "/capabilities/finish/heat-treatment"),
    (r"打标|Marking", "/capabilities/finish/laser-marking"),
    (r"抛光|Polish", "/capabilities/finish/polishing"),
    (r"发黑|Black", "/capabilities/finish/blackening"),
    (r"铝|Aluminum", "/capabilities/material/aluminum"),
    (r"不锈钢|Stainless", "/capabilities/material/stainless"),
    (r"碳钢|Carbon", "/capabilities/material/carbon"),
    (r"铜|Copper", "/capabilities/material/copper"),
    (r"塑料|Plastic", "/capabilities/material/plastic"),
    (r"钛|Titanium", "/capabilities/material/titanium"),
    (r"复合|Composite", "/capabilities/material/composite"),
    (r"薄板|Sheet", "/capabilities/process/sheet-metal"),
    (r"激光|Laser", "/capabilities/process/laser"),
    (r"注塑|Injection", "/capabilities/process/injection"),
    (r"聚氨酯|Urethane", "/capabilities/process/polyurethane"),
    (r"异形|Complex", "/capabilities/process/special"),
    (r"微纳|Micro", "/capabilities/process/micro-3d"),
    (r"金属3D|Metal 3D", "/capabilities/process/metal-3d"),
    (r"医疗|Medical", "/capabilities/process/medical"),
]


def guess_href(title: str, fallback: str = "#") -> str:
    for pat, href in TITLE_HREF_HINTS:
        if re.search(pat, title, re.I):
            return href
    return fallback


def fix_service_hub(path: Path, html_path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "lxml")
    # fix filters by order
    filters = data.get("filters") or []
    for i, f in enumerate(filters):
        if i < len(SERVICE_FILTER_KEYS):
            f["key"] = SERVICE_FILTER_KEYS[i]
    data["filters"] = filters

    # rebuild cards from HTML for stage + href
    cards = []
    for card in soup.select(".feature-card"):
        cid = card.get("id") or ""
        stage = (card.get("data-service-stage") or "").split()
        img = card.select_one("img")
        src = ""
        if img and img.get("src"):
            m = re.search(r"precision/([^/?#]+)", img["src"].replace("\\", "/"))
            src = f"/precision/{m.group(1)}" if m else img["src"]
        h3 = (card.select_one("h3").get_text(" ", strip=True) if card.select_one("h3") else "")
        p = (card.select_one("p").get_text(" ", strip=True) if card.select_one("p") else "")
        a = card.select_one("a")
        link = a.get_text(" ", strip=True) if a else "了解更多"
        href = SERVICE_HREF.get(cid) or guess_href(h3)
        cards.append(
            {
                "id": cid,
                "group": stage[0] if stage else "",
                "groups": stage,
                "tags": stage,
                "img": src,
                "h3": h3,
                "title": h3,
                "p": p,
                "body": p,
                "href": href,
                "link": re.sub(r"\s+", " ", link).strip(),
            }
        )
    if cards:
        data["cards"] = cards
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("fixed service hub", path)


def fix_finish_hub(path: Path, html_path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "lxml")
    cards = []
    for card in soup.select(".finish-card, .feature-card"):
        cid = card.get("id") or ""
        tags = (card.get("data-finish-tags") or "").split()
        img = card.select_one("img")
        src = ""
        if img and img.get("src"):
            m = re.search(r"precision/([^/?#]+)", img["src"].replace("\\", "/"))
            src = f"/precision/{m.group(1)}" if m else img["src"]
        h3 = card.select_one("h3").get_text(" ", strip=True) if card.select_one("h3") else ""
        p = card.select_one("p").get_text(" ", strip=True) if card.select_one("p") else ""
        a = card.select_one("a")
        link = a.get_text(" ", strip=True) if a else "了解更多"
        href = FINISH_HREF.get(cid) or guess_href(h3)
        # normalize id for React
        nid = {
            "electroplating": "plating",
            "powder": "powder-coating",
            "heat": "heat-treatment",
            "black-oxide": "blackening",
        }.get(cid, cid)
        cards.append(
            {
                "id": nid,
                "group": "",
                "groups": tags,
                "tags": tags,
                "img": src,
                "h3": h3,
                "title": h3,
                "p": p,
                "body": p,
                "href": href,
                "link": re.sub(r"\s+", " ", link).strip(),
            }
        )
    if cards:
        data["cards"] = cards
    # rebuild filters from HTML if present
    filters = []
    for a in soup.select(".finish-filter a, .process-selector a, aside.side-menu a"):
        key = a.get("data-finish-filter") or a.get("data-process-filter")
        href = (a.get("href") or "").lstrip("#")
        if not key:
            key = href if href and href != "all" else None
        strong = a.select_one("strong")
        span = a.select_one("span")
        label_strong = strong.get_text(" ", strip=True) if strong else a.get_text(" ", strip=True)
        # map by Chinese/EN label order fallback
        filters.append(
            {
                "key": key or "all",
                "strong": label_strong,
                "span": span.get_text(" ", strip=True) if span else "",
            }
        )
    # if all keys still all, assign known finish filter keys by order
    FINISH_KEYS = ["all", "appearance", "corrosion", "wear", "marking", "clean"]
    if filters and all(f["key"] in ("all", "", None) for f in filters):
        for i, f in enumerate(filters):
            if i < len(FINISH_KEYS):
                f["key"] = FINISH_KEYS[i]
    if filters:
        data["filters"] = filters
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("fixed finish hub", path)


def fix_material_hub(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    MATERIAL_HREF = {
        "aluminum": "/capabilities/material/aluminum",
        "stainless": "/capabilities/material/stainless",
        "carbon": "/capabilities/material/carbon",
        "copper": "/capabilities/material/copper",
        "plastic": "/capabilities/material/plastic",
        "titanium": "/capabilities/material/titanium",
        "composite": "/capabilities/material/composite",
    }
    for c in data.get("cards") or []:
        c["href"] = MATERIAL_HREF.get(c.get("id"), c.get("href") or "#")
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("fixed material hub", path)


def fix_related_hrefs(dir_path: Path):
    for p in dir_path.glob("*.json"):
        if p.name.startswith("hub__"):
            continue
        data = json.loads(p.read_text(encoding="utf-8"))
        related = data.get("related") or {}
        changed = False
        for item in related.get("items") or []:
            href = item.get("href") or ""
            title = item.get("title") or ""
            if href in ("#", "") or "能力中心" in unquote(href) or href.endswith(".html"):
                item["href"] = guess_href(title, "/capabilities")
                changed = True
            if "waterjet" in href or "水刀" in title:
                item.update(
                    {
                        "img": "/precision/cnc-machining.png",
                        "title": "数控加工" if "水刀" in title or not title.isascii() else "CNC machining",
                        "body": item.get("body") or "",
                        "href": "/capabilities/process/cnc",
                    }
                )
                changed = True
        if changed:
            data["related"] = related
            p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def rebuild_registry():
    media = json.loads(MEDIA.read_text(encoding="utf-8")) if MEDIA.exists() else {}
    reg = json.loads(REG.read_text(encoding="utf-8"))
    details = {}

    def add(cat, slug, hero=None, parent=None, label=None):
        key = f"{cat}/{slug}"
        details[key] = {
            "category": cat,
            "slug": slug,
            "heroClass": hero or f"detail-{cat}",
            "mediaImg": media.get(key) or f"/precision/service-cnc.jpg",
            "parentHref": parent or f"/capabilities/{cat if cat != 'process' else 'process'}",
            "parentLabelKey": label or cat,
        }
        if cat == "process":
            details[key]["parentHref"] = "/capabilities/process"
            details[key]["parentLabelKey"] = "process"
            details[key]["heroClass"] = "detail-process"
        elif cat == "service":
            details[key]["parentHref"] = "/capabilities/service"
            details[key]["heroClass"] = "detail-service"
        elif cat == "finish":
            details[key]["parentHref"] = "/capabilities/finish"
            details[key]["heroClass"] = "detail-finish"
        elif cat == "material":
            details[key]["parentHref"] = "/capabilities/material"
            details[key]["heroClass"] = "detail-material"
            details[key]["parentLabelKey"] = "material"

    for slug in [
        "sheet-metal",
        "injection",
        "cnc",
        "polyurethane",
        "laser",
        "special",
        "micro-3d",
        "metal-3d",
        "medical",
    ]:
        add("process", slug)
    for slug in [
        "cnc",
        "mold",
        "custom",
        "stamping",
        "casting",
        "forging",
        "3d-printing",
        "rapid-prototype",
    ]:
        add("service", slug)
    for slug in [
        "anodizing",
        "plating",
        "painting",
        "powder-coating",
        "passivation",
        "heat-treatment",
        "laser-marking",
        "polishing",
        "blackening",
    ]:
        add("finish", slug)
    # keep spray as alias of painting content optionally — leave file but not in registry primary list
    # still register spray pointing to painting media if file exists
    if (OUT_ZH / "finish__spray.json").exists():
        add("finish", "spray")
        details["finish/spray"]["mediaImg"] = media.get("finish/painting") or details["finish/painting"]["mediaImg"]

    for slug in ["aluminum", "stainless", "carbon", "copper", "plastic", "titanium", "composite"]:
        add("material", slug)

    reg["details"] = details
    REG.write_text(json.dumps(reg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("registry details", len(details))


def main():
    # re-extract EN service + finish
    for fname, (cat, slug) in {**SERVICE_EN, **FINISH_EN}.items():
        path = EN_DIR / fname
        if not path.exists():
            print("missing", fname)
            continue
        data = extract_detail(path, "en", cat, slug)
        out, media = write_detail(data, "en")
        print("EN", cat, slug, "->", out.name)

    fix_service_hub(OUT_ZH / "hub__service.json", HTML_DIR / "能力中心—服务部分.html")
    fix_service_hub(OUT_EN / "hub__service.json", EN_DIR / "capabilities-services.html")
    fix_finish_hub(OUT_ZH / "hub__finish.json", HTML_DIR / "能力中心—表面处理部分.html")
    fix_finish_hub(OUT_EN / "hub__finish.json", EN_DIR / "capabilities-finishes.html")
    fix_material_hub(OUT_ZH / "hub__material.json")
    fix_material_hub(OUT_EN / "hub__material.json")
    fix_related_hrefs(OUT_ZH)
    fix_related_hrefs(OUT_EN)
    rebuild_registry()


if __name__ == "__main__":
    main()
