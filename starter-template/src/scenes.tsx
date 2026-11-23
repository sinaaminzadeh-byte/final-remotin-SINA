import React from "react";
import { A, C, T, Head, tr, spSnap, clamp } from "./core";
import { Shade, StageFloor } from "./objects";

/**
 * Stage coordinate guide (inside 888x1024 stage SVG):
 * - y = 0..115:   top margin below CreatorSignature (do not place text here)
 * - y = 120..250: reserved for <Head /> (center y = 186) — keep all scene cards/badges at y >= 265
 * - y = 265..925: safe hero & label stage zone (x = 40..848)
 * - y = 935..1024: bottom margin near pixel-mark & Captions (keep critical text above y = 925)
 *
 * Directing & visual quality rules:
 * 1. Aim for 6-8 deeper scenes (~5-8s each), NOT 10-12 rushed micro-shots.
 * 2. Ground every scene in real staging (StageFloor, DraftBoard, desk, track, device frame) —
 *    NEVER repeat a floating "object + bottom Plate pills at y=888" template across every shot.
 * 3. Build topic-native hero SVG props; NEVER clone Gear/Flywheel silhouettes for unrelated topics
 *    or recycle the cover prop in the closing CTA.
 * 4. Keep Person() active when human action matters, and keep a warm brand palette (ivory/wood/brass/lapis/gold).
 * 5. M023/M024: Labels inside gauges/buttons/plates are allowed (only text-text collisions fail);
 *    NEVER wrap the scene root in opacity={0} or render <TechMatrixBackdrop /> inside scene files.
 */
export function SceneExample({ f }: { f: number }) {
  const shotStart = A(3);
  const enter = spSnap(f, shotStart, 22);
  const scale = 0.94 + 0.06 * clamp(enter);
  return (
    <g>
      <Head s="عنوان صحنهٔ اول" f={f} start={shotStart} />
      <StageFloor y={838} w={760} tone="wood" />
      <Shade x={444} y={822} w={230} h={20} />
      <g
        transform={tr(444, 650 + 18 * (1 - enter), scale)}
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
