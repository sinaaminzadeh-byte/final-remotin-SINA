import React from "react";
import { QuestionCover } from "./creator-brand/QuestionCover";
import { A, Defs, tr, spHeavy, clamp } from "./core";
import { CraftDefs, Shade, TechMatrixBackdrop } from "./objects";

/** Replace openingEnd with A(k) where k is the first word after the opening cover phrase. */
export const openingEnd = A(3);

export function Opening({ f }: { f: number }) {
  const settle = spHeavy(f, A(0), 28);
  return (
    <QuestionCover
      eyebrow="روتیتر کوتاه موضوع"
      line1="سطر اول پرسش"
      line2="سطر دوم آبی پرسش؟"
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
          <Shade x={508} y={1445} w={280} h={28} />
          <g transform={tr(510, 1230 - 10 * (1 - clamp(settle)), 1.12 + 0.03 * clamp(settle))}>
            {/* Replace with bespoke tactile SVG hero object from Scene 0 of your topic */}
            <rect
              x="-140"
              y="-100"
              width="280"
              height="200"
              rx="28"
              fill="url(#ivory)"
              stroke="url(#brass)"
              strokeWidth="4"
              filter="url(#heavyLift)"
            />
          </g>
        </>
      }
    />
  );
}
