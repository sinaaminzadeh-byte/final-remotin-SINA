import React from "react";
import {
  A,
  C,
  T,
  Head,
  Tag,
  Tick,
  Person,
  tr,
  clamp,
  e,
  sp,
  mix,
  range,
} from "./core";
import { O, Shade, RulePill, AIModule } from "./objects";

/* ============================================================================
 * SHOT 3: KaizenIntro — «شماره دو: کایزن؛ بهبودهای کوچک و دائمی.»
 * ============================================================================ */
export function KaizenIntro({ f }: { f: number }) {
  const enter = sp(f, A(41) + 2, 24);
  const climb = e(f, A(44) - 4, 62); // «بهبودهای کوچک و دائمی.»

  // 5 ascending wooden blocks from right to left (RTL upward journey!)
  const steps = [
    { x: 690, h: 92, tag: "+۱٪" },
    { x: 567, h: 158, tag: "+۱٪" },
    { x: 444, h: 228, tag: "+۱٪" },
    { x: 321, h: 302, tag: "+۱٪" },
    { x: 198, h: 382, tag: "رشد!" },
  ];

  // Character climbs smoothly along the top of the emerging steps
  const stepFloat = climb * 4;
  const si = Math.min(3, Math.floor(stepFloat));
  const frac = stepFloat - si;
  const px = mix(steps[si].x, steps[si + 1].x, frac);
  const py =
    820 -
    mix(steps[si].h, steps[si + 1].h, frac) -
    Math.sin(Math.PI * frac) * 34;

  return (
    <g>
      <Head s="قانون ۲: کایزن" f={f} start={A(41)} />
      <RulePill latin="Kaizen" p={enter} />
      <Shade x={444} y={848} w={354} h={26} />

      {/* Warm drafting baseline panel */}
      <g opacity={clamp(enter * 1.3)}>
        <rect
          x="84"
          y="336"
          width="720"
          height="504"
          rx="28"
          fill="url(#paper)"
          stroke="#CFC7B4"
          strokeWidth="2.4"
          filter="url(#lift)"
        />
        <rect
          x="98"
          y="350"
          width="692"
          height="476"
          rx="20"
          fill="url(#draft)"
        />

        {/* Ascending wooden + sapphire step blocks */}
        {steps.map((st, idx) => {
          const p = sp(f, A(44) - 6 + idx * 10, 22);
          const curH = Math.max(24, st.h * p);
          const isTop = idx === 4;
          return (
            <g key={idx}>
              <rect
                x={st.x - 48}
                y={820 - curH}
                width="96"
                height={curH}
                rx="14"
                fill={isTop ? "url(#blue)" : "url(#wood)"}
                stroke={isTop ? "#0B46A6" : "#9E8250"}
                strokeWidth="2.4"
              />
              {/* Top ivory highlight edge */}
              <rect
                x={st.x - 44}
                y={820 - curH + 4}
                width="88"
                height="12"
                rx="6"
                fill="#FFFFFF"
                opacity={isTop ? 0.25 : 0.35}
              />
              {p > 0.35 && (
                <T
                  s={st.tag}
                  x={st.x}
                  y={820 - curH + 42}
                  w={82}
                  h={36}
                  n={28}
                  k={900}
                  c={isTop ? "#FFFFFF" : C.goldInk}
                />
              )}
            </g>
          );
        })}

        {/* Ascending sapphire curve arrow above the stairs */}
        <path
          d={`M714 680 Q466 ${mix(660, 520, climb)} 200 ${mix(640, 392, climb)}`}
          fill="none"
          stroke={C.primary}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="12 10"
          opacity={0.25 + 0.75 * climb}
        />

        {/* Pixel Person climbing steadily */}
        <Person
          x={px}
          y={py}
          size={4.6}
          pose={Math.floor(f / 6) % 3}
          who={2}
          tilt={-3}
        />

        {/* Clear bottom callout pill */}
        <Tag
          s="بهبود کوچک، هر روز"
          x={574}
          y={416}
          w={290}
          h={58}
          c="url(#green)"
          n={31}
        />
      </g>
    </g>
  );
}

/* ============================================================================
 * SHOT 4: TwentyMinAI — «قرار نیست روزی ۵ تا ویدیو بسازی؛
 * روزی فقط ۲۰ دقیقه با هوش مصنوعی وقت بذار و هر روز یک نکته جدید یاد بگیر.»
 * ============================================================================ */
export function TwentyMinAI({ f }: { f: number }) {
  const isTwenty = f >= A(55) - 4;

  // Phase A: 5 heavy reels rejected
  const stackIn = sp(f, A(48) - 2, 22);
  const rejectFive = sp(f, A(51) - 2, 24);

  // Phase B: 20-minute brass timer + AI console + 5 daily tip tabs
  const dialIn = sp(f, A(55) - 3, 24);
  const sweep = e(f, A(57) - 2, 28); // sweeps to 20 min (120 deg)
  const aiLink = sp(f, A(60) - 3, 22); // «هوش مصنوعی»
  const tipsStart = A(65) - 2; // «و هر روز یک نکته جدید یاد بگیر»

  // Compute SVG arc for 0..120 degrees (20 minutes on a 60-minute dial)
  const angleDeg = 120 * sweep;
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const arcR = 96;
  const ax = arcR * Math.cos(rad);
  const ay = arcR * Math.sin(rad);

  const days = ["روز ۱", "روز ۲", "روز ۳", "روز ۴", "روز ۵"];

  return (
    <g>
      <Head
        s={isTwenty ? "روزی ۲۰ دقیقه با AI" : "روزی ۵ ویدیو؟ نه!"}
        f={f}
        start={isTwenty ? A(55) : A(48)}
      />

      {!isTwenty ? (
        /* Phase A: Five heavy video reels piled shakily and crossed off */
        <g opacity={clamp(stackIn * 1.4)}>
          <Shade x={444} y={846} w={300} h={28} />
          {[0, 1, 2, 3, 4].map((idx) => {
            const p = sp(f, A(48) + idx * 3, 18);
            const away = idx === 0 ? 0 : rejectFive;
            const rot = (idx - 2) * 3.5 + away * (idx % 2 ? 14 : -14);
            const dx = away * (idx % 2 ? 190 : -190);
            const dy = -idx * 74 - away * 30;
            return (
              <g
                key={idx}
                transform={tr(444 + dx, 770 + dy + 24 * (1 - p), 0.94 + 0.06 * p, rot)}
                opacity={clamp(p) * (1 - away * 0.65)}
                filter="url(#lift)"
              >
                <rect
                  x="-184"
                  y="-32"
                  width="368"
                  height="64"
                  rx="16"
                  fill={idx === 0 ? "url(#blue)" : "url(#night)"}
                  stroke={idx === 0 ? "#85B7FF" : "#40607D"}
                  strokeWidth="2.4"
                />
                <circle cx="144" cy="0" r="16" fill="#FFFFFF" opacity=".2" />
                <path d="M139-8 L152 0 L139 8 Z" fill="#FFFFFF" />
                <T
                  s={`ویدیوی شماره ${idx + 1}`}
                  x={-16}
                  y={1}
                  w={250}
                  h={40}
                  n={32}
                  k={800}
                  c="#FFFFFF"
                />
              </g>
            );
          })}

          {rejectFive > 0.05 && (
            <g
              transform={tr(444, 540, 0.78 + 0.22 * rejectFive, -6)}
              opacity={clamp(rejectFive)}
            >
              <Tag s="فشار زیاد؟ ممنوع!" x={0} y={0} w={310} h={74} c="url(#clay)" n={38} />
            </g>
          )}
        </g>
      ) : (
        /* Phase B: Brass 20-Minute Timer + AI Console + 5 Daily Learning Tabs */
        <g opacity={clamp(dialIn * 1.3)}>
          <Shade x={444} y={880} w={344} h={24} />

          {/* Connecting energy signal line between Timer (Right) and AI Module (Left) */}
          <line
            x1="484"
            y1="478"
            x2="344"
            y2="478"
            stroke={C.primary}
            strokeWidth="5"
            strokeDasharray="10 8"
            opacity={clamp(aiLink)}
          />

          {/* RIGHT HERO: Tactile Brass-Rimmed 20-Minute Studio Timer */}
          <g
            transform={tr(626, 478 + 14 * (1 - dialIn), 0.94 + 0.06 * dialIn)}
            filter="url(#heavyLift)"
          >
            {/* Top stopwatch crown button */}
            <rect x="-24" y="-168" width="48" height="22" rx="6" fill="url(#brass)" />
            <rect x="-12" y="-148" width="24" height="16" fill="#8C6E39" />
            {/* Outer brass bezel */}
            <circle r="138" fill="url(#brass)" stroke="#8B6E38" strokeWidth="3" />
            {/* Warm ivory dial face */}
            <circle r="122" fill="url(#paper)" stroke="#D7CEBA" strokeWidth="2" />
            {/* 12 clock tick marks */}
            {range(12).map((i) => (
              <line
                key={i}
                x1="0"
                y1="-112"
                x2="0"
                y2={i % 3 === 0 ? "-98" : "-105"}
                stroke={i % 3 === 0 ? C.ink : "#9A927F"}
                strokeWidth={i % 3 === 0 ? 3.5 : 2}
                strokeLinecap="round"
                transform={`rotate(${i * 30})`}
              />
            ))}
            {/* Sweeping 20-minute sapphire wedge */}
            {sweep > 0.02 && (
              <path
                d={`M0 0 L0 ${-arcR} A${arcR} ${arcR} 0 0 1 ${ax.toFixed(2)} ${ay.toFixed(2)} Z`}
                fill={C.primary}
                opacity=".24"
              />
            )}
            {sweep > 0.02 && (
              <path
                d={`M0 ${-arcR} A${arcR} ${arcR} 0 0 1 ${ax.toFixed(2)} ${ay.toFixed(2)}`}
                fill="none"
                stroke={C.primary}
                strokeWidth="10"
                strokeLinecap="round"
              />
            )}
            {/* Center label inside dial */}
            <circle r="54" fill="url(#paper)" stroke="#DDD5C2" strokeWidth="2" />
            <T s="۲۰" x={0} y={-8} w={88} h={52} n={50} k={900} c={C.primary} />
            <T s="دقیقه" x={0} y={30} w={84} h={28} n={25} k={800} c={C.ink} />
          </g>

          {/* LEFT HERO: Tactile AI Console */}
          <g
            transform={tr(246, 478 + 16 * (1 - aiLink), 0.96 + 0.04 * aiLink)}
            opacity={clamp(aiLink * 1.4)}
          >
            <AIModule x={0} y={0} active={aiLink} subtitle="هوش مصنوعی" />
          </g>

          {/* BOTTOM ROW: 5 Daily Learning Notebook Cards (+۱ نکته جدید each day!) */}
          <g transform={tr(444, 756)}>
            <rect
              x="-380"
              y="-92"
              width="760"
              height="184"
              rx="26"
              fill="url(#ivory)"
              stroke="#C9C0AA"
              strokeWidth="2.4"
              filter="url(#lift)"
            />
            <T
              s="هر روز یک نکتهٔ جدید"
              x={0}
              y={-58}
              w={500}
              h={40}
              n={34}
              k={900}
              c={C.ink}
            />
            {days.map((day, idx) => {
              const bx = 280 - idx * 140;
              const p = sp(f, tipsStart + idx * 8, 20);
              return (
                <g
                  key={day}
                  transform={tr(bx, 18 + 12 * (1 - p), 0.85 + 0.15 * p)}
                  opacity={0.3 + 0.7 * clamp(p)}
                >
                  <rect
                    x="-58"
                    y="-48"
                    width="116"
                    height="96"
                    rx="16"
                    fill={p > 0.45 ? "url(#paper)" : "#EAE5D8"}
                    stroke={p > 0.45 ? C.primary : "#C4BCA8"}
                    strokeWidth="2.4"
                  />
                  <T s={day} x={0} y={-22} w={96} h={28} n={24} k={800} c={C.muted} />
                  {p > 0.45 ? (
                    <g>
                      <circle cx="0" cy="18" r="20" fill="url(#green)" />
                      <Tick x={0} y={18} scale={0.58} col="#FFFFFF" />
                    </g>
                  ) : (
                    <T s="+۱" x={0} y={18} w={60} h={30} n={26} k={900} c="#A8A18E" />
                  )}
                </g>
              );
            })}
          </g>
        </g>
      )}
    </g>
  );
}

/* ============================================================================
 * SHOT 5: IkigaiCompass — «شماره سه: ایکیگای؛ هدفت رو شفاف کن.
 * موضوعی رو برای پیجت انتخاب کن که حتی اگه پولی هم در کار نبود،
 * عاشق حرف زدن درباره‌اش بودی.»
 * ============================================================================ */
export function IkigaiCompass({ f }: { f: number }) {
  const isPassion = f >= A(79) - 4;

  // Phase A: Four Ikigai translucent rings converging into a crystal-clear center star
  const ringIn = sp(f, A(72) + 2, 24);
  const spreadIn = sp(f, A(74) - 2, 24);
  const focus = e(f, A(77) - 3, 28); // «شفاف کن» -> circles converge & star ignites

  // Phase B: Topic selection + Money = 0 + Passionate Studio Mic
  const topicIn = sp(f, A(79) - 3, 24);
  const pickTopic = sp(f, A(83) - 2, 22); // «انتخاب کن»
  const noMoney = e(f, A(88) - 2, 24); // «پولی هم در کار نبود»
  const lovePulse = sp(f, A(93) - 2, 24); // «عاشق حرف زدن»
  const wavePhase = ((f - A(93)) % 36) / 36;

  const ringDist = mix(132, 74, focus);

  return (
    <g>
      <Head
        s={isPassion ? "موضوعِ عاشقانه" : "قانون ۳: ایکیگای"}
        f={f}
        start={isPassion ? A(79) : A(72)}
      />
      {!isPassion && <RulePill latin="Ikigai" p={ringIn} />}

      {!isPassion ? (
        /* Phase A: Iconic Four Translucent Washi-Paper Ikigai Circles */
        <g transform={tr(444, 608)} opacity={clamp(ringIn * 1.4)}>
          <Shade x={0} y={272} w={278} h={24} />
          {[
            { dx: 0, dy: -1, col: "#E5C168", stroke: "#B58D35", label: "علاقه", lx: 0, ly: -158 },
            { dx: 1, dy: 0, col: "#6CA694", stroke: "#3F7867", label: "مهارت", lx: 162, ly: 0 },
            { dx: 0, dy: 1, col: "#5386C6", stroke: "#285896", label: "نیاز", lx: 0, ly: 158 },
            { dx: -1, dy: 0, col: "#D47D63", stroke: "#A24E36", label: "مسیر", lx: -162, ly: 0 },
          ].map((c, idx) => (
            <g key={idx}>
              <circle
                cx={c.dx * ringDist * spreadIn}
                cy={c.dy * ringDist * spreadIn}
                r={132}
                fill={c.col}
                fillOpacity={mix(0.24, 0.34, focus)}
                stroke={c.stroke}
                strokeWidth="3"
                strokeDasharray={focus > 0.65 ? "none" : "8 6"}
              />
              <T
                s={c.label}
                x={c.lx * mix(1.06, 0.92, focus)}
                y={c.ly * mix(1.06, 0.92, focus)}
                w={120}
                h={40}
                n={34}
                k={900}
                c={C.ink}
              />
            </g>
          ))}

          {/* Crystal-clear center compass star on «شفاف کن» */}
          <g transform={tr(0, 0, 0.5 + 0.5 * focus)} opacity={clamp(focus * 1.4)} filter="url(#lift)">
            <circle r="68" fill="url(#blue)" stroke="#FFFFFF" strokeWidth="4" />
            <path
              d="M0-42 L10-10 L42 0 L10 10 L0 42 L-10 10 L-42 0 L-10-10 Z"
              fill="#FFFBF1"
              opacity=".25"
            />
            <T s="هدف" x={0} y={-10} w={104} h={34} n={32} k={900} c="#FFFFFF" />
            <T s="شفاف" x={0} y={24} w={104} h={30} n={27} k={800} c="#DCEBFF" />
          </g>
        </g>
      ) : (
        /* Phase B: Topic Lock + Coin Drops to 0 + Tactile Studio Broadcast Mic */
        <g opacity={clamp(topicIn * 1.3)}>
          <Shade x={444} y={874} w={306} h={26} />

          {/* Top row: Three Topic Cards with center one selected & locked */}
          {[
            { x: 678, label: "موضوع ۱", sel: false },
            { x: 444, label: "موضوع دلخواه", sel: true },
            { x: 210, label: "موضوع ۳", sel: false },
          ].map((card, i) => {
            const p = sp(f, A(79) + i * 3, 20);
            const active = card.sel && pickTopic > 0.3;
            return (
              <g
                key={i}
                transform={tr(
                  card.x,
                  348 + (active ? -10 : 0) + 12 * (1 - p),
                  active ? 1.08 : 0.94,
                )}
                opacity={card.sel ? 1 : mix(0.85, 0.38, pickTopic)}
                filter={active ? "url(#lift)" : undefined}
              >
                <rect
                  x="-102"
                  y="-42"
                  width="204"
                  height="84"
                  rx="20"
                  fill={active ? "url(#blue)" : "url(#paper)"}
                  stroke={active ? "#85B7FF" : "#C5BDAA"}
                  strokeWidth="2.6"
                />
                <T
                  s={card.label}
                  x={0}
                  y={1}
                  w={180}
                  h={38}
                  n={28}
                  k={active ? 900 : 800}
                  c={active ? "#FFFFFF" : C.muted}
                />
              </g>
            );
          })}

          {/* Tactile Studio Broadcast Microphone — Hero Centerpiece */}
          <g transform={tr(444, 668)} filter="url(#heavyLift)">
            {/* Radiant voice soundwaves when «عاشق حرف زدن» hits */}
            {lovePulse > 0.05 &&
              [0, 1, 2].map((w) => {
                const ph = (wavePhase + w / 3) % 1;
                const r = 92 + ph * 136;
                return (
                  <circle
                    key={w}
                    cx="0"
                    cy="-44"
                    r={r}
                    fill="none"
                    stroke={C.primary}
                    strokeWidth="4"
                    opacity={(1 - ph) * 0.48 * clamp(lovePulse)}
                  />
                );
              })}

            {/* Brass Mic Stand */}
            <rect x="-86" y="156" width="172" height="24" rx="12" fill="url(#night)" />
            <rect x="-14" y="76" width="28" height="86" rx="6" fill="url(#brass)" />
            {/* U-shaped yoke */}
            <path
              d="M-84-26 C-84 68 84 68 84-26"
              fill="none"
              stroke="url(#brass)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Capsule body */}
            <rect
              x="-58"
              y="-144"
              width="116"
              height="182"
              rx="58"
              fill="url(#ivory)"
              stroke="#9D9277"
              strokeWidth="3.2"
            />
            {/* Metallic grille lines */}
            <rect x="-46" y="-128" width="92" height="92" rx="46" fill="url(#night)" />
            {[-108, -94, -80, -66, -52].map((gy) => (
              <line
                key={gy}
                x1="-34"
                y1={gy}
                x2="34"
                y2={gy}
                stroke="#8FB1C9"
                strokeWidth="2.8"
                strokeLinecap="round"
                opacity=".7"
              />
            ))}
            {/* Glowing heart badge right on the mic body */}
            <g transform={tr(0, 6, 0.85 + 0.22 * lovePulse)}>
              <circle r="28" fill="url(#clay)" stroke="#FFF" strokeWidth="3" />
              <path
                d="M0 11 C-14 0 -17-10 -8-14 C-3-16 0-10 0-10 C0-10 3-16 8-14 C17-10 14 0 0 11 Z"
                fill="#FFFFFF"
              />
            </g>
          </g>

          {/* Side Coin / Price Tag gently dropping to ۰ ریال on «پولی هم در کار نبود» */}
          <g
            transform={tr(176, 616 + 34 * noMoney, 1 - 0.08 * noMoney, -7 * noMoney)}
            opacity={mix(0.95, 0.62, noMoney)}
            filter="url(#lift)"
          >
            <rect
              x="-94"
              y="-54"
              width="188"
              height="108"
              rx="22"
              fill="url(#gold)"
              stroke="#A68745"
              strokeWidth="2.6"
            />
            <T s="درآمد اولیه" x={0} y={-20} w={162} h={28} n={24} k={800} c={C.goldInk} />
            <T
              s={noMoney > 0.45 ? "۰ تومان" : "پول"}
              x={0}
              y={22}
              w={160}
              h={40}
              n={34}
              k={900}
              c={C.ink}
            />
          </g>

          {/* Right passion callout pill */}
          {lovePulse > 0.04 && (
            <g transform={tr(708, 616, 0.82 + 0.18 * lovePulse)} opacity={clamp(lovePulse)}>
              <Tag s="عشق به موضوع" x={0} y={0} w={218} h={64} c="url(#blue)" n={30} />
            </g>
          )}
        </g>
      )}
    </g>
  );
}
