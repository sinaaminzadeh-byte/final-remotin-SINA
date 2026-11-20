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
import {
  O,
  Shade,
  Seal,
  PlanLines,
  Issue,
  Kiosk,
  Key,
  Coin,
  Print,
} from "./objects";
export function Steps({
  x,
  y,
  p = 3,
  active = 0,
  s = 1,
}: {
  x: number;
  y: number;
  p?: number;
  active?: number;
  s?: number;
}) {
  return (
    <g transform={tr(x, y, s)}>
      {[1, 2, 3].map((n, i) => {
        let z = clamp(p - i);
        return (
          z > 0 && (
            <g
              key={n}
              transform={tr(99 - 99 * i, 12 * (1 - z), 0.9 + 0.1 * z)}
              opacity={z}
            >
              {i < 2 && (
                <path
                  d="M-26 0h-46"
                  stroke="#ACAD97"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
              )}
              <circle cy="3" r="25" fill="#BDAF8C" />
              <circle
                r="25"
                fill={active === n ? "url(#blue)" : "url(#ivory)"}
                stroke="#BAAF90"
                strokeWidth="1.3"
              />
              <T
                s={n}
                x={0}
                y={-1}
                w={39}
                h={39}
                n={34}
                k={900}
                c={active === n ? "#FFF" : O.lapis}
              />
            </g>
          )
        );
      })}
    </g>
  );
}
export function Edition({ f }: { f: number }) {
  let ent = sp(f, A(40) - 4, 25),
    draw = lin(f, A(43) - 3, 65),
    ticket = sp(f, A(47), 19),
    zero = sp(f, A(49), 20),
    cover = sp(f, A(51) - 2, 22),
    build = e(f, A(54) - 4, 28),
    awn = e(f, A(54) + 9, 21),
    own = sp(f, A(56), 24),
    steps = lin(f, A(58) - 4, 31) * 3,
    back = 1 - e(f, A(54) + 2, 19),
    quote = 1 - e(f, A(58) - 5, 14);
  let title =
    f < A(49)
      ? "داراییِ امروز"
      : f < A(54)
        ? "شروع با صفر ریال"
        : f < A(58)
          ? "رسانهٔ خودت"
          : "اول، ترتیبِ درست";
  return (
    <g>
      <Head
        s={title}
        f={f}
        start={
          f < A(49) ? A(40) : f < A(54) ? A(49) : f < A(58) ? A(54) : A(58)
        }
        blue={f >= A(49) && f < A(54)}
      />
      <Shade x={445} y={818} w={304} />
      {back > 0.003 && (
        <g
          data-blueprint
          transform={tr(
            444,
            589 + 31 * (1 - ent) + 72 * build,
            1 - 0.11 * build,
            -4 + 2 * ent,
          )}
          opacity={back}
        >
          <path
            d="M-246-180h472l28 28v327h-500z"
            fill="url(#ivory)"
            stroke="#A9AA95"
            strokeWidth="2.2"
            filter="url(#lift)"
          />
          <rect x="-234" y="-167" width="468" height="327" fill="url(#draft)" />
          <path
            d="M226-180v28h28M-221-1h441M18-157v302"
            fill="none"
            stroke="#8BABA7"
            strokeWidth="1.5"
            strokeDasharray="7 6"
          />
          <path
            d="M-193 139h395m-395-5v10m395-10v10"
            stroke="#718C89"
            strokeWidth="2"
          />
          <g transform="translate(0 2)">
            <PlanLines p={draw} />
          </g>
          {cover > 0.001 && (
            <Issue
              x={-116 + 106 * cover}
              y={95 - 92 * cover}
              w={99}
              h={122}
              rot={-10 + 7 * cover}
              caption={false}
            />
          )}
          <Seal x={202} y={110} s={0.73} col="#849E8A" bg="#EAEAD5" />
        </g>
      )}
      {build > 0.003 && (
        <Kiosk x={442} y={565} s={1.14} build={build} awn={awn} n={1} />
      )}
      {ticket > 0.001 && quote > 0.01 && (
        <g
          transform={tr(
            260 - 9 * build,
            817 - 28 * (1 - ticket),
            0.96 - 0.1 * build,
            -5 + 2 * ticket,
          )}
          opacity={clamp(ticket) * quote}
        >
          <rect
            x="-114"
            y="-40"
            width="228"
            height="87"
            rx="7"
            fill="#B6A17A"
          />
          <rect
            x="-114"
            y="-44"
            width="228"
            height="87"
            rx="7"
            fill="url(#gold)"
            stroke="#B69C6B"
            strokeWidth="2"
          />
          <path
            d="M-80-39v75"
            stroke="#B39B70"
            strokeWidth="2"
            strokeDasharray="5 5"
          />
          <circle cx="-98" r="6.2" fill="#A7936F" />
          <T
            s="هزینهٔ شروع"
            x={19}
            y={-19}
            w={151}
            h={30}
            n={26}
            c={C.goldInk}
          />
          {zero > 0.001 && (
            <T
              s="۰ ریال"
              x={19}
              y={18 - 9 * (1 - zero)}
              w={143}
              h={42}
              n={43}
              k={900}
              c={O.lapis}
              opacity={clamp(zero)}
            />
          )}
        </g>
      )}
      {own > 0.001 && (
        <g
          transform={tr(650, 798 - 14 * (1 - own), 1, -8 - 14 * (1 - own))}
          opacity={clamp(own)}
        >
          <Key blue s={1.4} />
        </g>
      )}
      {steps > 0 && <Steps x={442} y={878} p={steps} />}
    </g>
  );
}
function Camera() {
  return (
    <g>
      <path
        d="M-59-34h17l9-14h31l8 14h30"
        fill="url(#steel)"
        stroke="#6A7E7E"
        strokeWidth="2"
      />
      <rect
        x="-65"
        y="-34"
        width="131"
        height="82"
        rx="13"
        fill="url(#felt)"
        stroke="#536E73"
        strokeWidth="2.3"
      />
      <rect x="-63" y="-32" width="127" height="19" rx="7" fill="url(#steel)" />
      <rect x="-51" y="-42" width="22" height="9" rx="3" fill="#A48B5F" />
      <rect x="-54" y="-21" width="14" height="7" rx="1.5" fill="#374B53" />
      <circle
        cx="7"
        cy="6"
        r="34"
        fill="url(#steel)"
        stroke="#47616B"
        strokeWidth="2"
      />
      <circle
        cx="7"
        cy="6"
        r="26"
        fill="#355363"
        stroke="#849C98"
        strokeWidth="3"
      />
      <circle cx="7" cy="6" r="17" fill="#203847" />
      <circle cx="1" cy="-2" r="6" fill="#BCCDC4" />
      {range(4).map((i) => (
        <path
          key={i}
          d={`M${-55 + i * 4}-4v38`}
          stroke="#9CAD9C"
          opacity=".45"
          strokeWidth="1.3"
        />
      ))}
    </g>
  );
}
function Mic() {
  return (
    <g>
      <path
        d="M-41-5v11q0 39 40 39 37 0 37-38v-14m-38 53v15m-27 5h54"
        fill="none"
        stroke="url(#felt)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect
        x="-28"
        y="-58"
        width="54"
        height="86"
        rx="26"
        fill="url(#steel)"
        stroke="#7B8D89"
        strokeWidth="2.5"
      />
      {range(6).map((i) => (
        <path
          key={i}
          d={`M${-15 - (i % 3)} ${-41 + i * 8}h${30 + 2 * (i % 3)}`}
          stroke="#7D8D88"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      ))}
      <rect x="-27" y="-3" width="53" height="28" rx="12" fill="url(#felt)" />
      <circle cx="-2" cy="11" r="3.2" fill="#D5B876" />
    </g>
  );
}
function PaidTool() {
  return (
    <g transform="rotate(5)">
      <path
        d="M-51-49l22-9 89 6-21 12z"
        fill="#CBCBBA"
        stroke="#929E92"
        strokeWidth="2"
      />
      <path
        d="M-51-49l90 9v91l-90-12z"
        fill="url(#paper)"
        stroke="#9EA79C"
        strokeWidth="2"
      />
      <path
        d="M39-40l21-12v92L39 51z"
        fill="#91AA9E"
        stroke="#839A90"
        strokeWidth="2"
      />
      <path d="M-51-48l90 9v24l-90-10z" fill="url(#felt)" />
      <Seal x={-7} y={14} s={0.93} col="#B29B62" bg="#EDE4C3" />
    </g>
  );
}
export function Keep({ f }: { f: number }) {
  let enter = sp(f, A(61) - 5, 23),
    coin = e(f, A(64) - 2, 24),
    lock = sp(f, A(67) - 2, 20),
    small = e(f, A(68) - 5, 19),
    xx = 444,
    yy = mix(648, 518, small),
    sc = mix(1.11, 0.84, small);
  return (
    <g>
      <Head
        s={f < A(68) ? "قدم ۱  ·  خرج نکن" : "این خریدها لازم نیست"}
        f={f}
        start={f < A(68) ? A(61) : A(68)}
      />
      <Shade x={xx} y={yy + 139 * sc} w={198 * sc} />
      <g transform={tr(xx, yy + 16 * (1 - enter), sc, -2 + 2 * enter)}>
        <path
          d="M-177-94l45-30h264l50 29-24 20h-314z"
          fill="url(#roof)"
          stroke="#97AAA1"
          strokeWidth="2"
        />
        <rect x="-65" y="-110" width="131" height="9" rx="4.5" fill="#3C5456" />
        {coin < 0.997 && (
          <g data-return-coin>
            <defs>
              <clipPath id="coinSlot">
                <rect x="-140" y="-265" width="280" height="160" />
              </clipPath>
            </defs>
            <g clipPath="url(#coinSlot)">
              <Coin x={0} y={-178 + 119 * coin} s={1.31} show />
            </g>
          </g>
        )}
        <path
          d="M-177-94q-2-17 12-17h337q14 0 13 16l-12 20-24 11h-309z"
          fill="none"
          stroke="#879B90"
          strokeWidth="2"
        />
        <rect
          x="-177"
          y="-93"
          width="347"
          height="210"
          rx="22"
          fill="url(#felt)"
          stroke="#607B79"
          strokeWidth="3"
        />
        <path
          d="M170-90l26-18v196l-28 28z"
          fill="#315760"
          stroke="#6B8279"
          strokeWidth="2"
        />
        <rect
          x="-165"
          y="-80"
          width="322"
          height="184"
          rx="16"
          fill="none"
          stroke="#8FA69A"
          strokeWidth="1.8"
        />
        <path d="M-169-45h330" stroke="#BDCFB9" strokeWidth="1.7" />
        <T
          s="صندوقِ شروع"
          x={-17}
          y={39}
          w={228}
          h={65}
          n={51}
          k={900}
          c="#FFF7E1"
        />
        <g transform={tr(2, -70)}>
          <path d="M-24-27h48v17l-7 6h-34l-7-8z" fill="url(#brass)" />
          <g transform={`rotate(${-73 + 73 * lock} 0 -12)`}>
            <rect
              x="-14"
              y="-15"
              width="29"
              height="57"
              rx="8"
              fill="url(#brass)"
              stroke="#A59162"
              strokeWidth="2"
            />
            <circle cy="27" r="4.6" fill={lock > 0.7 ? "#3E7558" : "#827851"} />
          </g>
        </g>
      </g>
      {small > 0.01 && (
        <g opacity={small}>
          <path
            d="M132 819H754l-13 14H149z"
            fill="url(#wood)"
            stroke="#B6A177"
            strokeWidth="1.4"
          />
          {[Camera, Mic, PaidTool].map((Obj, i) => {
            let x = 649 - 205 * i,
              z = sp(f, A([69, 71, 73][i]) - 2, 19);
            return (
              z > 0.003 && (
                <g
                  key={i}
                  transform={tr(x, 751 - 23 * (1 - z), 0.99, -2 + 2 * z)}
                  opacity={clamp(z)}
                >
                  <Obj />
                  <g transform="translate(49 38)">
                    <circle
                      r="20"
                      fill="url(#clay)"
                      stroke="#F3E7D1"
                      strokeWidth="2"
                    />
                    <path
                      d="M-7-7l14 14m0-14L-7 7"
                      stroke="#FFF0DC"
                      strokeWidth="3.7"
                      strokeLinecap="round"
                    />
                  </g>
                  <T
                    s={["دوربین", "میکروفون", "ابزار پولی"][i]}
                    x={0}
                    y={114}
                    w={174}
                    h={49}
                    n={37}
                    k={700}
                    c={C.muted}
                  />
                </g>
              )
            );
          })}
        </g>
      )}
    </g>
  );
}
export function Workshop({ f }: { f: number }) {
  let ent = sp(f, A(75) - 5, 23),
    enable = sp(f, A(78) - 2, 18),
    motion = e(f, A(80) - 3, 29),
    type = lin(f, A(82), 17),
    assist = e(f, A(84) - 1, 25),
    paper = sp(f, A(87) - 2, 24),
    id = useId();
  return (
    <g>
      <Head s="از ایده تا ویدیوی کوتاه" f={f} start={A(75)} />
      <Shade x={443} y={842} w={309} />
      <g transform={tr(444, 607 + 21 * (1 - ent), 1, -2 + 1.2 * ent)}>
        <path
          d="M-281-183h545l24 22v333l-19 24h-548q-12 0-12-17v-348z"
          fill="#9DA99B"
          stroke="#899B91"
          strokeWidth="2"
        />
        <rect
          x="-295"
          y="-190"
          width="571"
          height="371"
          rx="22"
          fill="url(#ivory)"
          stroke="#A8AC99"
          strokeWidth="2"
          filter="url(#lift)"
        />
        <rect
          x="-277"
          y="-174"
          width="421"
          height="320"
          rx="13"
          fill="url(#felt)"
          stroke="#899D8F"
          strokeWidth="2"
        />
        <rect
          x="-257"
          y="-154"
          width="383"
          height="280"
          rx="6"
          fill="url(#inkprint)"
        />
        <rect x="-257" y="-154" width="383" height="280" fill="url(#draft)" />
        {enable > 0.002 && (
          <g opacity={clamp(enable)}>
            <defs>
              <clipPath id={id}>
                <rect x="-251" y="-147" width={371} height={265} rx="4" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${id})`}>
              <g
                transform={tr(
                  -68 + 9 * (1 - assist),
                  -28 - 6 * (1 - assist),
                  1,
                  3 - 3 * assist,
                )}
              >
                <Print x={-149} y={-98} w={296} h={165} p={motion} />
                <rect
                  x="-149"
                  y="67"
                  width="296"
                  height="50"
                  fill="url(#paper)"
                />
                {type > 0.01 && (
                  <T
                    s={"سپیده".slice(0, Math.max(1, Math.ceil(type * 5)))}
                    x={43 + 9 * (1 - assist)}
                    y={92}
                    w={153}
                    h={41}
                    n={36}
                    k={900}
                    c={O.lapis}
                  />
                )}
                <path
                  d="M-128 88h60m-60 8h38"
                  stroke="#B6B69D"
                  strokeWidth="2"
                />
              </g>
            </g>
          </g>
        )}
        {range(4).map((i) => (
          <path
            key={i}
            d="M0 13V0h14"
            transform={tr(
              i % 2 ? 104 : -237,
              i > 1 ? 107 : -134,
              1,
              i === 1 ? 90 : i === 2 ? -90 : i === 3 ? 180 : 0,
            )}
            fill="none"
            stroke="#EEEBCA"
            strokeWidth="2"
          />
        ))}
        <T s="ابزار" x={204} y={-143} w={101} h={42} n={35} k={800} c={O.ink} />
        <rect
          x="164"
          y="-104"
          width="81"
          height="42"
          rx="21"
          fill={enable > 0.5 ? "#427C63" : "#9CABA1"}
          stroke="#A1A893"
          strokeWidth="2"
        />
        <circle cx={183 + 41 * enable} cy="-83" r="15" fill="#FFF4DB" />
        <T
          s="رایگان"
          x={204}
          y={-40}
          w={95}
          h={37}
          n={30}
          k={800}
          c={enable > 0.5 ? "#37684E" : C.muted}
        />
        <path d="M164-12h81" stroke="#B2B7A5" strokeWidth="2" />
        <g transform={tr(205, 55, 1, assist * 48)}>
          <circle r="39" fill="url(#brass)" stroke="#B5A477" strokeWidth="2" />
          <circle r="29" fill="url(#ivory)" />
          <path
            d="M0-25v10"
            stroke="#7D805F"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        <T s="دستیار" x={204} y={119} w={100} h={39} n={31} c={O.ink} />
        <rect x="-201" y="156" width="267" height="12" rx="6" fill="#496263" />
        <Screw x={-276} y={164} />
        <Screw x={251} y={165} />
        {paper > 0.002 && (
          <g
            transform={tr(-63, 161 + 57 * paper, 0.87, -2 + 2 * paper)}
            opacity={clamp(paper)}
          >
            <Issue w={119} h={140} k={0} caption={false} play />
          </g>
        )}
      </g>
    </g>
  );
}
