# پرامپت آماده برای تولید هر ریل جدید (فقط ۲ ورودی + لینک مخزن)

این پرامپت مخصوص کار با مخزن `https://github.com/sinaaminzadeh-byte/final-remotin-SINA` است. هر وقت ویس و متن جدیدی دارید، فقط لینک فایل صوتی و متن نریشن را جایگزین کنید.

---

```text
یک ویدیوی موشن‌گرافیک فارسی جدید با موتور Remotion بر اساس مخزن زیر بساز:
https://github.com/sinaaminzadeh-byte/final-remotin-SINA

طبق جریان سریع و المان‌محور در `AGENTS.md` عمل کن (پیش‌خوانی طولانی و کاغذبازیِ اضافه پیش از کد ننویس؛ بیشترین تمرکز و توکن را صرف طراحی المان‌های اختصاصی، صحنه‌آرایی و پولیش بصری کن):
1. با `python3 scripts/check_reference.py` سلامت مخزن را چک کن و پروژه را فقط با `python3 scripts/new_project.py <slug>-v01` بساز. تصویر `references/flywheel-effect-v01/qa/encoded-review.jpg` را ببین تا سطح گرافیک و گرمای پالت دستت بیاید.
2. فایل صوتی ورودی را دقیقاً با سرعت اصلی خودش (بدون هیچ تغییری در سرعت صوت) با `scripts/ctc.py` روی متن دقیق زیر ترازبندی کن. فقط یک تقسیم‌بندی کوتاهِ ۶ تا ۸ صحنه‌ای بچین (نوشتن `brief.md` یا `semantic-beats.json` طولانی پیش از کد لازم نیست).
3. بلافاصله صحنه‌ها را در `src/Opening.tsx` و `src/scenes*.tsx` بساز:
   - ۶ تا ۸ صحنهٔ عمیق و محیط‌دار (با `StageFloor`, `DraftBoard` یا بستر واقعی — هرگز قالب «شیء شناور + پلاک پایین» یا سیلوئت چرخ‌دندهٔ مرجع را در صحنه‌ها تکرار نکن).
   - المان‌های چندلایهٔ اختصاصی موضوع، فیزیک چندجرمه، `@remotion/paths`، ریزکنش روی افعال گفتار، حضور فعال `Person()` در جای مناسب، پالت گرم برند و پایان‌بندی قوی در CTA.
   - کاور پرسشی از فریم ۰ (`QuestionCover` + `cover.png`)، امضای ثابت ریشه (`CreatorSignature`)، زیرلایهٔ سبک ۴ فقط در `Opening.tsx` و `index.tsx`، رعایت زون امن `y = 265..925` و صفر فریم خالی (`M023/M024`).
4. صدای پیش‌فرض المان‌ها (`element-sfx.wav`) را با `scripts/audio.py` بساز (رندر با `<Audio>` استاندارد Remotion، نریشن ۱٫۰ و المان ۰٫۳۰).
5. پس از `npm run typecheck` و `npm run preview:frames`، حتماً `qa/proof-sheet.jpg` را بازبینی و پولیش کن، سپس `npm run render` (`1080×1920 @ 60fps`)، بازبینی `qa/encoded-review.jpg`، `qa/verification.json` و در نهایت `python3 scripts/verify_project.py projects/<slug>-v01` را با نتیجهٔ `PASS` تکمیل کن.

ورودی‌های این ویدیو:
- لینک صدای نریشن: <URL فایل صوتی>
- متن دقیق نریشن (با جملهٔ پایانی/CTA):
«<متن کامل نریشن>»
```
