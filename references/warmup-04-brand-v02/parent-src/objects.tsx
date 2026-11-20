import React, { useId } from "react";
import { A, C, T, Tick, range, tr, clamp, mix } from "./core";
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
export function NewsDefs() {
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
      <linearGradient id="purse" x2=".2" y2="1">
        <stop stopColor="#447CC1" />
        <stop offset=".5" stopColor="#2B64AC" />
        <stop offset="1" stopColor="#174E86" />
      </linearGradient>
      <linearGradient id="inkprint" x2=".27" y2="1">
        <stop stopColor="#E0E9DA" />
        <stop offset="1" stopColor="#F4DBA2" />
      </linearGradient>
      <linearGradient id="wood" x2=".12" y2="1">
        <stop stopColor="#F3DA9B" />
        <stop offset=".52" stopColor="#D6B87A" />
        <stop offset="1" stopColor="#B89A66" />
      </linearGradient>
      <linearGradient id="roof" x2=".85" y2="1">
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
          opacity=".24"
          strokeWidth=".9"
        />
        <circle cy="1" cx="1" r="1.2" fill="#6A8985" opacity=".48" />
      </pattern>
      <pattern
        id="hatch"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(27)"
      >
        <path d="M0 0v8" stroke="#826D46" strokeWidth="1" opacity=".28" />
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
}: {
  x?: number;
  y?: number;
  s?: number;
  col?: string;
  bg?: string;
}) {
  return (
    <g transform={tr(x, y, s)}>
      <circle r="22" fill={bg} />
      {range(8).map((i) => (
        <path
          key={i}
          transform={`rotate(${i * 45})`}
          d="M-1.8-8l1.8-9 1.8 9z"
          fill={col}
        />
      ))}
      <circle r="6.2" fill={col} />
      <circle r="19.2" fill="none" stroke={col} strokeWidth="1" opacity=".56" />
    </g>
  );
}
export const titles = ["سپیده", "موج", "سرو"];
export const tones = ["#CC9A4E", "#568DB0", "#6D9574"];
export function Print({
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
  const u = clamp(p),
    H = (180 * h) / w,
    id = useId(),
    cy = H * 0.66;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx="3" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <svg x={x} y={y} width={w} height={h} viewBox={`0 0 180 ${H}`}>
          {k === 0 ? (
            <>
              <rect width="180" height={H} fill="url(#tile)" />
              <g transform={`translate(${109 + 12 * u} ${H * 0.43 - 17 * u})`}>
                <circle r="29" fill="#FFF0B8" />
                <circle r="23" fill="#E9AA4A" />
                {range(11).map((i) => (
                  <path
                    key={i}
                    d="M0-33v-5"
                    transform={`rotate(${-89 + i * 18})`}
                    stroke="#FEF4C9"
                    strokeWidth="1.4"
                  />
                ))}
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
              <path
                d={`M-9 ${H}V${cy - 16}q0-40 39-47 39 5 39 46v${H - cy + 16}H47V${cy - 17}q0-19-17-25-18 6-18 25v${H - cy + 17}z`}
                fill="#31516F"
              />
              <path
                d={`M-4 ${H}V${cy - 15}q0-34 34-42 34 8 34 42v${H - cy + 15}`}
                stroke="#9BB5BA"
                fill="none"
                strokeWidth="1.3"
              />
              {range(4).map((i) => (
                <path
                  key={i}
                  d={`M78 ${cy + 35 + 5 * i}q48-20 108-5`}
                  fill="none"
                  stroke="#A7BCAD"
                  strokeWidth=".9"
                />
              ))}
            </>
          ) : k === 1 ? (
            <>
              <rect width="180" height={H} fill="#D8E0C9" />
              <circle cx={46 + 10 * u} cy={H * 0.28} r="22" fill="#F1BD64" />
              <circle
                cx={46 + 10 * u}
                cy={H * 0.28}
                r="28"
                fill="none"
                stroke="#F7E9AB"
                strokeWidth="2"
              />
              {range(5).map((i) => (
                <g
                  key={i}
                  transform={`translate(${(i % 2 ? 1 : -1) * 8 * u} ${H * 0.36 + i * H * 0.123})`}
                >
                  <path
                    d={`M-18 12q42-25 77-2t66 2q34-27 76-4v${H}H-18z`}
                    fill={
                      ["#A7C1BB", "#80AAB0", "#5F94A9", "#3C7797", "#245B7D"][i]
                    }
                  />
                  <path
                    d="M-18 15q42-25 77-2t66 2q34-27 76-4"
                    fill="none"
                    stroke="#E5EBCE"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </>
          ) : (
            <>
              <rect width="180" height={H} fill="#E5DEBB" />
              <circle cx="139" cy={H * 0.25} r="23" fill="#CAA45F" />
              <path
                d={`M-4 ${H * 0.67}q35-19 83 0t106-13v${H}H-4z`}
                fill="#AEC0A2"
              />
              <path
                d={`M-6 ${H * 0.85}q35-19 83 1t114-15v${H}H-6z`}
                fill="#729785"
              />
              {[
                [48, 0.82],
                [99, 1.14],
                [139, 0.65],
              ].map(([x, s], i) => (
                <g
                  key={i}
                  transform={`translate(${x} ${H * 0.82}) scale(${s}) rotate(${(u - 0.4) * (i % 2 ? 2 : -2)})`}
                >
                  <path d="M0 8V-26" stroke="#6D7659" strokeWidth="4" />
                  <path
                    d={`M0 0C-23-2-19-20-12-33Q-3-49 0 ${-Math.min(93, H * 0.64)}Q2-51 13-31C24-13 17-2 0 0Z`}
                    fill={i === 1 ? "#315B53" : "#537665"}
                  />
                  <path
                    d="M0-4v-32m0 20-7-7m7-4 6-6"
                    stroke="#8BA590"
                    strokeWidth="1.2"
                    fill="none"
                  />
                </g>
              ))}
            </>
          )}
          <path
            d="M9 11h16m4 0h5"
            stroke="#FEF5D9"
            strokeWidth="2"
            opacity=".78"
            fill="none"
          />
        </svg>
      </g>
    </g>
  );
}
export function Issue({
  x = 0,
  y = 0,
  w = 150,
  h = 185,
  k = 0,
  p = 0.7,
  rot = 0,
  caption = true,
  play = true,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  k?: number;
  p?: number;
  rot?: number;
  caption?: boolean;
  play?: boolean;
}) {
  let m = w * 0.065,
    ht = caption ? h * 0.66 : h * 0.79;
  return (
    <g transform={tr(x, y, 1, rot)}>
      <rect
        x={-w / 2 + 3}
        y={-h / 2 + 4}
        width={w}
        height={h}
        rx={w * 0.047}
        fill="#ADAD95"
      />
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={w * 0.047}
        fill="url(#paper)"
        stroke="#C0BBA4"
        strokeWidth={w * 0.009}
      />
      <Print x={-w / 2 + m} y={-h / 2 + m} w={w - 2 * m} h={ht} k={k} p={p} />
      {caption ? (
        <T
          s={titles[k]}
          x={w * 0.07}
          y={h * 0.335}
          w={w * 0.72}
          h={h * 0.23}
          n={w * 0.29}
          k={900}
          c={O.ink}
        />
      ) : (
        <path
          d={`M${-w * 0.39} ${h * 0.4}h${w * 0.37}`}
          stroke={tones[k]}
          strokeWidth={w * 0.027}
        />
      )}{" "}
      {play && (
        <g transform={tr(-w * 0.315, caption ? h * 0.339 : h * 0.36)}>
          <circle r={w * 0.07} fill={O.lapis} />
          <path
            d={`M${-w * 0.021} ${-w * 0.03}l${w * 0.054} ${w * 0.03}-${w * 0.054} ${w * 0.033}z`}
            fill="#FFF7DA"
          />
        </g>
      )}
    </g>
  );
}
export function Key({
  x = 0,
  y = 0,
  s = 1,
  a = 0,
  blue = false,
}: {
  x?: number;
  y?: number;
  s?: number;
  a?: number;
  blue?: boolean;
}) {
  return (
    <g transform={tr(x, y, s, a)}>
      <path
        d="M-23-16q-13 0-18 11t0 22q8 12 24 7l13-12h62v-9H46v-8H32v8H-5q-3-16-18-19z"
        fill={blue ? "url(#purse)" : "url(#brass)"}
        stroke={blue ? "#2F6488" : "#9F8655"}
        strokeWidth="2.2"
      />
      <circle
        cx="-25"
        cy="4"
        r="9"
        fill="#EDE5C9"
        stroke={blue ? "#255578" : "#9E8A61"}
        strokeWidth="2"
      />
      <path
        d="M-3 6h43"
        stroke={blue ? "#A9C9DB" : "#FAEABC"}
        strokeWidth="2"
      />
    </g>
  );
}
export function Coin({
  x = 0,
  y = 0,
  s = 1,
  show = false,
}: {
  x?: number;
  y?: number;
  s?: number;
  show?: boolean;
}) {
  return (
    <g transform={tr(x, y, s, -5)}>
      <circle cy="4" r="43" fill="#A58B50" />
      <circle r="43" fill="url(#brass)" stroke="#B09656" strokeWidth="2" />
      <circle r="35" fill="none" stroke="#A38A51" strokeWidth="1.6" />
      {show ? (
        <T s="۱ ریال" x={0} y={1} n={30} w={64} h={39} k={900} c={C.goldInk} />
      ) : (
        <Seal s={1.15} col="#AC8E52" bg="#E4CF94" />
      )}
    </g>
  );
}
export function Parcel({
  x = 0,
  y = 0,
  s = 1,
  a = 0,
}: {
  x?: number;
  y?: number;
  s?: number;
  a?: number;
}) {
  return (
    <g transform={tr(x, y, s, a)} strokeLinejoin="round">
      <path
        d="M-65-36l45-21 91 10-30 23z"
        fill="#EDD4A4"
        stroke="#BDA37B"
        strokeWidth="2"
      />
      <path
        d="M-65-36 41-24v74L-65 35z"
        fill="url(#wood)"
        stroke="#B79D70"
        strokeWidth="2"
      />
      <path
        d="M41-24l30-23v75L41 50z"
        fill="#C5A575"
        stroke="#AA8F67"
        strokeWidth="2"
      />
      <path d="M-22-31 14-52l22 3-34 22v26l-24-3z" fill="#B18E60" />
      <path d="M-53 3l34 5v20l-34-5z" fill="#F2E7CD" />
      {range(6).map((i) => (
        <path
          key={i}
          d={`M${-49 + i * 4} 9l0 11`}
          stroke="#8F8870"
          strokeWidth={i % 2 ? 1 : 2}
        />
      ))}
      <path
        d="M10 20v13m-4-8 4-6 4 7"
        stroke="#8C7856"
        strokeWidth="2.7"
        fill="none"
      />
    </g>
  );
}
export function PlanLines({ p = 1 }: { p?: number }) {
  const d =
    "M-156 123H163M-141 116V-54L-165-53-142-81H150L170-54H-164M-143-82V-104H153v22M-153-105l61-48H91l69 48M-91-153h182M-135-46v144h269V-46M-124 44h246m-236 52V56h99v40m16 0V56h104v40M-126-47v81h244v-81M-109-104v-2m211-1v2";
  return (
    <g strokeLinecap="round" fill="none">
      <path d={d} stroke="#94A8A2" strokeWidth="1.7" strokeDasharray="4 5" />
      <path
        d={d}
        stroke={O.lapis}
        strokeWidth="3.4"
        pathLength={1}
        strokeDasharray={`${Math.max(0.001, clamp(p))} 1.01`}
      />
    </g>
  );
}
export function Kiosk({
  x = 0,
  y = 0,
  s = 1,
  build = 1,
  awn = 1,
  n = 3,
  extra = 0,
  t = "رسانهٔ من",
  a = 0,
}: {
  x?: number;
  y?: number;
  s?: number;
  build?: number;
  awn?: number;
  n?: number;
  extra?: number;
  t?: string;
  a?: number;
}) {
  const u = clamp(build),
    Y = (v: number) => 166 + (v - 166) * u,
    id = useId(),
    ww = clamp(awn);
  return (
    <g transform={tr(x, y, s, a)}>
      <g filter="url(#lift)">
        <path
          d={`M-189 ${Y(151)}h339l54-24 12 12-48 34h-351z`}
          fill="#979E8D"
        />
        <path
          d={`M-184 ${Y(-120)}h342V${Y(158)}h-342z`}
          fill="url(#ivory)"
          stroke="#AAAF99"
          strokeWidth="2.4"
        />
        <path
          d={`M158 ${Y(-121)}l44 ${Y(-146) - Y(-121)}V${Y(135)}l-44 ${Y(158) - Y(135)}z`}
          fill="#B3BB9F"
          stroke="#9EA68E"
          strokeWidth="2"
        />
        {u > 0.02 && (
          <>
            <rect
              x="-168"
              y={Y(-72)}
              width="309"
              height={Y(86) - Y(-72)}
              rx={6 * u}
              fill="url(#felt)"
            />
            <rect
              x="-163"
              y={Y(-65)}
              width="299"
              height={143 * u}
              rx={4 * u}
              fill="#294853"
            />
            <defs>
              <clipPath id={id}>
                <rect x="-159" y={Y(-61)} width="292" height={139 * u} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${id})`}>
              {range(n).map((i) => (
                <Issue
                  key={i}
                  x={88 - i * 100}
                  y={Y(25)}
                  w={86}
                  h={108}
                  k={i % 3}
                  rot={i === 0 ? -5 : i === 2 ? 4 : -1}
                  caption={false}
                />
              ))}
            </g>
            <path
              d={`M-175 ${Y(81)}h326l-8 ${Y(94) - Y(81)}h-315z`}
              fill="url(#brass)"
              stroke="#A49368"
              strokeWidth="1.8"
            />
            {[-163, -1].map((v, i) => (
              <g key={i}>
                <rect
                  x={v}
                  y={Y(101)}
                  width="143"
                  height={45 * u}
                  rx={5 * u}
                  fill={i ? "#BBCEBD" : "#D5DED0"}
                  stroke="#A1B39F"
                  strokeWidth="1.4"
                />
                <path
                  d={`M${v + 8} ${Y(139)}v${-30 * u}h125`}
                  stroke="#EFF0DC"
                  fill="none"
                  strokeWidth="1.6"
                />
              </g>
            ))}
            {range(Math.floor(extra)).map((i) => (
              <g
                key={i}
                transform={tr(-147 + 25 * i, Y(124), 1, i % 2 ? 3 : -3)}
              >
                <rect
                  x="-9"
                  y={-14 * u}
                  width="18"
                  height={31 * u}
                  rx="2"
                  fill={tones[i % 3]}
                />
                <path
                  d={`M-5 ${Y(0) - Y(0)}h10`}
                  stroke="#EFDFB0"
                  strokeWidth="2"
                />
              </g>
            ))}
            {range(4).map((i) => (
              <path
                key={i}
                d={`M${165 + i * 9} ${Y(-65 - i * 4)}v${191 * u}`}
                stroke="#839B8C"
                strokeWidth="1.6"
              />
            ))}
          </>
        )}
        <path
          d={`M-204 ${Y(-128)}l66 ${Y(-185) - Y(-128)} 226 0 118 ${Y(-129) - Y(-185)}-3 ${Y(-119) - Y(-129)}h-402z`}
          fill="url(#roof)"
          stroke="#77958B"
          strokeWidth="2.5"
        />
        <path d={`M88 ${Y(-185)}l66 ${Y(-129) - Y(-185)}h51z`} fill="#689187" />
        {range(7).map((i) => (
          <path
            key={i}
            d={`M${-128 + i * 34} ${Y(-181)}L${-185 + i * 52} ${Y(-132)}`}
            stroke="#C0CDB7"
            strokeWidth="2"
          />
        ))}
        <path d={`M-142 ${Y(-188)}h232l4 ${5 * u}h-240z`} fill="url(#brass)" />
        <rect
          x="-191"
          y={Y(-128)}
          width="359"
          height={62 * u + 1}
          rx={5 * u}
          fill="url(#purse)"
          stroke="#456E83"
          strokeWidth="2"
        />
        {u > 0.74 && (
          <g opacity={clamp((u - 0.74) / 0.26)}>
            <T
              s={t}
              x={-11}
              y={Y(-100)}
              n={44}
              w={242}
              h={50}
              k={900}
              c="#FFF8E1"
            />
            <Seal x={-163} y={Y(-98)} s={0.64} />
            <path
              d={`M117 ${Y(-100)}h21m-15 7h14`}
              stroke="#C7D8CF"
              strokeWidth="2"
            />
          </g>
        )}
        <g>
          {range(10).map((i) => {
            let x = -192 + i * 35.8,
              y1 = Y(-66),
              y2 = y1 + (11 + 30 * ww) * u,
              dx = -12 * ww;
            return (
              <g key={i}>
                <path
                  d={`M${x} ${y1}h35.9l${dx} ${y2 - y1}h-35.9z`}
                  fill={i % 2 ? "#EAC67D" : "#FBF2D7"}
                  stroke="#BBA77F"
                  strokeWidth=".65"
                />
                <path
                  d={`M${x + dx} ${y2}h36v${5 * u}q-18 ${15 * u}-36 0z`}
                  fill={i % 2 ? "#DAB169" : "#F1E4C1"}
                  stroke="#B7A37C"
                  strokeWidth="1.05"
                />
              </g>
            );
          })}
        </g>
        <rect
          x="-195"
          y={Y(155)}
          width="365"
          height="12"
          rx="3"
          fill="url(#wood)"
          stroke="#AD9B75"
          strokeWidth="1.5"
        />
      </g>
    </g>
  );
}
