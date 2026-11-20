import React from "react";
import {
  A,
  C,
  T,
  Head,
  Tag,
  Tick,
  Person,
  Screw,
  tr,
  clamp,
  e,
  sp,
  mix,
  range,
} from "./core";
import { O, Shade, RulePill, BatteryGauge, AIModule } from "./objects";

/* ============================================================================
 * SHOT 6: DelegateToAI — «بقیه بخش‌های فنی و سخت رو بسپار به هوش مصنوعی.»
 * ============================================================================ */
export function DelegateToAI({ f }: { f: number }) {
  const enter = sp(f, A(98) - 2, 22);
  const transfer = e(f, A(104) - 4, 34); // «بسپار به هوش مصنوعی.»
  const doneAI = sp(f, A(106) - 2, 20);

  const tasks = [
    { label: "تدوین ویدیو", y: 468, delay: 0 },
    { label: "تنظیمات فنی", y: 586, delay: 0.14 },
    { label: "طراحی و رندر", y: 704, delay: 0.28 },
  ];

  return (
    <g opacity={clamp(enter * 1.4)}>
      <Head s="فنی و سخت ← هوش مصنوعی" f={f} start={A(98)} />
      <Shade x={444} y={862} w={354} h={26} />

      {/* Brass Roller Transfer Track connecting Right Desk -> Left AI Engine */}
      <g transform={tr(444, 796)}>
        <rect
          x="-358"
          y="-18"
          width="716"
          height="36"
          rx="18"
          fill="url(#ivory)"
          stroke="#B9B09A"
          strokeWidth="2.4"
        />
        {range(9).map((i) => (
          <circle
            key={i}
            cx={-312 + i * 78}
            cy="0"
            r="9"
            fill="url(#brass)"
            stroke="#876A36"
            strokeWidth="1.5"
          />
        ))}
      </g>

      {/* Directional transfer chevrons */}
      {[504, 464, 424].map((cx, i) => (
        <path
          key={i}
          d={`M${cx + 12} 572 L${cx - 10} 588 L${cx + 12} 604`}
          fill="none"
          stroke={C.primary}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.25 + 0.75 * clamp(transfer * 2 - i * 0.2)}
        />
      ))}

      {/* LEFT SIDE: AI Engine Console receiving the technical workload */}
      <g transform={tr(228, 588)}>
        <AIModule
          x={0}
          y={0}
          active={0.5 + 0.5 * transfer}
          done={doneAI}
          scale={1.16}
          subtitle="آمادهٔ دریافت"
        />
      </g>

      {/* RIGHT SIDE: Creator's lightened creative space once tasks slide left */}
      <g transform={tr(684, 588)} opacity={clamp(transfer * 1.4)} filter="url(#lift)">
        <rect
          x="-118"
          y="-104"
          width="236"
          height="208"
          rx="26"
          fill="url(#paper)"
          stroke="#008551"
          strokeWidth="3"
        />
        <circle cx="0" cy="-34" r="34" fill="url(#green)" />
        <Tick x={0} y={-34} scale={0.9} col="#FFFFFF" />
        <T s="تو فقط" x={0} y={32} w={194} h={36} n={32} k={900} c={C.ink} />
        <T s="ایده بده!" x={0} y={70} w={194} h={36} n={32} k={900} c="#007A47" />
      </g>

      {/* Three heavy technical blocks sliding smoothly from Right (668) into Left AI Core (240) */}
      {tasks.map((task, idx) => {
        const localT = clamp((transfer - task.delay) / 0.68);
        const smooth = localT * localT * (3 - 2 * localT);
        const tx = mix(668, 250, smooth);
        const sc = mix(1.0, 0.58, smooth);
        const op = clamp(1 - Math.max(0, (smooth - 0.78) / 0.22));
        return (
          <g
            key={idx}
            transform={tr(tx, task.y, sc)}
            opacity={op}
            filter="url(#lift)"
          >
            <rect
              x="-126"
              y="-42"
              width="252"
              height="84"
              rx="18"
              fill="url(#night)"
              stroke="#456782"
              strokeWidth="2.4"
            />
            <circle cx="88" cy="0" r="18" fill="url(#brass)" />
            <circle cx="88" cy="0" r="7" fill="url(#night)" />
            <T s={task.label} x={-18} y={1} w={172} h={42} n={30} k={800} c="#FFFFFF" />
          </g>
        );
      })}
    </g>
  );
}

/* ============================================================================
 * SHOT 7: GambaruSystem — «و شماره چهار: گامبارو؛ استمرار هوشمندانه!
 * به جای اینکه یک ماه شبانه‌روز کار کنی و خسته بشی،»
 * ============================================================================ */
export function GambaruSystem({ f }: { f: number }) {
  const isBurnout = f >= A(114) - 4;

  // Phase A: Gambaru brass balance flywheel + vermilion hanko seal
  const wheelIn = sp(f, A(108) + 2, 24);
  const spinStart = Math.max(0, f - A(112));
  const spinDeg = spinStart * 1.4;

  // Phase B: 30-day rapid calendar + tired pixel character + draining red battery
  const burnIn = sp(f, A(114) - 3, 22);
  const drain = e(f, A(117) - 2, 68); // «یک ماه شبانه‌روز کار کنی و خسته بشی»
  const dayNum = Math.min(30, Math.max(1, Math.round(mix(1, 30, drain))));
  const batLevel = mix(0.88, 0.12, drain);
  const isNight = Math.floor(drain * 10) % 2 === 1;

  return (
    <g>
      <Head
        s={isBurnout ? "تلاش فرسایشی؟ نه!" : "قانون ۴: گامبارو"}
        f={f}
        start={isBurnout ? A(114) : A(108)}
      />
      {!isBurnout && <RulePill latin="Gambaru" p={wheelIn} />}

      {!isBurnout ? (
        /* Phase A: Balanced Brass Flywheel & Hanko Stamp */
        <g transform={tr(444, 608)} opacity={clamp(wheelIn * 1.3)}>
          <Shade x={0} y={248} w={278} h={24} />

          {/* Calm rotating balance ring */}
          <g transform={tr(0, 0, 0.9 + 0.1 * wheelIn, spinDeg)} filter="url(#heavyLift)">
            <circle
              r="186"
              fill="url(#ivory)"
              stroke="url(#brass)"
              strokeWidth="12"
            />
            <circle
              r="152"
              fill="none"
              stroke="#C9BEA4"
              strokeWidth="2.5"
              strokeDasharray="12 10"
            />
            {/* Balanced day (gold) and night (navy) rhythm arcs */}
            <path
              d="M0-166 A166 166 0 0 1 166 0"
              fill="none"
              stroke={C.primary}
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M0 166 A166 166 0 0 1 -166 0"
              fill="none"
              stroke="#008551"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Spokes */}
            {[0, 90, 180, 270].map((a) => (
              <line
                key={a}
                x1="0"
                y1="-142"
                x2="0"
                y2="-74"
                stroke="url(#brass)"
                strokeWidth="7"
                strokeLinecap="round"
                transform={`rotate(${a})`}
              />
            ))}
          </g>

          {/* Static center badge inside flywheel */}
          <circle r="86" fill="url(#paper)" stroke="url(#brass)" strokeWidth="5" filter="url(#lift)" />
          <T s="استمرار" x={0} y={-14} w={144} h={40} n={34} k={900} c={C.ink} />
          <T s="هوشمندانه" x={0} y={26} w={148} h={36} n={29} k={800} c={C.primary} />

          {/* Traditional Japanese Vermilion Hanko square stamp at bottom-right */}
          <g transform={tr(188, 146, 1, -8)} filter="url(#lift)">
            <rect
              x="-44"
              y="-44"
              width="88"
              height="88"
              rx="14"
              fill="url(#toriiRed)"
              stroke="#FFF2EC"
              strokeWidth="3"
            />
            <rect
              x="-35"
              y="-35"
              width="70"
              height="70"
              rx="8"
              fill="none"
              stroke="#FFF2EC"
              strokeWidth="1.8"
            />
            <T s="۴" x={0} y={2} w={52} h={52} n={44} k={900} c="#FFFBF1" />
          </g>
        </g>
      ) : (
        /* Phase B: 30-Day Desk Calendar + Tired Character + Draining Red Battery */
        <g opacity={clamp(burnIn * 1.4)}>
          <Shade x={444} y={860} w={330} h={26} />

          {/* RIGHT: 30-Day Rapid Tear-Off Calendar */}
          <g transform={tr(616, 566)} filter="url(#heavyLift)">
            <rect
              x="-144"
              y="-154"
              width="288"
              height="308"
              rx="26"
              fill="url(#paper)"
              stroke="#BEB59D"
              strokeWidth="3"
            />
            <rect x="-144" y="-154" width="288" height="76" rx="22" fill="url(#clay)" />
            <rect x="-144" y="-102" width="288" height="24" fill="url(#clay)" />
            <T s="۱ ماهِ شبانه‌روز" x={0} y={-114} w={252} h={42} n={31} k={900} c="#FFFFFF" />

            {/* Spiral rings */}
            {[-92, -32, 32, 92].map((rx) => (
              <rect key={rx} x={rx - 7} y="-172" width="14" height="36" rx="7" fill="url(#brass)" />
            ))}

            {/* Rapidly ticking day count */}
            <T s={`روز ${dayNum}`} x={0} y={14} w={240} h={94} n={76} k={900} c={C.ink} />

            {/* Sun / Moon alternating badge */}
            <rect
              x="-102"
              y="84"
              width="204"
              height="48"
              rx="24"
              fill={isNight ? "url(#night)" : "url(#gold)"}
            />
            <T
              s={isNight ? "شبِ بی‌خوابی" : "کار بی‌وقفه"}
              x={0}
              y={109}
              w={180}
              h={32}
              n={25}
              k={800}
              c={isNight ? "#DCEBFF" : C.goldInk}
            />
          </g>

          {/* LEFT: Exhausted Pixel Creator at Desk + Draining Red Battery */}
          <g transform={tr(244, 650)}>
            {/* Wooden work desk */}
            <rect
              x="-136"
              y="46"
              width="272"
              height="24"
              rx="8"
              fill="url(#wood)"
              stroke="#997D4C"
              strokeWidth="2.4"
            />
            <rect x="-112" y="70" width="20" height="106" rx="4" fill="#9E8250" />
            <rect x="92" y="70" width="20" height="106" rx="4" fill="#9E8250" />

            {/* Tired hunched pixel Person */}
            <Person
              x={0}
              y={54}
              size={5.2}
              pose={0}
              who={1}
              tilt={mix(0, 14, drain)}
            />

            {/* Draining Battery directly above character */}
            <BatteryGauge
              x={0}
              y={-158}
              level={batLevel}
              label={drain > 0.65 ? "خستگی! ۱۰٪" : `انرژی ${Math.round(batLevel * 100)}٪`}
              warn={drain > 0.45}
              scale={1.15}
            />
          </g>
        </g>
      )}
    </g>
  );
}

/* ============================================================================
 * SHOT 8: AutoPipeline — «سیستم تولیدت رو اتوماتیک کن تا کارهای تکراری و سخت
 * روزانه رو هوش مصنوعی انجام بده.»
 * ============================================================================ */
export function AutoPipeline({ f }: { f: number }) {
  const enter = sp(f, A(125) - 2, 22);
  const toggleOn = sp(f, A(128) - 2, 20); // «اتوماتیک کن»
  const flow = e(f, A(131) - 2, 76); // «تا کارهای تکراری و سخت روزانه رو هوش مصنوعی انجام بده»
  const aiFinish = sp(f, A(137) - 2, 22);

  const tickets = ["کپشن روزانه", "تدوین خودکار", "زمان‌بندی انتشار"];

  return (
    <g opacity={clamp(enter * 1.4)}>
      <Head s="سیستم تولید اتوماتیک" f={f} start={A(125)} />
      <Shade x={444} y={886} w={362} h={26} />

      {/* Top Physical Toggle Switch: دستی -> اتوماتیک */}
      <g transform={tr(444, 336)} filter="url(#lift)">
        <rect
          x="-216"
          y="-42"
          width="432"
          height="84"
          rx="42"
          fill="url(#ivory)"
          stroke="#BDB49D"
          strokeWidth="2.8"
        />
        <T s="دستی" x={136} y={1} w={116} h={38} n={30} k={800} c={toggleOn > 0.5 ? C.muted : C.ink} />
        <T
          s="اتوماتیک"
          x={-124}
          y={1}
          w={144}
          h={38}
          n={31}
          k={900}
          c={toggleOn > 0.5 ? "#007A47" : C.muted}
        />
        {/* Sliding tactile switch track */}
        <rect
          x="-42"
          y="-24"
          width="96"
          height="48"
          rx="24"
          fill={toggleOn > 0.5 ? "url(#green)" : "#C5BEB0"}
        />
        <circle
          cx={mix(28, -16, toggleOn)}
          cy="0"
          r="20"
          fill="#FFFFFF"
          stroke="#D7D0BF"
          strokeWidth="2"
        />
      </g>

      {/* Main 3-Stage Automated Pipeline Console (RTL: Right Input -> Center AI Hub -> Left Published Reels) */}
      <g transform={tr(444, 622)} filter="url(#heavyLift)">
        <rect
          x="-386"
          y="-186"
          width="772"
          height="396"
          rx="32"
          fill="url(#paper)"
          stroke="#C5BDAA"
          strokeWidth="2.8"
        />
        <rect
          x="-368"
          y="-168"
          width="736"
          height="360"
          rx="22"
          fill="#F7F4EB"
        />
        <Screw x={-356} y={-156} r={5} />
        <Screw x={356} y={-156} r={5} />
        <Screw x={-356} y={180} r={5} />
        <Screw x={356} y={180} r={5} />

        {/* Horizontal Conveyor Belt */}
        <rect x="-328" y="-12" width="656" height="24" rx="12" fill="#DDD6C5" />
        {/* Animated moving belt dashes */}
        {range(10).map((i) => {
          const offset = ((f * 2.2) % 64) * clamp(toggleOn);
          const bx = 290 - i * 64 - offset;
          if (bx < -314 || bx > 314) return null;
          return (
            <rect
              key={i}
              x={bx}
              y="-5"
              width="24"
              height="10"
              rx="5"
              fill={C.primary}
              opacity=".55"
            />
          );
        })}

        {/* Stage 1 (Right): Repetitive Daily Tasks Stack */}
        <g transform={tr(246, 0)}>
          <rect
            x="-98"
            y="-124"
            width="196"
            height="248"
            rx="22"
            fill="url(#ivory)"
            stroke="#C4B99F"
            strokeWidth="2.4"
          />
          <T s="کارهای تکراری" x={0} y={-92} w={172} h={34} n={26} k={900} c={C.ink} />
          {tickets.map((t, i) => {
            const slideOut = clamp((flow - i * 0.22) * 2.4);
            return (
              <g
                key={t}
                transform={tr(-slideOut * 95, -36 + i * 56)}
                opacity={1 - slideOut * 0.85}
              >
                <rect
                  x="-78"
                  y="-20"
                  width="156"
                  height="40"
                  rx="10"
                  fill="url(#gold)"
                  stroke="#B3934E"
                  strokeWidth="1.6"
                />
                <T s={t} x={0} y={1} w={140} h={26} n={21} k={800} c={C.goldInk} />
              </g>
            );
          })}
        </g>

        {/* Stage 2 (Center): AI Processing Engine */}
        <g transform={tr(0, 0)}>
          <AIModule
            x={0}
            y={0}
            active={toggleOn}
            done={aiFinish}
            scale={0.96}
            subtitle="پردازش خودکار"
          />
        </g>

        {/* Stage 3 (Left): Polished Ready Reels Output */}
        <g transform={tr(-246, 0)}>
          <rect
            x="-98"
            y="-124"
            width="196"
            height="248"
            rx="22"
            fill="url(#lapisGrad)"
            stroke="#144374"
            strokeWidth="2.4"
          />
          <T s="خروجی آماده" x={0} y={-92} w={172} h={34} n={26} k={900} c="#FFFFFF" />
          {[0, 1, 2].map((i) => {
            const p = sp(f, A(134) + i * 8, 20);
            return (
              <g
                key={i}
                transform={tr(0, -34 + i * 56 + 10 * (1 - p), 0.86 + 0.14 * p)}
                opacity={0.25 + 0.75 * clamp(p)}
              >
                <rect
                  x="-76"
                  y="-20"
                  width="152"
                  height="40"
                  rx="11"
                  fill="url(#paper)"
                />
                <circle cx="-48" cy="0" r="12" fill="url(#green)" />
                <Tick x={-48} y={0} scale={0.42} col="#FFFFFF" />
                <T s={`ویدیو ${i + 1} ✓`} x={16} y={1} w={104} h={28} n={22} k={800} c={C.ink} />
              </g>
            );
          })}
        </g>

        {/* Bottom calm status strip */}
        <Tag
          s="آرامش خالق + تولیدِ پیوسته"
          x={0}
          y={156}
          w={386}
          h={50}
          c="url(#green)"
          n={27}
        />
      </g>
    </g>
  );
}

/* ============================================================================
 * SHOT 9: SamuraiCTA — «پس اگه تو هم یه سامورایی شکست‌ناپذیر می‌شناسی،
 * این ویدیو رو براش بفرست!»
 * ============================================================================ */
export function SamuraiCTA({ f }: { f: number }) {
  const sunIn = sp(f, A(141) + 2, 24);
  const heroIn = sp(f, A(146) - 3, 24); // «سامورایی شکست‌ناپذیر»
  const cardIn = sp(f, A(149) - 3, 22); // «این ویدیو رو براش بفرست!»
  const sendFly = e(f, A(152) - 2, 26); // paper plane launches -> Sent ✓

  const principles = ["وابی‌سابی", "کایزن", "ایکیگای", "گامبارو"];

  return (
    <g>
      <Head s="برای یک سامورایی بفرست" f={f} start={A(141)} blue />
      <Shade x={444} y={888} w={320} h={26} />

      {/* Warm Japanese Sunrise Disc echoing QuestionCover for visual closure */}
      <g transform={tr(444, 514, 0.88 + 0.12 * sunIn)} opacity={clamp(sunIn * 1.4)}>
        <circle r="218" fill="url(#gold)" opacity=".36" />
        <circle
          r="196"
          fill="none"
          stroke="#C2A05C"
          strokeWidth="2.2"
          strokeDasharray="10 8"
        />

        {/* Arc of 4 Completed Golden Japanese Principle Medallions */}
        {principles.map((name, idx) => {
          const deg = [-70, -24, 24, 70][idx];
          const rad = ((deg - 90) * Math.PI) / 180;
          const mx = 216 * Math.cos(rad);
          const my = 202 * Math.sin(rad);
          const p = sp(f, A(141) + idx * 4, 20);
          return (
            <g key={name} transform={tr(mx, my, 0.78 + 0.22 * p)} filter="url(#lift)">
              <rect
                x="-66"
                y="-22"
                width="132"
                height="44"
                rx="22"
                fill="url(#paper)"
                stroke="url(#brass)"
                strokeWidth="2.6"
              />
              <T s={name} x={0} y={1} w={114} h={30} n={23} k={900} c={C.ink} />
            </g>
          );
        })}

        {/* Central Tactile Samurai Kabuto Crest & Pixel Samurai Creator */}
        <g
          transform={tr(0, 12 + 14 * (1 - heroIn), 0.92 + 0.08 * heroIn)}
          opacity={clamp(heroIn * 1.4)}
          filter="url(#heavyLift)"
        >
          {/* Shield backing */}
          <path
            d="M0-112 L106-68 L92 52 Q0 112 0 112 Q0 112 -92 52 L-106-68 Z"
            fill="url(#night)"
            stroke="url(#brass)"
            strokeWidth="6"
          />
          {/* Golden Samurai Crescent Crest (Maedate) */}
          <path
            d="M-64-78 Q0-14 64-78 Q0-44 -64-78 Z"
            fill="url(#kintsugiGold)"
          />
          <circle cx="0" cy="-64" r="11" fill="url(#toriiRed)" stroke="#FFF2D1" strokeWidth="2" />

          {/* Unstoppable Pixel Samurai wearing sapphire-gold Hachimaki headband */}
          <Person x={0} y={76} size={4.6} pose={1} who={3} band />
        </g>
      </g>

      {/* Bottom Interactive Share Card — Paper Plane launches on «بفرست!» */}
      <g
        transform={tr(444, 792 + 24 * (1 - cardIn), 0.94 + 0.06 * cardIn)}
        opacity={clamp(cardIn * 1.4)}
        filter="url(#heavyLift)"
      >
        <rect
          x="-346"
          y="-78"
          width="692"
          height="156"
          rx="30"
          fill="url(#paper)"
          stroke={C.primary}
          strokeWidth="3.5"
        />

        {/* Right text prompt */}
        <T
          s="ساموراییِ شکست‌ناپذیر"
          x={124}
          y={-22}
          w={370}
          h={44}
          n={35}
          k={900}
          c={C.ink}
        />
        <T
          s="این ویدیو رو براش بفرست"
          x={124}
          y={26}
          w={370}
          h={36}
          n={28}
          k={700}
          c={C.muted}
        />

        {/* Left Blue Action Button -> Green Sent ✓ */}
        <g transform={tr(-196, 0, 1 - 0.06 * Math.sin(Math.PI * sendFly))}>
          <rect
            x="-122"
            y="-40"
            width="244"
            height="80"
            rx="40"
            fill={sendFly > 0.65 ? "url(#green)" : "url(#blue)"}
            stroke="#FFFFFF"
            strokeWidth="2.5"
          />
          {sendFly > 0.65 ? (
            <g>
              <Tick x={-64} y={0} scale={0.75} col="#FFFFFF" />
              <T s="ارسال شد" x={22} y={1} w={144} h={40} n={33} k={800} c="#FFFFFF" />
            </g>
          ) : (
            <T s="ارسال ویدیو ◄" x={0} y={1} w={214} h={42} n={33} k={800} c="#FFFFFF" />
          )}
        </g>

        {/* Crisp Origami Paper Plane flying along a dotted arc when clicked */}
        {sendFly > 0.02 && sendFly < 0.98 && (
          <g
            transform={tr(
              mix(-196, -320, sendFly),
              mix(-40, -138, sendFly),
              mix(0.8, 1.15, sendFly),
              -28,
            )}
            opacity={Math.sin(Math.PI * sendFly)}
          >
            <path
              d="M-24 6 L26 -10 L4 22 L-4 8 Z"
              fill="url(#blue)"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>
    </g>
  );
}
