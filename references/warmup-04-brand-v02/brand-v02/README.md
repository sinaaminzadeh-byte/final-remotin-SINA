# Warmup 04 · نسخهٔ کاور و امضا، ۲K

[ویدیوی نهایی](warmup-04-zero-capital-asset-v02-2k.mp4) · [کاور آمادهٔ انتشار](../../../../motion-system/creator-brand-v1/examples/cover-1440.png) · [قاعده و کیت مشترک](../../../../motion-system/creator-brand-v1/README.md)

این نسخه در زیرپوشهٔ همان پروژه ساخته شده و هیچ‌یک از خروجی‌ها یا کد نسخهٔ ۱ را جایگزین نمی‌کند. فریم ۰: کاور ۱ با هویت نهایی. فریم‌های ۰ تا ۶۰: چفت و حرکت ملایم کیف روی ضرب‌های قبلی؛ با شروع گفتار، روتیتر جای خود را به کپشن همان سه واژه می‌دهد. روی «برای» در فریم ۶۱ به تایم‌لاین اصلی برمی‌گردیم. ۱۲ صحنه، صدا و طول قبلی حفظ‌اند. امضای ثابت روی تمام فریم‌هاست؛ هیچ شمارهٔ پرونده یا باکس قدیمی در تصویر نیست.

## بازسازی از checkout مخزن تولید

به پروژهٔ والد، کیت `motion-system/creator-brand-v1`، Node 20+، npm، Python (Pillow و NumPy برای QA)، FFmpeg/ffprobe و کتابخانه‌های معمول Chromium نیاز است. نصب وابستگی در staging جدا صورت می‌گیرد. این نسخه در اندازهٔ منطقی ۱۰۸۰×۱۹۲۰ با scale=4/3 به‌صورت native رندر می‌شود؛ تصویر از MP4 قدیمی upscale نمی‌شود. فقط AAC میکس تأییدشده بدون encode دوباره کپی می‌شود. به دسترسی اینترنت برای فایل‌های صحنه نیازی نیست.

```sh
# در ریشهٔ checkout تولید:
REV="$PWD/projects/warmup-04-zero-capital-asset-v01/revisions/brand-v02"
WORK="$PWD/.cache/warmup-brand-v02/work"
mkdir -p "$PWD/.cache/warmup-brand-v02/tmp"
export TMPDIR="$PWD/.cache/warmup-brand-v02/tmp" OPENBLAS_NUM_THREADS=1
python3 "$REV/scripts/prepare.py" --work "$WORK"
# اختیاری: --audio-master /path/to/original-v01-2k.mp4 (همان AAC تأییدشدهٔ HD)
(cd "$WORK" && npm ci && npx --no-install remotion browser ensure && npm run typecheck && node scripts/render-brand.mjs --proofs && node scripts/render-brand.mjs)
python3 "$REV/scripts/verify_brand.py" --temp "$TMPDIR"
# برای مقایسهٔ تصویر با خودِ مستر قبلی ۲K: --previous-2k /path/to/original-v01-2k.mp4
```

[کنترل صدای اصلی، زمان و فریم‌ها](qa/verification.json) · [سنجش امضا و تایپ در مرورگر](qa/type-and-layout.json) · [همسانی رندر مستقل](qa/source-determinism.json) · [فریم‌های decodeشده](qa/encoded-review.jpg).

[تأیید نهایی کاربر پس از تحویل ویدیو](qa/approval.json).
