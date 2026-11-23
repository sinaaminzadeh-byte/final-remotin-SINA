import React from "react";
import { A, C, T, Head, tr, spSnap, clamp } from "./core";
import { Shade } from "./objects";

/**
 * Stage coordinate guide (inside 888x1024 stage SVG):
 * - y = 0..115:   top margin below CreatorSignature (do not place text here)
 * - y = 120..250: reserved for <Head /> (center y = 186) — keep all scene cards/badges at y >= 265
 * - y = 265..925: safe hero & label stage zone (x = 40..848)
 * - y = 935..1024: bottom margin near pixel-mark & Captions (keep critical text above y = 925)
 *
 * Anti-overlap & zero-blank-frame rules:
 * 1. NEVER wrap the scene root in opacity={0}; keep the primary hero visible from f = shot.frame.
 * 2. When a scene has multiple sub-phases, assign distinct non-overlapping zones (>= 24px gap)
 *    or cleanly shrink/exit the previous element before entering the next element.
 * 3. NEVER render <TechMatrixBackdrop /> inside scene files.
 */
export function SceneExample({ f }: { f: number }) {
  const shotStart = A(3);
  const enter = spSnap(f, shotStart, 22);
  const scale = 0.94 + 0.06 * clamp(enter);
  return (
    <g>
      <Head s="عنوان صحنهٔ اول" f={f} start={shotStart} />
      <Shade x={444} y={860} w={300} h={26} />
      <g
        transform={tr(444, 600 + 18 * (1 - enter), scale)}
        filter="url(#heavyLift)"
      >
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
        <T
          s="شیء قهرمان اختصاصی موضوع"
          x={0}
          y={0}
          w={380}
          h={52}
          n={38}
          k={900}
          c={C.ink}
        />
      </g>
    </g>
  );
}
