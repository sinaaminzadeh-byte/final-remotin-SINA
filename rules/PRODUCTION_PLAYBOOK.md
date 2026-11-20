# دستور کار ۶ مرحله‌ای تولید ریل جدید (`PRODUCTION_PLAYBOOK.md`)

> این دستور کار نسخهٔ پاک‌سازی‌شده برای **تبار A** است (بدون میراث دوپهلوی V5 و بدون دستور نادرست «تصویرسازی کم‌جزئیات»).

## مرحله ۱ — بررسی ورودی‌ها و مرجع
1. اجرای `python3 scripts/check_reference.py` برای اطمینان از سلامت مرجع طلایی و کیت برند.
2. تطبیق دقیق سه ورودی سفارش: **نام پوشه (`projects/<slug>/`)**، **فایل صوتی و وضعیت سرعت آن** (`1.0x` یا از پیش `1.2x`) و **متن دقیق کلمه‌به‌کلمه + CTA**. در صورت هرگونه مغایرت، پیش از شروع سؤال بپرس.
3. مشاهدهٔ `references/warmup-04-brand-v02/brand-v02/qa/encoded-review.jpg` و خواندن نمونه‌ای از `references/warmup-04-brand-v02/parent-src/begin.tsx` و `semantic-beats.json` تا ریتم ریزکنش‌ها در ذهن تثبیت شود.

## مرحله ۲ — ایجاد پروژه از قالب قفل‌شده (تبار A)
```bash
python3 scripts/new_project.py <slug>
```
این دستور به‌طور خودکار `creator-brand-v1`، فونت‌های Doran، `background.png`، `pixel-mark.png`، `signature-2k.png`، `QuestionCover.tsx`، `CreatorSignature.tsx`، `src/core.tsx`، `src/objects.tsx`، `src/audit.tsx` و اسکریپت‌های ترازبندی و رندر را نصب می‌کند.

## مرحله ۳ — ترازبندی فارسی و طراحی جدول معنایی (`semantic-beats.json`)
1. صوت اصلی را بدون تغییر سرعت در `public/narration.mp3` و متن دقیق گفتار را در `narration.txt` قرار بده.
2. با `scripts/ctc.py` فایل `data/words.json` و `qa/alignment.json` را بساز و خروجی greedy را با متن مقایسه کن (اعداد و کلمات محاوره‌ای را در `spoken` تنظیم کن تا مرز واژه‌ها دقیق باشد).
3. بر پایهٔ `rules/skills/semantic-motion/SKILL.md` و `rules/BRIEF_TEMPLATE.md` جدول `semantic-beats.json` را با این معیارها طراحی کن:
   - هر عبارت کپشن حداکثر ۴ واژه (`data/phrases.json`).
   - برای هر فعل مهم یک ریزکنش قابل‌مشاهده درون خود شیء (`before / action / after` منحصربه‌فرد).
   - هدف چگالی: **۱٫۰ تا ۱٫۴ ضرب در ثانیه**، و **صفر فاصلهٔ بی‌توضیح بالای ۲٫۵ ثانیه**.
   - ثبت `continuity` برای پیوستگی اشیا میان صحنه‌های متوالی (M006).
4. نوشتن `identity-map.md` برای نگاشت هر عنصر جدید به خانوادهٔ متریال مرجع.

## مرحله ۴ — پیاده‌سازی صحنه‌ها و صدا
1. طراحی `src/Opening.tsx` با `QuestionCover`، سؤال دوخطی و شیء قهرمان صحنهٔ اول؛ خروج از جلد دقیقاً روی اولین واژه پس از عبارت افتتاحیه (`openingEnd = A(...)`).
2. طراحی صحنه‌ها در فایل‌های خوانا (`src/scenes1.tsx`, `src/scenes2.tsx`, ...) با اشیای قهرمان بزرگ، چندلایه و لمسی (`#lift`، `#heavyLift`، `#brass`، `#wood`، `#ivory`، `#weave`، `#draft`، `#hatch`). از کپی کارت‌های یکسان یا آیکن‌های تخت پرهیز کن.
3. اجرای `scripts/audio.py --mix /tmp/audio-master.wav` و تبدیل به `/tmp/audio-master.m4a` (AAC Stereo 48kHz، نریشن `1.0` پیوسته + SFX ملایم `0.30`، بدون clipping).

## مرحله ۵ — پیش‌نمایش، بازبینی بصری و رندر بومی ۲K
1. اجرای `npm run typecheck` (صفر خطای TypeScript).
2. اجرای `npm run preview:frames` (تولید ۱۶ فریم کلیدی ۲K + `cover-2k.png` + تست determinism رفت‌وبرگشت).
3. ساخت و **دیدن مستقیم** `qa/proof-sheet.jpg` و بررسی هرگونه برخورد متن، تنگی فضا، باگ RTL یا کوچکی شیء قهرمان؛ اصلاح قبل از رندر کامل.
4. اجرای `TMPDIR=/var/tmp/remotion-work npm run render` برای رندر بومی `1440×2560 @ 60fps` و mux پیوستهٔ AAC، با عبور کامل از `audit.tsx` (`qa/type-and-layout.json`).

## مرحله ۶ — QA واقعی روی MP4 نهایی و اجرای گیت ضد-انحراف
1. استخراج فریم‌های واقعی از خود MP4 نهایی به `qa/encoded-review.jpg` و مشاهدهٔ آن‌ها.
2. تولید `qa/verification.json` شامل بررسی `ffprobe`، decode کامل بدون خطا، تست فریم‌های متوالی ۶۰fps در پنجرهٔ حرکت فعال و بررسی پیوستگی صوت در پنجره‌های ۱۰۰ms (`speechDropouts: 0`).
3. ثبت `qa/mistake-review.json` و `qa/commit-review.json` با هش واقعی `rules/KNOWN_MISTAKES.md`.
4. اجرای گیت اجباری:
   ```bash
   python3 scripts/verify_project.py projects/<slug>
   ```
   تا زمانی که تمام بررسی‌های گیت `PASS` نشوند، ویدیو آمادهٔ تحویل یا commit نیست.
