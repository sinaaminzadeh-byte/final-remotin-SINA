import React from "react";
import { QuestionCover } from "./creator-brand/QuestionCover";
import { A, Defs, tr, clamp } from "./core";
import { CraftDefs, Shade, ToriiEmblem } from "./objects";

/** Cut on «برای» (word 3), exact first word after «۴ قانون ژاپنی», with zero inserted title card time. */
export const openingEnd = A(3);

const pulse = (f: number, at: number, len: number) =>
  Math.sin(Math.PI * clamp((f - at) / len)) ** 2;

export function Opening({ f }: { f: number }) {
  const settle = pulse(f, A(0), 20);
  const gleam = pulse(f, A(1), 22);
  const warmth = pulse(f, A(2), 24);
  return (
    <QuestionCover
      eyebrow="رشد بدون فرسودگی"
      line1="چطور بدون خستگی"
      line2="پیجت رو بترکونی؟"
      showEyebrow={f < A(0)}
      heroDefs={
        <>
          <Defs />
          <CraftDefs />
        </>
      }
      hero={
        <>
          <Shade x={508} y={1452} w={286} h={28} />
          <g
            transform={tr(
              510,
              1230 - 5 * settle - 3 * warmth,
              1.18 * (1 + 0.008 * gleam),
              -2.2 + 0.9 * settle - 0.6 * warmth,
            )}
          >
            <ToriiEmblem settle={settle} gleam={gleam} warmth={warmth} />
          </g>
        </>
      }
    />
  );
}
