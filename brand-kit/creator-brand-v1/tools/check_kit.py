"""Quick offline gate for next episode's shared identity. Run before composing the opening."""
import hashlib,json,math
from pathlib import Path
from PIL import Image
B=Path(__file__).resolve().parents[1];A=B/'assets';p=json.loads((B/'brand.json').read_text());s=p['byline'];safe=p['safeReference']['bounds2k'];b=s['bounds2k'];assert s['name']=='سینا امین زاده' and s['tagline']=='هوش مصنوعی به زبان ساده';assert len(b)==4 and (b[0]+b[2])/2==720 and b[1]==368 and [b[2]-b[0],b[3]-b[1]]==[504,110];assert safe[0]<=b[0] and safe[1]<=b[1] and b[2]<=safe[2] and b[3]<=safe[3];assert p['byline']['bounds1080']==[.75*x for x in b];
for line in (A/'SHA256SUMS').read_text().splitlines():
 h,n=line.split('  ',1);assert hashlib.sha256((A/n).read_bytes()).hexdigest()==h,n
with Image.open(A/s['asset']) as im:assert im.size==(504,110) and im.mode=='RGBA' and im.getchannel('A').getbbox()==(0,0,504,110)
with Image.open(A/s['portrait']) as im:assert im.size==(240,240) and im.format=='PNG'
for f in ['cover-1440.png','interior-1440.png']:
 with Image.open(B/'examples'/f) as im:assert im.size==(1440,2560) and im.format=='PNG'
print('Brand kit OK: approved assets, geometry, two full-frame references.')
