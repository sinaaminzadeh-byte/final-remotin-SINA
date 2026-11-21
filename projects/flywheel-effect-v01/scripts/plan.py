"""Build data/phrases.json, data/meta.json, semantic-beats.json, and subtitles.srt
from data/words.json so captions, motion cues, and SFX share one clock.
"""
from pathlib import Path
import json
import soundfile as sf

R = Path(__file__).resolve().parents[1]
words = json.loads((R / "data/words.json").read_text(encoding="utf-8"))
FPS = 60

raw, sr = sf.read(R / "public/narration.mp3", dtype="float32")
duration_sec = len(raw) / sr
DURATION_FRAMES = round(duration_sec * FPS)


def A(i: int) -> int:
    return round(words[i]["start"] * FPS)


def E(i: int) -> int:
    return round(words[i]["end"] * FPS)


# Caption phrases: strict max 4 words per phrase, natural Persian chunks.
# Phrase 0 ("توی علم مدیریت") displays on QuestionCover in the opening caption slot.
phrase_groups = [
    (0, 2),     # توی علم مدیریت
    (3, 6),     # مفهومی داریم به اسم
    (7, 9),     # «اثر فلای‌ویل» (Flywheel).
    (10, 13),   # فرض کن یک چرخ
    (14, 16),   # سنگین فلزی رو
    (17, 18),   # می‌خوای بچرخونی؛
    (19, 21),   # اولش باید تمام
    (22, 24),   # زورت رو بذاری
    (25, 27),   # تا فقط یک
    (28, 29),   # دور بچرخه!
    (30, 32),   # خیلی‌ها دقیقاً همین‌جا
    (33, 36),   # خسته میشن و میگن
    (37, 39),   # این کار اصلاً
    (40, 41),   # جواب نمیده!
    (42, 44),   # اما حقیقت اینه:
    (45, 47),   # چرخش اول، انرژیِ
    (48, 50),   # دورهای بعدی رو
    (51, 52),   # ذخیره می‌کنه.
    (53, 55),   # توی تولید محتوا
    (56, 58),   # هم دقیقاً همینه؛
    (59, 61),   # ده تای اول
    (62, 64),   # هیچ اتفاقی نمی‌افته،
    (65, 67),   # اما سیستم از
    (68, 71),   # ویدیوی بیستم به بعد
    (72, 74),   # شتاب تصاعدی می‌گیره!
    (75, 78),   # اشتباه بزرگ اینه که
    (79, 81),   # فکر می‌کنی نتیجه
    (82, 85),   # باید همون روز اول
    (86, 87),   # دیده بشه.
    (88, 91),   # وقتی با هوش مصنوعی
    (92, 94),   # ریتم ساختت رو
    (95, 96),   # آسون کنی،
    (97, 99),   # استمرار برات مثل
    (100, 102), # آب خوردن میشه
    (103, 106), # و اون چرخ سنگین،
    (107, 109), # بالاخره با انرژی
    (110, 112), # صفر شروع به
    (113, 114), # چرخیدن می‌کنه!
    (115, 117), # این ویدیو رو
    (118, 120), # حتماً نگه دار
    (121, 123), # که هر وقت
    (124, 125), # ناامید شدی،
    (126, 129), # یادت بیاد چرخ فلزی
    (130, 133), # داره انرژی جمع می‌کنه...
]

cur = 0
for first, last in phrase_groups:
    assert first == cur, f"Gap/overlap at {first} != {cur}"
    assert 1 <= (last - first + 1) <= 4, f"Phrase length invalid: {(first, last)}"
    cur = last + 1
assert cur == len(words), f"Covered {cur} != {len(words)}"

phrases = []
for idx, (first, last) in enumerate(phrase_groups):
    from_f = A(first)
    if idx + 1 < len(phrase_groups):
        next_start = A(phrase_groups[idx + 1][0])
        to_f = min(next_start, E(last) + 22)
    else:
        to_f = DURATION_FRAMES
    phrases.append({
        "index": idx,
        "first": first,
        "last": last,
        "fromFrame": from_f,
        "toFrame": to_f,
        "text": " ".join(words[k]["text"] for k in range(first, last + 1)),
    })

(R / "data/phrases.json").write_text(
    json.dumps(phrases, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)

shots = [
    {"id": "flywheel-concept",     "name": "FlywheelConcept",      "frame": A(3),   "word": 3,   "wipe": False},
    {"id": "first-heavy-push",     "name": "FirstHeavyPush",       "frame": A(10),  "word": 10,  "wipe": False},
    {"id": "burnout-quit-trap",    "name": "BurnoutQuitTrap",      "frame": A(30),  "word": 30,  "wipe": False},
    {"id": "stored-energy-truth",  "name": "StoredEnergyTruth",    "frame": A(42),  "word": 42,  "wipe": True},
    {"id": "content-momentum",     "name": "ContentMomentumCurve", "frame": A(53),  "word": 53,  "wipe": False},
    {"id": "day-one-mistake",      "name": "DayOneMistake",        "frame": A(75),  "word": 75,  "wipe": True},
    {"id": "ai-rhythm-zero",       "name": "AIRhythmZeroEffort",   "frame": A(88),  "word": 88,  "wipe": True},
    {"id": "save-flywheel-cta",    "name": "SaveFlywheelCTA",      "frame": A(115), "word": 115, "wipe": True},
]

meta = {
    "slug": "flywheel-effect-v01",
    "compositionId": "FlywheelEffect",
    "fps": FPS,
    "width": 1080,
    "height": 1920,
    "scale": 4 / 3,
    "outputWidth": 1440,
    "outputHeight": 2560,
    "durationSeconds": round(duration_sec, 4),
    "durationInFrames": DURATION_FRAMES,
    "narrationHz": sr,
    "voiceGain": 1.0,
    "elementGain": 0.30,
    "openingEndFrame": A(3),
    "shots": shots,
}
(R / "data/meta.json").write_text(
    json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)

# 55 semantic beats (~1.38/sec) — intra-object micro-actions + M006 continuity
beats_spec = [
    # Opening QuestionCover (0..2)
    (0,   "cover",                "metal",  "چرخ سنگین فلای‌ویل روی خورشید طلایی کاور متوقف است", "جا افتادن محور برنجی چرخ روی پایهٔ کاور با سایه عمیق", "استعارهٔ سنگینی چرخ در کانون جلد دیده می‌شود", "آغاز با شیء قهرمان جلد (چرخ سنگین فلزی فلای‌ویل)"),
    (2,   "cover",                "lock",   "پلاک عنوان روی پایهٔ چرخ سفید مانده است", "قفل شدن پیچ‌های برنجی و پلاک «فلای‌ویل» روی محور", "کاور با ضرب مدیریت آمادهٔ ورود به صحنهٔ اول است", None),

    # Shot 0: FlywheelConcept (3..9)
    (3,   "flywheel-concept",     "slide",  "چرخ کاور روی صفحهٔ نقشه قرار می‌گیرد", "باز شدن خطوط اندازه‌گیری مهندسی دور محفظهٔ چرخ", "فضای تشریح مفهوم مهندسی شکل می‌گیرد", "تحویل مستقیم چرخ فلای‌ویل از جلد پرسشی به میز نقشهٔ صحنهٔ صفر (M006)"),
    (6,   "flywheel-concept",     "paper",  "نشان عنوان بالای تخته هنوز بسته است", "لغزیدن برچسب لاجوردی «اثرِ فلای‌ویل» روی قاب بالا", "نام مفهوم در مرکز توجه می‌نشیند", None),
    (7,   "flywheel-concept",     "pop",    "حلقهٔ پیرامون چرخ خاموش است", "روشن شدن بخش‌های سنجش انرژی جنبشی دور حلقهٔ بیرونی", "مدار ذخیرهٔ انرژی معرفی می‌شود", None),
    (8,   "flywheel-concept",     "tick",   "پره‌های برنجی چرخ ثابت‌اند", "چرخش یک‌چهارم‌دور کالیبراسیون و درگیرشدن چرخ‌دندهٔ کمکی", "سازوکار انتقال نیرو فعال می‌شود", None),
    (9,   "flywheel-concept",     "stamp",  "گوشهٔ تختهٔ مهندسی خالی است", "حک شدن نشان انگلیسی Flywheel در مهر گوشهٔ نقشه", "اصطلاح علمی در قاب ثبت می‌شود", None),

    # Shot 1: FirstHeavyPush (10..29)
    (10,  "first-heavy-push",     "slide",  "چرخ از میز نقشه وارد فضای کارگاه می‌شود", "بزرگ‌شدن چرخ فلزی روی پایهٔ کف با سایهٔ سنگین", "مقیاس فیزیکی سنگینی چرخ حس می‌شود", "انتقال چرخ فلای‌ویل از نقشهٔ صحنهٔ صفر به محور کف کارگاه (M006)"),
    (13,  "first-heavy-push",     "metal",  "محور چرخ بدون اهرم کمکی است", "نصب اهرم برنجی فشار روی توپی مرکزی چرخ", "نقطهٔ اعمال نیرو مشخص می‌شود", None),
    (14,  "first-heavy-push",     "stamp",  "وزن چرخ هنوز نامگذاری نشده است", "بسته شدن وزنهٔ سنگین برنجی به پرهٔ پایینی و تشدید سایه", "جرم زیاد چرخ فلزی نمایان می‌شود", None),
    (18,  "first-heavy-push",     "tap",    "اهرم فشار بدون کاراکتر مانده است", "ورود کاراکتر پیکسلی و گرفتن اهرم فشار با دو دست", "تلاش انسانی برای به حرکت درآوردن چرخ آغاز می‌شود", None),
    (19,  "first-heavy-push",     "tick",   "شمارشگر دور روی صفر قفل است", "چشمک زدن نشان «دورِ ۰» روی صفحهٔ سنجش", "نقطهٔ شروع بدون حرکت قبلی ثبت می‌شود", None),
    (21,  "first-heavy-push",     "switch", "نشانگر فشار کاراکتر خنثی است", "پر شدن نشانگر زور به ۱۰۰٪ قرمز و خم شدن کاراکتر روی اهرم", "تمام توان اولیه صرف هل دادن می‌شود", None),
    (24,  "first-heavy-push",     "clasp",  "چرخ سنگین هنوز قفل مانده است", "تکان آهسته و سنگین چرخ تا ۱۸۰ درجه با جرقهٔ اصطکاک", "مقاومت اولیهٔ جرم شکسته می‌شود", None),
    (27,  "first-heavy-push",     "done",   "عقربهٔ دورسنج در میانهٔ راه است", "تکمیل زاویهٔ ۳۶۰ درجه و پریدن شمارشگر از ۰ به ۱", "اولین دور کامل با سختی طی می‌شود", None),
    (29,  "first-heavy-push",     "lock",   "قفل دور اول باز است", "جا افتادن زبانهٔ سبز «۱ دور ✓» روی محور مرکزی", "چرخش نخست با موفقیت قفل می‌شود", None),

    # Shot 2: BurnoutQuitTrap (30..41)
    (30,  "burnout-quit-trap",    "slide",  "تنها یک کاراکتر کنار چرخ ایستاده است", "ظاهر شدن سه کاراکتر دیگر در پشت صف برای نمایش اکثریت", "رفتار معمول اغلب افراد نشان داده می‌شود", "حفظ همان چرخ و کاراکتر پس از قفل شدن «۱ دور» در صحنهٔ ۱ (M006)"),
    (33,  "burnout-quit-trap",    "tick",   "باتری انرژی کاراکتر در مرز زرد است", "سقوط باتری به ۱۲٪ قرمز با برچسب خستگی", "فرسودگی روانی و جسمی دقیقاً همین‌جا رخ می‌دهد", None),
    (36,  "burnout-quit-trap",    "pop",    "فضای بالای سر کاراکترها خالی است", "باز شدن حباب گفتار نارنجی «جواب نمیده!»", "ناامیدی و قضاوت زودهنگام بیان می‌شود", None),
    (39,  "burnout-quit-trap",    "fold",   "دست کاراکتر روی اهرم است", "رها شدن اهرم و عقب‌نشینی کاراکتر؛ کند شدن چرخش", "دست کشیدن از ادامهٔ مسیر دیده می‌شود", None),
    (40,  "burnout-quit-trap",    "stamp",  "تابلوی نتیجه خالی است", "خوردن مهر قرمز «توقف ✕» روی خروجی ظاهراً صفر", "توقف درست قبل از برداشت انرژی پنهان ثبت می‌شود", None),

    # Shot 3: StoredEnergyTruth (42..52)
    (42,  "stored-energy-truth",  "swish",  "مهر قرمز توقف جلوی چرخ را گرفته است", "پرده کشیده شده و پیچ‌های درپوش جلوی چرخ باز می‌شوند", "حقیقت درونی چرخ آمادهٔ نمایش می‌شود", "باز کردن درپوش درونی همان چرخ صحنهٔ ۲ برای نمایش انرژی ذخیره (M006)"),
    (43,  "stored-energy-truth",  "lock",   "نمای چرخ از بیرون بسته است", "روشن شدن برش داخلیِ شبانهٔ توپی چرخ با کتیبهٔ «حقیقت»", "ساختار داخلی ذخیره‌ساز آشکار می‌شود", None),
    (45,  "stored-energy-truth",  "metal",  "فنر مارپیچ داخلی شل است", "کشیده شدن و کوک شدن فنر برنجی توسط دندهٔ دور اول", "چرخش اول فنر داخلی را شارژ می‌کند", None),
    (47,  "stored-energy-truth",  "pop",    "هستهٔ مرکزی چرخ بی‌نور است", "تزریق گوی‌های طلایی انرژی از طوقه به هستهٔ مرکزی", "انرژی چرخش اول در محور انباشته می‌شود", None),
    (49,  "stored-energy-truth",  "slide",  "یک حلقه دور چرخ دیده می‌شود", "باز شدن سه مدار هم‌مرکز دورهای بعدی با کد آبی و طلایی", "انرژی برای دورهای آینده آماده می‌شود", None),
    (51,  "stored-energy-truth",  "done",   "نوار ذخیره روی ۶۰٪ است", "پر شدن کامل مخزن داخلی با نشان سبز «ذخیره شد ✓»", "ذخیره‌سازی انرژی دور اول تثبیت می‌شود", None),

    # Shot 4: ContentMomentumCurve (53..74)
    (53,  "content-momentum",     "slide",  "چرخ شارژشده در مرکز است", "نشستن چرخ در پایهٔ چپ و باز شدن ریل رشد تولید محتوا", "اتصال چرخ فلای‌ویل به مسیر تولید محتوا برقرار می‌شود", "کوپل شدن چرخ انرژی‌ذخیره‌کردهٔ صحنهٔ ۳ به زیر منحنی رشد محتوا (M006)"),
    (54,  "content-momentum",     "paper",  "ریل تولید محتوا خالی است", "ورود کارت‌های ویدیوی اولیه روی خط افقی ۱۰ ویدیوی اول", "روند انتشار اولیه آغاز می‌شود", None),
    (59,  "content-momentum",     "tick",   "شمارشگر ویدیو روی ۱ است", "حرکت نشانگر از ویدیوی ۰۱ تا ۱۰ روی خط صاف پایین", "دورهٔ سکوت ۱۰ ویدیوی اول طی می‌شود", None),
    (62,  "content-momentum",     "tap",    "نشانگر بازخورد کنار ریل منتظر است", "ماندن عقربهٔ دیده شدن روی «۰ تغییر» در ۱۰ تای اول", "ندیدن نتیجهٔ فوری در ظاهر نشان داده می‌شود", None),
    (66,  "content-momentum",     "switch", "چرخ زیر ریل در حال شارژ مخفی است", "روشن شدن هستهٔ آبی چرخ با عنوان «سیستم فعال»", "نیروی نهفتهٔ سیستم به آستانهٔ چرخش می‌رسد", None),
    (68,  "content-momentum",     "lock",   "نشانگر روی مرز ۱۵ مانده است", "قفل شدن پلاک طلایی «ویدیوی ۲۰» در نقطهٔ عطف منحنی", "مرز شکست سکون در ویدیوی بیستم ثبت می‌شود", None),
    (72,  "content-momentum",     "pop",    "ادامهٔ خط منحنی هنوز افقی است", "اوج‌گیری تند منحنی یاقوتی و طلایی به سمت بالا", "شتاب تصاعدی نمودار شکل می‌گیرد", None),
    (73,  "content-momentum",     "done",   "فضای بالای منحنی آرام است", "پرتاب پی‌درپی کارت‌های محتوا و سکه‌های ارزش روی قله", "جهش تصاعدی بازدهی دیده می‌شود", None),

    # Shot 5: DayOneMistake (75..87)
    (75,  "day-one-mistake",      "swish",  "نمودار تصاعدی کل قاب را گرفته است", "پرده کشیده شده و تقویم رومیزی «روز اول» با ذره‌بین باز می‌شود", "تمرکز روی خطای شناختی روز اول می‌رود", "بزرگ‌نمایی بخش صاف «روز ۱» از نمودار صحنهٔ ۴ زیر ذره‌بین (M006)"),
    (76,  "day-one-mistake",      "stamp",  "حاشیهٔ تقویم خنثی است", "درخشش کادر هشدار نارنجی دور برگهٔ «روز ۱»", "بزرگنمایی اشتباه رایج آغازگران", None),
    (81,  "day-one-mistake",      "pop",    "کفهٔ نتیجه بالای تقویم خالی است", "لرزش نشانگر نتیجه و برچسب خیالی «نتیجهٔ فوری»", "انتظار غیرواقعیِ نتیجهٔ آنی نمایش داده می‌شود", None),
    (84,  "day-one-mistake",      "paper",  "ریشهٔ زیر خاک تقویم پنهان است", "نمایان شدن ریشه‌های در حال رشد زیر خط افق «روز اول»", "فرآیند پنهان رشد در زیر سطح دیده می‌شود", None),
    (86,  "day-one-mistake",      "stamp",  "توهم نتیجهٔ روز اول هنوز پابرجاست", "کوبیده شدن مهر قرمز «اشتباهِ بزرگ ✕» روی انتظار فوری", "باور نادرست نتیجهٔ روز اول رد می‌شود", None),

    # Shot 6: AIRhythmZeroEffort (88..114)
    (88,  "ai-rhythm-zero",       "swish",  "تقویم روز اول جمع می‌شود", "ورود کنسول AI در کنار چرخ بزرگ فلای‌ویل", "اتصال هوش مصنوعی به چرخ سنگین آغاز می‌شود", "اتصال موتور هوش مصنوعی به چرخ فلای‌ویل برای حذف اصطکاک روزانه (M006)"),
    (90,  "ai-rhythm-zero",       "switch", "تسمهٔ رابط بین کنسول و چرخ قطع است", "وصل شدن تسمهٔ یاقوتی هوش مصنوعی به توپی چرخ", "نیروی محرک هوشمند به چرخ متصل می‌شود", None),
    (92,  "ai-rhythm-zero",       "tick",   "صفحهٔ ریتم هنوز بی‌ثبات است", "قفل شدن عقربهٔ مترونوم روی «ریتم منظم»", "نظم ساخت محتوا با کمک AI تثبیت می‌شود", None),
    (95,  "ai-rhythm-zero",       "done",   "وزنهٔ اصطکاک هنوز به پره وصل است", "جدا شدن وزنهٔ سختی و تغییر نشانگر به «آسان ✓»", "فشار ساخت محتوا برداشته می‌شود", None),
    (97,  "ai-rhythm-zero",       "paper",  "زنجیرهٔ روزانه تنها یک کارت دارد", "تکمیل زنجیرهٔ ۵ تیک متوالی استمرار بالای ریل", "تداوم بدون وقفه شکل می‌گیرد", None),
    (100, "ai-rhythm-zero",       "pop",    "برچسب سهولت هنوز نمایش داده نشده", "لغزیدن مدال آبی قطره با برچسب «مثلِ آب خوردن»", "سادگی استمرار به تصویر کشیده می‌شود", None),
    (105, "ai-rhythm-zero",       "metal",  "حلقه‌های طلایی چرخ سرعت می‌گیرند", "درخشش چرخ سنگین فلزی در سرعت پایدار", "چرخ سنگین به حرکت پیوسته درمی‌آید", None),
    (109, "ai-rhythm-zero",       "fold",   "سنجشگر فشار دست روی ۵۰٪ است", "سقوط عقربهٔ فشار فردی به «انرژیِ صفر» (۰٪)", "بی‌نیاز شدن چرخ از زور فردی ثبت می‌شود", None),
    (113, "ai-rhythm-zero",       "done",   "وضعیت چرخش در حال تثبیت است", "گردش آزاد و پرشتاب چرخ با مهر سبز «چرخش خودکار ✓»", "چرخ با انرژی صفر به‌طور خودکار می‌چرخد", None),

    # Shot 7: SaveFlywheelCTA (115..133)
    (115, "save-flywheel-cta",    "swish",  "کارگاه تمام‌صفحه بسته می‌شود", "پرده کشیده شده و گوشی استودیویی ذخیره کنار چرخ درخشان ظاهر می‌شود", "دعوت نهایی روی پس‌زمینهٔ خورشید کاور باز می‌شود", "بازگشت چرخ درخشان و خورشید طلایی کاور در قاب نهایی ذخیرهٔ ویدیو (M006)"),
    (118, "save-flywheel-cta",    "slide",  "نشانگر دست در حاشیهٔ گوشی است", "حرکت نشانگر به سمت دکمهٔ آبی «نگه دار»", "توجه روی ذخیرهٔ ویدیو متمرکز می‌شود", None),
    (119, "save-flywheel-cta",    "done",   "دکمهٔ ذخیره آبی و بوکمارک خالی است", "فشرده شدن دکمه، پریدن روبان طلایی و تغییر به «ذخیره شد ✓»", "ویدیو در آرشیو ذخیره می‌شود", None),
    (124, "save-flywheel-cta",    "fold",   "ابر کوچک «ناامیدی» بالای چرخ دیده می‌شود", "کمرنگ شدن ابر خاکستری ناامیدی و تابش نور طلایی از چرخ", "حس ناامیدی با یادآوری چرخ پنهان کنار می‌رود", None),
    (128, "save-flywheel-cta",    "metal",  "چرخ فلزی در سمت چپ گوشی است", "درخشش پره‌های برنجی چرخ فلزی در حال چرخش پیوسته", "پویایی پیوستهٔ چرخ فلزی یادآوری می‌شود", None),
    (131, "save-flywheel-cta",    "lock",   "نوار انرژی کنار چرخ در حال صعود است", "پر شدن نشانگر «جمع‌کردن انرژی ✓» تا انتهای فریم پایانی", "پیام ذخیرهٔ انرژی چرخ با امضای ثابت بسته می‌شود", None),
]

beats = []
for idx, (wi, shot, sfx, before, action, after, cont) in enumerate(beats_spec):
    f0 = A(wi)
    f1 = A(beats_spec[idx + 1][0]) if idx + 1 < len(beats_spec) else DURATION_FRAMES
    item = {
        "index": idx,
        "shot": shot,
        "anchorIndex": wi,
        "anchorWord": words[wi]["text"],
        "frame": f0,
        "endFrame": f1,
        "startSec": round(f0 / FPS, 3),
        "endSec": round(f1 / FPS, 3),
        "durationSec": round((f1 - f0) / FPS, 3),
        "sfx": sfx,
        "before": before,
        "action": action,
        "after": after,
    }
    if cont:
        item["continuity"] = cont
    beats.append(item)

max_gap = max(b["durationSec"] for b in beats)
(R / "semantic-beats.json").write_text(
    json.dumps(beats, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)


def fmt_srt(sec: float) -> str:
    ms = round(sec * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


srt_lines = []
for p in phrases:
    srt_lines.append(f"{p['index'] + 1}")
    srt_lines.append(f"{fmt_srt(p['fromFrame'] / FPS)} --> {fmt_srt(p['toFrame'] / FPS)}")
    srt_lines.append(p["text"])
    srt_lines.append("")
(R / "subtitles.srt").write_text("\n".join(srt_lines), encoding="utf-8")

print(f"Duration: {duration_sec:.3f}s ({DURATION_FRAMES} frames @ {FPS}fps)")
print(f"Phrases: {len(phrases)} | Shots: {len(shots)} | Beats: {len(beats)} ({len(beats)/duration_sec:.2f}/s) | Max beat span: {max_gap:.2f}s")
for b in beats:
    flag = " [>2.5s HOLD CHECK]" if b["durationSec"] > 2.5 else ""
    print(f"  B{b['index']:02d} {b['shot']:20s} f={b['frame']:4d}..{b['endFrame']:4d} ({b['durationSec']:4.2f}s) @{b['anchorWord']}{flag}")
