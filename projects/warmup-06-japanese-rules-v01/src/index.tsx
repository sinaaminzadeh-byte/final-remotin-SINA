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
  metric,
  e,
  Defs,
  textDir,
} from "./core";
import { CraftDefs } from "./objects";
import { CreatorSignature } from "./creator-brand/CreatorSignature";
import { prepareCoverAssets } from "./creator-brand/QuestionCover";
import { Opening, openingEnd } from "./Opening";
import { Audit } from "./audit";
import { LaunchPage, WabiSabiIntro, OscarVsUpload } from "./scenes1";
import { KaizenIntro, TwentyMinAI, IkigaiCompass } from "./scenes2";
import {
  DelegateToAI,
  GambaruSystem,
  AutoPipeline,
  SamuraiCTA,
} from "./scenes3";
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

// Highlighted keywords in brand primary sapphire (#146EF5)
const H = new Set([
  0, 2, 8, 9, 13, 16, 17, 19, 20, 26, 28, 29, 30, 32, 35, 36, 39, 43, 45, 47,
  51, 57, 58, 60, 61, 68, 69, 74, 75, 77, 88, 93, 100, 102, 106, 107, 111, 112,
  113, 119, 123, 125, 128, 132, 137, 138, 146, 147, 153,
]);

const scenes = [
  LaunchPage,
  WabiSabiIntro,
  OscarVsUpload,
  KaizenIntro,
  TwentyMinAI,
  IkigaiCompass,
  DelegateToAI,
  GambaruSystem,
  AutoPipeline,
  SamuraiCTA,
];

function Captions({ f, opening = false }: { f: number; opening?: boolean }) {
  const p = phrases.find((p) => f >= p.fromFrame && f < p.toFrame);
  if (!p) return null;
  const row = words.slice(p.first, p.last + 1);
  const b = opening
    ? [108, 448, 908, 528]
    : design.safe_zones.bottom_caption_rect_px;
  let n = opening ? 47 : design.typography.caption_size_px;
  let ms = row.map((w) => metric(w.text, n, 700));
  let space = metric(" ", n, 700).w;
  let width = ms.reduce((s, m) => s + m.w, 0) + space * (ms.length - 1);
  while (width > b[2] - b[0] - 16 && n > design.typography.caption_min_px) {
    n--;
    ms = row.map((w) => metric(w.text, n, 700));
    space = metric(" ", n, 700).w;
    width = ms.reduce((s, m) => s + m.w, 0) + space * (ms.length - 1);
  }
  const up = Math.max(...ms.map((q) => q.a));
  const down = Math.max(...ms.map((q) => q.d));
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
  const idx = meta.shots.reduce((a, s, i) => (s.frame <= f ? i : a), 0);
  const shot = meta.shots[idx];
  const cut = shot.frame;
  const now = scenes[idx];
  const prev = scenes[Math.max(0, idx - 1)];
  const wipe = shot.wipe && f < cut + 10;
  const d = e(f, cut - 1, 11);
  const edge = 888 * (1 - d);
  const scene = React.createElement(now, { f });
  const [x0, y0, x1, y1] = design.safe_zones.stage_clip_rect_px;

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
            "radial-gradient(ellipse at center,rgba(168,142,75,.048),transparent 68%)",
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
        <CraftDefs />
        {wipe ? (
          <>
            <defs>
              <clipPath id="oldShot">
                <rect x="0" y="96" width={edge} height="924" />
              </clipPath>
              <clipPath id="newShot">
                <rect x={edge} y="96" width={888 - edge} height="924" />
              </clipPath>
            </defs>
            <g clipPath="url(#oldShot)">
              <g transform={`translate(${-19 * d} 0)`}>
                {React.createElement(prev, { f: cut - 1 })}
              </g>
            </g>
            <g clipPath="url(#newShot)">{scene}</g>
            <path
              d={`M${edge} 112v860`}
              stroke="#E1D3AE"
              opacity={Math.sin(Math.PI * d) * 0.85}
              strokeWidth="4"
            />
          </>
        ) : (
          scene
        )}
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

export function JapaneseRulesFilm({ audit = false }: { audit?: boolean }) {
  const f = useCurrentFrame();
  const [ready, setReady] = useState(false);
  const [handle] = useState(() =>
    delayRender("Load Doran FaNum faces and brand kit assets"),
  );

  useEffect(() => {
    getFonts().then(prepareCoverAssets).then(() => setReady(true), cancelRender);
  }, []);

  useLayoutEffect(() => {
    if (ready) continueRender(handle);
  }, [ready, handle]);

  return (
    <AbsoluteFill
      data-film-root="true"
      style={{ backgroundColor: design.brand.paper }}
    >
      {ready && (
        <>
          {f < openingEnd ? (
            <>
              <Opening f={f} />
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
                <Captions f={f} opening />
              </svg>
            </>
          ) : (
            <Picture f={f} />
          )}
          <CreatorSignature />
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
      id={meta.compositionId}
      component={JapaneseRulesFilm}
      defaultProps={{ audit: false }}
      durationInFrames={meta.durationInFrames}
      fps={meta.fps}
      width={meta.width}
      height={meta.height}
    />
  );
}

registerRoot(Root);
