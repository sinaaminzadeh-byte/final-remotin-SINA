import React, { useId } from "react";
import { C, T, Tick, Screw, range, tr, clamp, mix } from "./core";

// Style 04 (Minimal Tech Matrix) — always placed strictly underneath all foreground layers
export function TechMatrixBackdrop({ opacity = 0.17 }: { opacity?: number }) {
  const id = useId();
  return (
    <g opacity={opacity} style={{ mixBlendMode: "multiply" }}>
      <defs>
        <pattern
          id={id}
          width="216"
          height="216"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="36" cy="36" r="3.2" fill="#3B5B84" opacity="0.78" />
          <circle cx="144" cy="36" r="3.2" fill="#3B5B84" opacity="0.48" />
          <circle cx="36" cy="144" r="3.2" fill="#3B5B84" opacity="0.48" />
          <circle cx="144" cy="144" r="3.2" fill="#3B5B84" opacity="0.78" />
          <path
            d="M36 36 H144 V144"
            fill="none"
            stroke="#3B5B84"
            strokeWidth="1.8"
            opacity="0.54"
          />
          <path
            d="M144 144 H216 M36 144 V216"
            fill="none"
            stroke="#3B5B84"
            strokeWidth="1.6"
            strokeDasharray="6 8"
            opacity="0.46"
          />
          <circle
            cx="144"
            cy="36"
            r="7.5"
            fill="none"
            stroke="#3B5B84"
            strokeWidth="1.6"
            opacity="0.56"
          />
        </pattern>
      </defs>
      <rect width="1080" height="1920" fill={`url(#${id})`} />
    </g>
  );
}

// Specular light sheen sweep clipped cleanly to a rounded button or nameplate
export function SheenOverlay({
  x,
  y,
  w,
  h,
  rx = 16,
  progress,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  progress: number;
}) {
  const id = useId();
  if (progress < 0 || progress > 1) return null;
  const cx = x - 60 + (w + 120) * progress;
  return (
    <g pointerEvents="none">
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={rx} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <path
          d={`M${cx - 28} ${y - 20}h32l-26 ${h + 40}h-32z`}
          fill="#FFFFFF"
          opacity="0.28"
        />
      </g>
    </g>
  );
}

export const O = {
  blue: "#146EF5",
  lapis: "#204A78",
  ink: "#213C49",
  sage: "#71978A",
  green: "#346756",
  cream: "#FFF6DB",
  ochre: "#D4AA59",
  brass: "#A78950",
  red: "#AE5842",
  vermilion: "#C44D3A",
  line: "#B2AA92",
  ceramic: "#EAE2CE",
};

export function CraftDefs() {
  return (
    <defs>
      <linearGradient id="brass" x2=".82" y2="1">
        <stop stopColor="#967944" />
        <stop offset=".27" stopColor="#E1C282" />
        <stop offset=".48" stopColor="#FCEDB7" />
        <stop offset=".74" stopColor="#C0A366" />
        <stop offset="1" stopColor="#917641" />
      </linearGradient>
      <linearGradient id="felt" x2=".32" y2="1">
        <stop stopColor="#457987" />
        <stop offset=".55" stopColor="#315A67" />
        <stop offset="1" stopColor="#244750" />
      </linearGradient>
      <linearGradient id="lapisGrad" x2=".2" y2="1">
        <stop stopColor="#447CC1" />
        <stop offset=".5" stopColor="#2B64AC" />
        <stop offset="1" stopColor="#174E86" />
      </linearGradient>
      <linearGradient id="wood" x2=".12" y2="1">
        <stop stopColor="#F3DA9B" />
        <stop offset=".52" stopColor="#D6B87A" />
        <stop offset="1" stopColor="#B89A66" />
      </linearGradient>
      <linearGradient id="toriiRed" x1="0" y1="0" x2=".25" y2="1">
        <stop stopColor="#D4664D" />
        <stop offset=".55" stopColor="#B84B36" />
        <stop offset="1" stopColor="#8F3424" />
      </linearGradient>
      <linearGradient id="ceramicBowl" x1=".15" y1="0" x2=".85" y2="1">
        <stop stopColor="#FAF4E4" />
        <stop offset=".55" stopColor="#E5D9BE" />
        <stop offset="1" stopColor="#C8B998" />
      </linearGradient>
      <linearGradient id="ceramicInside" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#C7BA9C" />
        <stop offset="1" stopColor="#EAE0C8" />
      </linearGradient>
      <linearGradient id="kintsugiGold" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFE696" />
        <stop offset=".45" stopColor="#D8A73C" />
        <stop offset="1" stopColor="#A67A21" />
      </linearGradient>
      <linearGradient id="sageGrad" x2=".85" y2="1">
        <stop stopColor="#C4D5CB" />
        <stop offset=".42" stopColor="#7BA6A0" />
        <stop offset="1" stopColor="#467A7A" />
      </linearGradient>
      <linearGradient id="tile" x1="0" y1="0" x2=".37" y2="1">
        <stop stopColor="#F3DCAC" />
        <stop offset="1" stopColor="#E7B97C" />
      </linearGradient>
      <pattern
        id="weave"
        width="6"
        height="6"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(21)"
      >
        <path
          d="M0 0h6m-6 0v6"
          fill="none"
          stroke="#D0DEDC"
          strokeWidth=".8"
          opacity=".28"
        />
      </pattern>
      <pattern id="draft" width="24" height="24" patternUnits="userSpaceOnUse">
        <path
          d="M24 0H0v24"
          stroke="#4C7E86"
          fill="none"
          opacity=".20"
          strokeWidth=".9"
        />
        <circle cy="1" cx="1" r="1.2" fill="#6A8985" opacity=".42" />
      </pattern>
      <pattern
        id="hatch"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(27)"
      >
        <path d="M0 0v8" stroke="#826D46" strokeWidth="1" opacity=".24" />
      </pattern>
      <radialGradient id="deskShadow">
        <stop stopColor="#534D37" stopOpacity=".24" />
        <stop offset=".6" stopColor="#8D7650" stopOpacity=".12" />
        <stop offset="1" stopColor="#8A754D" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function Shade({
  x,
  y,
  w,
  h = 23,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
}) {
  return <ellipse cx={x} cy={y} rx={w} ry={h} fill="url(#deskShadow)" />;
}

export function Seal({
  x = 0,
  y = 0,
  s = 1,
  col = O.lapis,
  bg = O.cream,
  label,
}: {
  x?: number;
  y?: number;
  s?: number;
  col?: string;
  bg?: string;
  label?: string;
}) {
  return (
    <g transform={tr(x, y, s)}>
      <circle r="24" fill={bg} stroke={col} strokeWidth="2.2" />
      <circle r="19.5" fill="none" stroke={col} strokeWidth="1" opacity=".55" />
      {label ? (
        <T s={label} x={0} y={1} w={30} h={30} n={24} k={900} c={col} />
      ) : (
        <>
          {range(8).map((i) => (
            <path
              key={i}
              transform={`rotate(${i * 45})`}
              d="M-1.8-8l1.8-9 1.8 9z"
              fill={col}
            />
          ))}
          <circle r="5.5" fill={col} />
        </>
      )}
    </g>
  );
}

// Subtle Latin transliteration / principle pill under the main title
export function RulePill({
  latin,
  x = 444,
  y = 280,
  p = 1,
}: {
  latin: string;
  x?: number;
  y?: number;
  p?: number;
}) {
  if (p <= 0.01) return null;
  return (
    <g transform={tr(x, y + 8 * (1 - p), 0.94 + 0.06 * p)} opacity={clamp(p)}>
      <rect
        x="-112"
        y="-23"
        width="224"
        height="46"
        rx="23"
        fill="url(#ivory)"
        stroke="#C9B994"
        strokeWidth="2"
      />
      <T s={latin} x={0} y={1} w={196} h={34} n={29} k={800} c={C.goldInk} />
    </g>
  );
}

// Tactile energy / burnout battery gauge
export function BatteryGauge({
  x,
  y,
  level,
  label,
  warn = false,
  scale = 1,
}: {
  x: number;
  y: number;
  level: number;
  label: string;
  warn?: boolean;
  scale?: number;
}) {
  const lv = clamp(level);
  const fillCol = warn ? "url(#clay)" : "url(#green)";
  const textCol = warn ? C.clay : "#007A47";
  const barW = Math.max(8, 128 * lv);
  return (
    <g transform={tr(x, y, scale)} filter="url(#lift)">
      <rect
        x="-88"
        y="-42"
        width="176"
        height="84"
        rx="20"
        fill="url(#paper)"
        stroke="#C5BDAA"
        strokeWidth="2.2"
      />
      {/* Battery shell */}
      <rect
        x="-72"
        y="-24"
        width="136"
        height="36"
        rx="9"
        fill="#E9E4D6"
        stroke="#A49D8A"
        strokeWidth="2"
      />
      <rect x="65" y="-14" width="8" height="16" rx="3" fill="#A49D8A" />
      <rect
        x="-68"
        y="-20"
        width={barW}
        height="28"
        rx="6"
        fill={fillCol}
      />
      <T s={label} x={0} y={27} w={156} h={24} n={22} k={800} c={textCol} />
    </g>
  );
}

// Tactile studio AI console unit (clean anti-aliased hardware, M002 compliant)
export function AIModule({
  x,
  y,
  active = 1,
  done = 0,
  scale = 1,
  subtitle = "دستیار هوشمند",
}: {
  x: number;
  y: number;
  active?: number;
  done?: number;
  scale?: number;
  subtitle?: string;
}) {
  const a = clamp(active);
  const d = clamp(done);
  return (
    <g transform={tr(x, y, scale)} filter="url(#lift)">
      <rect
        x="-126"
        y="-92"
        width="252"
        height="184"
        rx="28"
        fill="url(#ivory)"
        stroke="#BDB39B"
        strokeWidth="2.6"
      />
      <rect
        x="-112"
        y="-78"
        width="224"
        height="156"
        rx="20"
        fill="url(#paper)"
        stroke="#D8D1BE"
        strokeWidth="1.5"
      />
      <Screw x={-98} y={-64} r={4.5} />
      <Screw x={98} y={-64} r={4.5} />
      <Screw x={-98} y={64} r={4.5} />
      <Screw x={98} y={64} r={4.5} />
      {/* Core screen */}
      <rect
        x="-88"
        y="-52"
        width="176"
        height="76"
        rx="16"
        fill="url(#night)"
        stroke="#2F5472"
        strokeWidth="2"
      />
      {/* Glowing AI emblem */}
      <circle
        cx="-42"
        cy="-14"
        r="22"
        fill={a > 0.3 ? C.primary : "#375A78"}
        opacity={0.22 + 0.78 * a}
      />
      <path
        d="M-42-29l4 11 11 4-11 4-4 11-4-11-11-4 11-4z"
        fill="#FFFBF1"
      />
      <T
        s="AI"
        x={28}
        y={-13}
        w={86}
        h={44}
        n={40}
        k={900}
        c="#FFFFFF"
      />
      {/* Status indicator bar */}
      <rect
        x="-84"
        y="36"
        width="168"
        height="34"
        rx="17"
        fill={d > 0.5 ? "url(#green)" : "url(#blue)"}
      />
      {d > 0.5 ? (
        <g>
          <Tick x={-52} y={53} scale={0.58} col="#FFFFFF" />
          <T s="انجام شد" x={12} y={53} w={106} h={26} n={24} k={800} c="#FFFFFF" />
        </g>
      ) : (
        <T s={subtitle} x={0} y={53} w={152} h={26} n={23} k={800} c="#FFFFFF" />
      )}
    </g>
  );
}

// Hero artwork for QuestionCover: tactile Japanese Torii arch + 4 sealed gold scrolls
export function ToriiEmblem({
  settle = 0,
  gleam = 0,
  warmth = 0,
}: {
  settle?: number;
  gleam?: number;
  warmth?: number;
}) {
  return (
    <g filter="url(#heavyLift)">
      {/* Stone base plinth */}
      <rect
        x="-212"
        y="128"
        width="424"
        height="26"
        rx="8"
        fill="url(#ivory)"
        stroke="#B8AE94"
        strokeWidth="2.4"
      />
      <rect
        x="-192"
        y="114"
        width="384"
        height="16"
        rx="5"
        fill="#D6CEB8"
      />

      {/* Left & Right stone pillar pedestals */}
      <rect x="-132" y="84" width="44" height="32" rx="4" fill="url(#night)" />
      <rect x="88" y="84" width="44" height="32" rx="4" fill="url(#night)" />

      {/* Main vertical Torii pillars */}
      <rect
        x="-124"
        y="-110"
        width="28"
        height="196"
        rx="5"
        fill="url(#toriiRed)"
        stroke="#7D2D1E"
        strokeWidth="1.8"
      />
      <rect
        x="96"
        y="-110"
        width="28"
        height="196"
        rx="5"
        fill="url(#toriiRed)"
        stroke="#7D2D1E"
        strokeWidth="1.8"
      />

      {/* Lower tie beam (nuki) */}
      <rect
        x="-172"
        y="-66"
        width="344"
        height="22"
        rx="6"
        fill="url(#toriiRed)"
        stroke="#7D2D1E"
        strokeWidth="1.8"
      />
      {/* Brass wedge ends on nuki */}
      <rect x="-176" y="-68" width="12" height="26" rx="3" fill="url(#brass)" />
      <rect x="164" y="-68" width="12" height="26" rx="3" fill="url(#brass)" />

      {/* Upper curved lintel (kasagi) with dark slate cap */}
      <path
        d="M-212-122 Q0-92 212-122 L198-92 Q0-68 -198-92 Z"
        fill="url(#toriiRed)"
        stroke="#7D2D1E"
        strokeWidth="2"
      />
      <path
        d="M-218-132 Q0-100 218-132 L212-119 Q0-90 -212-119 Z"
        fill="url(#night)"
      />

      {/* Central wooden tablet (gakuzuka) with number ۴ */}
      <g transform={tr(0, -82, 1 + 0.05 * settle)}>
        <rect
          x="-32"
          y="-26"
          width="64"
          height="58"
          rx="10"
          fill="url(#night)"
          stroke="url(#brass)"
          strokeWidth="3.5"
        />
        <T s="۴" x={0} y={4} w={46} h={44} n={42} k={900} c="#FCEDB7" />
      </g>

      {/* Suspended warm paper lantern glowing softly inside the arch */}
      <g transform={tr(0, 12 - 3 * warmth, 1 + 0.03 * warmth)}>
        <line x1="0" y1="-44" x2="0" y2="-28" stroke="url(#brass)" strokeWidth="3" />
        <ellipse
          cx="0"
          cy="0"
          rx="42"
          ry="34"
          fill="url(#gold)"
          stroke="#B58E43"
          strokeWidth="2"
        />
        <path d="M-38-11 Q0-3 38-11" fill="none" stroke="#B58E43" strokeWidth="1.3" opacity=".55" />
        <path d="M-40 4 Q0 12 40 4" fill="none" stroke="#B58E43" strokeWidth="1.3" opacity=".55" />
        <rect x="-18" y="-37" width="36" height="9" rx="3" fill="url(#night)" />
        <rect x="-16" y="29" width="32" height="9" rx="3" fill="url(#night)" />
        <T s="قانون" x={0} y={2} w={68} h={34} n={27} k={900} c={C.goldInk} />
      </g>

      {/* Four golden principle medallions arrayed across the stone base */}
      {["۱", "۲", "۳", "۴"].map((num, idx) => {
        const mx = 114 - idx * 76;
        const lift = gleam * (idx % 2 === 0 ? 4 : -2);
        return (
          <g key={num} transform={tr(mx, 96 - lift, 1 + 0.04 * gleam)}>
            <circle
              r="24"
              fill={idx === 0 ? "url(#blue)" : "url(#paper)"}
              stroke={idx === 0 ? "#85B7FF" : "url(#brass)"}
              strokeWidth="3"
            />
            <T
              s={num}
              x={0}
              y={1}
              w={32}
              h={32}
              n={28}
              k={900}
              c={idx === 0 ? "#FFFFFF" : C.ink}
            />
          </g>
        );
      })}
    </g>
  );
}
