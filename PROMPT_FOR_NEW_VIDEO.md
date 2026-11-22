# پرامپت آماده برای تولید هر ریل جدید (فقط ۲ ورودی + لینک مخزن)

این پرامپت مخصوص کار با مخزن `https://github.com/sinaaminzadeh-byte/final-remotin-SINA` است. هر وقت ویس و متن جدیدی دارید، فقط لینک فایل صوتی و متن نریشن را جایگزین کنید.

---

```text
یک ویدیوی موشن‌گرافیک فارسی جدید با موتور Remotion بر اساس مخزن زیر بساز:
https://github.com/sinaaminzadeh-byte/final-remotin-SINA

قوانین و ساختار مخزن قفل‌شده‌اند — دقیقاً مطابق آن‌ها عمل کن:
1. فایل‌های `AGENTS.md`، `rules/LOCKED_RULES.md`، `rules/CURRENT_REFERENCE.json`، `rules/VISUAL_IDENTITY.md`، `rules/PRODUCTION_PLAYBOOK.md`، `rules/skills/semantic-motion/SKILL.md` و `rules/KNOWN_MISTAKES.md` را بخوان و مرجع طلایی `references/flywheel-effect-v01/` (ویدیو، کاور، سورس `src/` و `semantic-beats.json`) را بررسی کن.
2. بر اساس موضوع متن، یک نام انگلیسی مناسب (`<slug>-v01`) بساز و پروژهٔ جدید را فقط با `python3 scripts/new_project.py <slug>-v01` ایجاد کن.
3. فایل صوتی ورودی را دقیقاً با سرعت اصلی خودش (بدون هیچ تغییری در سرعت صوت) با `scripts/ctc.py` روی متن دقیق زیر ترازبندی کن. صدای پیش‌فرض المان‌ها (`SFX`) با `scripts/audio.py` ساخته شده و هنگام رندر روی ۳۰٪ (`0.30`) در برابر نریشن ۱۰۰٪ (`1.0`) میکس می‌شود.
4. کارگردانی کامل تبار A را اجرا کن: کاور پرسشی از فریم ۰ (`QuestionCover` + `cover-2k.png`)، امضای ثابت ریشه (`CreatorSignature`)، زیرلایهٔ سبک ۴ (`TechMatrixBackdrop` در پایین‌ترین لایه)، اشیای قهرمان لمسی، فیزیک چندجرمه، `@remotion/paths`، چگالی ریزکنش ۱٫۰ تا ۱٫۴ در ثانیه و تداوم اشیا بین صحنه‌ها (`continuity`).
5. پس از `npm run typecheck` و `npm run preview:frames` (بازبینی `qa/proof-sheet.jpg`)، رندر نهایی `npm run render` (۲K @ 60fps)، بازبینی `qa/encoded-review.jpg`، تکمیل `qa/mistake-review.json` و `qa/commit-review.json` را انجام بده و حتماً `python3 scripts/verify_project.py projects/<slug>-v01` را با نتیجهٔ `PASS` پاس کن.

ورودی‌های این ویدیو:
- لینک صدای نریشن: <URL فایل صوتی>
- متن دقیق نریشن (با جملهٔ پایانی/CTA):
«<متن کامل نریشن>»
```
