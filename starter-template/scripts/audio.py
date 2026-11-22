"""Synthesize warm tactile element SFX locally and create the continuous 48 kHz stereo PCM master mix.
Usage: python3 scripts/audio.py [--mix /tmp/audio-master.wav]
Narration is decoded gaplessly at unity (1.0x, no time stretch, no slicing at scene cuts).
"""

from pathlib import Path
import argparse, json, subprocess, hashlib, math
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

R = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser()
ap.add_argument("--mix", type=Path, default=None)
args = ap.parse_args()

m = json.loads((R / "data/meta.json").read_text(encoding="utf-8"))
beats = json.loads((R / "semantic-beats.json").read_text(encoding="utf-8"))
sr = 48000
fps = m["fps"]
N = round(m["durationInFrames"] * sr / fps)
bus = np.zeros((N, 2), dtype=np.float64)
ev = []


def fx(kind: str, i: int) -> np.ndarray:
    rng = np.random.default_rng(60417 + i * 13)
    d = {
        "cloth": 0.21,
        "clasp": 0.11,
        "metal": 0.19,
        "swish": 0.25,
        "slide": 0.19,
        "paper": 0.155,
        "fold": 0.21,
        "stamp": 0.16,
        "lock": 0.14,
        "done": 0.21,
        "bye": 0.24,
        "pop": 0.11,
        "switch": 0.095,
        "snip": 0.105,
        "tick": 0.08,
        "tap": 0.085,
    }[kind]
    t = np.arange(round(d * sr)) / sr

    def noise(low: float, high: float) -> np.ndarray:
        return sosfilt(
            butter(2, [low, high], btype="bandpass", fs=sr, output="sos"),
            rng.standard_normal(len(t)),
        )

    def env(a: float, b: float) -> np.ndarray:
        return (1 - np.exp(-t / a)) * np.exp(-t / b)

    def chirp(f: float, dec: float, tau: float) -> np.ndarray:
        return np.sin(2 * np.pi * (f * t + dec * tau * (1 - np.exp(-t / tau))))

    if kind == "metal":
        a = (
            np.sin(2 * np.pi * 876 * t)
            + 0.37 * np.sin(2 * np.pi * 1493 * t)
            + 0.22 * np.sin(2 * np.pi * 2198 * t)
        ) * env(0.0014, 0.032) + 0.08 * noise(570, 2900) * env(0.001, 0.01)
        peak = 0.14
    elif kind == "clasp":
        a = 0.53 * chirp(177, 190, 0.014) * env(0.001, 0.022) + 0.37 * noise(
            500, 2800
        ) * env(0.001, 0.012)
        i0 = round(0.036 * sr)
        a[i0:] += 0.31 * a[:-i0].copy()
        peak = 0.17
    elif kind in ["swish", "slide", "paper", "fold"]:
        e = np.sin(np.pi * t / d) ** (2 if kind == "swish" else 1.3)
        a = noise(290 if kind == "paper" else 115, 3200 if kind == "paper" else 1650) * e
        if kind in ["fold", "paper"]:
            a += (
                0.08
                * noise(700, 3300)
                * (
                    np.exp(-(((t - d * 0.63) / 0.015) ** 2))
                    + 0.65 * np.exp(-(((t - d * 0.79) / 0.011) ** 2))
                )
            )
        peak = {"swish": 0.135, "slide": 0.14, "paper": 0.15, "fold": 0.14}[kind]
    elif kind in ["stamp", "lock", "snip", "switch", "tap", "tick"]:
        base = {
            "stamp": 115,
            "lock": 240,
            "snip": 470,
            "switch": 360,
            "tap": 275,
            "tick": 490,
        }[kind]
        a = 0.6 * chirp(base, base * 0.9, 0.014) * env(0.002, 0.021) + 0.4 * noise(
            470, min(3800, base * 9)
        ) * env(0.0015, 0.012)
        if kind in ["lock", "switch", "snip"]:
            k = round(0.027 * sr)
            a[k:] += 0.40 * a[:-k].copy()
        peak = {
            "stamp": 0.21,
            "lock": 0.18,
            "snip": 0.16,
            "switch": 0.165,
            "tap": 0.15,
            "tick": 0.13,
        }[kind]
    else:
        freq = {"done": 528, "bye": 440, "pop": 260}[kind]
        a = (
            0.78 * chirp(freq, 180 if kind == "pop" else -48, 0.038)
            + 0.20 * np.sin(2 * np.pi * freq * 1.5 * t)
        ) * env(0.003, 0.042 if kind != "pop" else 0.024)
        peak = 0.15 if kind == "bye" else 0.18
    a *= np.minimum(1, np.maximum(0, (d - t) / 0.016))
    a = a / (np.max(np.abs(a)) + 1e-12) * peak
    return a


for i, b in enumerate(beats):
    a = fx(b["sfx"], i)
    end_on = b["sfx"] in ["swish", "slide"]
    off = round(len(a) * 0.50) if end_on else 0
    start = round(b["frame"] * sr / fps) - off
    lo = max(0, start)
    hi = min(N, start + len(a))
    p = [-0.18, 0.12, 0.02, -0.10, 0.15][i % 5]
    g = np.array([np.sqrt(1 - p), np.sqrt(1 + p)])
    bus[lo:hi] += a[lo - start : hi - start, None] * g
    ev.append(
        {
            "beat": b["index"],
            "word": b["anchorIndex"],
            "cueFrame": b["frame"],
            "type": b["sfx"],
            "firstSample": lo,
            "lastSampleExclusive": hi,
        }
    )

# Gentle stereo distribution across semantic beats; element-sfx.wav plays at 0.30 volume inside Remotion <Audio>
sf.write(R / "public/element-sfx.wav", bus, sr, subtype="PCM_16")
stem, _ = sf.read(R / "public/element-sfx.wav", always_2d=True)

vo = np.frombuffer(
    subprocess.check_output(
        [
            "ffmpeg",
            "-v",
            "error",
            "-i",
            str(R / "public/narration.mp3"),
            "-af",
            "aresample=48000:resampler=soxr:precision=28",
            "-ac",
            "1",
            "-f",
            "f32le",
            "-",
        ]
    ),
    np.float32,
)
assert len(vo) <= N + 480, f"Unexpected length {len(vo)} vs {N}"
if len(vo) < N:
    voice = np.pad(vo, (0, N - len(vo)))[:, None]
else:
    voice = vo[:N, None]

mix = voice * m["voiceGain"] + stem * m["elementGain"]
pk = float(np.max(np.abs(mix)))
assert pk < 0.998, f"Peak clipping detected: {pk}"

if args.mix:
    args.mix.parent.mkdir(parents=True, exist_ok=True)
    sf.write(args.mix, mix, sr, subtype="PCM_24")


def db(a: np.ndarray) -> float:
    return round(float(20 * np.log10(max(1e-12, np.sqrt(np.mean(a * a))))), 3)


r = {
    "narrationGain": m["voiceGain"],
    "sfxBusGain": m["elementGain"],
    "narrationInputSHA256": hashlib.sha256(
        (R / "public/narration.mp3").read_bytes()
    ).hexdigest(),
    "sourceRate": m["narrationHz"],
    "mixRate": sr,
    "pcmSamplesPerChannel": N,
    "narrationSampleCountAt48k": int(len(vo)),
    "padOnlyAtEndSamples": int(max(0, N - len(vo))),
    "narrationRmsDbfs": db(voice),
    "sfxPostFaderRmsDbfs": db(stem * m["elementGain"]),
    "mixPeakDbfs": round(20 * math.log10(pk), 3),
    "eventsCount": len(ev),
    "notes": "Input narration preserved at its own natural speed (100% / voiceGain=1.0). Default tactile element SFX synthesized at 48 kHz and mixed at 30% (elementGain=0.30) via standard Remotion <Audio>.",
}
(R / "qa/mix.json").write_text(json.dumps(r, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(r, ensure_ascii=False, indent=2))
