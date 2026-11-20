import React from 'react';
import {QuestionCover} from './creator-brand/QuestionCover';
import {A,Defs,tr,clamp} from './core';
import {NewsDefs,Shade} from './objects';
import {Pocket} from './Pocket';
/** Cut on «برای», i.e. the first word of the next timed caption, not an inserted title card. */
export const openingEnd=A(3);
const pulse=(f:number,at:number,len:number)=>Math.sin(Math.PI*clamp((f-at)/len))**2;
export function Opening({f}:{f:number}){
 const settle=pulse(f,A(0),16),clasp=pulse(f,A(1),24);
 return <QuestionCover eyebrow="شروعِ کسب‌وکار" line1="با جیب خالی" line2="از کجا شروع کنم؟" showEyebrow={f<A(0)} heroDefs={<><Defs/><NewsDefs/></>}
 hero={<><Shade x={507} y={1443} w={290} h={31}/><g transform={tr(517+1.2*clasp,1237-5*settle-3*clasp,1.35*(1+.0035*clasp),-5.2+.8*settle-.75*clasp)}><Pocket f={245}/></g></>}/>;
}
