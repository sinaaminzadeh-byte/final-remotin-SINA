import React from "react";
import {
  A,
  C,
  T,
  Head,
  Tag,
  Tick,
  tr,
  clamp,
  e,
  sp,
  mix,
  range,
} from "./core";
import { O, Shade, RulePill, BatteryGauge } from "./objects";

/* ============================================================================
 * SHOT 0: LaunchPage — «برای اینکه امسال پیجت رو بدون خستگی راه بندازی و بترکونی!»
 * ============================================================================ */
export function LaunchPage({ f }: { f: number }) {
  const enter = sp(f, A(3) - 4, 24);
  const calm = e(f, A(8) - 2, 24); // «بدون خستگی» -> battery fills 100%, stress cloud fades
  const seals = sp(f, A(10) - 3, 22); // «راه بندازی» -> 4 seals snap in + switch active
  const boom = sp(f, A(13) - 3, 24); // «و بترکونی!» -> growth curve rockets up

  const batLevel = mix(0.45, 1.0, calm);

  return (
    <g>
      <Head s="شروع بدون خستگی" f={f} start={A(3)} />
      <Shade x={444} y={885} w={308} h={28} />

      {/* Main Creator Page Frame on tactile wooden stand */}
      <g
        transform={tr(444, 636 + 20 * (1 - enter), 0.92 + 0.06 * enter)}
        opacity={clamp(enter * 1.4)}
      >
        {/* Wooden stand base */}
        <path
          d="M-196 254 L196 254 L224 278 L-224 278 Z"
          fill="url(#wood)"
          stroke="#9E8250"
          strokeWidth="2.2"
        />
        {/* Four foundation seal sockets on the wooden stand */}
        {["۱", "۲", "۳", "۴"].map((num, i) => {
          const sx = 120 - i * 80;
          const p = sp(f, A(10) - 2 + i * 4, 20);
          return (
            <g key={num} transform={tr(sx, 242 - 18 * (1 - p), 0.72 + 0.28 * p)}>
              <circle
                r="24"
                fill={p > 0.3 ? "url(#gold)" : "#DDD6C4"}
                stroke={p > 0.3 ? "#A68443" : "#B5AD9B"}
                strokeWidth="2.4"
              />
              <T s={num} x={0} y={1} w={32} h={30} n={27} k={900} c={C.goldInk} />
            </g>
          );
        })}

        {/* Main tactile tablet / page display */}
        <g filter="url(#heavyLift)">
          <rect
            x="-238"
            y="-228"
            width="476"
            height="432"
            rx="34"
            fill="url(#ivory)"
            stroke="#BEB59E"
            strokeWidth="3"
          />
          <rect
            x="-220"
            y="-210"
            width="440"
            height="396"
            rx="24"
            fill="url(#paper)"
            stroke="#DDD6C5"
            strokeWidth="1.6"
          />

          {/* Top page header bar */}
          <rect
            x="-204"
            y="-194"
            width="408"
            height="72"
            rx="18"
            fill="url(#lapisGrad)"
          />
          <circle cx="164" cy="-158" r="21" fill="url(#gold)" stroke="#FFF" strokeWidth="2" />
          <T s="پیج" x={164} y={-157} w={34} h={24} n={18} k={900} c={C.goldInk} />
          <T s="پیج حرفه‌ای من" x={26} y={-158} w={214} h={42} n={34} k={900} c="#FFFFFF" />

          {/* Active status pill inside header */}
          <rect
            x="-190"
            y="-177"
            width="104"
            height="38"
            rx="19"
            fill={seals > 0.45 ? "url(#green)" : "#436485"}
          />
          <T
            s={seals > 0.45 ? "فعال ✓" : "آماده"}
            x={-138}
            y={-158}
            w={90}
            h={28}
            n={24}
            k={800}
            c="#FFFFFF"
          />

          {/* Chart canvas inside the page */}
          <rect
            x="-200"
            y="-104"
            width="400"
            height="270"
            rx="18"
            fill="#F7F4EB"
            stroke="#DFD8C6"
            strokeWidth="1.6"
          />
          <rect x="-200" y="-104" width="400" height="270" rx="18" fill="url(#draft)" />

          {/* Growth bars rising on boom */}
          {[
            { x: 126, h: 48, d: 0 },
            { x: 64, h: 78, d: 3 },
            { x: 2, h: 118, d: 6 },
            { x: -60, h: 156, d: 9 },
            { x: -122, h: 204, d: 12 },
          ].map((bar, idx) => {
            const p = clamp(mix(0.28, 1, sp(f, A(13) - 4 + bar.d, 22)));
            const bh = bar.h * p;
            return (
              <rect
                key={idx}
                x={bar.x - 20}
                y={144 - bh}
                width="40"
                height={bh}
                rx="10"
                fill={idx === 4 ? "url(#blue)" : idx >= 2 ? "url(#sageGrad)" : "#D2CCB8"}
              />
            );
          })}

          {/* Crisp ascending trend curve */}
          <path
            d={`M144 102 Q40 ${mix(92, 54, boom)} -122 ${mix(72, -62, boom)}`}
            fill="none"
            stroke={C.primary}
            strokeWidth="7"
            strokeLinecap="round"
            opacity={0.35 + 0.65 * clamp(boom)}
          />
          {/* Peak badge on boom */}
          {boom > 0.05 && (
            <g transform={tr(-122, -70, 0.75 + 0.25 * boom)} opacity={clamp(boom)}>
              <circle r="22" fill="url(#blue)" stroke="#FFF" strokeWidth="3" />
              <path
                d="M-6 5 L0 -7 L6 5 M0 -7 L0 9"
                stroke="#FFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          )}
          <T
            s={boom > 0.45 ? "رشد پیوسته!" : "مسیر رشد امسال"}
            x={72}
            y={-68}
            w={220}
            h={36}
            n={29}
            k={800}
            c={boom > 0.45 ? C.primary : C.ink}
          />
        </g>

        {/* Energy Battery floating cleanly above-left with zero overlap against tablet */}
        <g transform={tr(-136, -296 + 10 * (1 - enter), 0.96)}>
          <BatteryGauge
            x={0}
            y={0}
            level={batLevel}
            label={calm > 0.6 ? "انرژی ۱۰۰٪" : "بدون خستگی"}
          />
        </g>

        {/* Burnout storm cloud dissolving away on «بدون خستگی» */}
        {calm < 0.98 && (
          <g
            transform={tr(136 + 38 * calm, -296 - 18 * calm, 1 - 0.35 * calm)}
            opacity={1 - calm}
          >
            <rect
              x="-82"
              y="-36"
              width="164"
              height="72"
              rx="36"
              fill="#D9CBBF"
              stroke="#B89B8B"
              strokeWidth="2"
            />
            <T s="خستگی" x={0} y={1} w={132} h={34} n={29} k={800} c={C.clay} />
            <line
              x1="-56"
              y1="22"
              x2="56"
              y2="-22"
              stroke={C.clay}
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity={calm * 2}
            />
          </g>
        )}
      </g>
    </g>
  );
}

/* ============================================================================
 * SHOT 1: WabiSabiIntro — «شماره یک: وابی‌سابی! کمال‌گرایی رو دور بریز!»
 * ============================================================================ */
export function WabiSabiIntro({ f }: { f: number }) {
  const bowlIn = sp(f, A(14) + 2, 26);
  const goldGlow = e(f, A(16) - 4, 24); // «وابی‌سابی!» golden kintsugi seam shines
  const crack = e(f, A(17) - 2, 16); // «کمال‌گرایی» cage cracks
  const toss = e(f, A(19) - 2, 26); // «دور بریز!» perfection block flies into woven wastebasket

  return (
    <g>
      <Head s="قانون ۱: وابی‌سابی" f={f} start={A(14)} />
      <RulePill latin="Wabi-Sabi" p={bowlIn} />
      <Shade x={470} y={856} w={270} h={28} />

      {/* Woven paper wastebasket on the left (appears when tossing perfectionism) */}
      <g
        transform={tr(154, 756 + 26 * (1 - clamp(crack * 1.4)), 0.9 + 0.1 * crack)}
        opacity={clamp(crack * 1.5)}
        filter="url(#lift)"
      >
        <path
          d="M-68-74 L68-74 L52 78 Q0 88 -52 78 Z"
          fill="url(#wood)"
          stroke="#987C4B"
          strokeWidth="2.6"
        />
        <path
          d="M-64-74 L64-74 L50 74 L-50 74 Z"
          fill="url(#hatch)"
          opacity=".65"
        />
        <ellipse
          cx="0"
          cy="-74"
          rx="68"
          ry="16"
          fill="#4A4133"
          stroke="#987C4B"
          strokeWidth="2.6"
        />
        <T s="دور بریز" x={0} y={14} w={100} h={34} n={26} k={800} c={C.goldInk} />
      </g>

      {/* Handcrafted Kintsugi Ceramic Bowl — warm authentic Japanese metaphor */}
      <g
        transform={tr(
          mix(444, 512, toss),
          632 + 18 * (1 - bowlIn),
          0.95 + 0.08 * bowlIn,
        )}
        opacity={clamp(bowlIn * 1.3)}
        filter="url(#heavyLift)"
      >
        {/* Warm aura behind bowl once freed */}
        <circle
          cx="0"
          cy="-12"
          r={164 + 26 * toss}
          fill="url(#gold)"
          opacity={0.14 + 0.18 * toss}
        />

        {/* Ceramic foot ring */}
        <path
          d="M-86 142 L86 142 L76 174 Q0 182 -76 174 Z"
          fill="#BDAE8D"
          stroke="#998A6C"
          strokeWidth="2.4"
        />

        {/* Bowl outer body */}
        <path
          d="M-212-44 C-206 96 -130 156 0 156 C130 156 206 96 212-44 Z"
          fill="url(#ceramicBowl)"
          stroke="#A89A7B"
          strokeWidth="3"
        />

        {/* Bowl rim opening */}
        <ellipse
          cx="0"
          cy="-44"
          rx="212"
          ry="46"
          fill="url(#ceramicInside)"
          stroke="#A89A7B"
          strokeWidth="3"
        />
        <ellipse
          cx="0"
          cy="-42"
          rx="186"
          ry="34"
          fill="none"
          stroke="#FFFDF5"
          strokeWidth="2"
          opacity=".55"
        />

        {/* Authentic Golden Kintsugi Repair Seams — glowing softly */}
        <path
          d="M-64-10 L-38 36 L-62 84 L-26 144 M-38 36 L14 62 L58 34 L106-14 M14 62 L32 138"
          fill="none"
          stroke="url(#kintsugiGold)"
          strokeWidth={6 + 3 * goldGlow}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55 + 0.45 * goldGlow}
        />
        <path
          d="M-64-10 L-38 36 L-62 84 L-26 144 M-38 36 L14 62 L58 34 L106-14"
          fill="none"
          stroke="#FFF5C4"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={0.4 + 0.6 * goldGlow}
        />

        {/* Label pill anchored cleanly below bowl */}
        <Tag
          s="زیبایی در نقص"
          x={0}
          y={214}
          w={248}
          h={58}
          c="url(#blue)"
          n={31}
        />
      </g>

      {/* Oppressive Perfectionism Stamp/Block that cracks and arcs into wastebasket */}
      <g
        transform={tr(
          mix(444, 154, toss),
          mix(492, 668, toss) - Math.sin(Math.PI * toss) * 210,
          mix(1.0, 0.46, toss),
          mix(-3, -46, toss) + crack * 5 * (1 - toss),
        )}
        opacity={clamp(1 - Math.max(0, (toss - 0.72) / 0.28))}
        filter="url(#lift)"
      >
        <rect
          x="-156"
          y="-54"
          width="312"
          height="108"
          rx="18"
          fill="url(#clay)"
          stroke="#7A3120"
          strokeWidth="3"
        />
        <rect
          x="-144"
          y="-42"
          width="288"
          height="84"
          rx="12"
          fill="none"
          stroke="#FDE6DC"
          strokeWidth="2"
          strokeDasharray="8 6"
          opacity=".65"
        />
        <T s="کمال‌گرایی ۱۰۰٪" x={0} y={2} w={268} h={52} n={40} k={900} c="#FFFFFF" />
        {/* Crack line appearing before toss */}
        {crack > 0.1 && (
          <path
            d="M-12-54 L6-18 L-16 14 L8 54"
            fill="none"
            stroke="#FFFBF1"
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity={crack}
          />
        )}
      </g>
    </g>
  );
}

/* ============================================================================
 * SHOT 2: OscarVsUpload — «ویدیوی اولت قرار نیست جایزه اسکار بگیره؛
 * اجرای ناقص صدها برابر بهتر از یک شاهکار خیالیه که هیچ‌وقت آپلود نمیشه.»
 * ============================================================================ */
export function OscarVsUpload({ f }: { f: number }) {
  const isCompare = f >= A(28) - 4;

  // Phase A: First video vs Oscar
  const clapIn = sp(f, A(21) - 2, 22);
  const oscarReject = sp(f, A(25) - 2, 24);

  // Phase B: Balance scale — Real Imperfect Upload vs Ghosted Masterpiece
  const scaleIn = sp(f, A(28) - 4, 24);
  const uploadProg = e(f, A(29) - 2, 34); // fills 0% -> 100%
  const ghostIn = sp(f, A(35) - 3, 22);
  const ghostFail = e(f, A(38) - 2, 26); // locks 0% + fades
  const tiltDeg = mix(0, 11.5, clamp(uploadProg * 0.7 + ghostFail * 0.3));

  return (
    <g>
      <Head
        s={isCompare ? "اجرای ناقص، ۱۰۰ برابر بهتر" : "ویدیوی اولت؟"}
        f={f}
        start={isCompare ? A(28) : A(21)}
      />

      {!isCompare ? (
        <g>
          <Shade x={444} y={848} w={306} h={28} />

          {/* Tactile Studio Clapperboard — "ویدیوی اول" (right side, bright hero) */}
          <g
            transform={tr(
              mix(568, 492, oscarReject),
              612 + 16 * (1 - clapIn),
              0.94 + 0.08 * clapIn,
              -2,
            )}
            filter="url(#heavyLift)"
          >
            {/* Clapperboard top slate arm */}
            <g transform={tr(-132, -130, 1, mix(-18, 0, clapIn))}>
              <rect
                x="0"
                y="-34"
                width="264"
                height="36"
                rx="8"
                fill="url(#night)"
                stroke="#112236"
                strokeWidth="2"
              />
              {range(5).map((i) => (
                <path
                  key={i}
                  d={`M${16 + i * 52}-34 L${40 + i * 52}-34 L${26 + i * 52} 2 L${2 + i * 52} 2 Z`}
                  fill="#F5E7BD"
                />
              ))}
            </g>
            {/* Board body */}
            <rect
              x="-132"
              y="-126"
              width="264"
              height="252"
              rx="18"
              fill="url(#paper)"
              stroke="#B7AE97"
              strokeWidth="2.8"
            />
            <rect
              x="-116"
              y="-108"
              width="232"
              height="108"
              rx="12"
              fill="url(#lapisGrad)"
            />
            <circle cx="0" cy="-54" r="32" fill="#FFFFFF" opacity=".18" />
            <path d="M-8-68 L18-54 L-8-40 Z" fill="#FFFFFF" />
            <T s="ویدیوی اول" x={0} y={36} w={216} h={52} n={42} k={900} c={C.ink} />
            <Tag s="همین الان شروع کن" x={0} y={92} w={214} h={46} c="url(#green)" n={24} />
          </g>

          {/* Brass Oscar Trophy Silhouette (left side, politely dismissed with "لازم نیست") */}
          <g
            transform={tr(
              mix(220, 168, oscarReject),
              628 + 18 * oscarReject,
              mix(1.0, 0.84, oscarReject),
              mix(0, -10, oscarReject),
            )}
            opacity={mix(1, 0.42, oscarReject)}
            filter="url(#lift)"
          >
            {/* Pedestal */}
            <rect x="-56" y="102" width="112" height="58" rx="8" fill="url(#night)" />
            <rect x="-42" y="114" width="84" height="32" rx="4" fill="url(#brass)" />
            <T s="اسکار" x={0} y={131} w={74} h={24} n={21} k={900} c={C.ink} />
            {/* Statuette clean geometric figure */}
            <circle cx="0" cy="-94" r="24" fill="url(#brass)" />
            <path
              d="M-34-62 Q0-74 34-62 L24 22 L16 102 L-16 102 L-24 22 Z"
              fill="url(#brass)"
              stroke="#8B6F3A"
              strokeWidth="2"
            />
            <line x1="0" y1="-44" x2="0" y2="96" stroke="#FFF4C2" strokeWidth="3" opacity=".55" />
          </g>

          {/* Polite clay badge "لازم نیست" stamping over Oscar */}
          {oscarReject > 0.04 && (
            <g
              transform={tr(172, 600, 0.78 + 0.22 * oscarReject, -11)}
              opacity={clamp(oscarReject)}
            >
              <Tag s="لازم نیست!" x={0} y={0} w={206} h={62} c="url(#clay)" n={34} />
            </g>
          )}
        </g>
      ) : (
        /* Phase B: Brass Balance Scale — Real Imperfect Upload (Right) vs Imaginary Masterpiece (Left) */
        <g opacity={clamp(scaleIn * 1.4)}>
          <Shade x={444} y={890} w={310} h={26} />

          {/* Central Brass Scale Pillar */}
          <g transform={tr(444, 856)} filter="url(#lift)">
            <path
              d="M-96 14 L96 14 L78-16 L-78-16 Z"
              fill="url(#night)"
            />
            <rect x="-14" y="-338" width="28" height="324" rx="8" fill="url(#brass)" />
            <circle cx="0" cy="-342" r="22" fill="url(#night)" stroke="url(#brass)" strokeWidth="5" />
          </g>

          {/* Tilting Scale Beam */}
          <g transform={tr(444, 514, 1, tiltDeg)}>
            <rect
              x="-294"
              y="-9"
              width="588"
              height="18"
              rx="9"
              fill="url(#brass)"
              stroke="#8C6E39"
              strokeWidth="2"
            />
            <circle cx="-266" cy="0" r="10" fill="url(#night)" />
            <circle cx="266" cy="0" r="10" fill="url(#night)" />
          </g>

          {/* RIGHT PAN (heavier, lower): «اجرای ناقص» — Uploaded 100% + 100x Value */}
          {(() => {
            const rad = (tiltDeg * Math.PI) / 180;
            const px = 444 + 266 * Math.cos(rad);
            const py = 514 + 266 * Math.sin(rad);
            return (
              <g transform={tr(px, py)}>
                <line x1="0" y1="0" x2="0" y2="86" stroke="#9B7E48" strokeWidth="3" />
                <g transform={tr(0, 176)} filter="url(#heavyLift)">
                  <rect
                    x="-150"
                    y="-108"
                    width="300"
                    height="216"
                    rx="24"
                    fill="url(#paper)"
                    stroke={C.primary}
                    strokeWidth="3.5"
                  />
                  <rect x="-132" y="-92" width="264" height="54" rx="12" fill="url(#blue)" />
                  <T s="اجرای ناقص" x={0} y={-64} w={236} h={40} n={34} k={900} c="#FFFFFF" />

                  {/* Real Upload Progress Bar */}
                  <rect x="-124" y="-16" width="248" height="28" rx="14" fill="#E6E1D3" />
                  <rect
                    x="-124"
                    y="-16"
                    width={Math.max(24, 248 * uploadProg)}
                    height="28"
                    rx="14"
                    fill="url(#green)"
                  />
                  <T
                    s={uploadProg > 0.85 ? "آپلود شد ✓ ۱۰۰٪" : `در حال آپلود ${Math.round(uploadProg * 100)}٪`}
                    x={0}
                    y={36}
                    w={248}
                    h={34}
                    n={28}
                    k={800}
                    c="#007A47"
                  />
                  {/* 100x Value Seal */}
                  <Tag s="۱۰۰ برابر بهتر" x={0} y={84} w={218} h={46} c="url(#gold)" fg={C.goldInk} n={27} />
                </g>
              </g>
            );
          })()}

          {/* LEFT PAN (lighter, higher, ghosted): «شاهکار خیالی» — 0% never uploaded */}
          {(() => {
            const rad = (tiltDeg * Math.PI) / 180;
            const px = 444 - 266 * Math.cos(rad);
            const py = 514 - 266 * Math.sin(rad);
            return (
              <g
                transform={tr(px, py)}
                opacity={clamp(ghostIn) * mix(1, 0.56, ghostFail)}
              >
                <line x1="0" y1="0" x2="0" y2="86" stroke="#B6AB95" strokeWidth="2.5" strokeDasharray="6 5" />
                <g transform={tr(0, 176)}>
                  <rect
                    x="-144"
                    y="-102"
                    width="288"
                    height="204"
                    rx="24"
                    fill="#F7F4EC"
                    stroke="#A39A88"
                    strokeWidth="3"
                    strokeDasharray="10 8"
                  />
                  <T s="شاهکار خیالی" x={0} y={-54} w={248} h={42} n={34} k={900} c={C.muted} />
                  {/* Stalled 0% bar */}
                  <rect x="-116" y="-12" width="232" height="24" rx="12" fill="#E4DFD2" />
                  <T s="۰٪" x={0} y={32} w={100} h={34} n={32} k={900} c={C.clay} />
                  <Tag
                    s="آپلود نشده ✕"
                    x={0}
                    y={78}
                    w={204}
                    h={44}
                    c="url(#clay)"
                    n={25}
                  />
                </g>
              </g>
            );
          })()}
        </g>
      )}
    </g>
  );
}
