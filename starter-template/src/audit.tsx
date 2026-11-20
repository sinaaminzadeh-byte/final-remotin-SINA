import { useLayoutEffect } from "react";
import { A, metric, words, meta } from "./core";
import { openingEnd } from "./Opening";
import beats from "../semantic-beats.json";

const samples = new Set([
  0,
  meta.durationInFrames - 1,
  ...words.flatMap((_, i) => [A(i), A(i) + 2]),
  ...beats.flatMap((b) => [
    Math.max(0, b.frame - 1),
    Math.min(meta.durationInFrames - 1, b.frame + 8),
    Math.floor((b.frame + b.endFrame) / 2),
  ]),
]);

// Non-drawing, opt-in probe verifying real Doran ink bounds, static CreatorSignature,
// QuestionCover span, loaded font weights, and zero stage overflow (M007/M009/M017).
export function Audit({ f }: { f: number }) {
  useLayoutEffect(() => {
    if (!samples.has(f)) return;
    const err: string[] = [];
    const caps: number[] = [];

    const badges = document.querySelectorAll<HTMLElement>(
      "[data-creator-signature]",
    );
    const paper = document.querySelector<HTMLElement>("[data-film-root]");
    let bbox: number[] = [];
    if (badges.length !== 1 || !paper) {
      err.push("Byline missing or duplicated");
    } else {
      const r = paper.getBoundingClientRect();
      const k = badges[0].getBoundingClientRect();
      bbox = [
        ((k.left - r.left) * 1080) / r.width,
        ((k.top - r.top) * 1920) / r.height,
        (k.width * 1080) / r.width,
        (k.height * 1920) / r.height,
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

    let labels = 0;
    const weights = new Set<number>();

    for (const el of document.querySelectorAll<SVGTextElement>(
      "text[data-box]",
    )) {
      if (el.getAttribute("visibility") === "hidden") continue;
      let active = true;
      for (
        let p: Element | null = el;
        p && p.tagName !== "svg";
        p = p.parentElement
      ) {
        if (
          p.getAttribute("opacity") !== null &&
          Number(p.getAttribute("opacity")) < 0.04
        ) {
          active = false;
          break;
        }
      }
      if (!active) continue;

      const s = el.textContent || "";
      const x = Number(el.getAttribute("x"));
      const y = Number(el.getAttribute("y"));
      const n = Number(el.getAttribute("font-size"));
      const k = Number(el.getAttribute("font-weight"));
      weights.add(k);

      const m = metric(s, n, k);
      const bb = [x - m.l, y - m.a, x + m.r, y + m.d];
      const box = el.dataset.box!.split(",").map(Number);

      if (
        bb[0] < box[0] - 1.5 ||
        bb[1] < box[1] - 1.5 ||
        bb[2] > box[2] + 1.5 ||
        bb[3] > box[3] + 1.5
      ) {
        err.push("local ink overflow: " + s);
      }

      if (el.hasAttribute("data-cap")) {
        caps.push(Number(el.getAttribute("data-cap")));
      } else {
        labels++;
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
        const maxW = root?.hasAttribute("data-question-cover") ? 1081 : 889;
        const maxH = root?.hasAttribute("data-question-cover") ? 1921 : 1025;
        if (
          pts.some((pt) => pt.x < -1 || pt.y < -1 || pt.x > maxW || pt.y > maxH)
        ) {
          err.push("outside stage: " + s);
        }
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
          weights: [...weights],
          fonts,
          err,
        }),
    );
  }, [f]);

  return null;
}
