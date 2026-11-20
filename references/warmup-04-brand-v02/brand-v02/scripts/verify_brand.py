"""Check every encoded frame's clock, fixed identity, post-intro scene correspondence, and untouched AAC payloads and PCM."""
from pathlib import Path
from fractions import Fraction
from PIL import Image,ImageDraw
import argparse,tempfile,subprocess as S,json,hashlib,numpy as np
R=Path(__file__).resolve().parents[1];P=R.parents[1];B=P.parents[1]/'motion-system/creator-brand-v1';qa=R/'qa';name='warmup-04-zero-capital-asset-v02-2k.mp4';video=R/name;N=3215;cut=61
arg=argparse.ArgumentParser();arg.add_argument('--previous-2k',type=Path);arg.add_argument('--temp',type=Path);args=arg.parse_args();old=args.previous_2k or P/(P.name+'.mp4');sig=[468,368,972,478];j=lambda p:json.loads(p.read_text());run=lambda a:S.check_output(list(map(str,a)));H=lambda b:hashlib.sha256(b).hexdigest();sha=lambda p:H(p.read_bytes());probe=lambda p,a:json.loads(run(['ffprobe','-v','error',*a,'-of','json',p]));assert sha(old) in ['28113694c47ede63683e29abf579e6e991a7d2b7623e492b447919a805fec480','3803541d0c0e3ff0a99c9b503e76425fe3daf008f0a359604b32525233cdb886'];stats=j(qa/'type-and-layout.json');assert not stats['issues'] and stats['distinctWords']==172 and stats['stableBylineAtEverySample'];assert j(qa/'source-determinism.json')['allIdentical']
v,a=probe(video,['-show_streams'])['streams'];assert (v['codec_name'],v['pix_fmt'],v['color_space'],v['width'],v['height'],Fraction(v['r_frame_rate']),Fraction(v['avg_frame_rate']),int(v['nb_frames']))==('h264','yuv420p','bt709',1440,2560,60,60,N);assert float(v['start_time'])==0 and abs(float(v['duration'])-N/60)<.000001 and a['codec_name']=='aac' and a['channels']==2 and int(a['sample_rate'])==48000 and float(a['start_time'])==0
pts=sorted(i['pts'] for i in probe(video,['-select_streams','v:0','-show_packets','-show_entries','packet=pts'])['packets']);assert pts==[int(i/(60*Fraction(v['time_base']))) for i in range(N)]
pack=lambda p:probe(p,['-select_streams','a:0','-show_packets','-show_data_hash','sha256','-show_entries','packet=pts,dts,duration,size,data_hash:packet_side_data=side_data_type,skip_samples,discard_padding'])['packets'];p0,p1=pack(old),pack(video);assert p0==p1 and len(p1)==2513 and all('data_hash' in x for x in p1);os=probe(old,['-select_streams','a:0','-show_streams'])['streams'][0];assert a['time_base']==os['time_base'] and a['duration_ts']==os['duration_ts'];pcm=lambda p:H(run(['ffmpeg','-nostdin','-v','error','-xerror','-threads','1','-i',p,'-map','0:a','-f','f32le','-']));sound=pcm(old);assert pcm(video)==sound;print('AAC, PCM, 60 Hz presentation grid passed',flush=True)
def raw(p,vf):return run(['ffmpeg','-nostdin','-v','error','-xerror','-threads','2','-filter_threads','1','-i',p,'-map','0:v:0','-an','-vf',vf,'-fps_mode','passthrough','-threads:v','1','-f','rawvideo','-'])
small=lambda p:np.frombuffer(raw(p,'scale=90:160:flags=area,format=gray'),np.uint8).reshape((-1,160,90));before=small(old);after=small(video);assert len(before)==len(after)==N
# Exclude only rows covering removed Folio & fixed byline. This is a coarse motion/sync test, not an identity test.
mask=np.ones((160,90),dtype=bool);mask[21:33]=False;dif=np.array([np.abs(x.astype(np.int16)-y)[mask].mean() for x,y in zip(before[cut:],after[cut:])]);assert float(dif.max())<3.5,(dif.max(),cut+int(dif.argmax()));assert np.min(after.mean(axis=(1,2)))>150
wins={};
for k,z in j(P/'qa/encoded-qc.json')['activeMotionWindows'].items():
 f=z['startFrame'];c=z['sampledFrames'];
 if f<cut:continue
 sec=after[f:f+c];num=int(np.any(sec[1:]!=sec[:-1],axis=(1,2)).sum());assert num==c-1;wins[k]=[f,c,num]
print('Picture: 3215 decoded frame pairs, post-cover max luma difference',float(dif.max()),flush=True)
fil='crop=504:110:468:368,scale=126:28:flags=area,format=gray';tiles=lambda p:np.frombuffer(raw(p,fil),np.uint8).reshape((-1,28*126));ref0=tiles(B/'examples/cover-1440.png')[0].astype('float32');ref1=tiles(B/'examples/interior-1440.png')[0].astype('float32');actual=tiles(video);assert len(actual)==N;cor=[];mad=[]
for i,x in enumerate(actual):
 t=ref0 if i<cut else ref1;x=x.astype('float32');mad.append(float(np.abs(t-x).mean()));u=t-t.mean();v0=x-x.mean();cor.append(float((u*v0).sum()/np.sqrt((u*u).sum()*(v0*v0).sum())))
assert min(cor)>.97 and max(mad)<7,(min(cor),max(mad));print('Whole-film signature matched, min correlation',min(cor),'max mean difference',max(mad),flush=True)
frames=[0,31,60,61,242,544,650,1101,1480,1674,1976,2254,2651,2949,3185,3214];expr="select='"+'+'.join(f'eq(n,{f})' for f in frames)+"'"
with tempfile.TemporaryDirectory(dir=args.temp) as tt:
 td=Path(tt);run(['ffmpeg','-nostdin','-v','error','-xerror','-y','-threads','2','-filter_threads','1','-i',video,'-map','0:v:0','-an','-vf',expr,'-fps_mode','passthrough','-frames:v',len(frames),'-compression_level','3','-threads:v','1',td/'f%02d.png']);samples=sorted(td.glob('f*.png'));assert len(samples)==len(frames);sheet=Image.new('RGB',(852,4*395),'#e6e2d7');d=ImageDraw.Draw(sheet);strip=Image.new('RGB',(650,3*176),'#e8e4d9');sd=ImageDraw.Draw(strip)
 for i,(f,file) in enumerate(zip(frames,samples)):
  with Image.open(file) as im:
   im=im.convert('RGB');assert im.size==(1440,2560);x=i%4*213+4;y=i//4*395+6;sheet.paste(im.resize((205,364),Image.Resampling.LANCZOS),(x,y));d.text((x,y+368),f'{f:04d}  /  {f/60:.2f}s',fill='#253e49');
   if f in [0,1101,3185]:
    n0=[0,1101,3185].index(f);patch=im.crop((414,344,1026,495));strip.paste(patch,(19,n0*176+18));sd.text((19,n0*176+1),f'f{f}',fill='#29414c')
   if f==0:
    aa=np.array(Image.open(B/'examples/cover-1440.png').convert('RGB')).astype(np.float32);bb=np.array(im).astype(np.float32);psnr=float(10*np.log10(255**2/np.mean((aa-bb)**2)));assert psnr>32,psnr
 sheet.save(qa/'encoded-review.jpg',quality=90,optimize=True);strip.save(qa/'encoded-signature.jpg',quality=94,optimize=True,subsampling=0)
r={'sha256':sha(video),'file':name,'bytes':video.stat().st_size,'nativeRemotionOutput':[1440,2560],'format':'H.264/yuv420p/BT.709 + AAC stereo 48 kHz','fps':'60/1','framesDecoded':N,'durationSeconds':float(v['duration']),'exactPresentationGrid':True,'coverFrameSpanInclusive':[0,60],'openingToPictureCutFrame':cut,'coverPngVsEncodedFrameZeroPSNRdB':round(psnr,2),'signatureBoundsXYXY2K':sig,'matchedSignatureEveryFrame':len(cor),'signatureMinLumaCorrelationAt126x28':round(min(cor),6),'worstSignatureLumaMADAt126x28':round(max(mad),4),'matchedAudioPacketsAndTimestamps':len(p1),'decodedStereoFloatPcmSHA256':sound,'sourceAudioMasterSHA256':sha(old),'scenesAfterOpeningTestedFrames':len(dif),'postOpeningMaxCoarseLumaMADOutsideHeader':round(float(dif.max()),4),'postOpeningMaxAtFrame':int(dif.argmax())+cut,'existingActiveMotionWindows':wins,'decodedProofFrames':frames,'inAppInstagramPreview':False,'humanApprovalOfVideo':'awaiting user review'};(qa/'verification.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print('PASS final MP4',r['sha256'],r['bytes'],flush=True)
