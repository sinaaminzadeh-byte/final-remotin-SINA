"""Install only render-time kit files into a Remotion project; reruns cannot silently replace customised assets."""
from pathlib import Path
import argparse,shutil,hashlib
q=argparse.ArgumentParser();q.add_argument('project',type=Path);a=q.parse_args();p=a.project.resolve();b=Path(__file__).resolve().parents[1]
if not (p/'src').is_dir() or not (p/'package.json').is_file():raise SystemExit('Expected a Remotion project with src and package.json')
assets=['signature-2k.png','portrait.png','background.png','paper-grain.png','pixel-mark.png','DoranFaNum-Bold.woff2','DoranFaNum-ExtraBold.woff2','DoranFaNum-Black.woff2'];dest=p/'src/creator-brand';jobs=[(b/'assets'/s,p/'public/creator-brand-v1'/s) for s in assets]+[(b/'components'/s,dest/s) for s in ['CreatorSignature.tsx','QuestionCover.tsx','HairlineMaster.tsx']]+[(b/'brand.json',dest/'brand.json')]
for s,t in jobs:
 if t.exists() and t.read_bytes()!=s.read_bytes():raise SystemExit('Conflicting file; no copy performed: '+str(t))
for s,t in jobs:t.parent.mkdir(exist_ok=True,parents=True);shutil.copyfile(s,t)
print('Installed exact creator kit:',len(jobs),'files.')
