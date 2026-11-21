import React from "react";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import {
  A,
  C,
  T,
  Head,
  Tag,
  Tick,
  Screw,
  tr,
  sp,
  spHeavy,
  spSnap,
  spPop,
  impactShake,
  sheenSweep,
  clamp,
  range,
  e,
} from "./core";
import {
  O,
  Shade,
  HeavyFlywheel,
  MediaCard,
  CoinToken,
  AICoreUnit,
  SheenOverlay,
} from "./objects";

const CURVE_PATH = "M14 172Q136 168 186 72T282 -192";
const CURVE_LEN = getLength(CURVE_PATH);

/* ============================================================================
   SHOT 4: ContentMomentumCurve (w53..w74 -> f=1001..1429)
   "توی تولید محتوا هم دقیقاً همینه؛ ده تای اول هیچ اتفاقی نمی‌افته، اما سیستم از ویدیوی بیستم به بعد شتاب تصاعدی می‌گیره!"
   Continuity: Charged flywheel docks under the left rail of the growth chart.
   Upgrade: Live glowing beacon tracking getPointAtLength on the exponential curve!
============================================================================ */
export function ContentMomentumCurve({ f }: { f: number }) {
  const dockIn = spHeavy(f, A(53), 24);
  const count10 = e(f, A(59), Math.max(20, A(62) - A(59)));
  const zeroOut = spSnap(f, A(62), 18);
  const sysOn = spPop(f, A(66), 20);
  const v20Lock = spPop(f, A(68), 20);
  const rocketUp = e(f, A(72), Math.max(20, A(74) - A(72)));
  const payoffIn = spPop(f, A(73), 22);

  const countNum = Math.round(1 + 9 * count10 + 10 * clamp(v20Lock));
  const curveProg = clamp(v20Lock * 0.28 + rocketUp * 0.72);
  const evolvedCurve = evolvePath(curveProg, CURVE_PATH);
  const tipPt = getPointAtLength(CURVE_PATH, CURVE_LEN * curveProg);

  return (
    <g>
      <Head s="جهش از ویدیوی بیستم" f={f} start={A(53)} />

      {/* Growth Chart Drafting Frame */}
      <g transform={tr(444, 594)} filter="url(#lift)">
        <rect
          x="-374"
          y="-294"
          width="748"
          height="588"
          rx="26"
          fill="url(#ivory)"
          stroke="#C2B89F"
          strokeWidth="2.8"
        />
        <rect
          x="-350"
          y="-270"
          width="700"
          height="540"
          rx="16"
          fill="url(#paper)"
          stroke="#D7CFBA"
          strokeWidth="1.6"
        />
        <rect
          x="-350"
          y="-270"
          width="700"
          height="540"
          rx="16"
          fill="url(#draft)"
        />
        <Screw x={-330} y={-250} r={5} />
        <Screw x={330} y={-250} r={5} />
        <Screw x={-330} y={250} r={5} />
        <Screw x={330} y={250} r={5} />

        {/* Axes */}
        <path
          d="M-296 184H296M-296 -210V184"
          stroke={O.ink}
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Flat silent phase (Videos 1..10) */}
        <path
          d="M-286 172H14"
          stroke="#92A19E"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${300 * clamp(spSnap(f, A(54), 18) * 1.4)} 400`}
        />

        {/* Exponential takeoff curve evolved via @remotion/paths */}
        <path
          d={CURVE_PATH}
          fill="none"
          stroke={O.blue}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={evolvedCurve.strokeDasharray}
          strokeDashoffset={evolvedCurve.strokeDashoffset}
        />

        {/* Glowing live beacon riding the tip of the curve */}
        {tipPt && curveProg > 0.03 && (
          <g transform={tr(tipPt.x, tipPt.y)}>
            <circle r="15" fill={O.blue} opacity="0.22" />
            <circle r="7.5" fill="#FFFFFF" stroke={O.blue} strokeWidth="3.5" />
          </g>
        )}

        {/* Glowing node at Video 20 inflection point */}
        <g
          transform={tr(98, 152, 0.7 + 0.3 * clamp(v20Lock))}
          opacity={clamp(v20Lock)}
        >
          <circle r="16" fill="url(#brass)" stroke="#7B6030" strokeWidth="3" />
          <Tag
            s="ویدیوی ۲۰"
            x={0}
            y={-52}
            w={150}
            h={46}
            c="url(#lapisGrad)"
            n={24}
          />
        </g>

        {/* Staggered video cards lined along the early flat rail */}
        {[0, 1, 2].map((i) => {
          const p = spPop(f, A(54) + i * 4, 18);
          return (
            <g
              key={i}
              transform={tr(
                -224 + i * 96,
                98 + 16 * (1 - p),
                0.86 + 0.14 * clamp(p),
                (1 - clamp(p)) * (i % 2 ? 4 : -4),
              )}
              opacity={clamp(p)}
            >
              <MediaCard
                w={78}
                h={94}
                k={i % 3}
                p={0.75}
                play={false}
                label={`ویدیو ${i === 0 ? "۱" : i === 1 ? "۵" : "۱۰"}`}
              />
            </g>
          );
        })}

        {/* Zero change indicator on first 10 videos */}
        <g
          transform={tr(-136, -64, 0.78 + 0.22 * zeroOut)}
          opacity={clamp(zeroOut)}
        >
          <rect
            x="-126"
            y="-30"
            width="252"
            height="60"
            rx="16"
            fill="#F4EDE0"
            stroke="#C3B79B"
            strokeWidth="2"
          />
          <T
            s="۱۰ تای اول: ۰ تغییر"
            x={0}
            y={1}
            w={226}
            h={32}
            n={24}
            k={800}
            c={C.clay}
          />
        </g>

        {/* Takeoff media & coins above the exponential curve */}
        <g
          transform={tr(
            228,
            -96 - 18 * clamp(payoffIn),
            0.72 + 0.28 * payoffIn,
          )}
          opacity={clamp(payoffIn)}
        >
          <MediaCard w={96} h={118} k={0} p={0.95} rot={6} label="شتاب!" />
          <g transform={tr(-70, -54, spPop(f, A(73) + 2, 18))}>
            <CoinToken x={0} y={0} s={0.72} label="رشد" />
          </g>
          <g transform={tr(64, 46, spPop(f, A(73) + 5, 18))}>
            <CoinToken x={0} y={0} s={0.65} label="بازده" />
          </g>
        </g>

        {/* Live Video Counter Badge */}
        <g transform={tr(-212, -204)}>
          <rect
            x="-106"
            y="-34"
            width="212"
            height="68"
            rx="18"
            fill="url(#night)"
            stroke="url(#brass)"
            strokeWidth="2.4"
          />
          <T
            s={`ویدیوی ${countNum}`}
            x={0}
            y={1}
            w={186}
            h={36}
            n={30}
            k={900}
            c="#FCEDB7"
          />
        </g>

        {/* Charged Flywheel docked under the left rail */}
        <g transform={tr(-236, 214, 0.44 * (0.85 + 0.15 * clamp(dockIn)))}>
          <HeavyFlywheel
            s={1}
            rot={90 * count10 + 360 * rocketUp}
            energy={0.55 + 0.45 * clamp(sysOn)}
            cutaway={sysOn > 0.3}
          />
        </g>

        {/* "سیستم فعال" pill */}
        <g transform={tr(0, 226, 0.78 + 0.22 * sysOn)} opacity={clamp(sysOn)}>
          <Tag
            s="سیستمِ فعال ✓"
            x={0}
            y={0}
            w={210}
            h={52}
            c="url(#green)"
            n={24}
          />
        </g>
      </g>
    </g>
  );
}

/* ============================================================================
   SHOT 5: DayOneMistake (w75..w87 -> f=1430..1619) — WIPE IN
   "اشتباه بزرگ اینه که فکر می‌کنی نتیجه باید همون روز اول دیده بشه."
   Continuity: Zooms into "روز اول" flat segment with @remotion/paths root
   growth + dramatic micro-impact stamp slam.
============================================================================ */
export function DayOneMistake({ f }: { f: number }) {
  const calIn = spSnap(f, A(75), 18);
  const warnIn = spSnap(f, A(76), 18);
  const mirageIn = spPop(f, A(81), 18);
  const rootIn = spHeavy(f, A(84), 24);
  const stampIn = spPop(f, A(86), 16);
  const stampShake = impactShake(f, A(86), 8, 14);

  const rootPaths = [
    "M0 10C-18 52-70 68-126 98",
    "M0 10C16 54 74 70 134 102",
    "M0 10C-4 60-22 92-42 122",
    "M0 10C10 60 34 90 56 122",
  ];

  return (
    <g transform={tr(stampShake * 0.65, stampShake)}>
      <Head s="اشتباه: انتظار در روز اول" f={f} start={A(75)} />

      {/* Ground divider */}
      <Shade x={444} y={668} w={300} h={22} />
      <rect
        x="110"
        y="658"
        width="668"
        height="14"
        rx="7"
        fill="url(#wood)"
        stroke="#A48854"
        strokeWidth="2"
      />

      {/* Underground roots growing via @remotion/paths */}
      <g transform={tr(444, 672)} opacity={clamp(rootIn * 1.4)}>
        <rect
          x="-280"
          y="0"
          width="560"
          height="196"
          rx="22"
          fill="#EFE8D4"
          stroke="#C7BEA5"
          strokeWidth="2"
        />
        {rootPaths.map((d, idx) => {
          const ev = evolvePath(
            clamp(rootIn * 1.3 - idx * 0.08),
            d,
          );
          return (
            <path
              key={idx}
              d={d}
              fill="none"
              stroke={O.green}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={ev.strokeDasharray}
              strokeDashoffset={ev.strokeDashoffset}
            />
          );
        })}
        <T
          s="رشدِ پنهانِ ریشه‌ها زیر سطح"
          x={0}
          y={162}
          w={420}
          h={30}
          n={24}
          k={800}
          c={O.green}
        />
      </g>

      {/* Tactile Desk Calendar Card: "روز ۱" */}
      <g
        transform={tr(376, 488 + 18 * (1 - calIn), 0.92 + 0.08 * calIn)}
        filter="url(#heavyLift)"
      >
        <rect
          x="-156"
          y="-164"
          width="312"
          height="328"
          rx="26"
          fill="url(#paper)"
          stroke={warnIn > 0.4 ? C.clay : "#C3B9A3"}
          strokeWidth={warnIn > 0.4 ? 4 : 2.5}
        />
        <rect
          x="-156"
          y="-164"
          width="312"
          height="84"
          rx="26"
          fill="url(#clay)"
        />
        <rect x="-156" y="-110" width="312" height="30" fill="url(#clay)" />
        <Screw x={-96} y={-124} r={7} />
        <Screw x={96} y={-124} r={7} />
        <T
          s="روز اول"
          x={0}
          y={-120}
          w={220}
          h={44}
          n={36}
          k={900}
          c="#FFFFFF"
        />
        <T s="۱" x={0} y={42} w={180} h={150} n={140} k={900} c={O.ink} />
      </g>

      {/* Mirage "نتیجهٔ فوری" card being stamped with Error */}
      <g
        transform={tr(
          646,
          456 - 10 * clamp(mirageIn),
          0.82 + 0.18 * mirageIn,
        )}
        opacity={clamp(mirageIn)}
        filter="url(#lift)"
      >
        <rect
          x="-134"
          y="-78"
          width="268"
          height="156"
          rx="22"
          fill="url(#ivory)"
          stroke="#C2B8A0"
          strokeWidth="2.4"
        />
        <T
          s="انتظارِ نتیجهٔ فوری"
          x={0}
          y={-34}
          w={230}
          h={34}
          n={24}
          k={800}
          c={O.ink}
        />
        <path
          d="M-84 36L84 6"
          stroke="#95A49F"
          strokeWidth="5"
          strokeDasharray="8 6"
          strokeLinecap="round"
        />
      </g>

      {/* Red Stamp slamming onto mirage */}
      <g
        transform={tr(534, 480, 1.4 - 0.4 * stampIn, -11)}
        opacity={clamp(stampIn)}
      >
        <rect
          x="-152"
          y="-46"
          width="304"
          height="92"
          rx="18"
          fill="rgba(255,251,241,0.96)"
          stroke={C.clay}
          strokeWidth="5.5"
        />
        <T
          s="اشتباهِ بزرگ ✕"
          x={0}
          y={1}
          w={270}
          h={48}
          n={34}
          k={900}
          c={C.clay}
        />
      </g>
    </g>
  );
}

/* ============================================================================
   SHOT 6: AIRhythmZeroEffort (w88..w114 -> f=1620..2110) — WIPE IN
   "وقتی با هوش مصنوعی ریتم ساختت رو آسون کنی، استمرار برات مثل آب خوردن میشه و اون چرخ سنگین، بالاخره با انرژی صفر شروع به چرخیدن می‌کنه!"
   Continuity: Connects AI drive unit via belt with staggered tick chain &
   smoothly accelerating HeavyFlywheel at 0% human effort.
============================================================================ */
export function AIRhythmZeroEffort({ f }: { f: number }) {
  const aiIn = spSnap(f, A(88), 20);
  const beltIn = spSnap(f, A(90), 18);
  const rhythmIn = spHeavy(f, A(92), 22);
  const easyIn = spPop(f, A(95), 18);
  const waterIn = spPop(f, A(100), 18);
  const spinUp = e(f, A(105), Math.max(24, A(114) - A(105)));
  const zeroIn = spSnap(f, A(109), 20);
  const autoDone = spPop(f, A(113), 18);

  const wheelRot = 140 * clamp(rhythmIn) + 740 * spinUp;
  const effortPct = Math.round(50 * (1 - clamp(zeroIn)));

  return (
    <g>
      <Head s="چرخِ خودکار با هوش مصنوعی" f={f} start={A(88)} blue />

      {/* Top 5-day Continuity Tick Chain with 3-frame stagger */}
      <g
        transform={tr(444, 336)}
        opacity={clamp(spSnap(f, A(97), 16) * 1.4)}
      >
        <rect
          x="-320"
          y="-42"
          width="640"
          height="84"
          rx="22"
          fill="url(#paper)"
          stroke="#C5BDAA"
          strokeWidth="2.2"
        />
        <T
          s="استمرارِ منظم"
          x={216}
          y={0}
          w={168}
          h={34}
          n={24}
          k={800}
          c={O.ink}
        />
        {range(5).map((i) => {
          const p = spPop(f, A(97) + i * 3, 18);
          return (
            <g
              key={i}
              transform={tr(-230 + i * 74, 0, 0.5 + 0.5 * p)}
              opacity={clamp(p)}
            >
              <circle r="24" fill="url(#green)" />
              <Tick x={0} y={1} scale={0.72} col="#FFFFFF" />
            </g>
          );
        })}
      </g>

      {/* Drive Belt connecting AI Core (left) to HeavyFlywheel (right) */}
      <g opacity={clamp(beltIn)}>
        <path
          d="M258 552L588 532M258 648L588 692"
          stroke={O.blue}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="18 10"
          strokeDashoffset={-spinUp * 260}
        />
      </g>

      {/* AI Core Drive Unit (Left) */}
      <g
        transform={tr(210 - 26 * (1 - aiIn), 600)}
        opacity={clamp(aiIn)}
      >
        <AICoreUnit
          x={0}
          y={0}
          active={clamp(beltIn)}
          done={clamp(easyIn)}
          scale={1.0}
          subtitle="ریتمِ منظم"
        />
      </g>

      {/* Heavy Flywheel spinning smoothly with ZERO human effort (Right) */}
      <Shade x={622} y={838} w={220} h={22} />
      <g transform={tr(622, 616, 1.02)} filter="url(#heavyLift)">
        <HeavyFlywheel
          s={1}
          rot={wheelRot}
          energy={0.7 + 0.3 * clamp(autoDone)}
          plinth
        />
      </g>

      {/* "مثل آب خوردن" blue droplet badge */}
      <g
        transform={tr(
          212,
          774 - 12 * (1 - waterIn),
          0.74 + 0.26 * waterIn,
        )}
        opacity={clamp(waterIn)}
      >
        <rect
          x="-119"
          y="-29"
          width="238"
          height="58"
          rx="29"
          fill="url(#blue)"
          stroke="#fff"
          strokeOpacity=".45"
          strokeWidth="2"
        />
        <path
          d="M-84-12c0 0 11 12 11 19a11 11 0 0 1-22 0c0-7 11-19 11-19z"
          fill="#FFFBF1"
        />
        <T
          s="مثلِ آب خوردن"
          x={14}
          y={-1}
          w={170}
          h={34}
          n={24}
          k={800}
          c="#FFFFFF"
        />
      </g>

      {/* Zero Effort Gauge (Bottom Center-Right) */}
      <g transform={tr(584, 886)} filter="url(#lift)">
        <rect
          x="-212"
          y="-42"
          width="424"
          height="84"
          rx="22"
          fill="url(#paper)"
          stroke="#C5BDAA"
          strokeWidth="2.4"
        />
        <T
          s={`انرژیِ فردی: ${effortPct}٪`}
          x={68}
          y={0}
          w={220}
          h={34}
          n={26}
          k={900}
          c={zeroIn > 0.6 ? O.green : O.ink}
        />
        {autoDone > 0.3 && (
          <g transform={tr(-110, 0, clamp(autoDone))}>
            <Tag
              s="چرخش خودکار ✓"
              x={0}
              y={0}
              w={176}
              h={50}
              c="url(#green)"
              n={21}
            />
          </g>
        )}
      </g>
    </g>
  );
}

/* ============================================================================
   SHOT 7: SaveFlywheelCTA (w115..w133 -> f=2111..2387) — WIPE IN
   "این ویدیو رو حتماً نگه دار که هر وقت ناامید شدی، یادت بیاد چرخ فلزی داره انرژی جمع می‌کنه..."
   Continuity: Hero flywheel returns glowing beside studio save phone + sun glow
   + tactile click impact & Sheen Sweep across CTA button!
============================================================================ */
export function SaveFlywheelCTA({ f }: { f: number }) {
  const enter = spSnap(f, A(115), 20);
  const handMove = spSnap(f, A(118), 18);
  const saved = spPop(f, A(119), 18);
  const clickShake = impactShake(f, A(119), 4.5, 10);
  const cloudFade = sp(f, A(124), 20);
  const glowSpin = e(f, A(128), Math.max(20, 2388 - A(128)));
  const chargeFull = spPop(f, A(131), 18);
  const ctaSheen = sheenSweep(f, A(119) + 6, 30);

  const sunPulse = 1 + 0.03 * Math.sin(f * 0.08);
  const wheelRot = 60 + 275 * glowSpin;

  return (
    <g transform={tr(0, clickShake)}>
      <Head s="این ویدیو رو نگه دار" f={f} start={A(115)} blue />

      {/* Warm cover sun callback behind the glowing flywheel */}
      <g
        transform={tr(274, 594, sunPulse)}
        opacity={0.72 + 0.28 * clamp(cloudFade)}
      >
        <circle r="196" fill="#FAF0CF" opacity=".52" />
        <circle r="146" fill="#F6E5AD" opacity=".78" />
      </g>

      {/* Fading grey "ناامیدی" cloud above the wheel */}
      <g
        transform={tr(274, 344 - 16 * clamp(cloudFade))}
        opacity={0.95 * (1 - 0.8 * clamp(cloudFade))}
      >
        <rect
          x="-104"
          y="-30"
          width="208"
          height="60"
          rx="30"
          fill="#D4D2C7"
          stroke="#A3A195"
          strokeWidth="2"
        />
        <T
          s="ناامیدی"
          x={0}
          y={1}
          w={160}
          h={32}
          n={25}
          k={800}
          c="#555A5E"
        />
      </g>

      {/* Hero HeavyFlywheel continuously charging */}
      <Shade x={274} y={818} w={210} h={20} />
      <g transform={tr(274, 594, 0.94)} filter="url(#heavyLift)">
        <HeavyFlywheel
          s={1}
          rot={wheelRot}
          energy={0.78 + 0.22 * clamp(chargeFull)}
          plinth
        />
      </g>

      {/* Energy Collecting Meter beneath Flywheel */}
      <g transform={tr(274, 876)} filter="url(#lift)">
        <rect
          x="-196"
          y="-38"
          width="392"
          height="76"
          rx="20"
          fill="url(#paper)"
          stroke="#C5BDAA"
          strokeWidth="2.2"
        />
        <T
          s="جمع‌کردن انرژی ✓"
          x={0}
          y={1}
          w={330}
          h={36}
          n={26}
          k={900}
          c={O.green}
        />
      </g>

      {/* Studio Phone Save Card (Right) */}
      <g
        transform={tr(
          638,
          608 + 22 * (1 - enter),
          0.94 + 0.06 * clamp(enter),
        )}
        filter="url(#heavyLift)"
      >
        <rect
          x="-158"
          y="-242"
          width="316"
          height="484"
          rx="38"
          fill="url(#night)"
          stroke="url(#brass)"
          strokeWidth="4"
        />
        <rect
          x="-140"
          y="-220"
          width="280"
          height="440"
          rx="28"
          fill="url(#paper)"
        />
        <rect x="-46" y="-208" width="92" height="10" rx="5" fill="#C9C2B0" />

        {/* Mini reel preview inside phone */}
        <rect
          x="-114"
          y="-178"
          width="228"
          height="236"
          rx="18"
          fill="url(#ivory)"
          stroke="#D2C8AE"
          strokeWidth="2"
        />
        <g transform={tr(0, -64, 0.52)}>
          <HeavyFlywheel s={1} rot={wheelRot} energy={1} />
        </g>
        <T
          s="اثرِ فلای‌ویل"
          x={0}
          y={28}
          w={190}
          h={30}
          n={24}
          k={900}
          c={O.ink}
        />

        {/* Bookmark Ribbon + Save Button with Sheen Sweep */}
        <g transform={tr(0, 134, 1 - 0.06 * Math.sin(Math.PI * clamp(saved)))}>
          <rect
            x="-114"
            y="-40"
            width="228"
            height="80"
            rx="22"
            fill={saved > 0.5 ? "url(#green)" : "url(#blue)"}
          />
          {saved > 0.5 ? (
            <g>
              <Tick x={-64} y={0} scale={0.72} col="#FFFFFF" />
              <T
                s="ذخیره شد"
                x={20}
                y={1}
                w={140}
                h={34}
                n={28}
                k={900}
                c="#FFFFFF"
              />
            </g>
          ) : (
            <T
              s="نگه دار"
              x={0}
              y={1}
              w={180}
              h={34}
              n={30}
              k={900}
              c="#FFFFFF"
            />
          )}
          <SheenOverlay
            x={-114}
            y={-40}
            w={228}
            h={80}
            rx={22}
            progress={ctaSheen}
          />
        </g>

        {/* Tactile pointer moving onto the Save button corner */}
        <g
          transform={tr(
            82 - 18 * clamp(handMove),
            210 - 38 * clamp(handMove),
            1 - 0.1 * clamp(saved),
          )}
          opacity={clamp(handMove * 1.4)}
        >
          <circle
            r="24"
            fill="rgba(255,251,241,0.92)"
            stroke={O.blue}
            strokeWidth="3.5"
          />
          <path
            d="M-6 -8l16 12-7 3 4 10-5 2-4-10-6 4z"
            fill={O.ink}
          />
        </g>
      </g>
    </g>
  );
}
