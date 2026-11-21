import React from "react";
import { QuestionCover } from "./creator-brand/QuestionCover";
import { A, Defs, tr, spHeavy, spSnap, sheenSweep, clamp } from "./core";
import {
  CraftDefs,
  Shade,
  HeavyFlywheel,
  TechMatrixBackdrop,
  SheenOverlay,
} from "./objects";

/** First word after the opening cover phrase ("توی علم مدیریت") */
export const openingEnd = A(3);

export function Opening({ f }: { f: number }) {
  const settle = spHeavy(f, A(0), 28);
  const lock = spSnap(f, A(2), 18);
  const sheen = sheenSweep(f, A(2) + 2, 28);

  return (
    <QuestionCover
      eyebrow="اصلِ فلای‌ویل"
      line1="چرا شروعِ پیج"
      line2="این‌قدر سنگینه؟"
      showEyebrow={f < A(0)}
      backdrop={<TechMatrixBackdrop opacity={0.17} />}
      heroDefs={
        <>
          <Defs />
          <CraftDefs />
        </>
      }
      hero={
        <>
          <Shade x={508} y={1412} w={260} h={26} />
          <g
            transform={tr(
              508,
              1218 - 12 * (1 - settle),
              1.05 + 0.05 * clamp(settle),
            )}
            filter="url(#heavyLift)"
          >
            <HeavyFlywheel
              s={1.0}
              rot={16 * lock}
              energy={0.14 * lock}
              plinth
              nameplate="فلای‌ویل"
            />
            <SheenOverlay
              x={-106}
              y={134}
              w={212}
              h={44}
              rx={12}
              progress={sheen}
            />
          </g>
        </>
      }
    />
  );
}
