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
import { O, Shade, Seal, PlanLines, Parcel, Key, Kiosk } from "./objects";
export function Pocket({ f=245, insert }: { f?: number; insert?: React.ReactNode }) {
  let sit = sp(f, A(0) - 8, 26),
    u = clamp(sp(f, A(1), 26)),
    amt = e(f, A(4), 16),
    sheet = sp(f, A(7) - 3, 26),
    draw = e(f, A(9), 30),
    qm = sp(f, A(11), 18);
  let z = `M-212-66Q-243-2-237 70q4 60 65 71h328q64-4 75-58 11-62-30-149Q95-99 0-87q-108 2-212 21z`;
  return (
    <g>
      <g>
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
          {insert}
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
