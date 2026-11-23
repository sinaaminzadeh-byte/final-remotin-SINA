# سیستم تولید موشن‌گرافیک ریل — `final-remotin-SINA` (تبار A قفل‌شده)

این مخزن خط تولید استاندارد و قفل‌شدهٔ موشن‌گرافیک فارسی با **Remotion 4.0.543** بر مبنای مرجع طلایی **`references/flywheel-effect-v01/`** (ریشهٔ `Warmup 04 · brand-v02`) و کیت برند **سینا امین‌زاده (`creator-brand-v1`)** است.

تمام اسناد متعارض تاریخی حذف شده‌اند و یک **قالب شروع آماده (`starter-template/`)** به‌همراه **گیت ضد-انحراف (`scripts/verify_project.py`)** در مخزن قرار دارد تا هر ریل جدید دقیقاً با همان هویت بصری گرم، لمسی، زیرلایهٔ سبک ۴ (`TechMatrixBackdrop`)، فیزیک چندجرمه و `@remotion/paths` تولید شود.

---

## استانداردهای تولید فعلی
- **رزولوشن و فریم‌ریت خروجی:** **`1080×1920` (Full HD 9:16، `scale: 1`)** با نرخ فریم ثابت **`60fps` CFR** (`H.264 / yuv420p / BT.709`) + پوستر مستقل `cover.png`.
- **صدا و میکس استاندارد Remotion:** فایل صوتی نریشن دقیقاً با **سرعت طبیعی خودش** (بدون دستکاری سرعت) روی خط زمان قرار می‌گیرد. اسکریپت `scripts/audio.py` صدای پیش‌فرض المان‌ها (`public/element-sfx.wav`) را می‌سازد و تگ‌های استاندارد `<Audio>` داخل Remotion (`renderMedia`) هنگام رندر نهایی، نریشن را روی **۱۰۰٪ (`1.0`)** و صدای المان‌ها را روی **۳۰٪ (`0.30`)** میکس می‌کنند.
- **پترن و حرکت:** زیرلایهٔ **سبک ۴ (`TechMatrixBackdrop`, opacity `0.17`, `multiply`)** زیر تمام لایه‌ها، فنرهای چندجرمه (`spHeavy`, `spSnap`, `spPop`)، مسیرهای `@remotion/paths`، لرزش قفل (`impactShake`)، درخشش نوری (`SheenOverlay`) و دوربین نرم استیج بدون حرکت‌دادن امضا و زیرنویس.

---

## ساختار مخزن

| مسیر | نقش |
|---|---|
| `AGENTS.md` | نقطهٔ شروع و قوانین قفل‌شده برای هر عامل هوش مصنوعی |
| `PROMPT_FOR_NEW_VIDEO.md` | پرامپت آماده و ساده (فقط لینک ویس و متن نریشن را پر کنید) |
| `rules/LOCKED_RULES.md` | قانون اساسی قفل‌شده (تبار A، ریزکنش‌های درون‌شیء، تداوم شیء و صدا) |
| `rules/VISUAL_IDENTITY.md` | راهنمای کامل هویت بصری (کاور، امضا، رنگ، فونت Doran، متریال لمسی، سبک ۴) |
| `rules/PRODUCTION_PLAYBOOK.md` | دستور کار ۵ مرحله‌ای المان‌محور از ترازبندی ویس تا طراحی صحنه‌های محیط‌دار، رندر و QA |
| `rules/skills/semantic-motion/SKILL.md` | اسکیل v2.2: صحنه‌پردازی محیط‌دار (۶–۸ صحنهٔ عمیق)، ضدهم‌پوشانی، صفر فریم خالی و تداوم شیء |
| `rules/KNOWN_MISTAKES.md` | دفتر خطاهای شناخته‌شده (`M001` تا `M024`) |
| `rules/CURRENT_REFERENCE.json` | شناسنامه و هش فایل‌های مرجع قفل‌شده (`flywheel-effect-v01-2k`) |
| `brand-kit/creator-brand-v1/` | کیت رسمی کاور پرسشی، امضا، فونت Doran FaNum و بافت‌های رسمی |
| `starter-template/` | پروژهٔ پایهٔ Remotion 4.0.543 با `core.tsx`, `objects.tsx`, `audit.tsx`, `ctc.py`, `audio.py`, `render.mjs` |
| `scripts/new_project.py` | ساخت خودکار پروژهٔ جدید `projects/<slug>/` با نصب کامل کیت برند |
| `scripts/verify_project.py` | گیت ضد-انحراف: بررسی کیت، `TechMatrixBackdrop`، `audit.tsx`، MP4 `1080×1920 @ 60fps` و سلامت صدا |
| `scripts/check_reference.py` | بررسی سلامت و یکپارچگی هش مرجع قفل‌شده و کیت برند |
| `references/flywheel-effect-v01/` | **مرجع طلایی رسمی فعلی** (سورس کامل + ویدیوی مرجع + کاور + ۵۵ ضرب معنایی) |
| `references/warmup-04-brand-v02/` | مرجع تاریخی ریشهٔ تبار A |
| `projects/flywheel-effect-v01/` | پروژهٔ کامل تولیدشده و تأییدشده («اثر فلای‌ویل») |

---

## شروع سریع برای ساخت یک ریل جدید

```bash
# ۱. بررسی سلامت مرجع و کیت
python3 scripts/check_reference.py

# ۲. ساخت اسکلت آمادهٔ پروژهٔ جدید با کیت قفل‌شدهٔ تبار A
python3 scripts/new_project.py my-new-topic-v01

# ۳. قرار دادن صوت در projects/my-new-topic-v01/public/narration.mp3 و متن در narration.txt
# ۴. ترازبندی فارسی، طراحی صحنه‌ها و رندر استاندارد Remotion (1080x1920 @ 60fps)
cd projects/my-new-topic-v01
npm install
python3 scripts/audio.py
npm run typecheck
npm run preview:frames
TMPDIR=/var/tmp/remotion-work npm run render

# ۵. بررسی MP4 نهایی و اجرای گیت ضد-انحراف پیش از تحویل
cd ../..
python3 scripts/verify_project.py projects/my-new-topic-v01
```
