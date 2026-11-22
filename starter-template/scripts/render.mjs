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
const wordsData = JSON.parse(fs.readFileSync(path.join(R, "data/words.json"), "utf8"));
const expectedWords = wordsData.length;
const qa = path.join(R, "qa");
const proofsDir = path.join(R, "qa", "proofs");
fs.mkdirSync(qa, { recursive: true });
fs.mkdirSync(proofsDir, { recursive: true });

const sh = (b) => crypto.createHash("sha256").update(b).digest("hex");
const write = (p, x) => fs.writeFileSync(p, JSON.stringify(x, null, 2) + "\n");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), `${meta.slug}-`));
const limits = renderSlots();
const scale = meta.scale ?? 1;
console.log(
  `Standard render scale ${scale} (${1080 * scale}x${1920 * scale} @ ${meta.fps}fps); workers:`,
  limits.workers,
);

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
    forceDeviceScaleFactor: scale,
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
    scale,
    timeoutInMilliseconds: 90000,
    inputProps: { audit: true },
    onBrowserLog,
  };

  if (process.argv.includes("--proofs")) {
    // Evenly sample cover + key scene frames
    const frames = [0];
    for (const s of meta.shots ?? []) {
      frames.push(Math.min(meta.durationInFrames - 1, s.frame + 12));
    }
    frames.push(Math.max(0, meta.durationInFrames - 15));
    const uniqueFrames = [...new Set(frames)].sort((a, b) => a - b);

    for (const frame of uniqueFrames) {
      const { buffer } = await renderStill({
        ...common,
        frame,
        imageFormat: "png",
      });
      fs.writeFileSync(
        path.join(proofsDir, `frame-${String(frame).padStart(4, "0")}.png`),
        buffer,
      );
      if (frame === 0) {
        fs.writeFileSync(path.join(R, "cover.png"), buffer);
      }
      console.log("Proof still rendered:", frame);
    }

    const twice = uniqueFrames.slice(0, Math.min(6, uniqueFrames.length));
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
        `All ${uniqueFrames.length} proof stills & determinism checks passed! (allIdentical=${allIdentical})`,
      );
    }
  } else {
    const rawOut = path.join(temp, "remotion-out.mp4");
    const outFile = path.join(R, `${meta.slug}.mp4`);
    let last = -1;

    // Ensure standalone cover.png at frame 0 is fresh
    const { buffer: coverBuf } = await renderStill({
      ...common,
      frame: 0,
      imageFormat: "png",
    });
    fs.writeFileSync(path.join(R, "cover.png"), coverBuf);

    // Standard Remotion renderMedia: mixes <Audio> (narration 1.0 + element-sfx 0.30) natively
    await renderMedia({
      ...common,
      outputLocation: rawOut,
      codec: "h264",
      pixelFormat: "yuv420p",
      colorSpace: "bt709",
      audioCodec: "aac",
      audioBitrate: "192k",
      muted: false,
      imageFormat: "jpeg",
      jpegQuality: 96,
      crf: 17,
      x264Preset: "veryfast",
      concurrency: limits.workers,
      disallowParallelEncoding: true,
      onProgress: ({ progress, renderedFrames }) => {
        const pct = Math.floor(progress * 20);
        if (pct > last) {
          console.log(
            `Rendering ${1080 * scale}x${1920 * scale} @ ${meta.fps}fps: ${pct * 5}% (${renderedFrames}/${meta.durationInFrames})`,
          );
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
      stats.sampledFrames < 120 ||
      wc.size !== expectedWords ||
      !stats.allFonts ||
      !stats.stableBylineAtEverySample ||
      stats.issues.length > 0
    ) {
      throw new Error(
        "Render bounds/word/overlay audit failed: " + JSON.stringify(stats, null, 2),
      );
    }

    // Apply faststart flag cleanly for Instagram/web streaming
    execFileSync(
      "ffmpeg",
      [
        "-hide_banner",
        "-v",
        "error",
        "-nostdin",
        "-y",
        "-i",
        rawOut,
        "-c",
        "copy",
        "-movflags",
        "+faststart",
        outFile,
      ],
      { stdio: "inherit" },
    );
    console.log("SUCCESS! Rendered standard Remotion MP4:", outFile);
  }
} finally {
  if (browser) await browser.close({ silent: true });
  fs.rmSync(temp, { recursive: true, force: true });
}
