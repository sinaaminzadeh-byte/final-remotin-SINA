import { useLayoutEffect } from "react";
import { A, design, metric, words, meta } from "./core";
import beats from "../semantic-beats.json";
const samples = new Set([
  0,
  meta.durationInFrames - 1,
  ...words.flatMap((_, i) => [A(i), A(i) + 2]),
  ...beats.flatMap((b) => [
    b.frame - 1,
    b.frame + 8,
    Math.floor((b.frame + b.endFrame) / 2),
  ]),
]);
// A non-drawing, opt-in probe. Use actual font ink, not line-height or SVG em boxes.
export function Audit({ f }: { f: number }) {
  useLayoutEffect(() => {
    if (!samples.has(f)) return;
    const err: string[] = [],
      caps: number[] = [];
    if (f >= A(56) && f < A(61) && document.querySelector("[data-blueprint]"))
      err.push("draft remained over built kiosk");
    if (f >= A(131) && f < A(139) && document.querySelector("[data-stock]"))
      err.push("old inventory over service demo");
    if (f < A(169) - 4 && document.querySelector("[data-course]"))
      err.push("course appears before its spoken cue");
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
          Number(p.getAttribute("opacity")) < 0.03
        ) {
          active = false;
          break;
        }
      }
      if (!active) continue;
      const s = el.textContent || "",
        x = Number(el.getAttribute("x")),
        y = Number(el.getAttribute("y")),
        n = Number(el.getAttribute("font-size")),
        k = Number(el.getAttribute("font-weight"));
      weights.add(k);
      const m = metric(s, n, k),
        bb = [x - m.l, y - m.a, x + m.r, y + m.d],
        box = el.dataset.box!.split(",").map(Number);
      if (
        bb[0] < box[0] - 1 ||
        bb[1] < box[1] - 1 ||
        bb[2] > box[2] + 1 ||
        bb[3] > box[3] + 1
      )
        err.push("local ink: " + s);
      if (el.hasAttribute("data-cap"))
        caps.push(Number(el.getAttribute("data-cap")));
      else {
        labels++;
        const root = el.ownerSVGElement,
          ctm = el.getScreenCTM(),
          outer = root?.getScreenCTM();
        if (!ctm || !outer) continue;
        const matrix = outer.inverse().multiply(ctm);
        const pts = [
          [bb[0], bb[1]],
          [bb[2], bb[1]],
          [bb[0], bb[3]],
          [bb[2], bb[3]],
        ].map(([a, b]) => new DOMPoint(a, b).matrixTransform(matrix));
        if (
          pts.some(
            (p) => p.x < -0.9 || p.y < -0.9 || p.x > 888.9 || p.y > 1024.9,
          )
        )
          err.push("outside stage: " + s);
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
