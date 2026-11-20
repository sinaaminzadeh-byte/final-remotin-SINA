import React, { useId } from "react";
import {
  A,
  C,
  T,
  Head,
  Tag,
  Screw,
  Tick,
  range,
  tr,
  clamp,
  e,
  sp,
  lin,
  mix,
} from "./core";
import { O, Shade, Seal, PlanLines, Parcel, Key } from "./objects";
export function Wallet({ f }: { f: number }) {
  let sit = sp(f, A(0) - 8, 26),
    u = clamp(sp(f, A(1), 26)),
    amt = e(f, A(4), 16),
    sheet = sp(f, A(7) - 3, 26),
    draw = e(f, A(9), 30),
    qm = sp(f, A(11), 18);
  let z = `M-212-66Q-243-2-237 70q4 60 65 71h328q64-4 75-58 11-62-30-149Q95-99 0-87q-108 2-212 21z`;
  return (
    <g>
      <Head
        s={f < A(7) ? "با جیبِ خالی؟" : "چه دارایی‌ای می‌سازی؟"}
        f={f}
        start={f < A(7) ? -11 : A(7)}
      />
      <Shade x={442} y={855} w={282} h={26} />
      <g transform={tr(444, 655 + 13 * (1 - sit), 1.21, -4 + 2 * sit)}>
        <g filter="url(#lift)">
          <path
            d={`M-213-59Q-212 ${-98 - 86 * u} -142 ${-95 - 88 * u}Q-1 ${-111 - 93 * u} 149 ${-97 - 82 * u}Q207 ${-88 - 76 * u} 206-59L171-10H-168Z`}
            fill="#A29377"
            stroke="url(#brass)"
            strokeWidth="10"
          />
          <path
            d={`M-203-64Q-197 ${-83 - 89 * u} -138 ${-87 - 84 * u}Q0 ${-103 - 83 * u} 146 ${-88 - 79 * u}Q197 ${-85 - 68 * u} 198-65Q0-28-203-64z`}
            fill="#334A54"
          />
          <path
            d={`M-190-69Q-166 ${-93 - 76 * u} -106 ${-87 - 70 * u}t231 0q41-3 61 24`}
            stroke="#758380"
            fill="none"
            strokeWidth="2"
          />
          <g transform={tr(-6, -97 - 90 * u)}>
            <path
              d="M-28 13l32-28"
              stroke="url(#brass)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle
              cx="8"
              cy="-20"
              r="12"
              fill="url(#brass)"
              stroke="#AC9561"
              strokeWidth="1.7"
            />
          </g>
          {sheet > 0.007 && (
            <g
              transform={tr(
                -22 + 11 * sheet,
                -73 - 105 * sheet,
                0.85 + 0.15 * sheet,
                -8 - 3 * sheet,
              )}
              opacity={clamp(sheet)}
            >
              <rect
                x="-138"
                y="-94"
                width="276"
                height="183"
                rx="6"
                transform="translate(4 5)"
                fill="#C0BBA4"
              />
              <rect
                x="-139"
                y="-98"
                width="276"
                height="183"
                rx="6"
                fill="url(#paper)"
                stroke="#B8B59D"
                strokeWidth="2"
              />
              <rect
                x="-133"
                y="-91"
                width="263"
                height="168"
                fill="url(#draft)"
              />
              <g transform="translate(1 14) scale(.51)">
                <PlanLines p={draw} />
              </g>
              {qm > 0.001 && (
                <g
                  transform={tr(100, 40, 0.8 + 0.2 * qm, -9)}
                  opacity={clamp(qm)}
                >
                  <circle
                    r="29"
                    fill="url(#gold)"
                    stroke="#C6AC73"
                    strokeWidth="2"
                  />
                  <T
                    s="؟"
                    x={0}
                    y={0}
                    w={44}
                    h={46}
                    n={43}
                    k={900}
                    c={C.goldInk}
                  />
                </g>
              )}
            </g>
          )}
          <path d={z} fill="url(#purse)" stroke="#385F7A" strokeWidth="2.6" />
          <path d={z} fill="url(#weave)" opacity=".43" />
          <path
            d="M-211-39q-21 52-17 105 4 55 60 64h318q59-3 69-51 7-45-9-97"
            stroke="#C7CFB4"
            strokeWidth="2.1"
            strokeDasharray="4.5 5.5"
            fill="none"
          />
          <path
            d="M-212-62q21-29 86-28t119-1q138-5 207 25"
            stroke="#8F7F60"
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M-211-66q21-29 86-28t119-1q138-5 207 25"
            stroke="url(#brass)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          <g transform={tr(6, -94)}>
            <path
              d="M19 7l-27-22"
              stroke="url(#brass)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle
              cx="-13"
              cy="-19"
              r="12.7"
              fill="url(#brass)"
              stroke="#AA9363"
              strokeWidth="1.6"
            />
          </g>
          <rect
            x="-110"
            y="-40"
            width="220"
            height="113"
            rx="15"
            fill="#18466C"
            stroke="#9FB09E"
            strokeWidth="1.8"
          />
          <rect
            x="-103"
            y="-33"
            width="206"
            height="99"
            rx="11"
            fill="#EEE7CA"
          />
          <T
            s="موجودیِ شروع"
            x={0}
            y={-12}
            n={28}
            w={176}
            h={32}
            k={800}
            c="#6D786E"
          />
          {amt > 0.01 ? (
            <T
              s="۰ ریال"
              x={0}
              y={35}
              n={51}
              w={167}
              h={53}
              k={900}
              c={O.lapis}
              opacity={amt}
            />
          ) : (
            <path d="M-26 34h52" stroke="#A6AC95" strokeWidth="3" />
          )}
        </g>
      </g>
    </g>
  );
}
function Wheel({
  x,
  y,
  deg,
  r = 42,
}: {
  x: number;
  y: number;
  deg: number;
  r?: number;
}) {
  return (
    <g transform={tr(x, y, r / 42, deg)}>
      <circle r="43" fill="#35464A" stroke="#6B756B" strokeWidth="2" />
      <circle r="32" fill="url(#steel)" />
      <circle r="25" fill="#637C79" />
      {range(6).map((i) => (
        <path
          key={i}
          transform={`rotate(${i * 60})`}
          d="M-3-12l-3-13h12l-3 13z"
          fill="#C1CABE"
        />
      ))}
      <circle r="10" fill="url(#brass)" />
    </g>
  );
}
export function Trolley({ f }: { f: number }) {
  const roll = sp(f, A(12) - 5, 33),
    list = sp(f, A(17) - 3, 22),
    wedge = e(f, A(21), 19),
    stamp = sp(f, A(23), 18),
    box = sp(f, A(25) - 3, 23),
    key = sp(f, A(28), 18),
    tag = e(f, A(29), 12);
  let xx = 444 - 66 * (1 - roll);
  return (
    <g>
      <Head
        s={f < A(21) ? "اشتباهِ رایج" : "اول، این‌ها رو بخری؟"}
        f={f}
        start={f < A(21) ? A(12) : A(21)}
      />
      <Shade x={455} y={847} w={324} h={22} />
      <g transform={tr(xx, 646, 1.11, -2 + 1.8 * box)}>
        <Wheel x={95} y={119} r={35} deg={roll * 115} />
        <path
          d="M-206 85h284L133-161q5-24 26-30l44-12"
          fill="none"
          stroke="#748B83"
          strokeWidth="15"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M-174 108H78q31 0 38-34l47-224q3-13 15-17l39-13"
          fill="none"
          stroke="url(#felt)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M106-83l48-12m-73 123 53-12"
          stroke="#899C8D"
          strokeWidth="9"
        />
        <path
          d="M176-176l43-15"
          stroke="#C3A876"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {range(4).map((i) => (
          <path
            key={i}
            d={`M${182 + i * 8} ${-184 - i * 2.8}l3 11`}
            stroke="#8D7D5F"
            strokeWidth="1.5"
          />
        ))}
        <path
          d="M-223 80l41-16 281 1-26 26h-280z"
          fill="url(#steel)"
          stroke="#A9B5A4"
          strokeWidth="2"
        />
        <path d="M-222 81l286 7v13h-278z" fill="#8C9E93" />
        {list > 0.005 && (
          <g
            transform={tr(
              -74 - 17 * (1 - list),
              -34 - 44 * (1 - list),
              1,
              -9 + 3 * list,
            )}
            opacity={clamp(list)}
          >
            <rect
              x="-103"
              y="-118"
              width="207"
              height="215"
              rx="10"
              fill="url(#gold)"
              stroke="#C2AA77"
              strokeWidth="2"
            />
            <rect
              x="-95"
              y="-114"
              width="194"
              height="200"
              rx="6"
              fill="url(#paper)"
              stroke="#C8C3AF"
              strokeWidth="1.6"
            />
            <rect
              x="-39"
              y="-126"
              width="82"
              height="21"
              rx="6"
              fill="url(#brass)"
            />
            <T
              s="قبل از شروع"
              x={0}
              y={-74}
              n={32}
              w={159}
              h={43}
              k={800}
              c={C.muted}
            />
            <path d="M-74-46H77m-151 14h102" stroke="#C0C6B6" strokeWidth="3" />
            {stamp > 0 && (
              <g
                transform={tr(-7, 16, 1.2 - 0.2 * stamp, -9)}
                opacity={clamp(stamp)}
              >
                <rect
                  x="-62"
                  y="-30"
                  width="124"
                  height="60"
                  rx="10"
                  fill="#F0E0C7"
                  stroke={C.clay}
                  strokeWidth="3"
                />
                <T
                  s="وام"
                  x={0}
                  y={-1}
                  w={100}
                  h={46}
                  n={44}
                  k={900}
                  c={C.clay}
                />
              </g>
            )}
          </g>
        )}
        {box > 0.005 && (
          <g
            transform={tr(71, 6 - 96 * (1 - box), 1.29, -5 + 5 * box)}
            opacity={clamp(box)}
          >
            <Parcel />
            <T
              s="جنس"
              x={6}
              y={16}
              n={21}
              w={53}
              h={25}
              k={800}
              c={C.goldInk}
            />
          </g>
        )}
        {key > 0.001 && (
          <g
            transform={tr(199, -170 - 28 * (1 - key), 1, 13 * (1 - key))}
            opacity={clamp(key)}
          >
            <ellipse
              cy="6"
              rx="13"
              ry="18"
              fill="none"
              stroke="url(#brass)"
              strokeWidth="4"
            />
            <Key x={-3} y={38} s={0.71} a={88} />
            <g transform={tr(26, 91, 1, 7 - 6 * tag)}>
              <path
                d="M-49-23l14-11H57q6 0 6 7v44q0 8-8 8H-40q-9 0-9-8z"
                fill="url(#gold)"
                stroke="#B9A16C"
                strokeWidth="1.8"
              />
              <T
                s={tag > 0.2 ? "اجارهٔ دفتر" : "دفتر"}
                x={7}
                y={-1}
                n={29}
                w={102}
                h={39}
                k={800}
                c={C.goldInk}
              />
            </g>
          </g>
        )}
        <Wheel x={59} y={122} deg={roll * 157 + box * 12} />
        {wedge > 0 && (
          <path
            d={`M${96 + 62 * (1 - wedge)} 162l24-29 43 29z`}
            fill="url(#clay)"
            stroke="#AB7654"
            strokeWidth="2"
            opacity={wedge}
          />
        )}
      </g>
    </g>
  );
}
function Banknote({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={tr(x, y, 1, rot)}>
      <rect
        x="-66"
        y="-30"
        width="132"
        height="62"
        rx="5"
        fill="#BBD5B4"
        stroke="#76967B"
        strokeWidth="2"
      />
      <rect
        x="-58"
        y="-23"
        width="116"
        height="46"
        rx="4"
        fill="none"
        stroke="#8BAB8B"
        strokeWidth="1.8"
      />
      <ellipse rx="25" ry="18" fill="#95B99A" />
      <Seal s={0.62} col="#4C7768" bg="#D1E1BC" />
      {[-46, 44].map((i) => (
        <path
          key={i}
          d={`M${i - 6}-8h14m-14 5h9m-8 12h13`}
          fill="none"
          stroke="#719681"
          strokeWidth="2"
        />
      ))}
    </g>
  );
}
export function Salary({ f }: { f: number }) {
  const ent = sp(f, A(31) - 5, 24),
    cash = sp(f, A(33) - 3, 20),
    part = e(f, A(35), A(37) - A(35) + 2),
    empty = e(f, A(38), 18),
    slots = [223, 444, 665];
  function note(i: number) {
    let t = e(f, A(35) + i * 2, A(37) - A(35) + 1),
      sink = e(f, A(37) + i * 3, A(38) - A(37) + 11);
    return (
      <Banknote
        key={i}
        x={mix(444 + (i - 1) * 45, slots[i], t)}
        y={
          mix(497 - 82 * cash - (i % 2) * 10, 691, t) -
          53 * Math.sin(t * Math.PI) +
          51 * sink +
          84 * empty
        }
        rot={mix((i - 1) * 9, (i - 1) * 2, t)}
      />
    );
  }
  return (
    <g>
      <Head s="حقوق کجا می‌ره؟" f={f} start={A(31)} />
      <Shade x={444} y={879} w={345} />
      {slots.map((x, i) => (
        <g key={i} transform={tr(x, 768 + 23 * (1 - ent), 1, (i - 1) * 2)}>
          <path
            d="M-93-50l11-29H79l13 29v106H-93z"
            fill="#B79E6D"
            stroke="#AD956B"
            strokeWidth="2"
          />
          <rect x="-79" y="-66" width="158" height="24" rx="9" fill="#665F50" />
        </g>
      ))}
      <g transform={tr(444, 492 + 20 * (1 - ent), 1, -4 + part * 4)}>
        <path
          d="M-170-44l136-91q26-18 53-2l150 91v125h-339z"
          fill="url(#gold)"
          stroke="#BDAC84"
          strokeWidth="2"
        />
      </g>
      {cash > 0.001 && part < 0.002 && slots.map((_, i) => note(i))}
      <g transform={tr(444, 502 + 19 * (1 - ent), 1, -4 + part * 4)}>
        <path
          d="M-170-56l149 66q18 8 34 0l156-69v141q0 15-17 15h-306q-17 0-17-16z"
          fill="url(#ivory)"
          stroke="#B9AE92"
          strokeWidth="2.5"
        />
        <path d="M-170 76l97-69m242 72L71 5" stroke="#D0BFA1" strokeWidth="2" />
        <T
          s={empty > 0.6 ? "پاکت خالی" : "حقوق"}
          x={0}
          y={50}
          n={52}
          w={197}
          h={65}
          k={900}
          c={empty > 0.6 ? C.muted : C.navy}
        />
      </g>
      {part >= 0.002 && empty < 0.999 && slots.map((_, i) => note(i))}
      {slots.map((x, i) => (
        <g key={i} transform={tr(x, 772 + 23 * (1 - ent), 1, (i - 1) * 2)}>
          <path
            d="M-97-46h52l17 10h52l18-10h55v91q0 19-19 19H-80q-17 0-17-19z"
            fill={i === 1 ? "url(#purse)" : "url(#felt)"}
            stroke="#597875"
            strokeWidth="2.3"
          />
          <path
            d="M-85 48h168"
            stroke="#BAC8AC"
            strokeDasharray="4 4"
            strokeWidth="1.7"
          />
          <T
            s={"قسط " + (3 - i)}
            x={0}
            y={6}
            w={159}
            h={56}
            n={46}
            k={800}
            c="#FFF7E0"
          />
        </g>
      ))}
    </g>
  );
}
