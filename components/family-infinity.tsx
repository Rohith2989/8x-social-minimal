'use client';

import { useEffect, useId, useRef, type CSSProperties } from 'react';
import { Arrow } from './icons';
import { familyCurrentPosition, familyThemes, type FamilyTheme } from '@/lib/family-surface';

const asset='/media/family/infinity-graphite.webp';
const products=[
  {id:'social',name:'Social',colour:'#FFD438',href:'https://www.8x.social/'},
  {id:'business',name:'Business',colour:'#4D2C91',href:undefined},
  {id:'sale',name:'Sale',colour:'#F34B32',href:undefined},
  {id:'careers',name:'Careers',colour:'#78AEE8',href:'https://8x.careers'},
  {id:'research',name:'Research',colour:'#9DADC2',href:undefined},
];

export function FamilyInfinity({theme='sale',id='family'}:{theme?:FamilyTheme;id?:string}) {
  const root=useRef<HTMLElement>(null),scene=useRef<SVGGElement>(null),light=useRef<SVGGElement>(null),front=useRef<SVGGElement>(null);
  const unique=useId().replace(/:/g,'');
  const palette=familyThemes[theme];
  const rgb=[0,2,4].map(i=>parseInt(palette.accent.slice(1+i,3+i),16)/255);
  const colourMatrix=rgb.map(c=>`${.3189*c} ${1.0728*c} ${.1083*c} 0 ${.55*c}`).join(' ')+' 0 0 0 1 0';
  useEffect(()=>{
    const el=root.current!,reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let raf=0,visible=false,last=0,clock=0,painted=0;
    const paint=(seconds:number,moving:boolean)=>{
      const phase=(seconds/12)%1,p=familyCurrentPosition(phase);
      light.current!.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${p.angle||35})`);
      // A broad pulse passes underneath the front branch on its second crossing.
      const crossing=Math.exp(-Math.pow((phase-.5)/.035,2));
      light.current!.style.opacity=String(1-crossing*.9);
      const breath=moving?Math.sin(seconds*Math.PI/6):0;
      scene.current!.setAttribute('transform',`translate(992 396) scale(${1+breath*.0015}) translate(-992 -396)`);
      front.current!.setAttribute('transform',`translate(0 ${moving?Math.sin(seconds*Math.PI/6+.4)*-1.4:0})`);
      el.dataset.frame=seconds.toFixed(3);
    };
    const tick=(time:number)=>{
      raf=0;if(!visible||document.hidden||reduced.matches){last=0;el.dataset.running='false';return;}
      if(last)clock+=Math.min(time-last,64)/1000;last=time;
      if(time-painted>=1000/30){paint(clock,true);painted=time;}
      el.dataset.running='true';raf=requestAnimationFrame(tick);
    };
    const sync=()=>{cancelAnimationFrame(raf);raf=0;last=0;
      if(reduced.matches){paint(0,false);el.dataset.running='false';}
      else if(visible&&!document.hidden)raf=requestAnimationFrame(tick);
      else el.dataset.running='false';
    };
    paint(0,false);el.dataset.ready='true';
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(el.querySelector('.fi-art')!);
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
    return()=>{cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);};
  },[theme]);
  return <section id={id} ref={root} className="family-infinity" data-theme={theme} data-running="false" aria-labelledby={`${id}-title`}
    style={{'--fi-surface':palette.surface,'--fi-ink':palette.ink} as CSSProperties}>
    <div className="fi-inner">
      <div className="fi-top"><img src="/8x.svg" alt="8x" width="386" height="264" /><span>Explore the family</span></div>
      <div className="fi-composition">
        <div className="fi-art" role="img" aria-label="A sculpted infinity with a slow colour current and gently breathing image layers.">
          <svg className="fi-image-scene" viewBox="0 0 1984 793" aria-hidden="true">
            <defs>
              <filter id={`${unique}-colour`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values={colourMatrix}/></filter>
              <filter id={`${unique}-pale`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values=".5 0 0 0 .62 0 .5 0 0 .64 0 0 .5 0 .69 0 0 0 1 0"/></filter>
              <radialGradient id={`${unique}-pulse`}><stop offset="0" stopColor="white"/><stop offset=".4" stopColor="white" stopOpacity=".98"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient>
              <radialGradient id={`${unique}-depth`}><stop stopColor="white"/><stop offset=".6" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient>
              <mask id={`${unique}-current`} maskUnits="userSpaceOnUse" x="0" y="0" width="1984" height="793"><g ref={light} transform="translate(1000 390) rotate(35)"><ellipse rx="165" ry="125" fill={`url(#${unique}-pulse)`}/></g></mask>
              <mask id={`${unique}-front`} maskUnits="userSpaceOnUse" x="0" y="0" width="1984" height="793"><ellipse cx="1000" cy="390" rx="270" ry="100" transform="rotate(35 1000 390)" fill={`url(#${unique}-depth)`}/></mask>
            </defs>
            <g ref={scene}>
              <image className="fi-base-image" href={asset} width="1984" height="793" filter={palette.light?`url(#${unique}-pale)`:undefined}/>
              <g ref={front} mask={`url(#${unique}-front)`}><image href={asset} width="1984" height="793" filter={palette.light?`url(#${unique}-pale)`:undefined}/></g>
              <image className="fi-colour-image" href={asset} width="1984" height="793" filter={`url(#${unique}-colour)`} mask={`url(#${unique}-current)`}/>
            </g>
          </svg>
        </div>
        <ul className="fi-products" aria-label="8x products">{products.map(product=>{
          const content=<><span className="fi-icon" data-product={product.id} style={{backgroundColor:product.colour}}><img src="/8x.svg" alt="" width="386" height="264" /></span><span>8x {product.name}</span>{product.href&&<Arrow/>}</>;
          return <li key={product.id} className={`fi-product fi-${product.id}`}>{product.href?<a href={product.href}>{content}</a>:<span className="fi-label">{content}</span>}</li>;
        })}</ul>
      </div>
      <h2 id={`${id}-title`}>One family. More possibilities.</h2>
    </div>
  </section>;
}
