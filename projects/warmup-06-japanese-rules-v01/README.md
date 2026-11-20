# Warmup 06 — ۴ قانون ژاپنی رشد پیج بدون خستگی (`warmup-06-japanese-rules-v01`)

پروژهٔ موشن‌گرافیک تولیدشده با **Remotion 4.0.543** بر پایهٔ ساختار و سیستم طراحی مرجع `warmup-04-zero-capital-asset-v02-2k` و کیت `creator-brand-v1`.

## خروجی‌های اصلی
- `warmup-06-japanese-rules-v01-2k.mp4` — ویدیوی نهایی ۲K بومی (`1440×2560`, `60fps` CFR, H.264 `yuv420p` BT.709 + AAC Stereo 48 kHz, مدت `55.20s`, `3312` فریم)
- `cover-2k.png` — تصویر جلد پرسشی مستقل (فریم ۰ در ابعاد `1440×2560`)
- `subtitles.srt` — زیرنویس هم‌ساعت با `data/words.json`
- `semantic-beats.json` — جدول ۳۵ ضرب معنایی (`before / action / after`) با بیشینه فاصله ۲٫۵۰ ثانیه
- `identity-map.md` — نقشهٔ تطبیق هویت بصری با مرجع

## ساختار پروژه
- `src/index.tsx`: Composition اصلی `WarmupSixJapaneseRules`، کپشن واژه‌ای، ترنزیشن‌های کاغذی و امضای ثابت ریشه (`CreatorSignature`)
- `src/Opening.tsx`: جلد پرسشی (`QuestionCover`) روی فریم ۰ تا `A(3)=80`
- `src/core.tsx` و `src/objects.tsx`: توکن‌ها، موتور تایپوگرافی `T()` با ink-centering، کاراکتر `Person()` و اشیای تمیز برند (`ToriiEmblem`, `AIModule`, `BatteryGauge`, `RulePill`)
- `src/scenes1.tsx`, `src/scenes2.tsx`, `src/scenes3.tsx`: ۱۰ صحنهٔ اختصاصی برای کل روایت (راه‌اندازی پیج، وابی‌سابی، اسکار و آپلود ناقص، پله‌های کایزن، ۲۰ دقیقه با AI، قطب‌نمای ایکیگای و عشق به موضوع، سپردن کار فنی به AI، گامبارو و فرسودگی ۳۰روزه، خط تولید اتوماتیک و دعوت به ارسال سامورایی)
- `src/audit.tsx`: بررسی خودکار ink bounds، وزن‌های فونت Doran، ثبات امضای ریشه و نبود خروج از کادر
- `scripts/ctc.py`, `scripts/plan.py`, `scripts/audio.py`, `scripts/render.mjs`: خط کامل ترازبندی فارسی CTC، زمان‌بندی، ساخت SFX و رندر بومی ۲K

## دستورات اجرا
```bash
npm install
npm run typecheck
npm run preview:frames   # رندر ۱۶ فریم کلیدی ۲K + تست determinism
python3 scripts/audio.py --mix /tmp/audio-master.wav
ffmpeg -y -i /tmp/audio-master.wav -c:a aac -b:a 192k -ar 48000 -ac 2 /tmp/audio-master.m4a
npm run render           # رندر نهایی ۲K/60fps + mux پیوسته صدا
```

## وضعیت QA
- بررسی فنی، ترازبندی خودکار CTC، پیوستگی صوت (`0` افت در ۴۳۹ پنجره ۱۰۰ms گفتار فعال)، نمونه‌برداری واقعی ۶۰fps و بازبینی فریم‌های encoded (`qa/encoded-review.jpg`) انجام شده است.
- شنیدار انسانی و تأیید سلیقه‌ای نهایی انجام نشده است (`status: implemented-awaiting-user-review`).
