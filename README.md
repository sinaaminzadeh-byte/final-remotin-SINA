# سیستم تولید موشن‌گرافیک ریل — `final-remotin-SINA` (تبار A قفل‌شده)

این مخزن نسخهٔ **پاک، یکپارچه و قفل‌شدهٔ** خط تولید موشن‌گرافیک فارسی با **Remotion 4.0.543** بر مبنای مرجع تأییدشدهٔ **Warmup 04 · brand-v02** (`8f12c76 + 0f1d8c7`) و کیت برند **سینا امین‌زاده (`creator-brand-v1`)** است.

تمام اسناد متعارض تاریخی (V5، دستور دوپهلوی «کم‌جزئیات»، و اسکلت‌های منحرفِ تبار B مثل `Stage.tsx` و `paper.jpg`) از این مخزن حذف شده‌اند و یک **قالب شروع آماده (`starter-template/`)** به‌همراه **گیت سخت‌گیرانهٔ ضد-انحراف (`scripts/verify_project.py`)** جایگزین شده تا هر ریل جدید دقیقاً با همین هویت بصریِ گرم، لمسی و حرفه‌ای ولی با **کارگردانی و استعاره‌های اختصاصی موضوع خودش** تولید شود.

---

## ساختار مخزن

| مسیر | نقش |
|---|---|
| `AGENTS.md` | نقطهٔ شروع و قوانین قفل‌شده برای هر عامل هوش مصنوعی |
| `PROMPT_FOR_NEW_VIDEO.md` | پرامپت آماده (کپی کن و فقط ۳ ورودی slug، ویس و متن را پر کن) |
| `rules/LOCKED_RULES.md` | قانون اساسی قفل‌شده (تبار A، ریزکنش‌های درون‌شیء، تداوم شیء و ممنوعیت‌ها) |
| `rules/VISUAL_IDENTITY.md` | راهنمای کامل هویت بصری (کاور، امضا، رنگ، فونت Doran، متریال لمسی، کاراکتر) |
| `rules/PRODUCTION_PLAYBOOK.md` | دستور کار ۶ مرحله‌ای از ترازبندی ویس تا QA نهایی |
| `rules/skills/semantic-motion/SKILL.md` | اسکیل v2.0: پوشش معنایی + چگالی ریزکنش + تداوم شیء (M006) |
| `rules/KNOWN_MISTAKES.md` | دفتر خطاهای شناخته‌شده (`M001` تا `M022`) |
| `rules/CURRENT_REFERENCE.json` | شناسنامه و هش فایل‌های مرجع قفل‌شده |
| `brand-kit/creator-brand-v1/` | کیت رسمی کاور پرسشی، امضای ۲K، فونت Doran FaNum و بافت‌های رسمی |
| `starter-template/` | پروژهٔ پایهٔ Remotion 4.0.543 با `core.tsx`, `objects.tsx`, `audit.tsx`, `ctc.py`, `audio.py`, `render.mjs` |
| `scripts/new_project.py` | ساخت خودکار پروژهٔ جدید `projects/<slug>/` با نصب کامل کیت برند |
| `scripts/verify_project.py` | گیت ضد-انحراف: بدون رعایت تبار A، کیت، `audit.tsx`، MP4 2K/60 و پیوستگی صوت پاس نمی‌شود |
| `scripts/check_reference.py` | بررسی سلامت و یکپارچگی هش مرجع قفل‌شده و کیت برند |
| `references/warmup-04-brand-v02/` | مرجع طلایی کامل (سورس والد `8f12c76` + `brand-v02` + ویدیوی ۲K + شیت‌های QA + ۷۲ ضرب) |
| `projects/warmup-06-japanese-rules-v01/` | نمونهٔ کامل تولیدشده با همین سیستم («۴ قانون ژاپنی») |

---

## شروع سریع برای ساخت یک ریل جدید

```bash
# ۱. بررسی سلامت مرجع و کیت
python3 scripts/check_reference.py

# ۲. ساخت اسکلت آمادهٔ پروژهٔ جدید با کیت قفل‌شدهٔ تبار A
python3 scripts/new_project.py my-new-topic-v01

# ۳. قرار دادن صوت در projects/my-new-topic-v01/public/narration.mp3 و متن در narration.txt
# ۴. ترازبندی فارسی، طراحی صحنه‌ها و رندر
cd projects/my-new-topic-v01
npm install
npm run typecheck
npm run preview:frames
python3 scripts/audio.py --mix /tmp/audio-master.wav
ffmpeg -y -i /tmp/audio-master.wav -c:a aac -b:a 192k -ar 48000 -ac 2 /tmp/audio-master.m4a
TMPDIR=/var/tmp/remotion-work npm run render

# ۵. اجرای گیت سخت‌گیرانهٔ ضد-انحراف پیش از commit
cd ../..
python3 scripts/verify_project.py projects/my-new-topic-v01
```
