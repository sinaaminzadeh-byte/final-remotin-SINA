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

  const isProofs = process.argv.includes("--proofs");
  const comp = await selectComposition({
    serveUrl,
    id: meta.compositionId ?? meta.slug,
    inputProps: { audit: true, auditAll: isProofs },
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
    inputProps: { audit: true, auditAll: isProofs },
    onBrowserLog,
  };

  if (isProofs) {
    const proofCommon = common;
    // Sample cover + 4 sub-phases of EVERY shot (entry, early-mid, climax, pre-exit) + end frame (M023/M024)
    const maxF = Math.max(0, meta.durationInFrames - 1);
    const shots = Array.isArray(meta.shots) ? meta.shots : [];
    const frames = [0];
    if (shots.length > 0 && shots[0].frame > 24) {
      frames.push(Math.floor(shots[0].frame / 2));
    }
    if (shots.length > 0) {
      for (let i = 0; i < shots.length; i++) {
        const s0 = shots[i].frame;
        const s1 = shots[i + 1]?.frame ?? maxF;
        const span = Math.max(12, s1 - s0);
        frames.push(
          Math.min(maxF, s0 + 3),
          Math.min(maxF, Math.round(s0 + span * 0.3)),
          Math.min(maxF, Math.round(s0 + span * 0.62)),
          Math.min(maxF, Math.max(s0 + 6, s1 - 6)),
        );
      }
    } else {
      for (let i = 1; i <= 15; i++) {
        frames.push(Math.min(maxF, Math.round((maxF * i) / 16)));
      }
    }
    frames.push(Math.max(0, maxF - 2));
    const uniqueFrames = [...new Set(frames)].sort((a, b) => a - b);

    for (const frame of uniqueFrames) {
      const { buffer } = await renderStill({
        ...proofCommon,
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

    // Build qa/proof-sheet.jpg contact sheet automatically so every shot sub-phase is visually inspectable
    execFileSync(
      "python3",
      [
        "-c",
        `
from pathlib import Path
from PIL import Image, ImageDraw
import math
proofs = sorted(Path(${JSON.stringify(proofsDir)}).glob("frame-*.png"))
fps = ${Number(meta.fps || 60)}
cols = 6
cell_w, cell_h, pad, label_h = 200, 356, 8, 22
rows = math.ceil(len(proofs) / cols)
sheet = Image.new("RGB", (cols * (cell_w + pad) + pad, rows * (cell_h + label_h + pad) + pad), "#EAE5D9")
draw = ImageDraw.Draw(sheet)
for idx, p in enumerate(proofs):
    r, c = divmod(idx, cols)
    x = pad + c * (cell_w + pad)
    y = pad + r * (cell_h + label_h + pad)
    with Image.open(p) as im:
        sheet.paste(im.convert("RGB").resize((cell_w, cell_h), Image.Resampling.LANCZOS), (x, y))
    fnum = int(p.stem.split("-")[1])
    draw.text((x + 4, y + cell_h + 4), f"f={fnum} ({fnum/fps:.2f}s)", fill="#17263D")
sheet.save(${JSON.stringify(path.join(qa, "proof-sheet.jpg"))}, quality=90, optimize=True)
print("Saved proof sheet:", len(proofs), "frames")
`,
      ],
      { stdio: "inherit" },
    );

    const step = Math.max(1, Math.floor(uniqueFrames.length / 6));
    const twice = uniqueFrames.filter((_, idx) => idx % step === 0).slice(0, 6);
    const checks = {};
    let allIdentical = true;
    for (const frame of [...twice].reverse()) {
      const { buffer } = await renderStill({
        ...proofCommon,
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
      sampledProofFrames: uniqueFrames.length,
      issues: auditIssues,
    });
    if (audits.size < uniqueFrames.length) {
      console.error(`Audit missed frames: checked ${audits.size}/${uniqueFrames.length}`);
      process.exitCode = 1;
    } else if (auditIssues.length) {
      console.error("Proof audit issues:", JSON.stringify(auditIssues, null, 2));
      process.exitCode = 1;
    } else {
      console.log(
        `All ${uniqueFrames.length} multi-phase proof stills, qa/proof-sheet.jpg & determinism checks passed! (allIdentical=${allIdentical})`,
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
      emptyStageFrames: a.filter((v) => !v.cover && v.visibleStagePrimitives === 0).map((v) => v.frame),
    };
    write(path.join(qa, "type-and-layout.json"), stats);

    await browser.close({ silent: true });
    browser = undefined;

    const minSamples = Math.min(200, Math.max(120, expectedWords));
    if (
      stats.sampledFrames < minSamples ||
      wc.size !== expectedWords ||
      !stats.allFonts ||
      !stats.stableBylineAtEverySample ||
      stats.emptyStageFrames.length > 0 ||
      stats.issues.length > 0
    ) {
      throw new Error(
        "Render bounds/word/overlay/empty-stage audit failed: " + JSON.stringify(stats, null, 2),
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

    // Extract multi-phase review sheet directly from encoded MP4
    execFileSync(
      "python3",
      [
        "-c",
        `
from pathlib import Path
from PIL import Image, ImageDraw
import json, math, subprocess, tempfile
R = Path.cwd()
meta = json.loads((R / "data/meta.json").read_text(encoding="utf-8"))
fps = float(meta.get("fps", 60))
max_f = max(0, int(meta["durationInFrames"]) - 1)
shots = meta.get("shots") or []
frames = [0]
for i, s in enumerate(shots):
    s0 = int(s["frame"])
    s1 = int(shots[i + 1]["frame"]) if i + 1 < len(shots) else max_f
    frames.extend([min(max_f, s0 + 4), min(max_f, round((s0 + s1) / 2))])
frames.append(max(0, max_f - 2))
frames = sorted(set(frames))[:16]
expr = "+".join(f"eq(n,{k})" for k in frames)
with tempfile.TemporaryDirectory() as td:
    subprocess.check_call([
        "ffmpeg", "-nostdin", "-v", "error", "-i", str(${JSON.stringify(outFile)}),
        "-an", "-vf", f"select='{expr}'", "-fps_mode", "passthrough",
        "-frames:v", str(len(frames)), "-q:v", "2", f"{td}/f%03d.jpg"
    ])
    imgs = sorted(Path(td).glob("f*.jpg"))
    cols = 4
    cw, ch, pad, lh = 210, 373, 8, 22
    rows = math.ceil(len(imgs) / cols)
    sheet = Image.new("RGB", (cols * (cw + pad) + pad, rows * (ch + lh + pad) + pad), "#EAE5D9")
    draw = ImageDraw.Draw(sheet)
    for idx, (k, p) in enumerate(zip(frames, imgs)):
        r, c = divmod(idx, cols)
        x = pad + c * (cw + pad)
        y = pad + r * (ch + lh + pad)
        with Image.open(p) as im:
            sheet.paste(im.convert("RGB").resize((cw, ch), Image.Resampling.LANCZOS), (x, y))
        draw.text((x + 4, y + ch + 4), f"f={k} ({k/fps:.2f}s)", fill="#17263D")
    sheet.save(R / "qa/encoded-review.jpg", quality=90, optimize=True)
print("Saved qa/encoded-review.jpg from final MP4:", len(imgs), "frames")
`,
      ],
      { stdio: "inherit" },
    );

    console.log("SUCCESS! Rendered standard Remotion MP4:", outFile);
  }
} finally {
  if (browser) await browser.close({ silent: true });
  fs.rmSync(temp, { recursive: true, force: true });
}
