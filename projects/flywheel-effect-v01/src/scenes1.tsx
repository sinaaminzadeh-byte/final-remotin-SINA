import React from "react";
import {
  A,
  C,
  T,
  Head,
  Tag,
  Tick,
  Screw,
  Person,
  tr,
  sp,
  spHeavy,
  spSnap,
  spPop,
  impactShake,
  sheenSweep,
  clamp,
  range,
  e,
} from "./core";
import {
  O,
  Shade,
  HeavyFlywheel,
  BrassGear,
  Seal,
  BatteryMeter,
  SheenOverlay,
} from "./objects";

/* ============================================================================
   SHOT 0: FlywheelConcept (w3..w9 -> f=55..211)
   "مفهومی داریم به اسم «اثر فلای‌ویل» (Flywheel)."
   Continuity: Receives HeavyFlywheel directly from QuestionCover onto an
   engineering drafting blueprint board with staggered snap + heavy calibration turn.
============================================================================ */
export function FlywheelConcept({ f }: { f: number }) {
  const boardIn = spSnap(f, A(3), 20);
  const tagIn = spPop(f, A(6), 20);
  const ringIn = sp(f, A(7), 20);
  const calSpin = spHeavy(f, A(8), 28);
  const stampIn = spPop(f, A(9), 18);
  const stampShake = impactShake(f, A(9), 4, 10);

  return (
    <g>
      <Head s="مفهوم «اثرِ فلای‌ویل»" f={f} start={A(3)} blue />

      {/* Engineering Blueprint Drafting Board */}
      <g
        transform={tr(
          444 + stampShake * 0.6,
          608 + 20 * (1 - boardIn) + stampShake,
          0.94 + 0.06 * boardIn,
        )}
        filter="url(#lift)"
      >
        <rect
          x="-370"
          y="-290"
          width="740"
          height="580"
          rx="26"
          fill="url(#ivory)"
          stroke="#C2B89F"
          strokeWidth="2.8"
        />
        <rect
          x="-346"
          y="-266"
          width="692"
          height="532"
          rx="16"
          fill="url(#paper)"
          stroke="#D7CFBA"
          strokeWidth="1.6"
        />
        <rect
          x="-346"
          y="-266"
          width="692"
          height="532"
          rx="16"
          fill="url(#draft)"
        />
        <Screw x={-328} y={-248} r={5} />
        <Screw x={328} y={-248} r={5} />
        <Screw x={-328} y={248} r={5} />
        <Screw x={328} y={248} r={5} />

        {/* Crosshair axis lines */}
        <path
          d="M-300 10H300M0 -210V220"
          stroke="#799B9E"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity={0.45 * clamp(boardIn)}
        />

        {/* Kinetic energy ring gauge */}
        <circle
          cx="0"
          cy="10"
          r="176"
          fill="none"
          stroke={O.blue}
          strokeWidth="4.5"
          strokeDasharray="16 10"
          opacity={0.8 * clamp(ringIn)}
          transform={`rotate(${-15 + 42 * calSpin} 0 10)`}
        />

        {/* Auxiliary brass pinion engaging the flywheel */}
        <g transform={tr(204, 52)} opacity={clamp(calSpin * 1.4)}>
          <BrassGear r={44} teeth={10} rot={-calSpin * 135} tone="brass" />
          <T
            s="انتقال نیرو"
            x={0}
            y={72}
            w={130}
            h={26}
            n={20}
            k={800}
            c={O.ink}
          />
        </g>

        {/* Central HeavyFlywheel transferred from QuestionCover */}
        <Shade x={0} y={178} w={210} h={20} />
        <HeavyFlywheel
          x={0}
          y={10}
          s={0.94}
          rot={16 + 90 * calSpin}
          energy={0.14 + 0.28 * clamp(ringIn)}
          plinth
        />

        {/* Top Lapis Concept Tag */}
        <g
          transform={tr(0, -214 - 14 * (1 - tagIn), clamp(tagIn))}
          opacity={clamp(tagIn)}
        >
          <Tag
            s="چرخ‌طیارِ ذخیرهٔ انرژی"
            x={0}
            y={0}
            w={310}
            h={56}
            c="url(#lapisGrad)"
            n={28}
          />
        </g>

        {/* Corner English Term Stamp: Flywheel */}
        <g
          transform={tr(-240, -186, 0.72 + 0.28 * stampIn, -8 + 4 * (1 - stampIn))}
          opacity={clamp(stampIn)}
        >
          <rect
            x="-86"
            y="-28"
            width="172"
            height="56"
            rx="12"
            fill="url(#night)"
            stroke="url(#brass)"
            strokeWidth="2.4"
          />
          <T
            s="Flywheel"
            x={0}
            y={1}
            w={150}
            h={36}
            n={28}
            k={900}
            c="#FCEDB7"
          />
          <SheenOverlay
            x={-86}
            y={-28}
            w={172}
            h={56}
            rx={12}
            progress={sheenSweep(f, A(9) + 4, 24)}
          />
        </g>

        {/* Corner technical seal */}
        <g transform={tr(260, -188, 0.8 + 0.2 * ringIn)} opacity={clamp(ringIn)}>
          <Seal s={0.95} col={O.lapis} label="اصل" />
        </g>
      </g>
    </g>
  );
}

/* ============================================================================
   SHOT 1: FirstHeavyPush (w10..w29 -> f=212..544)
   "فرض کن یک چرخ سنگین فلزی رو می‌خوای بچرخونی؛ اولش باید تمام زورت رو بذاری تا فقط یک دور بچرخه!"
   Continuity: Heavy cast-iron wheel moves onto workshop floor axle with real
   rotational inertia (spHeavy) + lock impact shake on 1st revolution.
============================================================================ */
export function FirstHeavyPush({ f }: { f: number }) {
  const wheelIn = spHeavy(f, A(10), 26);
  const leverIn = spSnap(f, A(13), 18);
  const weightIn = spPop(f, A(14), 20);
  const workerIn = spSnap(f, A(18), 18);
  const forceIn = spSnap(f, A(21), 22);
  const halfTurn = e(f, A(24), Math.max(24, A(27) - A(24)));
  const fullTurn = spHeavy(f, A(27), 26);
  const lockTurn = spPop(f, A(29), 20);
  const lockShake = impactShake(f, A(29), 5.5, 12);

  const rotDeg = 106 + 180 * halfTurn + 180 * fullTurn;
  const forcePct = Math.round(100 * clamp(forceIn));
  const revDone = fullTurn > 0.55 ? "۱" : "۰";

  return (
    <g transform={tr(lockShake * 0.5, lockShake)}>
      <Head s="تمامِ زورت برای «دورِ اول»" f={f} start={A(10)} />

      {/* Workshop floor pedestal */}
      <Shade x={390} y={845} w={310} h={24} />
      <rect
        x="80"
        y="835"
        width="728"
        height="18"
        rx="9"
        fill="url(#wood)"
        stroke="#A48854"
        strokeWidth="2"
      />

      {/* Revolution Counter Plaque (Top Left) */}
      <g
        transform={tr(188, 366, 0.96 + 0.04 * spSnap(f, A(19), 18))}
        filter="url(#lift)"
      >
        <rect
          x="-110"
          y="-64"
          width="220"
          height="128"
          rx="20"
          fill="url(#paper)"
          stroke="#C5BDAA"
          strokeWidth="2.4"
        />
        <T s="تعداد دور" x={0} y={-34} w={170} h={28} n={23} k={800} c={O.ink} />
        <rect
          x="-72"
          y="-8"
          width="144"
          height="54"
          rx="14"
          fill={lockTurn > 0.5 ? "url(#green)" : "url(#night)"}
        />
        <T
          s={`${revDone} دور`}
          x={0}
          y={19}
          w={124}
          h={40}
          n={34}
          k={900}
          c="#FFFFFF"
        />
      </g>

      {/* Effort / Force Meter (Top Right) */}
      <g transform={tr(684, 366)} filter="url(#lift)">
        <rect
          x="-128"
          y="-64"
          width="256"
          height="128"
          rx="20"
          fill="url(#paper)"
          stroke="#C5BDAA"
          strokeWidth="2.4"
        />
        <T
          s="فشارِ اولیه"
          x={0}
          y={-34}
          w={200}
          h={28}
          n={23}
          k={800}
          c={O.ink}
        />
        <rect
          x="-98"
          y="-2"
          width="196"
          height="26"
          rx="13"
          fill="#E7E1D2"
          stroke="#B5AE99"
          strokeWidth="1.8"
        />
        <rect
          x="-94"
          y="2"
          width={Math.max(12, 188 * clamp(forceIn))}
          height="18"
          rx="9"
          fill="url(#clay)"
        />
        <T
          s={`${forcePct}٪ تمامِ زور`}
          x={0}
          y={42}
          w={210}
          h={26}
          n={22}
          k={900}
          c={C.clay}
        />
      </g>

      {/* Main HeavyFlywheel in center-left */}
      <g
        transform={tr(472, 650, 1.02 + 0.06 * clamp(wheelIn))}
        filter="url(#heavyLift)"
      >
        <HeavyFlywheel
          s={1}
          rot={rotDeg}
          energy={0.22 + 0.25 * clamp(fullTurn)}
          weightClamp={weightIn > 0.15}
          plinth
        />

        {/* Brass push lever attached to axle */}
        <g
          transform={`rotate(${-36 + 40 * clamp(halfTurn * 0.6 + fullTurn * 0.4)})`}
          opacity={clamp(leverIn)}
        >
          <rect
            x="-238"
            y="-10"
            width="238"
            height="20"
            rx="10"
            fill="url(#brass)"
            stroke="#7A6032"
            strokeWidth="2.4"
          />
          <circle
            cx="-232"
            cy="0"
            r="16"
            fill="url(#night)"
            stroke="url(#brass)"
            strokeWidth="2.4"
          />
        </g>
      </g>

      {/* Pixel character leaning hard into the lever */}
      <g
        transform={tr(
          164 + 66 * clamp(workerIn) + 22 * clamp(forceIn),
          825,
          1,
          13 * clamp(forceIn),
        )}
        opacity={clamp(workerIn)}
      >
        <Person x={0} y={0} size={6.2} pose={1} who={0} band />
      </g>

      {/* Friction sparks when breaking initial inertia */}
      {halfTurn > 0.05 && halfTurn < 0.95 && (
        <g transform={tr(472, 792)} opacity={Math.sin(Math.PI * halfTurn)}>
          {range(5).map((i) => (
            <path
              key={i}
              d={`M${-40 + i * 20} 0l${-8 + i * 4} -16`}
              stroke="#F3B845"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ))}
        </g>
      )}

      {/* Green lock badge when 1st revolution completes */}
      {lockTurn > 0.05 && (
        <g
          transform={tr(690, 492, 0.72 + 0.28 * lockTurn)}
          opacity={clamp(lockTurn)}
        >
          <Tag
            s="۱ دورِ کامل ✓"
            x={0}
            y={0}
            w={206}
            h={58}
            c="url(#green)"
            n={26}
          />
          <SheenOverlay
            x={-103}
            y={-29}
            w={206}
            h={58}
            rx={29}
            progress={sheenSweep(f, A(29) + 3, 24)}
          />
        </g>
      )}
    </g>
  );
}

/* ============================================================================
   SHOT 2: BurnoutQuitTrap (w30..w41 -> f=545..739)
   "خیلی‌ها دقیقاً همین‌جا خسته میشن و میگن این کار اصلاً جواب نمیده!"
   Continuity: Same wheel locked at 1 turn + staggered crowd retreat + stamp slam.
============================================================================ */
export function BurnoutQuitTrap({ f }: { f: number }) {
  const drainIn = spSnap(f, A(33), 20);
  const bubbleIn = spPop(f, A(36), 20);
  const quitBack = spHeavy(f, A(39), 24);
  const stampIn = spPop(f, A(40), 18);
  const stampShake = impactShake(f, A(40), 7.5, 14);

  const batteryLv = 0.62 - 0.5 * clamp(drainIn);
  const wheelRot = 466 + 12 * (1 - clamp(quitBack));

  return (
    <g transform={tr(stampShake * 0.6, stampShake)}>
      <Head s="خیلی‌ها همین‌جا رها می‌کنن" f={f} start={A(30)} />

      {/* Floor */}
      <Shade x={444} y={845} w={330} h={24} />
      <rect
        x="80"
        y="835"
        width="728"
        height="18"
        rx="9"
        fill="url(#wood)"
        stroke="#A48854"
        strokeWidth="2"
      />

      {/* Same flywheel from Shot 1 resting at 1 turn */}
      <g transform={tr(610, 650, 0.96)} filter="url(#heavyLift)">
        <HeavyFlywheel s={1} rot={wheelRot} energy={0.34} weightClamp plinth />
      </g>

      {/* Low red battery meter */}
      <BatteryMeter
        x={238}
        y={374}
        level={batteryLv}
        label={drainIn > 0.5 ? "انرژی: ۱۲٪ (خستگی)" : "در حال تخلیه..."}
        warn={drainIn > 0.3}
        scale={1.08}
      />

      {/* Staggered crowd of people stepping back and giving up */}
      <g transform={tr(240 - 48 * clamp(quitBack), 825)}>
        {range(3).map((i) => {
          const pIn = spSnap(f, A(30) + i * 3, 18);
          return (
            <g
              key={i}
              transform={tr(-86 * i * clamp(pIn), -2 * (i % 2))}
              opacity={(0.58 + 0.42 * (1 - i * 0.25)) * clamp(pIn)}
            >
              <Person
                x={0}
                y={0}
                size={5.6 - i * 0.4}
                pose={quitBack > 0.4 ? 0 : 2}
                who={i}
                tilt={quitBack > 0.4 ? -9 : 0}
                band={i === 0}
              />
            </g>
          );
        })}
      </g>

      {/* Speech Bubble: "اصلاً جواب نمیده!" */}
      <g
        transform={tr(
          264,
          534 - 12 * (1 - bubbleIn),
          0.72 + 0.28 * bubbleIn,
        )}
        opacity={clamp(bubbleIn)}
        filter="url(#lift)"
      >
        <rect
          x="-158"
          y="-52"
          width="316"
          height="104"
          rx="24"
          fill="url(#clay)"
          stroke="#FFF8E9"
          strokeWidth="2.5"
        />
        <path d="M-24 52l-18 28 38-28z" fill={C.clay} />
        <T
          s="اصلاً جواب نمیده!"
          x={0}
          y={1}
          w={280}
          h={46}
          n={34}
          k={900}
          c="#FFFFFF"
        />
      </g>

      {/* Red STOP Stamp slamming onto output */}
      <g
        transform={tr(610, 646, 1.45 - 0.45 * stampIn, -10)}
        opacity={clamp(stampIn)}
      >
        <rect
          x="-126"
          y="-42"
          width="252"
          height="84"
          rx="16"
          fill="rgba(255,251,241,0.95)"
          stroke={C.clay}
          strokeWidth="5"
        />
        <T
          s="توقفِ زودهنگام ✕"
          x={0}
          y={1}
          w={222}
          h={44}
          n={30}
          k={900}
          c={C.clay}
        />
      </g>
    </g>
  );
}

/* ============================================================================
   SHOT 3: StoredEnergyTruth (w42..w52 -> f=740..1000) — WIPE IN
   "اما حقیقت اینه: چرخش اول، انرژیِ دورهای بعدی رو ذخیره می‌کنه."
   Continuity: Opens the front cover of the SAME flywheel to reveal the
   glowing coiled kinetic spring & spiraling golden energy orbs.
============================================================================ */
export function StoredEnergyTruth({ f }: { f: number }) {
  const openIn = spSnap(f, A(43), 20);
  const coilIn = spHeavy(f, A(45), 26);
  const orbIn = spSnap(f, A(47), 22);
  const ringIn = spPop(f, A(49), 22);
  const doneIn = spPop(f, A(51), 20);

  const energyLv = 0.35 + 0.65 * clamp(0.4 * coilIn + 0.6 * doneIn);

  return (
    <g>
      <Head s="حقیقت: انرژی ذخیره میشه" f={f} start={A(42)} blue />

      {/* Outer concentric next-round orbits with staggered snap */}
      {[1, 2, 3].map((k) => {
        const p = clamp(ringIn * 1.4 - (k - 1) * 0.2);
        return (
          <circle
            key={k}
            cx="444"
            cy="588"
            r={164 + k * 42}
            fill="none"
            stroke={k % 2 === 1 ? O.blue : O.brass}
            strokeWidth={3.8 - k * 0.5}
            strokeDasharray="14 10"
            opacity={0.78 * p}
            transform={`rotate(${(k % 2 ? 1 : -1) * 32 * coilIn} 444 588)`}
          />
        );
      })}

      {/* Cutaway Flywheel showing coiled kinetic energy spring */}
      <Shade x={444} y={840} w={250} h={24} />
      <g
        transform={tr(444, 588, 1.1 + 0.06 * clamp(openIn))}
        filter="url(#heavyLift)"
      >
        <HeavyFlywheel
          s={1}
          rot={76 * coilIn + 44 * doneIn}
          energy={energyLv}
          cutaway
        />
      </g>

      {/* Energy particles spiraling into the core */}
      {orbIn > 0.05 &&
        range(6).map((i) => {
          const ang = (i * Math.PI) / 3 + coilIn * 0.9;
          const dist = 216 * (1 - 0.54 * clamp(orbIn));
          return (
            <circle
              key={i}
              cx={444 + dist * Math.cos(ang)}
              cy={588 + dist * Math.sin(ang)}
              r={10}
              fill="#FFE484"
              stroke="#A57F2C"
              strokeWidth="2"
              opacity={clamp(orbIn)}
            />
          );
        })}

      {/* "دورهای بعدی" Badge on top right */}
      <g
        transform={tr(684, 344, 0.78 + 0.22 * ringIn)}
        opacity={clamp(ringIn)}
      >
        <Tag
          s="انرژیِ دورهای بعدی"
          x={0}
          y={0}
          w={236}
          h={56}
          c="url(#lapisGrad)"
          n={24}
        />
      </g>

      {/* Storage Tank Gauge at bottom */}
      <g transform={tr(444, 876)} filter="url(#lift)">
        <rect
          x="-270"
          y="-42"
          width="540"
          height="84"
          rx="22"
          fill="url(#paper)"
          stroke="#C5BDAA"
          strokeWidth="2.4"
        />
        <T
          s="مخزن انرژی"
          x={186}
          y={0}
          w={140}
          h={34}
          n={24}
          k={800}
          c={O.ink}
        />
        <rect
          x="-238"
          y="-16"
          width="320"
          height="32"
          rx="16"
          fill="#E7E1D2"
          stroke="#B5AE99"
          strokeWidth="1.8"
        />
        <rect
          x="-234"
          y="-12"
          width={Math.max(16, 312 * energyLv)}
          height="24"
          rx="12"
          fill={doneIn > 0.5 ? "url(#green)" : "url(#blue)"}
        />
        {doneIn > 0.3 && (
          <g transform={tr(-120, 0)} opacity={clamp(doneIn)}>
            <Tick x={-52} y={0} scale={0.55} col="#FFFFFF" />
            <T
              s="ذخیره شد"
              x={14}
              y={1}
              w={118}
              h={26}
              n={22}
              k={900}
              c="#FFFFFF"
            />
          </g>
        )}
      </g>
    </g>
  );
}
