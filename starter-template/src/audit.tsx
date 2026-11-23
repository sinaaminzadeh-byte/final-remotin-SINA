import { useLayoutEffect } from "react";
import { A, metric, words, meta } from "./core";
import { openingEnd } from "./Opening";

const shotList: { frame: number; endFrame?: number }[] = meta.shots ?? [];
const regularSamples = Array.from(
  { length: Math.ceil(meta.durationInFrames / 30) },
  (_, k) => Math.min(meta.durationInFrames - 1, k * 30),
);

const samples = new Set([
  0,
  meta.durationInFrames - 1,
  ...regularSamples,
  ...words.flatMap((_, i) => [A(i), A(i) + 2]),
  ...shotList.flatMap((s, idx) => {
    const start = s.frame;
    const end =
      s.endFrame ??
      (idx + 1 < shotList.length ? shotList[idx + 1].frame - 1 : meta.durationInFrames - 1);
    const span = Math.max(12, end - start);
    return [
      Math.max(0, start + 2),
      Math.min(meta.durationInFrames - 1, start + Math.round(span * 0.3)),
      Math.min(meta.durationInFrames - 1, start + Math.round(span * 0.62)),
      Math.max(0, end - 6),
    ];
  }),
]);

type TextBox = {
  s: string;
  rect: [number, number, number, number];
  isCap: boolean;
  wipeGroup: "old" | "new" | "none";
};

function effectiveOpacity(el: Element): number {
  let op = 1;
  for (let p: Element | null = el; p && p.tagName !== "svg"; p = p.parentElement) {
    const raw = p.getAttribute("opacity");
    if (raw !== null && raw !== "") {
      const n = Number(raw);
      if (!Number.isNaN(n)) op *= n;
    }
    const styleOp = (p as HTMLElement).style?.opacity;
    if (styleOp) {
      const n = Number(styleOp);
      if (!Number.isNaN(n)) op *= n;
    }
  }
  return op;
}

function insideDefsOrClip(el: Element): boolean {
  for (let p: Element | null = el; p; p = p.parentElement) {
    const t = p.tagName.toLowerCase();
    if (t === "defs" || t === "clippath" || t === "pattern" || t === "mask") {
      return true;
    }
  }
  return false;
}

function getWipeGroup(el: Element): "old" | "new" | "none" {
  for (let p: Element | null = el; p && p.tagName !== "svg"; p = p.parentElement) {
    const cp = p.getAttribute("clip-path") || "";
    if (cp.includes("#oldShot")) return "old";
    if (cp.includes("#newShot")) return "new";
  }
  return "none";
}

function overlapArea(
  a: [number, number, number, number],
  b: [number, number, number, number],
): [number, number] {
  const ow = Math.min(a[2], b[2]) - Math.max(a[0], b[0]);
  const oh = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
  return [ow, oh];
}

// Non-drawing, opt-in probe verifying real Doran ink bounds, static CreatorSignature,
// QuestionCover span, loaded font weights, text-to-text non-overlap, backdrop isolation,
// and non-empty stage content (M007/M009/M017/M023/M024).
export function Audit({ f, auditAll = false }: { f: number; auditAll?: boolean }) {
  useLayoutEffect(() => {
    if (!auditAll && !samples.has(f)) return;
    const err: string[] = [];
    const caps: number[] = [];

    const badges = document.querySelectorAll<HTMLElement>(
      "[data-creator-signature]",
    );
    const paper = document.querySelector<HTMLElement>("[data-film-root]");
    let bbox: number[] = [];
    let paperRect: DOMRect | null = null;
    if (badges.length !== 1 || !paper) {
      err.push("Byline missing or duplicated");
    } else {
      paperRect = paper.getBoundingClientRect();
      const k = badges[0].getBoundingClientRect();
      bbox = [
        ((k.left - paperRect.left) * 1080) / paperRect.width,
        ((k.top - paperRect.top) * 1920) / paperRect.height,
        (k.width * 1080) / paperRect.width,
        (k.height * 1920) / paperRect.height,
      ];
      if (bbox.some((n, i) => Math.abs(n - [351, 276, 378, 82.5][i]) > 0.15)) {
        err.push("Byline moved: " + bbox.map((v) => v.toFixed(2)).join(","));
      }
    }

    if (
      [...document.querySelectorAll("text")].some((el) =>
        (el.textContent || "").includes("پرونده"),
      )
    ) {
      err.push("Retired folio visible");
    }

    const cover = !!document.querySelector("[data-question-cover]");
    if (cover !== (f < openingEnd)) {
      err.push("Wrong opener span at frame " + f);
    }
    if (cover) {
      if (!!document.querySelector('[data-cover-role="eyebrow"]') !== (f < A(0))) {
        err.push("Eyebrow collides with opening captions");
      }
    }

    // Check TechMatrixBackdrop z-order & isolation (M024)
    const stageSvg = document.querySelector<SVGSVGElement>("[data-stage-svg]");
    const backdropSvg = document.querySelector<SVGSVGElement>("[data-backdrop-svg]");
    if (!cover) {
      if (stageSvg && stageSvg.querySelector("[data-tech-backdrop]")) {
        err.push("TechMatrixBackdrop placed inside stage SVG instead of backdrop layer");
      }
      if (
        backdropSvg &&
        stageSvg &&
        !(
          backdropSvg.compareDocumentPosition(stageSvg) &
          Node.DOCUMENT_POSITION_FOLLOWING
        )
      ) {
        err.push("TechMatrixBackdrop is not strictly underneath stage SVG");
      }
    }

    let labels = 0;
    const weights = new Set<number>();
    const boxes: TextBox[] = [];

    for (const el of document.querySelectorAll<SVGTextElement>(
      "text[data-box], text[data-cover-role]",
    )) {
      if (el.getAttribute("visibility") === "hidden") continue;
      if (effectiveOpacity(el) < 0.08) continue;

      const s = el.textContent || "";
      const isCoverRole = el.hasAttribute("data-cover-role");
      const x = Number(el.getAttribute("x"));
      const y = Number(el.getAttribute("y"));
      const n = Number(el.getAttribute("font-size"));
      const k = Number(el.getAttribute("font-weight"));
      weights.add(k);

      const m = metric(s, n, k);
      const bb: [number, number, number, number] = [
        x - m.l,
        y - m.a,
        x + m.r,
        y + m.d,
      ];

      if (!isCoverRole && el.dataset.box) {
        const box = el.dataset.box.split(",").map(Number);
        if (
          bb[0] < box[0] - 1.5 ||
          bb[1] < box[1] - 1.5 ||
          bb[2] > box[2] + 1.5 ||
          bb[3] > box[3] + 1.5
        ) {
          err.push("local ink overflow: " + s);
        }
      }

      const isCap = el.hasAttribute("data-cap");
      if (isCap) {
        caps.push(Number(el.getAttribute("data-cap")));
      } else if (!isCoverRole) {
        labels++;
      }

      const root = el.ownerSVGElement;
      const ctm = el.getScreenCTM();
      const outer = root?.getScreenCTM();
      if (!ctm || !outer) continue;
      const matrix = outer.inverse().multiply(ctm);
      const pts = [
        [bb[0], bb[1]],
        [bb[2], bb[1]],
        [bb[0], bb[3]],
        [bb[2], bb[3]],
      ].map(([a, b]) => new DOMPoint(a, b).matrixTransform(matrix));

      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);

      if (!isCap && !isCoverRole) {
        const maxW = root?.hasAttribute("data-question-cover") ? 1081 : 889;
        const maxH = root?.hasAttribute("data-question-cover") ? 1921 : 1025;
        if (minX < -1 || minY < -1 || maxX > maxW || maxY > maxH) {
          err.push("outside stage: " + s);
        }
      }

      // Convert to global 1080x1920 coordinates for cross-layer overlap checks
      let gx0 = minX;
      let gy0 = minY;
      let gx1 = maxX;
      let gy1 = maxY;
      if (root === stageSvg) {
        const [sx0, sy0] = [64, 280];
        gx0 += sx0;
        gy0 += sy0;
        gx1 += sx0;
        gy1 += sy0;
      }

      if (!isCap && !isCoverRole) {
        const [sigW, sigH] = overlapArea([gx0, gy0, gx1, gy1], [351, 276, 729, 358.5]);
        if (sigW > 6 && sigH > 4) {
          err.push("stage text overlaps CreatorSignature: " + s);
        }
        const [capW, capH] = overlapArea([gx0, gy0, gx1, gy1], [80, 1320, 936, 1440]);
        if (capW > 6 && capH > 4) {
          err.push("stage text overlaps bottom captions: " + s);
        }
      }

      boxes.push({
        s,
        rect: [gx0, gy0, gx1, gy1],
        isCap,
        wipeGroup: getWipeGroup(el),
      });
    }

    // Text-to-text overlap detection (M023)
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        if (a.isCap && b.isCap) continue;
        if (
          (a.wipeGroup === "old" && b.wipeGroup === "new") ||
          (a.wipeGroup === "new" && b.wipeGroup === "old")
        ) {
          continue;
        }
        const [ow, oh] = overlapArea(a.rect, b.rect);
        if (ow > 8 && oh > 6) {
          err.push(`text overlap: "${a.s}" <-> "${b.s}"`);
        }
      }
    }

    // Empty / background-only stage detection (M024)
    let visibleStagePrimitives = 0;
    if (!cover && stageSvg && paperRect && paperRect.width > 0 && paperRect.height > 0) {
      const shapes = stageSvg.querySelectorAll(
        "rect, circle, path, ellipse, polygon, text",
      );
      for (const el of shapes) {
        if (insideDefsOrClip(el)) continue;
        if (el.closest("[data-head]") || el.closest("[data-tech-backdrop]")) continue;
        if (el.getAttribute("visibility") === "hidden") continue;
        if (effectiveOpacity(el) < 0.1) continue;
        const r = el.getBoundingClientRect();
        const lw = (r.width * 1080) / paperRect.width;
        const lh = (r.height * 1920) / paperRect.height;
        if (lw >= 14 && lh >= 14) {
          visibleStagePrimitives++;
        }
      }
      if (visibleStagePrimitives === 0) {
        err.push("empty stage (background-only frame) at frame " + f);
      }
    }

    const fonts = [700, 800, 900].every((k) =>
      [...document.fonts].some(
        (g) =>
          g.family === "Doran" &&
          g.weight === String(k) &&
          g.status === "loaded",
      ),
    );

    console.log(
      "TYPECHECK " +
        JSON.stringify({
          frame: f,
          bbox,
          cover,
          labels,
          caps,
          visibleStagePrimitives,
          weights: [...weights],
          fonts,
          err,
        }),
    );
  }, [f]);

  return null;
}
