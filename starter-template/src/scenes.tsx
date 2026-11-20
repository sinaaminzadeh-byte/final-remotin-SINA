import React from "react";
import { A, C, T, Head, tr, clamp, sp } from "./core";
import { Shade } from "./objects";

/** Replace with bespoke multi-phase scenes tied to semantic-beats.json (target 1.0-1.4 micro-actions/sec). */
export function SceneExample({ f }: { f: number }) {
  const enter = sp(f, A(3) - 4, 24);
  return (
    <g opacity={clamp(enter * 1.4)}>
      <Head s="عنوان صحنهٔ اول" f={f} start={A(3)} />
      <Shade x={444} y={860} w={300} h={26} />
      <g transform={tr(444, 600 + 18 * (1 - enter), 0.94 + 0.06 * enter)} filter="url(#heavyLift)">
        <rect
          x="-220"
          y="-160"
          width="440"
          height="320"
          rx="28"
          fill="url(#paper)"
          stroke="#BEB59E"
          strokeWidth="3"
        />
        <T s="شیء قهرمان اختصاصی موضوع" x={0} y={0} w={380} h={52} n={38} k={900} c={C.ink} />
      </g>
    </g>
  );
}
