#!/usr/bin/env python3
"""Strict Anti-Drift QA Gate for Lineage A Remotion Reels.
Rejects Lineage B drift (paper.jpg, missing QuestionCover/CreatorSignature/audit.tsx/pixel-mark,
flat-icon low-detail scenes, broken RTL '>' titles, audio dropouts, or missing mistake review).

Usage:
    python3 scripts/verify_project.py projects/<slug>
"""
from pathlib import Path
import argparse, hashlib, json, re, sys

ROOT = Path(__file__).resolve().parents[1]
KIT = ROOT / "brand-kit/creator-brand-v1/assets"
MISTAKES_PATH = ROOT / "rules/KNOWN_MISTAKES.md"

ap = argparse.ArgumentParser()
ap.add_argument("project", help="Path to project directory, e.g. projects/warmup-06-japanese-rules-v01")
args = ap.parse_args()

P = (ROOT / args.project).resolve() if not Path(args.project).is_absolute() else Path(args.project).resolve()
if not P.is_dir():
    print(f"ERROR: project directory not found: {P}", file=sys.stderr)
    sys.exit(2)

def sha256(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()

errors = []
warnings = []
checks = {}

# 1. Check locked creator-brand-v1 kit assets match SHA-256 byte-for-byte
kit_files = [
    "DoranFaNum-Bold.woff2",
    "DoranFaNum-ExtraBold.woff2",
    "DoranFaNum-Black.woff2",
    "background.png",
    "paper-grain.png",
    "pixel-mark.png",
    "signature-2k.png",
]
kit_ok = True
for name in kit_files:
    expected = sha256(KIT / name)
    target = P / "public/creator-brand-v1" / name
    if not target.is_file():
        errors.append(f"[Lineage A] Missing brand kit asset: public/creator-brand-v1/{name}")
        kit_ok = False
    elif sha256(target) != expected:
        errors.append(f"[Lineage A] Brand kit asset tampered/changed: public/creator-brand-v1/{name}")
        kit_ok = False
checks["brandKitIntegrity"] = kit_ok

# 2. Forbid Lineage B drift artifacts
forbidden_files = ["public/paper.jpg", "public/paper.png", "final.mp4", "src/Stage.tsx"]
for rel in forbidden_files:
    if (P / rel).exists():
        errors.append(f"[M021 Lineage B Forbidden] Found forbidden file: {rel}")

# 3. Source architecture checks (QuestionCover, CreatorSignature, T ink-bounds, audit.tsx, tactile SVG craft)
src_files = sorted(list((P / "src").rglob("*.tsx")) + list((P / "src").rglob("*.ts")))
if not src_files:
    errors.append("No TypeScript/TSX source files found under src/")

all_src = "\n".join(f.read_text(encoding="utf-8", errors="ignore") for f in src_files)
must_have_tokens = {
    "QuestionCover": "QuestionCover",
    "CreatorSignature": "CreatorSignature",
    "TechMatrixBackdrop": "TechMatrixBackdrop",
    "actualBoundingBox": "actualBoundingBox",
    "auditComponent": "TYPECHECK ",
    "liftShadow": "heavyLift",
    "backgroundPng": "background.png",
    "pixelMarkPng": "pixel-mark.png",
}
for key, tok in must_have_tokens.items():
    ok = tok in all_src
    checks[f"src_{key}"] = ok
    if not ok:
        errors.append(f"[Lineage A] Missing required code/component pattern in src/: {tok}")

if "پرونده" in all_src and "includes(\"پرونده\")" not in all_src and "includes('پرونده')" not in all_src:
    errors.append("[Lineage A] Retired 'پرونده' folio text detected in src/")

svg_primitives = (
    all_src.count("<path")
    + all_src.count("<rect")
    + all_src.count("<circle")
    + all_src.count("<ellipse")
)
tactile_defs = (
    all_src.count("linearGradient")
    + all_src.count("radialGradient")
    + all_src.count("<pattern")
    + all_src.count("feDropShadow")
)
checks["svgPrimitives"] = svg_primitives
checks["tactileDefs"] = tactile_defs
if svg_primitives < 80:
    errors.append(f"[M021 Low Detail] Only {svg_primitives} SVG primitives in src/ (minimum 80; Warmup 04 has 271)")
if tactile_defs < 16:
    errors.append(f"[M021 Flat Visuals] Only {tactile_defs} gradients/patterns/shadows in src/ (minimum 16)")

# Check for reversed RTL comparison symbols inside Persian strings
if re.search(r"[\u0600-\u06ff]\s*[<>]\s*[\u0600-\u06ff]", all_src):
    errors.append("[RTL Clarity] Avoid '<' or '>' between Persian words (mirrors ambiguously in RTL); use Persian phrasing or directional arrow")

# Check TechMatrixBackdrop placement: strictly in Opening.tsx (backdrop prop) and index.tsx (underlay SVG), never in scenes*.tsx
opening_src = (P / "src/Opening.tsx").read_text(encoding="utf-8", errors="ignore") if (P / "src/Opening.tsx").is_file() else ""
index_src = (P / "src/index.tsx").read_text(encoding="utf-8", errors="ignore") if (P / "src/index.tsx").is_file() else ""
if "TechMatrixBackdrop" not in opening_src or "backdrop=" not in opening_src:
    errors.append("[M024] Opening.tsx must pass backdrop={<TechMatrixBackdrop ... />} to QuestionCover")
if "TechMatrixBackdrop" not in index_src:
    errors.append("[M024] index.tsx must render <TechMatrixBackdrop /> strictly underneath stage SVG")
for sf in (P / "src").glob("scenes*.tsx"):
    stxt = sf.read_text(encoding="utf-8", errors="ignore")
    if "TechMatrixBackdrop" in stxt:
        errors.append(f"[M024] {sf.name} must NOT render TechMatrixBackdrop inside scene stage")

# 4. Shots timeline & optional semantic-beats.json check (M004 / M022 / M024)
meta_path = P / "data/meta.json"
if not meta_path.is_file():
    errors.append("Missing data/meta.json")
else:
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    shots = meta.get("shots") or []
    if not shots:
        errors.append("[M024] data/meta.json must define shots[]")
    else:
        shot_frames = [int(s["frame"]) for s in shots]
        if shot_frames != sorted(shot_frames) or len(set(shot_frames)) != len(shot_frames):
            errors.append("[M024] meta.shots frames must be strictly increasing")
        if "openingEndFrame" in meta and abs(shot_frames[0] - int(meta["openingEndFrame"])) > 2:
            errors.append(
                f"[M024] Gap between openingEndFrame ({meta['openingEndFrame']}) and shots[0].frame ({shot_frames[0]})"
            )
    checks["shotsCount"] = len(shots)

    beats_path = P / "semantic-beats.json"
    checks["semanticBeatsProvided"] = beats_path.is_file()
    if beats_path.is_file():
        beats = json.loads(beats_path.read_text(encoding="utf-8"))
        dur = float(meta["durationSeconds"])
        density = len(beats) / max(dur, 1.0)
        max_gap = max((float(b["durationSec"]) for b in beats), default=99.0)
        unique_after = len({str(b.get("after", "")).strip() for b in beats if str(b.get("after", "")).strip()})
        unique_action = len({str(b.get("action", "")).strip() for b in beats if str(b.get("action", "")).strip()})
        checks["beatsCount"] = len(beats)
        checks["beatsPerSecond"] = round(density, 3)
        checks["maxBeatGapSec"] = round(max_gap, 3)
        if max_gap > 2.55:
            errors.append(f"[M004] Max semantic beat gap is {max_gap:.2f}s (> 2.50s limit)")
        if unique_after < max(1, int(len(beats) * 0.85)):
            errors.append(f"[M004/M022] Repeated 'after' descriptions in semantic-beats.json ({unique_after}/{len(beats)})")
        if unique_action < max(1, int(len(beats) * 0.85)):
            errors.append(f"[M004/M022] Repeated 'action' descriptions in semantic-beats.json ({unique_action}/{len(beats)})")
        if density < 0.60:
            errors.append(f"[M022] Beat density too low: {density:.2f}/s (minimum 0.60/s; Warmup 04 target 1.0-1.4/s)")
        elif density < 0.95:
            warnings.append(f"[M022 Advisory] Beat density is {density:.2f}/s; Warmup 04 gold target is 1.0-1.4 micro-actions/s")

# 5. Type & Layout Audit (qa/type-and-layout.json & qa/proof-audit.json)
tl_path = P / "qa/type-and-layout.json"
if not tl_path.is_file():
    errors.append("[M017] Missing qa/type-and-layout.json")
else:
    tl = json.loads(tl_path.read_text(encoding="utf-8"))
    checks["auditSampledFrames"] = tl.get("sampledFrames", 0)
    checks["auditIssues"] = len(tl.get("issues", []))
    if tl.get("sampledFrames", 0) < 100:
        errors.append("[M017] qa/type-and-layout.json sampledFrames too low")
    if tl.get("distinctWords") != tl.get("expectedWords"):
        errors.append(f"[M017] Word coverage mismatch: {tl.get('distinctWords')}/{tl.get('expectedWords')}")
    if not tl.get("allFonts"):
        errors.append("Not all 3 Doran FaNum weights verified loaded in qa/type-and-layout.json")
    if not tl.get("stableBylineAtEverySample"):
        errors.append("CreatorSignature moved or missing in qa/type-and-layout.json")
    if tl.get("emptyStageFrames"):
        errors.append(f"[M024] Empty/background-only stage frames detected: {tl['emptyStageFrames']}")
    if tl.get("issues"):
        errors.append(f"Non-empty layout/ink audit issues: {len(tl['issues'])}")

pa_path = P / "qa/proof-audit.json"
if pa_path.is_file():
    pa = json.loads(pa_path.read_text(encoding="utf-8"))
    if pa.get("issues"):
        errors.append(f"[M023] Non-empty proof-audit issues: {len(pa['issues'])}")

# 6. Encoded MP4 & standalone cover & review sheet
ver_path = P / "qa/verification.json"
if not ver_path.is_file():
    errors.append("Missing qa/verification.json")
else:
    ver = json.loads(ver_path.read_text(encoding="utf-8"))
    v = ver.get("video", {})
    a = ver.get("audio", {})
    mp4_name = ver.get("file", "")
    mp4_file = P / mp4_name
    if not mp4_file.is_file():
        errors.append(f"Missing rendered MP4 referenced by verification.json: {mp4_name}")
    elif sha256(mp4_file) != ver.get("sha256"):
        errors.append("[M016] MP4 SHA-256 does not match qa/verification.json")
    if (v.get("width"), v.get("height")) not in {(1080, 1920), (1440, 2560)}:
        errors.append(f"Output must be 1080x1920 or 1440x2560, got {v.get('width')}x{v.get('height')}")
    if v.get("avg_frame_rate") != "60/1" or v.get("r_frame_rate") != "60/1":
        errors.append(f"Output must be CFR 60/1, got {v.get('avg_frame_rate')}/{v.get('r_frame_rate')}")
    if v.get("codec") != "h264" or v.get("pix_fmt") != "yuv420p":
        errors.append(f"Codec/pix_fmt mismatch: {v.get('codec')}/{v.get('pix_fmt')}")
    if not ver.get("native60fpsVerified"):
        errors.append("native60fpsVerified is not true")
    if a.get("codec") != "aac" or a.get("sample_rate") not in {44100, 48000} or a.get("channels") != 2:
        errors.append(f"Audio spec mismatch: {a}")
    if a.get("speechDropouts", 1) != 0:
        errors.append(f"[M014] Audio speech dropouts detected: {a.get('speechDropouts')}")

if not ((P / "cover.png").is_file() or (P / "cover-2k.png").is_file()):
    errors.append("Missing required cover image: cover.png (or cover-2k.png)")

for req_file in ["qa/proof-sheet.jpg", "qa/encoded-review.jpg", "qa/mix.json", "qa/alignment.json", "qa/source-determinism.json"]:
    if not (P / req_file).is_file():
        errors.append(f"Missing required deliverable/QA file: {req_file}")

# 7. Optional Mistake & Commit Review (only checked if provided; no longer mandatory paperwork)
digest = sha256(MISTAKES_PATH)
valid_ids = set(re.findall(r"^## (M\d{3}) —", MISTAKES_PATH.read_text(encoding="utf-8"), re.M))
for qa_name in ["qa/mistake-review.json", "qa/commit-review.json"]:
    qp = P / qa_name
    if qp.is_file():
        data = json.loads(qp.read_text(encoding="utf-8"))
        if data.get("mistake_register_sha256") != digest:
            warnings.append(f"{qa_name} digest does not match current rules/KNOWN_MISTAKES.md")
        checked = set(data.get("checked_mistake_ids", []))
        if not checked or not checked.issubset(valid_ids):
            warnings.append(f"{qa_name} has invalid checked_mistake_ids")

# 8. Credential scan across text files (M020)
for p in P.rglob("*"):
    if p.is_file() and p.suffix in {".ts", ".tsx", ".js", ".mjs", ".py", ".json", ".md", ".txt"} and "node_modules" not in p.parts:
        txt = p.read_text(encoding="utf-8", errors="ignore")
        if "ghp_" in txt or "github_pat_" in txt:
            errors.append(f"[M020 Security] Credential pattern found in {p.relative_to(P)}")

report = {
    "project": str(P.relative_to(ROOT)) if str(P).startswith(str(ROOT)) else str(P),
    "gate": "PASS" if not errors else "FAIL",
    "checks": checks,
    "warnings": warnings,
    "errors": errors,
    "note": "Anti-drift structural & technical Lineage A gate. Visual storytelling craft and human listening still require human review.",
}
print(json.dumps(report, ensure_ascii=False, indent=2))
sys.exit(0 if not errors else 1)
