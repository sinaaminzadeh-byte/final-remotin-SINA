#!/usr/bin/env python3
"""Scaffold a new Lineage A Remotion motion project under projects/<slug>/
with locked creator-brand-v1 assets, Doran FaNum fonts, QuestionCover,
CreatorSignature, core.tsx (T ink-bounds), objects.tsx, audit.tsx, and scripts.

Usage:
    python3 scripts/new_project.py <slug>
"""
from pathlib import Path
import argparse, json, re, shutil, sys

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "starter-template"
KIT = ROOT / "brand-kit/creator-brand-v1"

ap = argparse.ArgumentParser()
ap.add_argument("slug", help="Kebab-case thematic versioned project slug, e.g. topic-name-v01")
args = ap.parse_args()

slug = args.slug.strip()
if not re.fullmatch(r"[a-z0-9][a-z0-9-]*-v\d{2}", slug):
    print(f"ERROR: slug '{slug}' must be kebab-case ending with version, e.g. my-topic-v01", file=sys.stderr)
    sys.exit(2)

dest = ROOT / "projects" / slug
if dest.exists():
    print(f"ERROR: target project already exists: {dest}", file=sys.stderr)
    sys.exit(2)

shutil.copytree(TEMPLATE, dest)
(dest / "public/creator-brand-v1").mkdir(parents=True, exist_ok=True)
(dest / "src/creator-brand").mkdir(parents=True, exist_ok=True)
(dest / "qa").mkdir(parents=True, exist_ok=True)

# Copy official locked brand kit assets
kit_assets = [
    "DoranFaNum-Bold.woff2",
    "DoranFaNum-ExtraBold.woff2",
    "DoranFaNum-Black.woff2",
    "background.png",
    "paper-grain.png",
    "pixel-mark.png",
    "signature-2k.png",
]
for name in kit_assets:
    shutil.copy2(KIT / "assets" / name, dest / "public/creator-brand-v1" / name)
for name in [
    "DoranFaNum-Bold.woff2",
    "DoranFaNum-ExtraBold.woff2",
    "DoranFaNum-Black.woff2",
    "background.png",
    "pixel-mark.png",
]:
    shutil.copy2(KIT / "assets" / name, dest / "public" / name)

# Copy official brand components
shutil.copy2(KIT / "brand.json", dest / "src/creator-brand/brand.json")
shutil.copy2(KIT / "components/CreatorSignature.tsx", dest / "src/creator-brand/CreatorSignature.tsx")
shutil.copy2(KIT / "components/QuestionCover.tsx", dest / "src/creator-brand/QuestionCover.tsx")

# Update package.json name
pkg_path = dest / "package.json"
pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
pkg["name"] = slug
pkg_path.write_text(json.dumps(pkg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

# Create placeholder narration.txt & brief.md
(dest / "narration.txt").write_text("متن دقیق نریشن را اینجا قرار دهید.\n", encoding="utf-8")
shutil.copy2(ROOT / "rules/BRIEF_TEMPLATE.md", dest / "brief.md")

print(f"SUCCESS: Created Lineage A project at {dest.relative_to(ROOT)}")
print("Next steps:")
print(f"  1. Put narration audio at {dest.relative_to(ROOT)}/public/narration.mp3")
print(f"  2. Put exact Persian transcript in {dest.relative_to(ROOT)}/narration.txt")
print("  3. Run scripts/ctc.py -> plan semantic-beats.json -> design scenes -> preview:frames -> render")
print(f"  4. Verify with: python3 scripts/verify_project.py {dest.relative_to(ROOT)}")
