import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  registerRoot,
  staticFile,
  useCurrentFrame,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";
import {
  A,
  C,
  design,
  words,
  meta,
  range,
  metric,
  clamp,
  e,
  lin,
  Defs,
  Folio,
} from "./core";
import { Audit } from "./audit";
import { Wallet, Trolley, Salary } from "./begin";
import { Edition, Keep, Workshop } from "./build";
import { Week, Readers, Archive } from "./publish";
import { Service, Property, Follow } from "./convert";
import { NewsDefs } from "./objects";
import { textDir } from "./core";
import phrases from "../data/phrases.json";
let fontPromise: Promise<unknown> | undefined;
function getFonts() {
  return (fontPromise ??= Promise.all(
    (
      [
        ["Bold", 700],
        ["ExtraBold", 800],
        ["Black", 900],
      ] as const
    ).map(async ([name, weight]) => {
      const f = new FontFace(
        "Doran",
        `url("${staticFile(`DoranFaNum-${name}.woff2`)}")`,
        { weight: String(weight), style: "normal" },
      );
      await f.load();
      document.fonts.add(f);
      return f;
    }),
  ));
}
const H = new Set([
  1, 2, 5, 9, 10, 12, 23, 25, 28, 29, 33, 37, 38, 43, 44, 48, 49, 51, 52, 54,
  55, 58, 62, 64, 67, 69, 71, 74, 78, 80, 82, 84, 85, 89, 90, 91, 92, 98, 102,
  103, 106, 111, 114, 117, 120, 122, 128, 129, 131, 133, 136, 137, 140, 144,
  147, 148, 153, 154, 159, 163, 165, 168, 169, 170,
]);
const scenes = [
  Wallet,
  Trolley,
  Salary,
  Edition,
  Keep,
  Workshop,
  Week,
  Readers,
  Archive,
  Service,
  Property,
  Follow,
];
function Captions({ f }: { f: number }) {
  const p = phrases.find((p) => f >= p.fromFrame && f < p.toFrame);
  if (!p) return null;
  const row = words.slice(p.first, p.last + 1),
    b = design.safe_zones.bottom_caption_rect_px;
  let n = design.typography.caption_size_px;
  let ms = row.map((w) => metric(w.text, n, 700));
  let space = metric(" ", n, 700).w;
  let width = ms.reduce((s, m) => s + m.w, 0) + space * (ms.length - 1);
  while (width > b[2] - b[0] - 16 && n > design.typography.caption_min_px) {
    n--;
    ms = row.map((w) => metric(w.text, n, 700));
    space = metric(" ", n, 700).w;
    width = ms.reduce((s, m) => s + m.w, 0) + space * (ms.length - 1);
  }
  const up = Math.max(...ms.map((q) => q.a)),
    down = Math.max(...ms.map((q) => q.d));
  const baseline = (b[1] + b[3] + up - down) / 2;
  let cursor = (b[0] + b[2] + width) / 2;
  return (
    <g data-captions="true">
      {row.map((word, i) => {
        const x = cursor - ms[i].w / 2;
        cursor -= ms[i].w + space;
        return (
          <text
            key={word.i}
            data-cap={word.i}
            data-box={b.join(",")}
            x={x}
            y={baseline}
            direction={textDir(word.text)}
            textAnchor="middle"
            fontFamily="Doran"
            fontSize={n}
            fontWeight="700"
            fill={H.has(word.i) ? C.primary : C.ink}
            visibility={f < A(word.i) ? "hidden" : "visible"}
          >
            {word.text}
          </text>
        );
      })}
    </g>
  );
}
function Picture({ f }: { f: number }) {
  const idx = meta.shots.reduce((a, s, i) => (s.frame <= f ? i : a), 0),
    cut = meta.shots[idx].frame;
  const now = scenes[idx],
    prev = scenes[Math.max(0, idx - 1)];
  const wipe = [1, 3, 4, 6, 9, 11].includes(idx) && f < cut + 10;
  const d = e(f, cut - 1, 11),
    edge = 888 * (1 - d);
  const scene = React.createElement(now, { f });
  let [x0, y0, x1, y1] = design.safe_zones.stage_clip_rect_px;
  return (
    <>
      <Img
        src={staticFile("background.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 370,
          width: 890,
          height: 900,
          background:
            "radial-gradient(ellipse at center,rgba(168,142,75,.046),transparent 68%)",
        }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={x1 - x0}
        height={y1 - y0}
        viewBox="0 0 888 1024"
        style={{
          position: "absolute",
          left: x0,
          top: y0,
          overflow: "hidden",
          fontSynthesis: "none",
        }}
      >
        <Defs />
        <NewsDefs />
        {wipe ? (
          <>
            <defs>
              <clipPath id="oldShot">
                <rect x="0" y="111" width={edge} height="910" />
              </clipPath>
              <clipPath id="newShot">
                <rect x={edge} y="111" width={888 - edge} height="910" />
              </clipPath>
            </defs>
            <g clipPath="url(#oldShot)">
              <g transform={`translate(${-19 * d} 0)`}>
                {React.createElement(prev, { f: cut - 1 })}
              </g>
            </g>
            <g clipPath="url(#newShot)">{scene}</g>
            <path
              d={`M${edge} 120v849`}
              stroke="#E1D3AE"
              opacity={Math.sin(Math.PI * d) * 0.85}
              strokeWidth="4"
            />
          </>
        ) : (
          scene
        )}
        <Folio idx={idx} />
      </svg>
      <Img
        src={staticFile("pixel-mark.png")}
        style={{
          position: "absolute",
          width: 64.8,
          height: 50.4,
          left: 922 - 32.4,
          top: 1278 - 25.2,
        }}
      />
      <svg
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          inset: 0,
          fontSynthesis: "none",
          pointerEvents: "none",
        }}
      >
        <Captions f={f} />
      </svg>
    </>
  );
}
export function MediaAtelier({ audit = false }: { audit?: boolean }) {
  const f = useCurrentFrame();
  const [ready, setReady] = useState(false);
  const [handle] = useState(() =>
    delayRender("Load the three supplied Doran font faces"),
  );
  useEffect(() => {
    getFonts().then(() => setReady(true), cancelRender);
  }, []);
  useLayoutEffect(() => {
    if (ready) continueRender(handle);
  }, [ready, handle]);
  return (
    <AbsoluteFill style={{ backgroundColor: design.brand.paper }}>
      {ready && (
        <>
          <Picture f={f} />
          {audit && <Audit f={f} />}
        </>
      )}
      <Audio src={staticFile("narration.mp3")} volume={meta.voiceGain} />
      <Audio src={staticFile("element-sfx.wav")} volume={meta.elementGain} />
    </AbsoluteFill>
  );
}
function Root() {
  return (
    <Composition
      id="WarmupFour"
      component={MediaAtelier}
      defaultProps={{ audit: false }}
      durationInFrames={meta.durationInFrames}
      fps={meta.fps}
      width={meta.width}
      height={meta.height}
    />
  );
}
registerRoot(Root);
