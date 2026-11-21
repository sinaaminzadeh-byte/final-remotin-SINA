import { bundle } from "@remotion/bundler";
import {
  ensureBrowser,
  openBrowser,
  selectComposition,
  renderStill,
  renderMedia,
} from "@remotion/renderer";
import { renderSlots } from "./slots.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const R = process.cwd();
const meta = JSON.parse(fs.readFileSync(path.join(R, "data/meta.json"), "utf8"));
const qa = path.join(R, "qa");
const proofsDir = path.join(R, "qa", "proofs");
fs.mkdirSync(qa, { recursive: true });
fs.mkdirSync(proofsDir, { recursive: true });

const sh = (b) => crypto.createHash("sha256").update(b).digest("hex");
const write = (p, x) => fs.writeFileSync(p, JSON.stringify(x, null, 2) + "\n");

const wordsData = JSON.parse(fs.readFileSync(path.join(R, "data/words.json"), "utf8"));
const expectedWords = wordsData.length;

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "flywheel-effect-"));
const limits = renderSlots();
console.log("Native scale 4/3 (1440x2560 @ 60fps); workers:", limits.workers);

let browser;
try {
  const p = await ensureBrowser();
  if (
    !("path" in p) ||
    execFileSync("ldd", [p.path], { encoding: "utf8" }).includes("not found")
  ) {
    throw new Error("Missing Chrome or shared libraries (see M011)");
  }

  const opts = {
    gl: null,
    flags: {
      "disable-partial-raster": true,
      "disable-zero-copy": true,
      "disable-gpu": true,
      "disable-gpu-rasterization": true,
      "disable-skia-runtime-opts": true,
      "num-raster-threads": "1",
    },
  };

  const serveUrl = await bundle({
    entryPoint: path.join(R, "src/index.tsx"),
    outDir: path.join(temp, "bundle"),
    publicDir: path.join(R, "public"),
  });

  browser = await openBrowser("chrome", {
    browserExecutable: p.path,
    forceDeviceScaleFactor: 4 / 3,
    chromiumOptions: opts,
  });

  const comp = await selectComposition({
    serveUrl,
    id: meta.compositionId,
    inputProps: { audit: true },
    puppeteerInstance: browser,
  });

  if (
    comp.fps !== meta.fps ||
    comp.durationInFrames !== meta.durationInFrames ||
    comp.width !== 1080 ||
    comp.height !== 1920
  ) {
    throw new Error("Clock or canvas mismatch");
  }

  const audits = new Map();
  const onBrowserLog = (msg) => {
    const i = msg.text.indexOf("TYPECHECK ");
    if (i >= 0) {
      const j = JSON.parse(msg.text.slice(i + 10));
      audits.set(j.frame, j);
      if (j.err.length) console.error("Audit issue @ frame", j.frame, j.err);
    }
  };

  const common = {
    serveUrl,
    composition: comp,
    puppeteerInstance: browser,
    chromiumOptions: opts,
    scale: 4 / 3,
    timeoutInMilliseconds: 90000,
    inputProps: { audit: true },
    onBrowserLog,
  };

  if (process.argv.includes("--proofs")) {
    // Keyframes spanning cover + every single scene + sub-phase + CTA
    const frames = [
      0, 20, 75, 135, 225, 340, 485, 560, 685, 765, 895, 1020, 1140, 1300,
      1370, 1450, 1560, 1650, 1780, 1980, 2140, 2340,
    ];
    for (const frame of frames) {
      const { buffer } = await renderStill({
        ...common,
        frame,
        imageFormat: "png",
      });
      fs.writeFileSync(path.join(proofsDir, `frame-${String(frame).padStart(4, "0")}.png`), buffer);
      if (frame === 0) {
        fs.writeFileSync(path.join(R, "cover-2k.png"), buffer);
      }
      console.log("Proof still rendered:", frame);
    }

    // Forward/reverse determinism pair check (M013)
    const twice = [0, 135, 485, 895, 1370, 2340];
    const checks = {};
    let allIdentical = true;
    for (const frame of [...twice].reverse()) {
      const { buffer } = await renderStill({
        ...common,
        frame,
        imageFormat: "png",
      });
      const old = fs.readFileSync(
        path.join(proofsDir, `frame-${String(frame).padStart(4, "0")}.png`),
      );
      const h1 = sh(old);
      const h2 = sh(buffer);
      checks[frame] = [h1, h2, h1 === h2];
      if (h1 !== h2) allIdentical = false;
    }
    write(path.join(qa, "source-determinism.json"), {
      frames: twice,
      hashes: checks,
      allIdentical,
    });

    const auditIssues = [...audits.values()].filter((a) => a.err.length > 0);
    write(path.join(qa, "proof-audit.json"), {
      checkedFrames: audits.size,
      issues: auditIssues,
    });
    if (auditIssues.length) {
      console.error("Proof audit issues:", JSON.stringify(auditIssues, null, 2));
      process.exitCode = 1;
    } else {
      console.log(
        `All ${frames.length} proof stills & determinism checks passed! (allIdentical=${allIdentical})`,
      );
    }
  } else {
    const silent = path.join(temp, "picture.mp4");
    const mux = path.join(temp, "final.mp4");
    const outFile = path.join(R, `${meta.slug}-2k.mp4`);
    let last = -1;

    // Also ensure standalone cover-2k.png is fresh
    const { buffer: coverBuf } = await renderStill({
      ...common,
      frame: 0,
      imageFormat: "png",
    });
    fs.writeFileSync(path.join(R, "cover-2k.png"), coverBuf);

    await renderMedia({
      ...common,
      outputLocation: silent,
      codec: "h264",
      pixelFormat: "yuv420p",
      colorSpace: "bt709",
      muted: true,
      imageFormat: "jpeg",
      jpegQuality: 96,
      crf: 17,
      x264Preset: "veryfast",
      concurrency: limits.workers,
      disallowParallelEncoding: true,
      onProgress: ({ progress, renderedFrames }) => {
        const pct = Math.floor(progress * 20);
        if (pct > last) {
          console.log(`Rendering 2K 60fps: ${pct * 5}% (${renderedFrames}/${meta.durationInFrames})`);
          last = pct;
        }
      },
    });

    const a = [...audits.values()].sort((x, y) => x.frame - y.frame);
    const wc = new Set(a.flatMap((i) => i.caps));
    const stats = {
      sampledFrames: a.length,
      distinctWords: wc.size,
      expectedWords,
      labels: a.reduce((t, v) => t + v.labels, 0),
      coverSamples: a.filter((v) => v.cover).map((v) => v.frame),
      allFonts: a.every((v) => v.fonts),
      stableBylineAtEverySample: a.every(
        (v) =>
          v.bbox.length === 4 &&
          v.bbox.every((n, i) => Math.abs(n - [351, 276, 378, 82.5][i]) <= 0.15),
      ),
      issues: a.filter((v) => v.err.length),
    };
    write(path.join(qa, "type-and-layout.json"), stats);

    await browser.close({ silent: true });
    browser = undefined;

    if (
      stats.sampledFrames < 240 ||
      wc.size !== expectedWords ||
      !stats.allFonts ||
      !stats.stableBylineAtEverySample ||
      stats.issues.length > 0
    ) {
      throw new Error(
        "Render bounds/word/overlay audit failed: " + JSON.stringify(stats, null, 2),
      );
    }

    const audioMaster = "/tmp/audio-master.m4a";
    if (!fs.existsSync(audioMaster)) {
      throw new Error("Missing /tmp/audio-master.m4a — run scripts/audio.py first");
    }

    execFileSync(
      "ffmpeg",
      [
        "-hide_banner",
        "-v",
        "error",
        "-nostdin",
        "-y",
        "-i",
        silent,
        "-i",
        audioMaster,
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-map_metadata",
        "-1",
        "-c",
        "copy",
        "-metadata",
        "title=اثر فلای‌ویل در تولید محتوا | سینا امین زاده",
        "-movflags",
        "+faststart",
        mux,
      ],
      { stdio: "inherit" },
    );
    fs.copyFileSync(mux, outFile);
    console.log("SUCCESS! Rendered & muxed:", outFile);
  }
} finally {
  if (browser) await browser.close({ silent: true });
  fs.rmSync(temp, { recursive: true, force: true });
}
