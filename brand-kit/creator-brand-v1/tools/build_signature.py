"""Rebuild the locked small #1 treatment from its clean high-resolution approved master, without re-typesetting Persian."""
from pathlib import Path
from PIL import Image
import hashlib
D=Path(__file__).resolve().parents[1]/'assets'
h=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
assert h(D/'portrait.png')=='4950eaca21697ea82afbb31330231de24372ddfe73e1f9c008645b4917066bae'
assert h(D/'hairline-master.png')=='f6f4d99331e31c7bb5e0969224f14b82777b661758b4a484413aa53655f37f62'
im=Image.open(D/'hairline-master.png');assert im.mode=='RGBA' and im.size==(576,126)
im=im.resize((504,110),Image.Resampling.LANCZOS);assert im.getchannel('A').getbbox()==(0,0,504,110)
im.save(D/'signature-2k.png',compress_level=9)
