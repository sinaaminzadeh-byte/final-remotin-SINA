#!/usr/bin/env python3
"""Verify integrity of locked reference media, brand kit assets, and core rule files.
Usage: python3 scripts/check_reference.py
"""
from pathlib import Path
import hashlib, json, sys

ROOT = Path(__file__).resolve().parents[1]
ref = json.loads((ROOT / "rules/CURRENT_REFERENCE.json").read_text(encoding="utf-8"))

def sha256(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()

errors = []

# 1. Verify required rule files exist and are locked
required_rules = [
    "AGENTS.md",
    "PROMPT_FOR_NEW_VIDEO.md",
    "rules/LOCKED_RULES.md",
    "rules/VISUAL_IDENTITY.md",
    "rules/PRODUCTION_PLAYBOOK.md",
    "rules/BRIEF_TEMPLATE.md",
    "rules/KNOWN_MISTAKES.md",
    "rules/CURRENT_REFERENCE.json",
    "rules/skills/semantic-motion/SKILL.md",
]
for rel in required_rules:
    if not (ROOT / rel).is_file():
        errors.append(f"Missing locked rule file: {rel}")

# 2. Verify primary reference MP4 & parent source files
mp4_path = ROOT / ref["primaryReference"]["video"]
if not mp4_path.is_file():
    errors.append(f"Missing primary reference video: {mp4_path}")
elif sha256(mp4_path) != ref["primaryReference"]["sha256"]:
    errors.append(f"Primary reference SHA-256 mismatch: {mp4_path}")

for rel in ref["parentReferenceSource"]["files"]:
    if not (ROOT / rel).is_file():
        errors.append(f"Missing Warmup 04 parent source file: {rel}")

# 3. Verify brand kit asset SHA-256 hashes
for rel, expected in ref["brandKitAssetSHA256"].items():
    p = ROOT / rel
    if not p.is_file():
        errors.append(f"Missing brand kit asset: {rel}")
    elif sha256(p) != expected:
        errors.append(f"Brand kit asset modified: {rel}")

# 4. Verify zero credential leakage in rule/prompt files
for rel in required_rules:
    p = ROOT / rel
    if p.is_file():
        txt = p.read_text(encoding="utf-8")
        if "ghp_" in txt or "github_pat_" in txt:
            errors.append(f"Credential token pattern detected in {rel}")

result = {
    "status": "PASS" if not errors else "FAIL",
    "sampleId": ref["sampleId"],
    "checkedBrandAssets": len(ref["brandKitAssetSHA256"]),
    "checkedParentSourceFiles": len(ref["parentReferenceSource"]["files"]),
    "errors": errors,
}
print(json.dumps(result, ensure_ascii=False, indent=2))
sys.exit(0 if not errors else 1)
