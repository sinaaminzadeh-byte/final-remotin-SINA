import React, { useId } from "react";
import { C, T, Tick, Screw, range, tr, clamp } from "./core";

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
  line: "#B2AA92",
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
      <linearGradient id="ironRim" x1="0" y1="0" x2=".8" y2="1">
        <stop stopColor="#6D7D82" />
        <stop offset=".45" stopColor="#45575E" />
        <stop offset="1" stopColor="#2A3940" />
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

export function BrassGear({
  x = 0,
  y = 0,
  r = 36,
  teeth = 8,
  rot = 0,
  tone = "brass",
}: {
  x?: number;
  y?: number;
  r?: number;
  teeth?: number;
  rot?: number;
  tone?: "brass" | "blue" | "steel";
}) {
  const fill =
    tone === "blue"
      ? "url(#lapisGrad)"
      : tone === "steel"
        ? "url(#steel)"
        : "url(#brass)";
  const stroke =
    tone === "blue" ? "#193756" : tone === "steel" ? "#7B8C84" : "#8F7341";
  const toothW = (r * 0.28).toFixed(1);
  const toothH = (r * 0.24).toFixed(1);
  return (
    <g transform={tr(x, y, 1, rot)}>
      {range(teeth).map((i) => (
        <rect
          key={i}
          transform={`rotate(${(i * 360) / teeth})`}
          x={-Number(toothW) / 2}
          y={-r - Number(toothH) * 0.72}
          width={toothW}
          height={toothH}
          rx={3}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.4"
        />
      ))}
      <circle r={r} fill={fill} stroke={stroke} strokeWidth="2.2" />
      <circle
        r={r * 0.64}
        fill="none"
        stroke={tone === "blue" ? "#93B7DF" : "#FAF0CF"}
        strokeWidth="1.8"
        opacity=".75"
      />
      <circle
        r={r * 0.34}
        fill={tone === "blue" ? "#FFF7DC" : "#254865"}
        stroke={stroke}
        strokeWidth="1.6"
      />
    </g>
  );
}

// Bespoke Tactile Hero Object: Cast-Steel & Brass Heavy Flywheel
export function HeavyFlywheel({
  x = 0,
  y = 0,
  s = 1,
  rot = 0,
  energy = 0,
  weightClamp = false,
  cutaway = false,
  plinth = false,
  nameplate,
}: {
  x?: number;
  y?: number;
  s?: number;
  rot?: number;
  energy?: number;
  weightClamp?: boolean;
  cutaway?: boolean;
  plinth?: boolean;
  nameplate?: string;
}) {
  const eng = clamp(energy);
  const rimR = 136;
  const circ = 2 * Math.PI * (rimR - 14);
  return (
    <g transform={tr(x, y, s)}>
      {/* Optional wooden/brass bearing pedestal behind the wheel */}
      {plinth && (
        <g>
          <path
            d="M-76 156L-44 0H44L76 156Z"
            fill="url(#felt)"
            stroke="#244750"
            strokeWidth="2.6"
          />
          <rect
            x="-132"
            y="144"
            width="264"
            height="28"
            rx="8"
            fill="url(#wood)"
            stroke="#A58958"
            strokeWidth="2.4"
          />
        </g>
      )}

      {/* Rotating wheel body */}
      <g transform={`rotate(${rot})`}>
        {/* Heavy cast-iron outer rim */}
        <circle
          r={rimR}
          fill="url(#ironRim)"
          stroke="#1D2B33"
          strokeWidth="3.5"
        />
        <circle
          r={rimR - 14}
          fill="none"
          stroke="#8FA3A6"
          strokeWidth="2.2"
          opacity=".65"
        />
        {/* Recessed interior well */}
        <circle
          r={rimR - 26}
          fill={cutaway ? "url(#night)" : "#E9E3D0"}
          stroke="url(#brass)"
          strokeWidth="4"
        />

        {/* Energy charge arc around inner rim */}
        {eng > 0.01 && (
          <circle
            r={rimR - 14}
            fill="none"
            stroke={eng > 0.7 ? "#FCEDB7" : "#4E9BFF"}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${circ * eng} ${circ}`}
            transform="rotate(-90)"
          />
        )}

        {/* 6 heavy radial spokes (or coiled kinetic spring in cutaway mode) */}
        {cutaway ? (
          <g>
            {/* Coiled kinetic brass energy spiral */}
            <path
              d="M0 0 m-14 0 a14 14 0 1 0 28 0 a22 22 0 1 0 -44 0 a32 32 0 1 0 64 0 a44 44 0 1 0 -88 0 a56 56 0 1 0 112 0"
              fill="none"
              stroke="url(#brass)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {range(6).map((i) => (
              <circle
                key={i}
                cx={78 * Math.cos((i * Math.PI) / 3)}
                cy={78 * Math.sin((i * Math.PI) / 3)}
                r={7 * eng + 2}
                fill="#FFE58F"
                opacity={0.35 + 0.65 * eng}
              />
            ))}
          </g>
        ) : (
          range(6).map((i) => (
            <g key={i} transform={`rotate(${i * 60})`}>
              <rect
                x="-11"
                y={-(rimR - 27)}
                width="22"
                height={rimR - 46}
                rx="6"
                fill="url(#steel)"
                stroke="#6C7C79"
                strokeWidth="2"
              />
              <circle
                cx="0"
                cy={-(rimR - 14)}
                r="5.5"
                fill="url(#brass)"
                stroke="#755D30"
                strokeWidth="1.2"
              />
            </g>
          ))
        )}

        {/* Optional heavy counterweight clamp */}
        {weightClamp && (
          <g transform="translate(0 92)">
            <rect
              x="-34"
              y="-18"
              width="68"
              height="36"
              rx="8"
              fill="url(#brass)"
              stroke="#7A6032"
              strokeWidth="2.4"
            />
            <T s="سنگین" x={0} y={1} w={56} h={24} n={18} k={900} c={C.goldInk} />
          </g>
        )}

        {/* Central brass hub & axle bolt */}
        <circle
          r="34"
          fill="url(#brass)"
          stroke="#7B6235"
          strokeWidth="2.6"
        />
        <circle r="20" fill="url(#night)" stroke="#FCEDB7" strokeWidth="2" />
        <circle r="7" fill={eng > 0.5 ? "#00B86B" : "#FCEDB7"} />
      </g>

      {/* Optional static nameplate on base */}
      {nameplate && (
        <g transform="translate(0 156)">
          <rect
            x="-106"
            y="-22"
            width="212"
            height="44"
            rx="12"
            fill="url(#night)"
            stroke="url(#brass)"
            strokeWidth="2.5"
          />
          <T
            s={nameplate}
            x={0}
            y={1}
            w={186}
            h={32}
            n={26}
            k={900}
            c="#FCEDB7"
          />
        </g>
      )}
    </g>
  );
}

export function CoinToken({
  x = 0,
  y = 0,
  s = 1,
  label = "ارزش",
}: {
  x?: number;
  y?: number;
  s?: number;
  label?: string;
}) {
  return (
    <g transform={tr(x, y, s, -4)}>
      <circle cy="4" r="34" fill="#9E824B" />
      <circle r="34" fill="url(#brass)" stroke="#A78D52" strokeWidth="2" />
      <circle r="27" fill="none" stroke="#8E723C" strokeWidth="1.4" />
      <T s={label} x={0} y={1} w={46} h={30} n={22} k={900} c={C.goldInk} />
    </g>
  );
}

export function MediaPrint({
  x,
  y,
  w,
  h,
  k = 0,
  p = 0.7,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  k?: number;
  p?: number;
}) {
  const u = clamp(p);
  const H = (180 * h) / w;
  const id = useId();
  const cy = H * 0.66;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx="4" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <svg x={x} y={y} width={w} height={h} viewBox={`0 0 180 ${H}`}>
          {k === 0 ? (
            <>
              <rect width="180" height={H} fill="url(#tile)" />
              <g transform={`translate(${106 + 14 * u} ${H * 0.42 - 14 * u})`}>
                <circle r="28" fill="#FFF0B8" />
                <circle r="22" fill="#E9AA4A" />
              </g>
              <path
                d={`M-8 ${cy + 4}q44-40 98-9t100-10v${H}H-8z`}
                fill="#C88160"
              />
              <path
                d={`M-7 ${cy + 16}Q50 ${cy - 4} 94 ${cy + 12}t93-5v${H}H-7z`}
                fill="#74A09A"
              />
              <path
                d={`M-9 ${cy + 34}q48 3 94-13t103 4v${H}H-9z`}
                fill="#305D73"
              />
            </>
          ) : k === 1 ? (
            <>
              <rect width="180" height={H} fill="#D8E0C9" />
              <circle cx={46 + 10 * u} cy={H * 0.28} r="22" fill="#F1BD64" />
              {range(4).map((i) => (
                <path
                  key={i}
                  transform={`translate(${(i % 2 ? 1 : -1) * 7 * u} ${H * 0.42 + i * H * 0.14})`}
                  d={`M-18 12q42-24 77-2t66 2q34-26 76-4v${H}H-18z`}
                  fill={["#A7C1BB", "#72A2A8", "#477E99", "#245B7D"][i]}
                />
              ))}
            </>
          ) : (
            <>
              <rect width="180" height={H} fill="#213E58" />
              <circle cx={130 - 10 * u} cy={H * 0.28} r="20" fill="#F6DF9A" />
              <circle cx={136 - 10 * u} cy={H * 0.25} r="17" fill="#213E58" />
              <path
                d={`M-6 ${H * 0.68}q44-22 92 0t102-14v${H}H-6z`}
                fill="#3B6877"
              />
              <path
                d={`M-6 ${H * 0.84}q48-16 96 4t100-12v${H}H-6z`}
                fill="#5A8C85"
              />
            </>
          )}
          <path
            d="M10 11h16m4 0h6"
            stroke="#FEF5D9"
            strokeWidth="2"
            opacity=".75"
            fill="none"
          />
        </svg>
      </g>
    </g>
  );
}

export function MediaCard({
  x = 0,
  y = 0,
  w = 132,
  h = 160,
  k = 0,
  p = 0.7,
  rot = 0,
  label,
  play = true,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  k?: number;
  p?: number;
  rot?: number;
  label?: string;
  play?: boolean;
}) {
  const m = w * 0.07;
  const ht = label ? h * 0.65 : h * 0.78;
  return (
    <g transform={tr(x, y, 1, rot)}>
      <rect
        x={-w / 2 + 3}
        y={-h / 2 + 4}
        width={w}
        height={h}
        rx={w * 0.055}
        fill="#ADAD95"
      />
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={w * 0.055}
        fill="url(#paper)"
        stroke="#C0BBA4"
        strokeWidth={1.6}
      />
      <MediaPrint
        x={-w / 2 + m}
        y={-h / 2 + m}
        w={w - 2 * m}
        h={ht}
        k={k}
        p={p}
      />
      {label ? (
        <T
          s={label}
          x={w * 0.08}
          y={h * 0.34}
          w={w * 0.64}
          h={h * 0.22}
          n={w * 0.2}
          k={800}
          c={O.ink}
        />
      ) : (
        <path
          d={`M${-w * 0.14} ${h * 0.36}h${w * 0.44}`}
          stroke="#96A89D"
          strokeWidth={3}
          strokeLinecap="round"
        />
      )}
      {play && (
        <g transform={tr(-w * 0.3, h * 0.34)}>
          <circle r={w * 0.08} fill={O.lapis} />
          <path
            d={`M${-w * 0.025} ${-w * 0.032}l${w * 0.06} ${w * 0.032}-${w * 0.06} ${w * 0.034}z`}
            fill="#FFF7DA"
          />
        </g>
      )}
    </g>
  );
}

export function BatteryMeter({
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
      <rect x="-68" y="-20" width={barW} height="28" rx="6" fill={fillCol} />
      <T s={label} x={0} y={27} w={156} h={24} n={22} k={800} c={textCol} />
    </g>
  );
}

export function AICoreUnit({
  x,
  y,
  active = 1,
  done = 0,
  scale = 1,
  subtitle = "هوش مصنوعی",
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
        x="-120"
        y="-88"
        width="240"
        height="176"
        rx="26"
        fill="url(#ivory)"
        stroke="#BDB39B"
        strokeWidth="2.6"
      />
      <rect
        x="-106"
        y="-74"
        width="212"
        height="148"
        rx="18"
        fill="url(#paper)"
        stroke="#D8D1BE"
        strokeWidth="1.5"
      />
      <Screw x={-92} y={-60} r={4.2} />
      <Screw x={92} y={-60} r={4.2} />
      <Screw x={-92} y={60} r={4.2} />
      <Screw x={92} y={60} r={4.2} />
      <rect
        x="-84"
        y="-50"
        width="168"
        height="72"
        rx="15"
        fill="url(#night)"
        stroke="#2F5472"
        strokeWidth="2"
      />
      <circle
        cx="-38"
        cy="-14"
        r="21"
        fill={a > 0.3 ? C.primary : "#375A78"}
        opacity={0.25 + 0.75 * a}
      />
      <path
        d="M-38-28l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"
        fill="#FFFBF1"
      />
      <T s="AI" x={28} y={-13} w={80} h={42} n={38} k={900} c="#FFFFFF" />
      <rect
        x="-80"
        y="34"
        width="160"
        height="34"
        rx="17"
        fill={d > 0.5 ? "url(#green)" : "url(#blue)"}
      />
      {d > 0.5 ? (
        <g>
          <Tick x={-48} y={51} scale={0.56} col="#FFFFFF" />
          <T
            s="آسان شد"
            x={12}
            y={51}
            w={98}
            h={26}
            n={24}
            k={800}
            c="#FFFFFF"
          />
        </g>
      ) : (
        <T s={subtitle} x={0} y={51} w={144} h={26} n={22} k={800} c="#FFFFFF" />
      )}
    </g>
  );
}

// Style 04 (Minimal Tech Matrix) — always placed strictly underneath all foreground layers
export function TechMatrixBackdrop({ opacity = 0.14 }: { opacity?: number }) {
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
