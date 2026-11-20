import React, { useId } from "react";
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
import {
  O,
  Shade,
  Print,
  Parcel,
  Seal,
  Issue,
  Kiosk,
  Key,
  tones,
} from "./objects";
function Receipt({ stamp }: { stamp: number }) {
  return (
    <g>
      <path
        d="M-77-58h154v108l-8 6-9-5-9 5-8-5-9 5-9-5-9 5-8-5-9 5-8-5-9 5-8-5-9 5-9-5-9 5-10-6z"
        fill="url(#paper)"
        stroke="#B3B8A2"
        strokeWidth="2"
      />
      <path d="M-59-40h118" stroke="#94AD96" strokeWidth="2" />
      <T s="رسیدِ خدمت" x={0} y={-14} n={29} w={126} h={41} k={800} c={O.ink} />
      {stamp > 0.005 && (
        <g
          transform={tr(0, 24, 1.09 - 0.09 * stamp, -6)}
          opacity={clamp(stamp)}
        >
          <rect
            x="-46"
            y="-18"
            width="92"
            height="36"
            rx="6"
            fill="#DFE9D4"
            stroke="#669478"
            strokeWidth="2"
          />
          <T s="تسویه" x={0} y={-1} w={75} h={29} n={25} k={800} c={O.green} />
        </g>
      )}
    </g>
  );
}
export function Service({ f }: { f: number }) {
  let enter = sp(f, A(119) - 5, 23),
    client = sp(f, A(122) - 3, 25),
    shelf = e(f, A(125), 21),
    fold = e(f, A(128) - 1, 23),
    skill = e(f, A(131) - 3, 25),
    handoff = e(f, A(133) - 2, 31),
    income = e(f, A(136) - 4, 26),
    stamp = sp(f, A(137), 15);
  let heading =
    f < A(125)
      ? "قدم ۳  ·  از مهارت تا درآمد"
      : f < A(131)
        ? "بدون انبارِ کالا"
        : "خدمت بده، درآمد بگیر";
  return (
    <g>
      <Head
        s={heading}
        f={f}
        start={f < A(125) ? A(119) : f < A(131) ? A(125) : A(131)}
      />
      <Shade x={445} y={861} w={343} h={30} />
      <g transform={tr(0, 17 * (1 - enter))}>
        <Person
          x={703}
          y={678}
          who={6}
          size={7.55}
          pose={handoff > 0.2 ? 2 : 0}
          tilt={-1.5}
        />
        {client > 0.001 && (
          <g opacity={clamp(client)}>
            <Person
              x={180 - 52 * (1 - client)}
              y={678}
              who={1}
              size={7.4}
              pose={client < 0.98 ? 1 : 2}
              tilt={1.5}
            />
          </g>
        )}
        <path
          d="M138 644l48-33h508l60 34-35 30H164z"
          fill="url(#wood)"
          stroke="#B9A477"
          strokeWidth="2.4"
        />
        <path
          d="M152 656h583l-17 147-13 17H181l-22-17z"
          fill="url(#felt)"
          stroke="#627E72"
          strokeWidth="2.5"
        />
        <path d="M151 646h587v19H152z" fill="url(#brass)" />
        {range(15).map((i) => (
          <path
            key={i}
            d={`M${188 + i * 35} 684v95`}
            stroke="#BCD0B4"
            strokeOpacity=".16"
            strokeWidth="2"
          />
        ))}
        <rect
          x="290"
          y="707"
          width="306"
          height="65"
          rx="12"
          fill="url(#ivory)"
          stroke="#9DA68F"
          strokeWidth="2"
        />
        <T
          s="پیشخوانِ سفارش"
          x={443}
          y={737}
          w={269}
          h={49}
          n={40}
          k={900}
          c={O.lapis}
        />
        {fold < 0.997 && (
          <g
            data-stock
            opacity={1 - fold}
            transform={tr(
              446 + 109 * shelf + 37 * fold,
              573 + 19 * shelf,
              0.9 - 0.15 * shelf - 0.24 * fold,
              -3 - 10 * fold,
            )}
          >
            <g transform={`scale(1 ${1 - 0.8 * fold})`}>
              <Parcel s={1.13} />
            </g>
            <path
              d="M-86 67h178l-12 11H-76z"
              fill="url(#steel)"
              stroke="#A2AE9F"
              strokeWidth="1.5"
            />
          </g>
        )}
        {skill > 0.001 && (
          <g
            data-service-print
            transform={tr(
              mix(539, 314, handoff),
              555 - 15 * Math.sin(handoff * Math.PI),
              1,
              -5 + 10 * handoff,
            )}
          >
            <rect
              x="-80"
              y="-103"
              width="160"
              height="203"
              rx="8"
              fill="url(#paper)"
              stroke="#A9B4A2"
              strokeWidth="2.2"
            />
            {skill > 0 && (
              <g>
                <defs>
                  <clipPath id="waveRevealed">
                    <rect x="-73" y="-96" width={146 * skill} height="134" />
                  </clipPath>
                </defs>
                <g clipPath="url(#waveRevealed)">
                  <Print x={-73} y={-96} w={146} h={134} k={1} p={handoff} />
                </g>
              </g>
            )}
            <T
              s="طرحِ موج"
              x={0}
              y={67}
              w={128}
              h={40}
              n={35}
              k={900}
              c={O.lapis}
            />
            {handoff < 0.005 && skill < 0.999 && (
              <g
                transform={tr(
                  -72 + 144 * skill,
                  35 - 0.7 * 134 * skill,
                  0.66,
                  35,
                )}
              >
                <path d="M-6-91h12V0L0 17-6 0z" fill="url(#brass)" />
                <path d="M-6 0H6L0 17z" fill="#A78861" />
                <path d="M-1.7 12h3.4L0 17z" fill={O.ink} />
              </g>
            )}
          </g>
        )}
        {income > 0.002 && (
          <g
            transform={tr(
              mix(449, 562, income),
              mix(636, 548, income) - 69 * Math.sin(Math.PI * income),
              1,
              6 - 10 * income,
            )}
            opacity={clamp(income * 3)}
          >
            <Receipt stamp={stamp} />
          </g>
        )}
      </g>
    </g>
  );
}
export function Property({ f }: { f: number }) {
  let ent = sp(f, A(139) - 5, 25),
    bound = lin(f, A(144) - 4, 26),
    key = sp(f, A(144), 25),
    rent = sp(f, A(147) - 5, 14),
    tear = e(f, A(148), 23),
    grow = lin(f, A(151) - 3, 38),
    lift = e(f, A(154) - 3, 24);
  let baseY = 765;
  return (
    <g>
      <Head
        s={
          f < A(144)
            ? "رسانهٔ خودت"
            : f < A(151)
              ? "مثلِ ملکِ خودته"
              : "هر روز، یک اثرِ بیشتر"
        }
        f={f}
        start={f < A(144) ? A(139) : f < A(151) ? A(144) : A(151)}
      />
      <Shade x={447} y={867} w={311} h={26} />
      <g transform={tr(445, baseY + 18 * (1 - ent), 1, -1)}>
        <path
          d="M-298 1l92-65h392l108 54-76 69h-426z"
          fill="url(#ivory)"
          stroke="#ACB29C"
          strokeWidth="2.2"
        />
        <path
          d="M-298 1l90 58h426l76-69v13l-74 71h-432l-86-61z"
          fill="url(#wood)"
          stroke="#BAAA84"
          strokeWidth="1.8"
        />
        <path d="M-272 0l75-53h378l85 44-57 54h-412z" fill="url(#draft)" />
        <path
          d="M-269 1l77-52h371l84 42-56 52h-410z"
          fill="none"
          stroke={O.lapis}
          strokeWidth="3"
          pathLength={1}
          strokeDasharray={`${Math.max(0.001, bound)} 1.01`}
        />
      </g>
      {grow > 0.002 && (
        <g transform={tr(444, 746 - lift * 3, 1, -0.4)}>
          <path
            d={`M-196 ${-5 - 49 * grow}h386l21-12v${55 * grow + 1}l-21 15h-386z`}
            fill="url(#ivory)"
            stroke="#B0AF96"
            strokeWidth="2"
          />
          <rect
            x="-181"
            y={-46 * grow}
            width="352"
            height={44 * grow}
            fill="#658176"
          />
          {range(12).map((i) => {
            let p = clamp(grow * 13 - i);
            return (
              p > 0.001 && (
                <g
                  key={i}
                  transform={tr(-163 + i * 28, -2, 1, i % 3 === 0 ? -3 : 1)}
                >
                  <rect
                    x="-9"
                    y={-32 * p}
                    width="19"
                    height={32 * p}
                    rx="2"
                    fill={["#D5A65F", "#9DBBB8", "#CDD0AA"][i % 3]}
                  />
                  <path
                    d={`M-6 ${-26 * p}h12m-11 ${20 * p}h10`}
                    stroke="#F5E9CB"
                    strokeWidth="1.7"
                  />
                </g>
              )
            );
          })}
        </g>
      )}
      <Kiosk
        x={444}
        y={577 - 17 * grow - 37 * lift - 37 * (1 - ent)}
        s={1.03}
        n={3}
        extra={12 * grow}
      />
      {key > 0.001 && (
        <g
          transform={tr(641, 743 - 8 * key, 1.05, 52 - 69 * key)}
          opacity={clamp(key)}
        >
          <Key blue />
        </g>
      )}
      {rent > 0.001 && tear < 0.996 && (
        <g
          data-rent-ticket
          transform={tr(212 - 18 * tear, 737 + 57 * tear, 1, 5 - 18 * tear)}
          opacity={clamp(rent) * (1 - tear)}
        >
          <path
            d="M-60-30h116l14 15v41H-60z"
            fill="url(#gold)"
            stroke="#B7A476"
            strokeWidth="2"
          />
          <T
            s="اجاره"
            x={0}
            y={-1}
            n={35}
            w={102}
            h={43}
            k={800}
            c={C.goldInk}
          />
          <path
            d="M55-23v42"
            stroke="#A3916A"
            strokeDasharray="3 4"
            strokeWidth="1.4"
          />
        </g>
      )}
    </g>
  );
}
export function Follow({ f }: { f: number }) {
  let ent = sp(f, A(156) - 5, 23),
    route = e(f, A(159) - 2, 21),
    action = sp(f, A(163) - 3, 18),
    press = e(f, A(165) - 2, 12),
    follow = f >= A(165) + 5,
    wait = e(f, A(168) - 2, 14),
    book = sp(f, A(169) - 4, 18),
    free = sp(f, A(170) - 1, 14);
  let phoneX = 444 + 154 * wait,
    phoneS = 1 - 0.07 * wait;
  let title =
    f < A(163)
      ? "از اینجا شروع کن"
      : f < A(168)
        ? "پیج رو فالو کن"
        : f < A(170)
          ? "منتظر دوره باش"
          : "منتظر دورهٔ رایگان باش";
  return (
    <g>
      <Head
        s={title}
        f={f}
        start={
          f < A(163)
            ? A(156)
            : f < A(168)
              ? A(163)
              : f < A(170)
                ? A(168)
                : A(170)
        }
        blue={f >= A(163)}
      />
      <Shade x={455} y={875} w={204 + 93 * wait} h={24} />
      <g transform={tr(phoneX, 612 + 19 * (1 - ent), phoneS, -3 + 1.4 * ent)}>
        <rect
          x="-144"
          y="-239"
          width="291"
          height="497"
          rx="42"
          fill="#879990"
          transform="translate(4 5)"
        />
        <rect
          x="-146"
          y="-244"
          width="290"
          height="498"
          rx="42"
          fill="url(#felt)"
          stroke="#647B76"
          strokeWidth="3"
          filter="url(#lift)"
        />
        <rect
          x="-134"
          y="-232"
          width="266"
          height="473"
          rx="33"
          fill="url(#ivory)"
        />
        <rect x="-35" y="-225" width="69" height="12" rx="6" fill="#3A5359" />
        <circle cx="22" cy="-219" r="3.5" fill="#8AA0A1" />
        <T
          s="صفحهٔ من"
          x={0}
          y={-172}
          w={214}
          h={60}
          n={48}
          k={900}
          c={O.lapis}
        />
        <path d="M-113-131h226" stroke="#B0BEA8" strokeWidth="2" />
        <g>
          <Issue x={-31} y={-34} w={145} h={162} k={0} caption={false} />
          <Issue x={65} y={-77} w={67} h={73} k={1} caption={false} />
          <Issue x={65} y={5} w={67} h={73} k={2} caption={false} />
        </g>
        {route > 0.001 && (
          <g transform={tr(0, 88)}>
            <path
              d="M92 0H-92"
              stroke="#89A49B"
              strokeWidth="2.2"
              pathLength="1"
              strokeDasharray={`${route} 1.01`}
            />
            {[1, 2, 3].map((n, i) => {
              let z = clamp(route * 3 - i);
              return (
                z > 0 && (
                  <g key={i} transform={tr(77 - 77 * i, 0, z)}>
                    <circle r="15" fill={i === 2 ? C.primary : "#D8C89B"} />
                    <T
                      s={n}
                      x={0}
                      y={-1}
                      n={22}
                      w={24}
                      h={24}
                      k={900}
                      c={i === 2 ? "#FFF" : O.ink}
                    />
                  </g>
                )
              );
            })}
          </g>
        )}
        {action > 0.001 && (
          <g
            transform={tr(
              0,
              164 + 10 * (1 - action),
              1 - 0.04 * Math.sin(Math.PI * press),
            )}
            opacity={clamp(action)}
          >
            <rect
              x="-111"
              y="-31"
              width="222"
              height="65"
              rx="24"
              fill={follow ? "url(#green)" : "url(#blue)"}
            />
            <T
              s={follow ? "دنبال شد" : "فالو کن"}
              x={follow ? 12 : 0}
              y={0}
              n={42}
              w={follow ? 151 : 189}
              h={49}
              k={800}
              c="#FFF"
            />
            {follow && <Tick x={-77} y={1} scale={0.76} />}
          </g>
        )}
        {action > 0.01 && press < 0.998 && (
          <g
            transform={tr(93 - 20 * press, 182 - 12 * press, 0.82, 3)}
            opacity={clamp(action) * (1 - press * 0.55)}
          >
            <path
              d="M0 0l9 36 8-12 12 8 5-7-13-9 13-4z"
              fill="#FFF3D1"
              stroke="#5F725F"
              strokeWidth="2.5"
            />
          </g>
        )}
        <rect x="-38" y="222" width="76" height="4.5" rx="2" fill="#8A9C92" />
      </g>
      {wait > 0.001 && (
        <g transform={tr(253, 750, 1, -7)} opacity={wait}>
          <path d="M-111 10l146-15 97 38-32 19h-204z" fill="#A4A788" />
          <path d="M-111 4L34-10l98 36-33 13h-204z" fill="url(#wood)" />
        </g>
      )}
      {book > 0.003 && (
        <g
          data-course
          transform={tr(
            260,
            620 + 47 * (1 - book),
            0.93 + 0.07 * book,
            -7 - 7 * (1 - book),
          )}
          opacity={clamp(book)}
        >
          <path
            d="M-110-144l14-12h207v285l-16 16h-205z"
            fill="#739181"
            stroke="#719482"
            strokeWidth="2.1"
          />
          <path
            d="M-103-146l12-7h193v281l-12 9h-196z"
            fill="url(#paper)"
            stroke="#B6B7A1"
            strokeWidth="1.7"
          />
          <rect
            x="-114"
            y="-143"
            width="207"
            height="283"
            rx="8"
            fill="url(#gold)"
            stroke="#AB986B"
            strokeWidth="2"
          />
          <rect
            x="-113"
            y="-143"
            width="25"
            height="283"
            rx="5"
            fill="url(#felt)"
          />
          <path d="M-80-131v257" stroke="#C1A771" strokeWidth="1.8" />
          <Seal x={0} y={-88} s={1.05} col={O.green} bg="#EFE1B7" />
          <T s="دوره" x={3} y={-5} w={141} h={74} n={71} k={900} c={O.ink} />
          {free > 0.001 && (
            <g
              transform={tr(4, 75, 1.15 - 0.15 * free, -6)}
              opacity={clamp(free)}
            >
              <rect
                x="-65"
                y="-28"
                width="130"
                height="56"
                rx="9"
                fill="#DAE8D5"
                stroke="#679176"
                strokeWidth="2.4"
              />
              <T
                s="رایگان"
                x={0}
                y={-1}
                n={43}
                w={108}
                h={44}
                k={800}
                c="#306849"
              />
            </g>
          )}
        </g>
      )}
    </g>
  );
}
