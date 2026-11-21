"""Offline Persian alignment: Persian character CTC plus Viterbi on immutable reference text.
Usage: python3 scripts/ctc.py /path/to/local-model-files [--cached-log /tmp/ctc_log.npy]
Model: XDcobra/wav2vec2-large-xlsr-53-persian-ONNX@f3704ea1da09bc43528c1e332475b2c70ac9dd28
"""

from pathlib import Path
import json, sys, itertools, argparse
import numpy as np
from scipy.special import log_softmax
import soundfile as sf
from scipy.signal import resample_poly
from math import gcd

R = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser()
ap.add_argument("model_dir", type=Path)
ap.add_argument("--cached-log", type=Path, default=None)
args = ap.parse_args()

D = args.model_dir
out = [
    {"i": i, "text": w} for i, w in enumerate((R / "narration.txt").read_text(encoding="utf-8").split())
]
v = json.loads((D / "vocab.json").read_text(encoding="utf-8"))
inv = {i: s for s, i in v.items()}

if args.cached_log and args.cached_log.exists():
    log = np.load(args.cached_log)
else:
    import onnxruntime as ort
    raw, sr = sf.read(R / "public/narration.mp3", dtype="float32")
    assert raw.ndim == 1
    g = gcd(sr, 16000)
    a = resample_poly(raw, 16000 // g, sr // g).astype("float32")
    a = (a - a.mean()) / np.sqrt(a.var() + 1e-7)
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = 2
    opts.inter_op_num_threads = 1
    opts.enable_cpu_mem_arena = False
    opts.enable_mem_pattern = False
    opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_BASIC
    opts.add_session_config_entry("session.disable_prepacking", "1")
    f = D / "model_int8.onnx"
    sess = ort.InferenceSession(
        str(f if f.exists() else D / "onnx/model_int8.onnx"),
        opts,
        providers=["CPUExecutionProvider"],
    )
    chunks = []
    total = (len(a) - 400) // 320 + 1
    for j in range(0, total, 200):
        lo = max(j - 35, 0)
        stop = min(total, j + 200)
        hi = min(total, stop + 35)
        pcm = a[lo * 320 : (hi - 1) * 320 + 400][None, :]
        feed = {
            p.name: (
                pcm if p.type == "tensor(float)" else np.ones(pcm.shape, dtype=np.int64)
            )
            for p in sess.get_inputs()
        }
        z = sess.run(None, feed)[0][0]
        chunks.append(z[j - lo : stop - lo])
    log = log_softmax(np.concatenate(chunks), axis=1)

greedy = "".join(inv[k] for k, _ in itertools.groupby(log.argmax(1)) if k).replace("|", " ")

spoken = {
    "۴": "چهار",
    "۵": "پنج",
    "۲۰": "بیست",
    "درباره‌اش": "دربارش",
    "کارهای": "کارای",
    "(Flywheel).": "فلایویل",
}

def norm(s):
    s = spoken.get(s, s)
    # Strip punctuation and ZWNJ, keep Persian letters in vocab
    return "".join(c for c in s if c in v and c != "|")

seq = []
word_ranges = []
for j, w in enumerate(out):
    if j:
        seq.append(v["|"])
    a0 = len(seq)
    seq.extend(v[c] for c in norm(w["text"]) if c in v)
    assert len(seq) > a0, f"Empty norm for {w}"
    word_ranges.append((a0, len(seq)))

blank = v["<pad>"]
S = np.full(len(seq) * 2 + 1, blank, dtype=int)
S[1::2] = seq
n = len(S)
dp = np.full(n, -1e20)
dp[0] = 0
back = np.zeros((len(log), n), np.uint8)
allow = (S != blank) & (S != np.roll(S, 2))
allow[:2] = False
for t, L in enumerate(log):
    step1 = np.r_[-1e20, dp[:-1]]
    step2 = np.where(allow, np.r_[[-1e20] * 2, dp[:-2]], -1e20)
    steps = np.stack((dp, step1, step2))
    back[t] = steps.argmax(0)
    dp = steps.max(0) + L[S]

k = n - 1 if dp[-1] >= dp[-2] else n - 2
path = np.zeros(len(log), int)
for t in reversed(range(len(log))):
    path[t] = k
    k -= int(back[t, k])

entries = []
for w, (u, z) in zip(out, word_ranges):
    ts = np.nonzero((path >= 2 * u + 1) & (path <= 2 * z - 1))[0]
    first = float(ts[0] * 0.02 + 0.0125)
    last = float(ts[-1] * 0.02 + 0.0125)
    start = max(0.0, first - 0.035)
    end = last + 0.035
    entries.append(
        {
            "i": w["i"],
            "text": w["text"],
            "start": round(start, 4),
            "end": round(end, 4),
            "ctcFirst": round(first, 4),
            "ctcLast": round(last, 4),
        }
    )

for i in range(1, len(entries)):
    if entries[i]["start"] < entries[i - 1]["end"]:
        mid = round((entries[i]["ctcFirst"] + entries[i - 1]["ctcLast"]) / 2, 4)
        entries[i]["start"] = entries[i - 1]["end"] = mid

(R / "data/words.json").write_text(
    json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
for x in entries:
    print(f'{x["i"]:3d} {x["text"]:18s} {x["start"]:6.2f}s - {x["end"]:6.2f}s (f={round(x["start"]*60):4d})')

(R / "qa/alignment.json").write_text(
    json.dumps(
        {
            "method": "Offline native Persian char-CTC forced alignment with Viterbi on the exact supplied transcript. 16 kHz inference only; 20 ms stride, +-35 ms emission margins. Adjacent overlaps split between emissions. Nearest 60 Hz frame for the animation/caption clock.",
            "model": "XDcobra/wav2vec2-large-xlsr-53-persian-ONNX@f3704ea1da09bc43528c1e332475b2c70ac9dd28",
            "words": len(entries),
            "greedyDiagnosticOnly": greedy,
            "pronunciationsForAlignmentOnly": spoken,
            "voiceResynthesized": False,
            "humanListening": False,
            "limitation": "Automatic onsets are not human phoneme annotations; greedy output was not substituted for any narration word.",
        },
        ensure_ascii=False,
        indent=2,
    )
    + "\n",
    encoding="utf-8",
)
