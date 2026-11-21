import React from 'react';
import {Img, staticFile} from 'remotion';
import config from './brand.json';
/** Mount exactly once in a 9:16 composition-sized AbsoluteFill, AFTER all shot layers. */
export function CreatorSignature() {
  const p=config.byline;
  return <Img data-creator-signature="hairline-1" alt={`${p.name} — ${p.tagline}`} src={staticFile(`${config.publicDirName}/${p.asset}`)} style={{position:'absolute',width:`${100*p.width2k/1440}%`,height:`${100*p.height2k/2560}%`,left:`${100*(p.centerX2k-p.width2k/2)/1440}%`,top:`${100*p.top2k/2560}%`,pointerEvents:'none',objectFit:'fill',zIndex:5}}/>;
}
