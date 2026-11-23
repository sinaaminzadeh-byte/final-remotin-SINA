# دستور کار ۶ مرحله‌ای تولید ریل جدید (`PRODUCTION_PLAYBOOK.md`)

> این دستور کار نسخهٔ پاک‌سازی‌شده برای **تبار A** است (بدون میراث دوپهلوی V5 و بدون دستور نادرست «تصویرسازی کم‌جزئیات»).

## مرحله ۱ — بررسی ورودی‌ها و مرجع
1. اجرای `python3 scripts/check_reference.py` برای اطمینان از سلامت مرجع طلایی و کیت برند.
2. تطبیق دقیق سه ورودی سفارش: **نام پوشه (`projects/<slug>/`)**، **فایل صوتی ورودی** (دقیقاً با سرعت اصلی خودش، بدون تغییر سرعت) و **متن دقیق کلمه‌به‌کلمه + CTA**. در صورت هرگونه مغایرت، پیش از شروع سؤال بپرس.
3. مشاهدهٔ `references/flywheel-effect-v01/qa/encoded-review.jpg` و خواندن نمونه‌ای از `references/flywheel-effect-v01/src/scenes1.tsx`، `scenes2.tsx` و `semantic-beats.json` تا ریتم ریزکنش‌ها، پترن زیرلایهٔ سبک ۴ و فیزیک چندجرمه در ذهن تثبیت شود.

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

## مرحله ۴ — پیاده‌سازی صحنه‌ها و صدا
1. طراحی `src/Opening.tsx` با `QuestionCover`، `backdrop={<TechMatrixBackdrop opacity={0.17} />}`، سؤال دوخطی و شیء قهرمان صحنهٔ اول؛ خروج از جلد دقیقاً روی اولین واژه پس از عبارت افتتاحیه (`openingEnd = A(...)` و برابر با `meta.openingEndFrame` و `meta.shots[0].frame`).
2. طراحی صحنه‌ها در فایل‌های خوانا (`src/scenes1.tsx`, `src/scenes2.tsx`, ...) درون محدودهٔ امن `x = 40..848, y = 265..925` (بدون ورود به ناحیهٔ `Head` در `y < 260`، بدون هم‌پوشانی بین فازهای قبلی/بعدی و بدون پنهان‌کردن ریشهٔ صحنه در `opacity={0}`). هرگز `<TechMatrixBackdrop />` را داخل فایل‌های صحنه قرار نده. از کپی کارت‌های یکسان یا آیکن‌های تخت پرهیز کن.
3. اجرای `python3 scripts/audio.py` برای تولید صدای پیش‌فرض المان‌ها (`public/element-sfx.wav`) و ثبت `qa/mix.json` (میکس نهایی با روش استاندارد Remotion `<Audio>` با نریشن `1.0` و SFX `0.30` انجام می‌شود).

## مرحله ۵ — پیش‌نمایش چندفازی، بازبینی بصری و رندر استاندارد `1080×1920 @ 60fps`
1. اجرای `npm run typecheck` (صفر خطای TypeScript).
2. اجرای `npm run preview:frames`: اسکریپت `render.mjs --proofs` به‌طور خودکار **۴ فریم از هر شات** (ورود، ۳۰٪، ۶۲٪ و پیش از خروج) را رندر می‌کند، `qa/proof-sheet.jpg` و `cover.png` را می‌سازد و `qa/proof-audit.json` (بررسی برخورد متن، جای `TechMatrixBackdrop` و فریم خالی) را بررسی می‌کند.
3. **دیدن مستقیم** `qa/proof-sheet.jpg` و بررسی هرگونه هم‌پوشانی کارت/آیکن/متن، تداخل با `Head` یا کادر خالی در تمام فازها؛ اصلاح کامل پیش از رندر نهایی.
4. اجرای `TMPDIR=/var/tmp/remotion-work npm run render` برای رندر مستقیم استاندارد Remotion (`1080×1920 @ 60fps` با صدای میکس‌شدهٔ نریشن ۱۰۰٪ + المان ۳۰٪)، عبور کامل از `audit.tsx` (`qa/type-and-layout.json` با `emptyStageFrames: []`) و ساخت خودکار `qa/encoded-review.jpg` از خود MP4 نهایی.

## مرحله ۶ — QA واقعی روی MP4 نهایی و اجرای گیت ضد-انحراف
1. مشاهدهٔ `qa/encoded-review.jpg` (استخراج‌شده از خود MP4 نهایی).
2. تولید `qa/verification.json` شامل بررسی `ffprobe`، decode کامل بدون خطا، تست فریم‌های متوالی ۶۰fps در پنجرهٔ حرکت فعال و بررسی پیوستگی صوت در پنجره‌های ۱۰۰ms (`speechDropouts: 0`).
3. اجرای گیت اجباری (فایل‌های گزارش `mistake-review.json`، `commit-review.json` و `identity-map.md` اختیاری هستند):
   ```bash
   python3 scripts/verify_project.py projects/<slug>
   ```
   تا زمانی که تمام بررسی‌های گیت `PASS` نشوند، ویدیو آمادهٔ تحویل یا commit نیست.
