// Remotion 4.0.543 uses min(nproc, node.availableParallelism) on Linux.
// Ask the pinned renderer itself: a parent OpenMP setting can change nproc.
import { RenderInternals } from "@remotion/renderer";
export function renderSlots(pref = process.env.RENDER_JOBS ?? "2") {
  const cap = RenderInternals.resolveConcurrency("100%");
  const requested = Number(pref);
  if (!Number.isInteger(requested) || requested < 1)
    throw new Error("RENDER_JOBS must be a positive integer");
  const workers = RenderInternals.resolveConcurrency(Math.min(cap, requested));
  return { requested, rendererLimit: cap, workers };
}
