import React from "react";
import { Easing, interpolate, spring } from "remotion";
import design from "../data/design-system.json";
import words from "../data/words.json";
import meta from "../data/meta.json";
export { design, words, meta };
export const C = {
  ...design.brand,
  gold: "#D9B75F",
  goldInk: "#76551C",
  deep: "#114FA8",
  ivory: "#FFFBF1",
  navy: "#193756",
  pale: "#E8E4D8",
  clay: "#AF533B",
  edge: "#D4CEBD",
};
export const FPS = meta.fps,
  A = (i: number) => Math.round(words[i].start * FPS),
  fa = (s: string | number) =>
    String(s).replace(/\d/g, (n) => "۰۱۲۳۴۵۶۷۸۹"[Number(n)]);
export const clamp = (n: number) => Math.min(1, Math.max(0, n));
const bez = Easing.bezier(0.24, 0.72, 0.15, 1);
export const e = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: bez,
  });
export const lin = (f: number, start: number, dur: number) =>
  clamp((f - start) / dur);
export const sp = (f: number, start: number, duration = 26) =>
  f <= start
    ? 0
    : spring({
        frame: f - start,
        fps: FPS,
        durationInFrames: duration,
        config: { mass: 0.85, stiffness: 195, damping: 17 },
      });
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const tr = (x: number, y: number, s = 1, a = 0) =>
  `translate(${x} ${y}) rotate(${a}) scale(${s})`;
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
let ctx: CanvasRenderingContext2D | null = null;
const cache = new Map<
  string,
  { l: number; r: number; a: number; d: number; w: number }
>();
export const textDir = (s: string): "rtl" | "ltr" =>
  /[a-z]/i.test(s) && !/[\u0600-\u06ff]/.test(s) ? "ltr" : "rtl";
export function metric(s: string, n: number, weight: number) {
  const key = [s, n, weight].join("|");
  const old = cache.get(key);
  if (old) return old;
  ctx ??= document.createElement("canvas").getContext("2d")!;
  ctx.font = `${weight} ${n}px Doran`;
  ctx.direction = textDir(s);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const m = ctx.measureText(s);
  const o = {
    l: m.actualBoundingBoxLeft,
    r: m.actualBoundingBoxRight,
    a: m.actualBoundingBoxAscent,
    d: m.actualBoundingBoxDescent,
    w: m.width,
  };
  cache.set(key, o);
  return o;
}
type TP = {
  s: string | number;
  x: number;
  y: number;
  w: number;
  h: number;
  n: number;
  k?: 700 | 800 | 900;
  c?: string;
  opacity?: number;
};
// x,y are the center of a LOCAL ink box. No font synthesis, stretching or implicit wrapping.
export function T({ s, x, y, w, h, n, k = 700, c = C.ink, opacity = 1 }: TP) {
  let txt = textDir(String(s)) === "ltr" ? String(s) : fa(s),
    m = metric(txt, n, k);
  while ((m.l + m.r > w || m.a + m.d > h) && n > 12) {
    n--;
    m = metric(txt, n, k);
  }
  return (
    <text
      x={x + (m.l - m.r) / 2}
      y={y + (m.a - m.d) / 2}
      direction={textDir(txt)}
      textAnchor="middle"
      fontFamily="Doran"
      fontWeight={k}
      fontSize={n}
      fill={c}
      opacity={opacity}
      data-ink="1"
      data-box={[x - w / 2, y - h / 2, x + w / 2, y + h / 2].join(",")}
    >
      {txt}
    </text>
  );
}
export function Head({
  s,
  f,
  start,
  blue = false,
}: {
  s: string;
  f: number;
  start: number;
  blue?: boolean;
}) {
  const p = sp(f, start - 7, 25);
  return (
    <g transform={tr(444, 190 + 14 * (1 - p), 0.97 + 0.03 * p)}>
      <T
        s={s}
        x={0}
        y={0}
        w={790}
        h={119}
        n={91}
        k={900}
        c={blue ? C.primary : C.ink}
      />
    </g>
  );
}
export function Tag({
  s,
  x,
  y,
  w = 205,
  h = 65,
  c = "url(#blue)",
  fg = "white",
  n = 37,
  rot = 0,
}: {
  s: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  c?: string;
  fg?: string;
  n?: number;
  rot?: number;
}) {
  return (
    <g transform={tr(x, y, 1, rot)}>
      <rect
        x={-w / 2}
        y={-h / 2 + 3}
        width={w}
        height={h}
        rx={h / 2}
        fill="#745A36"
        opacity=".13"
      />
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={h / 2}
        fill={c}
        stroke="#fff"
        strokeOpacity=".45"
        strokeWidth="2"
      />
      <T s={s} x={0} y={-1} w={w - 23} h={h - 10} n={n} k={800} c={fg} />
    </g>
  );
}
export function Defs() {
  const grad = (id: string, a: string, b: string) => (
    <linearGradient
      id={id}
      key={id}
      x1="0"
      y1="0"
      x2={id === "steel" ? "1" : "0.25"}
      y2="1"
      gradientUnits="objectBoundingBox"
    >
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  );
  return (
    <defs>
      {grad("paper", "#FFFEFB", "#F2EFE8")}
      {grad("gold", "#F5E7BD", "#D9BE78")}
      {grad("blue", C.primary, "#0C53C5")}
      {grad("green", "#008551", "#006841")}
      {grad("clay", "#C57659", "#A24B34")}
      {grad("steel", "#EEEDE6", "#ADBAAE")}
      {grad("ivory", "#FFFCF1", "#E3D8BD")}
      {grad("night", "#264762", "#172C45")}
      <filter
        id="lift"
        x="-28%"
        y="-30%"
        width="160%"
        height="178%"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="0"
          dy="11"
          stdDeviation="10"
          floodColor="#6C513B"
          floodOpacity=".22"
        />
      </filter>
      <filter
        id="heavyLift"
        x="-30%"
        y="-35%"
        width="170%"
        height="185%"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="1"
          dy="16"
          stdDeviation="15"
          floodColor="#6C513B"
          floodOpacity=".24"
        />
      </filter>
      <pattern
        id="screenDots"
        width="7"
        height="7"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="1.15" fill="#17263D" opacity=".27" />
      </pattern>
      <pattern
        id="engrave"
        width="7"
        height="7"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(26)"
      >
        <path
          d="M0 0V7"
          fill="none"
          stroke="#785E32"
          opacity=".24"
          strokeWidth="2"
        />
      </pattern>
    </defs>
  );
}
export function Screw({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={tr(x, y)}>
      <circle cy={1.5} r={r} fill="#AEA999" />
      <circle r={r - 0.7} fill="#E7E1D0" stroke="#B6AF9A" strokeWidth=".8" />
      <path
        d={`M${-r * 0.54} ${r * 0.35}l${r * 1.08} ${-r * 0.7}`}
        stroke="#827E70"
        strokeWidth="1.5"
      />
    </g>
  );
}
export function Tick({
  x,
  y,
  scale = 1,
  col = "white",
}: {
  x: number;
  y: number;
  scale?: number;
  col?: string;
}) {
  return (
    <path
      transform={tr(x, y, scale)}
      d="M-12 0l8 8 17-18"
      stroke={col}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}
export function Person({
  x,
  y,
  size = 4.4,
  pose = 0,
  who = 1,
  tilt = 0,
}: {
  x: number;
  y: number;
  size?: number;
  pose?: number;
  who?: number;
  tilt?: number;
}) {
  const k = who,
    hair = ["#302419", "#755334", "#BD8B42", "#201F27", "#69382A"][k % 5],
    skin = ["#EAC5A0", "#B9815C", "#D7A078", "#EED2AF"][k % 4],
    shirt = [
      "#CC6D53",
      "#4D91AC",
      "#93A468",
      "#D6AD4E",
      "#7C6F97",
      "#E0DDD0",
      "#527B72",
    ][k % 7],
    arm = pose % 3;
  const boxes: [number, number, number, number, string][] = [
    [4, 0, 9, 2, hair],
    [3, 2, 10, 7, skin],
    [3, 1, 10, 3, hair],
    [4, 8, 9, 16, shirt],
    [2, 9 - arm, 3, 15 - arm, skin],
    [10, 9 + arm, 11, 15 + arm, skin],
    [4, 17, 6, pose % 2 ? 23 : 22, "#43515D"],
    [8, 17, 10, pose % 2 ? 22 : 23, "#5A5954"],
    [3, 23, 6, 24, hair],
    [8, 23, 11, 24, hair],
    [5, 5, 5, 5, "#3C3025"],
    [8, 5, 8, 5, "#3C3025"],
  ];
  if (k % 4 === 0) boxes.push([3, 3, 3, 10, hair], [10, 3, 10, 10, hair]);
  if (k % 6 === 0) boxes.push([1, 15, 4, 19, "#AC8051"]);
  if (k % 8 === 0) boxes.push([4, 10, 9, 11, "#EFE7D4"]);
  return (
    <g transform={tr(x, y, size, tilt)}>
      <g transform="translate(-7 -25)" shapeRendering="crispEdges">
        {boxes.map(([a, b, c, d, v], i) => (
          <rect
            key={i}
            x={a}
            y={b}
            width={c - a + 0.3}
            height={d - b + 0.3}
            fill={v}
          />
        ))}
      </g>
    </g>
  );
}
export function Folio({ idx }: { idx: number }) {
  return (
    <g>
      <path d="M61 93H827" stroke="#A9A58E" strokeWidth="1.6" opacity=".67" />
      <path d={`M61 93h${51 + idx * 39}`} stroke={C.primary} strokeWidth="3" />
      <g
        transform="translate(79 52) rotate(-7)"
        fill="none"
        stroke={C.deep}
        strokeWidth="2.4"
      >
        <path d="M-10-14h22v28h-22zM-14-10v27H8m-13-22h12m-12 5h9m-9 5h12" />
      </g>
      <T
        s="پروندهٔ ۰۴"
        x={179}
        y={52}
        w={152}
        h={46}
        n={35}
        k={800}
        c={C.muted}
      />
      <T s="دفتر رسانه" x={731} y={52} w={166} h={49} n={40} k={800} />
      <circle cx="824" cy="52" r="5" fill={C.primary} />
    </g>
  );
}
