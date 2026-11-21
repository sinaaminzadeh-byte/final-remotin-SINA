import React from 'react';
import {staticFile} from 'remotion';
import config from './brand.json';
const file=(n:string)=>staticFile(config.publicDirName+'/'+n);
let faces:Promise<void>|undefined;
/** Await this inside a Remotion delayRender / continueRender pair before drawing glyphs. */
export function prepareCoverAssets(){return faces??=Promise.all([
 ...([['Bold',700],['ExtraBold',800],['Black',900]] as const).map(async ([s,w])=>{if([...document.fonts].some(f=>f.family==='Doran'&&f.weight===String(w)&&f.status==='loaded'))return;const f=new FontFace('Doran',`url("${file('DoranFaNum-'+s+'.woff2')}")`,{weight:String(w)});await f.load();document.fonts.add(f);}),
 ...['background.png','paper-grain.png','pixel-mark.png','signature-2k.png'].map(async s=>{const i=new Image();i.src=file(s);await i.decode()})
 ]).then(()=>{})}
let ctx:CanvasRenderingContext2D|null=null;
function Line({s,y,w,n,h,k=900,color,role}:{s:string;y:number;w:number;n:number;h:number;k?:number;color:string;role:string}){ctx??=document.createElement('canvas').getContext('2d')!;ctx.direction='rtl';ctx.textAlign='center';ctx.textBaseline='alphabetic';let m:TextMetrics;for(;;){ctx.font=`${k} ${n}px Doran`;m=ctx.measureText(s);if(m.actualBoundingBoxLeft+m.actualBoundingBoxRight<=w&&m.actualBoundingBoxAscent+m.actualBoundingBoxDescent<=h)break;if(n<15)throw Error('Use a shorter cover line: '+s);n-=.5}const x=508+(m.actualBoundingBoxLeft-m.actualBoundingBoxRight)/2;return <text data-cover-role={role} x={x} y={y+(m.actualBoundingBoxAscent-m.actualBoundingBoxDescent)/2} direction="rtl" textAnchor="middle" fontFamily="Doran" fontWeight={k} fontSize={n} fill={color}>{s}</text>}
export type CoverProps={eyebrow:string;line1:string;line2:string;hero:React.ReactNode;heroDefs?:React.ReactNode;backdrop?:React.ReactNode;showEyebrow?:boolean};
/** Hero is a scene-specific SVG group in 1080x1920 coordinates. No byline baked into the cover. */
export function QuestionCover({eyebrow,line1,line2,hero,heroDefs,backdrop,showEyebrow=true}:CoverProps){return <svg data-question-cover="1" style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block',fontSynthesis:'none',textRendering:'optimizeLegibility'}} viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  {heroDefs}<defs>
    <linearGradient id="qcSolar" x1=".15" y1=".05" x2=".77" y2="1"><stop stopColor="#F2DEAA"/><stop offset=".52" stopColor="#EAD19A"/><stop offset="1" stopColor="#DAC29B"/></linearGradient>
    <pattern id="qcGrain" width="120" height="120" patternUnits="userSpaceOnUse"><image href={file('paper-grain.png')} width="120" height="120"/></pattern>
    <pattern id="qcDots" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(18)"><circle cx="1.5" cy="1.5" r="1.12" fill="#7D7045" opacity=".44"/></pattern>
    <clipPath id="qcDisc"><circle cx="481" cy="1136" r="276"/></clipPath></defs>
  <image href={file('background.png')} width="1080" height="1920" preserveAspectRatio="none"/>
  {backdrop}
  <g clipPath="url(#qcDisc)"><rect x="201" y="856" width="560" height="561" fill="url(#qcSolar)"/><path d="M213 1318q260-72 614-246v364H213z" fill="url(#qcDots)" opacity=".74"/><path d="M204 1234q309-37 651-209" fill="none" stroke="#FFF0CB" opacity=".54" strokeWidth="2"/><rect x="200" y="854" width="563" height="562" fill="url(#qcGrain)" opacity=".27"/></g>
  <path d="M215 1067a276 276 0 0 1 198-198" stroke="#BE9F66" strokeWidth="1.8" fill="none" transform="translate(-10 -10)"/>
  {showEyebrow&&<><g transform="translate(325 489)" fill="#BD9956" stroke="#BD9956" strokeLinecap="round"><path d="M0 0h49" strokeWidth="2.5"/><circle cx="58" r="2.7" stroke="none"/></g><g transform="translate(691 489) rotate(180)" fill="#BD9956" stroke="#BD9956" strokeLinecap="round"><path d="M0 0h49" strokeWidth="2.5"/><circle cx="58" r="2.7" stroke="none"/></g><Line s={eyebrow} y={488} w={227} n={37} h={44} k={800} color="#6C644C" role="eyebrow"/></>}
  <Line s={line1} y={595} w={791} n={133} h={119} color="#17263D" role="line1"/><Line s={line2} y={737} w={829} n={139} h={133} color="#146EF5" role="line2"/>
  {hero}<image href={file('pixel-mark.png')} x={922-24.3} y={1278-18.9} width="48.6" height="37.8"/>
</svg>}
