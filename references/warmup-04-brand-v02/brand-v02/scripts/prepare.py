"""Create an isolated reproducible Remotion build from the unchanged v01 baseline, approved revision, and repository-wide kit."""
from pathlib import Path
import hashlib,shutil,json,argparse,subprocess,sys
R=Path(__file__).resolve().parents[1];P=R.parents[1];root=P.parents[1];B=root/'motion-system/creator-brand-v1';q=argparse.ArgumentParser();q.add_argument('--work',type=Path,required=True);q.add_argument('--audio-master',type=Path);a=q.parse_args();w=a.work.resolve();assert w!=P and w!=R and w!=B and R not in w.parents and P not in w.parents,'Use an isolated build directory';w.mkdir(exist_ok=True,parents=True);tag=w/'.brand-revision-work'
if any(w.iterdir()) and not tag.is_file():raise SystemExit('Refusing to merge into an unrelated non-empty directory')
tag.touch();sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();audio=(a.audio_master or P/(P.name+'.mp4')).resolve();assert sha(audio) in ['28113694c47ede63683e29abf579e6e991a7d2b7623e492b447919a805fec480','3803541d0c0e3ff0a99c9b503e76425fe3daf008f0a359604b32525233cdb886'],'Not a verified audio source';assert (B/'assets/portrait.png').is_file()
for d in ['src','data','public']:shutil.copytree(P/d,w/d,dirs_exist_ok=True)
for n in ['package.json','package-lock.json','tsconfig.json','semantic-beats.json']:shutil.copy2(P/n,w/n)
(w/'scripts').mkdir(exist_ok=True);shutil.copy2(P/'scripts/slots.mjs',w/'scripts/slots.mjs');shutil.copy2(R/'scripts/render-brand.mjs',w/'scripts/render-brand.mjs')
for f in (R/'src').glob('*.tsx'):shutil.copy2(f,w/'src'/f.name)
subprocess.run([sys.executable,str(B/'tools/install.py'),str(w)],check=True);(w/'inputs.local.json').write_text(json.dumps({'revision':str(R),'brand':str(B),'audioMaster':str(audio),'work':str(w)})+'\n');print(w)
