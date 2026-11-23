# دستور کار سریع و المان‌محور تولید ریل جدید (`PRODUCTION_PLAYBOOK.md`)

> اصل راهنما: کمترین کاغذبازی پیش از کد، بیشترین تمرکز و توکن روی **طراحی المان‌های اختصاصی، صحنه‌آرایی محیط‌دار و پولیش بصری روی `proof-sheet.jpg`**.

## مرحله ۱ — ساخت پروژه و کالیبراسیون ۳۰ ثانیه‌ای
1. اجرای `python3 scripts/check_reference.py` و ساخت پروژه با `python3 scripts/new_project.py <slug>`.
2. دیدن `references/flywheel-effect-v01/qa/encoded-review.jpg` (یک تصویر مرجع) و مرور سریع `starter-template/src/{objects,scenes}.tsx`. نیازی به خواندن کامل تمام فایل‌های مرجع و مستندات طولانی پیش از کدنویسی نیست.

## مرحله ۲ — ترازبندی فارسی و نقشهٔ کوتاه ۶–۸ صحنه‌ای
1. صوت اصلی را بدون تغییر سرعت در `public/narration.mp3` و متن دقیق گفتار را در `narration.txt` قرار بده.
2. با `scripts/ctc.py` فایل‌های `data/words.json` و `qa/alignment.json` را بساز (اعداد و کلمات محاوره‌ای را در `spoken` تنظیم کن) و `data/phrases.json` (حداکثر ۴ واژه در هر عبارت) و `data/meta.json` (`shots[]` و `openingEndFrame`) را آماده کن.
3. فقط یک لیست **۶ تا ۸ خطی** از صحنه‌ها در ذهن یا یادداشت کوتاه بچین (هر صحنه ۵–۸ ثانیه با بستر محیطی و استعارهٔ اختصاصی). ساختن `brief.md` یا `semantic-beats.json` مفصل پیش از کدنویسی **اختیاری** است.

## مرحله ۳ — ساخت المان‌های قهرمان و صحنه‌ها (بخش اصلی کار)
1. طراحی `src/Opening.tsx` با `QuestionCover`، `backdrop={<TechMatrixBackdrop opacity={0.17} />}`، سؤال دوخطی و شیء قهرمان صحنهٔ اول؛ خروج از جلد دقیقاً روی اولین واژه پس از عبارت افتتاحیه (`openingEnd = A(...)` تراز با `meta.shots[0].frame`).
2. کدنویسی مستقیم صحنه‌ها در `src/scenes.tsx` (یا جایگزینی تمیز آن با `src/scenes1.tsx`, `src/scenes2.tsx`):
   - **صحنهٔ محیط‌دار:** از `StageFloor`، `DraftBoard`، قاب ابزار یا پس‌زمینهٔ واقعی استفاده کن؛ اشیا را در هوا رها نکن و قالب «شیء + پلاک پایین» را در همهٔ شات‌ها تکرار نکن.
   - **تنوع و اصالت:** سیلوئت `Gear` مرجع را در موضوعات نامرتبط کپی نکن؛ پالت گرم برند (`wood`, `ivory`, `brass`, `gold`, `lapisGrad`) را حفظ کن؛ کاراکتر `Person()` را در کنش واقعی بگذار و پایان CTA را با نتیجهٔ واقعی بساز.
   - **ریزکنش مستقیم در کد (۱٫۰–۱٫۴/ثانیه):** هر فعل گفتار حالت درونی شیء را تغییر دهد (`spHeavy`, `spSnap`, `spPop`, `@remotion/paths`, `impactShake`, `SheenOverlay`).
   - **انضباط فنی:** محدودهٔ امن `x = 40..848, y = 265..925` (بدون ورود به `y < 260` متعلق به `Head`)، بدون `opacity={0}` روی ریشهٔ صحنه، و بدون قراردادن `TechMatrixBackdrop` داخل `scenes*.tsx`.
3. اجرای `python3 scripts/audio.py` برای تولید صدای پیش‌فرض المان‌ها (`public/element-sfx.wav`) و ثبت `qa/mix.json`.

## مرحله ۴ — پیش‌نمایش چندفازی و پولیش بصری (`qa/proof-sheet.jpg`)
1. اجرای `npm run typecheck` و `npm run preview:frames` (خروجی `qa/proof-sheet.jpg`, `cover.png`, `qa/proof-audit.json` برای ۴ فاز از هر شات).
2. **بازبینی مستقیم `qa/proof-sheet.jpg`:** هم‌پوشانی متن/شیء، تعادل کادر، گرمای رنگ و تنوع صحنه‌ها را با چشم چک کن و هر ایراد بصری را قبل از رندر نهایی اصلاح کن.

## مرحله ۵ — رندر نهایی `1080×1920 @ 60fps` و گیت تایید
1. اجرای `TMPDIR=/var/tmp/remotion-work npm run render` (رندر مستقیم استاندارد Remotion با صدای میکس‌شدهٔ نریشن ۱٫۰ + المان ۰٫۳۰ و ساخت `qa/encoded-review.jpg`).
2. دیدن `qa/encoded-review.jpg`، تولید `qa/verification.json` (`speechDropouts: 0`, `native60fpsVerified: true`) و پاس کامل:
   ```bash
   python3 scripts/verify_project.py projects/<slug>
   ```
   (فایل‌های `semantic-beats.json`, `brief.md`, `qa/mistake-review.json`, `qa/commit-review.json` و `identity-map.md` اختیاری هستند.)
