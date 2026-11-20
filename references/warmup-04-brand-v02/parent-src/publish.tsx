import React from "react";
import {
  A,
  C,
  T,
  Head,
  Tag,
  Screw,
  Tick,
  Person,
  range,
  tr,
  clamp,
  e,
  sp,
  lin,
  mix,
} from "./core";
import { O, Shade, Seal, Print, Issue, Kiosk, tones, titles } from "./objects";
export function Week({ f }: { f: number }) {
  const ent = sp(f, A(88) - 6, 24),
    week = e(f, A(90) - 2, 17),
    topic = e(f, A(95) - 2, 23),
    like = sp(f, A(98), 18);
  return (
    <g>
      <Head
        s={f < A(91) ? "قدم ۲  ·  نوبتِ انتشار" : "یک هفته، سه ویدیو"}
        f={f}
        start={f < A(91) ? A(88) : A(91)}
      />
      <Shade x={446} y={861} w={343} h={25} />
      <g
        transform={tr(
          444,
          605 + 35 * (1 - ent),
          0.98 + 0.02 * ent,
          -3 + 2.2 * ent,
        )}
      >
        <path
          d="M-307-168l15-25h565l50 407-28 21h-603z"
          fill="#8DA9A0"
          stroke="#8B9F94"
          strokeWidth="2.2"
        />
        <path d="M282-179l41 389-36-10-34-366z" fill="#739184" />
        <path
          d="M-296 203h589l28 15h-620z"
          fill="url(#wood)"
          stroke="#B3A67B"
          strokeWidth="1.5"
        />
        <rect
          x="-310"
          y="-181"
          width="599"
          height="389"
          rx="18"
          fill="url(#ivory)"
          stroke="#ACAE98"
          strokeWidth="2.4"
          filter="url(#lift)"
        />
        <path
          d="M-293-176h566q13 0 13 15v52h-594v-55q0-12 15-12z"
          fill="url(#purse)"
        />
        <T
          s="تقویمِ انتشار"
          x={155}
          y={-139}
          w={209}
          h={49}
          n={43}
          k={900}
          c="#FFF8DE"
        />
        {range(6).map((i) => (
          <g key={i} transform={tr(-240 + i * 92, -179)}>
            <circle cy="15" r="7" fill="#365B6B" />
            <path
              d="M-8 5v-16q0-15 10-14t9 13v21"
              fill="none"
              stroke="#918669"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M-8 3v-14q0-12 10-12"
              fill="none"
              stroke="#E7D5A5"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ))}
        {range(7).map((i) => {
          let x = 236 - i * 82,
            sel = [1, 3, 5].includes(i),
            z = clamp(week * 8 - i * 0.15);
          return (
            <g key={i} opacity={z}>
              <path
                d={`M${x - 18}-82h36`}
                stroke={sel ? C.primary : "#B7BAA6"}
                strokeWidth={sel ? 5 : 3}
                strokeLinecap="round"
              />
              <circle
                cx={x}
                cy="-84"
                r={sel ? 5 : 2}
                fill={sel ? C.primary : "#798B83"}
              />
            </g>
          );
        })}
        {range(3).map((i) => {
          let x = 165 - i * 174,
            z = sp(f, A(91) - 3 + i * 7, 23),
            seal = clamp(sp(f, A(100) - 2 + i * 3, 17));
          return (
            <g key={i}>
              <rect
                x={x - 71}
                y={-57}
                width="142"
                height="156"
                rx="9"
                fill="#E7E6D5"
                stroke="#B6BCA8"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              {z > 0.001 && (
                <g opacity={clamp(z)}>
                  <Issue
                    x={x - 18 * (1 - z)}
                    y={19 - 51 * (1 - z)}
                    w={147}
                    h={164}
                    rot={(i - 1) * 2 - 8 * (1 - z)}
                    k={i}
                    play={seal > 0.12}
                  />
                </g>
              )}
            </g>
          );
        })}
        <path d="M-282 120h543" stroke="#BFC1AA" strokeWidth="2" />
        {topic > 0.005 && (
          <g transform={tr(-4 + 76 * (1 - topic), 159)} opacity={topic}>
            <rect
              x="-144"
              y="-28"
              width="288"
              height="57"
              rx="28"
              fill="#DDE6D7"
              stroke="#A6BAA5"
              strokeWidth="1.7"
            />
            <T
              s="موضوع: تصویرسازی"
              x={10}
              y={-1}
              w={232}
              h={44}
              n={35}
              k={800}
              c={O.green}
            />
            {like > 0.001 && (
              <g
                transform={tr(-141, -17, 0.7 + 0.3 * like, -7)}
                opacity={clamp(like)}
              >
                <circle
                  r="24"
                  fill="url(#gold)"
                  stroke="#B9A46C"
                  strokeWidth="1.6"
                />
                <path
                  d="M0 10l-11-11q-9-12 1-15 7-2 10 4 6-8 12-3 8 6 1 14z"
                  fill="#AD664F"
                />
              </g>
            )}
          </g>
        )}
      </g>
    </g>
  );
}
export function Readers({ f }: { f: number }) {
  const enter = e(f, A(102) - 4, 21),
    pull = e(f, A(106) - 1, 21);
  return (
    <g>
      <Head s="آدم‌های هم‌فکر" f={f} start={A(102)} />
      <Shade x={450} y={838} w={339} h={35} />
      <Kiosk x={438} y={564 + 19 * (1 - enter)} s={1.14} n={3} />
      {[0, 1, 2].map((i) => {
        const z = e(f, A(102) - 3 + i * 3, 21),
          mark = clamp(sp(f, A(103) + i * 3, 18)),
          p = e(f, A(106) - 3 + i * 3, 20),
          side = i === 1 ? 1 : -1;
        let x = [257, 613, 410][i] + side * (48 * (1 - z) + 37 * (1 - p)),
          y = [843, 830, 871][i] + 12 * (1 - p),
          size = [4.98, 4.85, 5.08][i];
        return (
          <g key={i} opacity={0.5 + 0.5 * z}>
            <Shade x={x} y={y - 1} w={43} h={11} />
            <Person
              x={x}
              y={y}
              size={size}
              who={[1, 3, 7][i]}
              pose={
                z < 0.98 || p < 0.98
                  ? Math.floor((f - A(102) + 40) / 5 + i) % 3
                  : 2
              }
              tilt={side * 2 * (1 - z)}
            />
            {mark > 0.001 && (
              <g
                opacity={mark}
                transform={tr(x + side * 28, y - size * 25 - 10, mark)}
              >
                <circle
                  r="16"
                  fill={tones[[2, 0, 1][i]]}
                  stroke="#F7F0D4"
                  strokeWidth="2.2"
                />
                {i === 1 ? (
                  <circle r="6.7" fill="#FFF1B6" />
                ) : i === 0 ? (
                  <path d="M0-10q-14 24 0 20 12 1 0-20z" fill="#E9EED5" />
                ) : (
                  <path
                    d="M-10-1q6-7 11-1t9 0m-20 6q6-7 11-1t9 0"
                    stroke="#EEF1D8"
                    strokeWidth="1.8"
                    fill="none"
                  />
                )}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}
export function Archive({ f }: { f: number }) {
  let load = e(f, A(108) - 4, 26),
    years = clamp(sp(f, A(111) - 1, 24)),
    lock = e(f, A(114), 17),
    replay = sp(f, A(117) - 3, 25);
  return (
    <g>
      <Head
        s={f < A(117) ? "آرشیوی که می‌ماند" : "دوباره دیده می‌شه"}
        f={f}
        start={f < A(117) ? A(108) : A(117)}
      />
      <Shade x={442} y={860} w={313} h={25} />
      <g transform={tr(444, 658, 1.03, -1.2)}>
        <path
          d="M-257-78l44-102h415l50 94v187h-509z"
          fill="url(#wood)"
          stroke="#B1A17D"
          strokeWidth="2.6"
        />
        <path d="M-229-80l30-84h382l38 80z" fill="#665E4B" />
        <path
          d="M-255-82l39-95h418l46 84-11 4-42-76h-398l-36 89z"
          fill="#E7D1A1"
        />
        {range(3).map((i) => {
          let z = clamp(years * 3 - i * 0.73),
            x = 145 - 145 * i;
          return (
            (i === 0 || z > 0.001) && (
              <g
                key={i}
                transform={tr(x, -98 - (i === 0 ? 41 : 54 * z))}
                opacity={i === 0 ? 1 : z}
              >
                <path
                  d="M-57 16v-36q0-10 10-10h75l21 12v34z"
                  fill={i % 2 ? "#D7DEC9" : "#E8D6A9"}
                  stroke="#ACAC91"
                  strokeWidth="2"
                />
                <T
                  s={["سال اول", "دوم", "بعدتر"][i]}
                  x={-4}
                  y={-9}
                  w={87}
                  h={32}
                  n={26}
                  k={800}
                  c={O.ink}
                />
              </g>
            )
          );
        })}
        {[0, 2, 1].map((i) => {
          let a = e(f, A(108) - 2 + i * 3, 27),
            r = i === 1 ? replay : 0;
          return (
            <Issue
              key={i}
              x={157 - 157 * i + 19 * (1 - a)}
              y={-40 - 95 * (1 - a) - 111 * r}
              w={141 + 19 * r}
              h={193 + 17 * r}
              k={i}
              rot={(i - 1) * 4 - (1 - a) * 8 + 4 * r}
              caption={false}
              play={i === 1 && r > 0.2}
              p={i === 1 ? r : 0.72}
            />
          );
        })}
        <path
          d="M-257 0q0-12 12-12h479q16 0 15 16l-19 143q-1 13-16 13h-437q-15 0-17-14z"
          fill="url(#felt)"
          stroke="#607B74"
          strokeWidth="2.6"
        />
        <path d="M-246-5h484l-2 16h-481z" fill="url(#brass)" />
        <rect
          x="-135"
          y="39"
          width="270"
          height="70"
          rx="10"
          fill="url(#brass)"
          stroke="#AF9C69"
          strokeWidth="2"
        />
        <rect
          x="-122"
          y="48"
          width="244"
          height="49"
          rx="4"
          fill="url(#paper)"
        />
        <T
          s="آرشیوِ پیج"
          x={0}
          y={73}
          n={42}
          w={217}
          h={45}
          k={900}
          c={O.lapis}
        />
        {[-202, 205].map((x) => (
          <g key={x} transform={tr(x, 63, 1, -59 + 59 * lock)}>
            <rect
              x="-9"
              y="-28"
              width="18"
              height="55"
              rx="8"
              fill="url(#brass)"
              stroke="#ACA277"
              strokeWidth="1.5"
            />
            <Screw x={0} y={-16} r={4.5} />
          </g>
        ))}
      </g>
    </g>
  );
}
