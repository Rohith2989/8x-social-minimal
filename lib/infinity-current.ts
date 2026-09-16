import reference from './current-reference.json';

// Dot positions and radii are measured from the approved artwork. A restrained
// displacement field keeps its silhouette intact while a small pigment trace
// travels along the loop. No point-to-point shuffling or disappearing dots.
const TAU=Math.PI*2;
const wrap=(v:number,n:number)=>((v%n)+n)%n;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
const palette=[[0,255,80,18],[.12,255,52,100],[.28,210,5,173],[.46,108,26,231],[.64,19,78,243],[.83,0,186,246],[1,18,24,34]];
const colours=Array.from({length:512},(_,i)=>{
  // One small highlight occupies 12% of the loop; the rest stays carbon.
  const tail=i/511,p=Math.min(1,tail/.12);let j=0;
  while(j<palette.length-2&&p>palette[j+1][0])j++;
  const a=palette[j],b=palette[j+1],t=smooth((p-a[0])/(b[0]-a[0]));
  const strength=smooth(tail/.018)*(1-smooth((tail-.07)/.05))*.82;
  return [18,24,34].map((base,k)=>base+(a[k+1]+(b[k+1]-a[k+1])*t-base)*strength);
});
const curves=[
  [[449,278],[585,98],[800,105],[800,274]],
  [[800,274],[800,440],[590,452],[449,278]],
  [[449,278],[310,90],[110,78],[103,276]],
  [[103,276],[98,450],[300,470],[449,278]],
];
type Dot={x:number;y:number;r:number;u:number;v:number;nx:number;ny:number};
function makeSurface():Dot[] {
  const path=curves.flatMap((c,segment)=>Array.from({length:180},(_,i)=> {
    const t=i/180,q=1-t;
    const x=q**3*c[0][0]+3*q*q*t*c[1][0]+3*q*t*t*c[2][0]+t**3*c[3][0];
    const y=q**3*c[0][1]+3*q*q*t*c[1][1]+3*q*t*t*c[2][1]+t**3*c[3][1];
    const dx=3*q*q*(c[1][0]-c[0][0])+6*q*t*(c[2][0]-c[1][0])+3*t*t*(c[3][0]-c[2][0]);
    const dy=3*q*q*(c[1][1]-c[0][1])+6*q*t*(c[2][1]-c[1][1])+3*t*t*(c[3][1]-c[2][1]);
    const len=Math.hypot(dx,dy);
    return {x,y,nx:-dy/len,ny:dx/len,u:(segment+t)/4};
  }));
  const dots:Dot[]=[];
  for(const [x,y,r] of reference) {
    let best=Infinity,nearest=path[0];
    for(const p of path) {
      const distance=(x-p.x)**2+(y-p.y)**2;
      if(distance<best){best=distance;nearest=p;}
    }
    const v=(x-nearest.x)*nearest.nx+(y-nearest.y)*nearest.ny;
    dots.push({x,y,r,u:nearest.u,v,nx:nearest.nx,ny:nearest.ny});
  }
  return dots;
}
const rgb=(colour:number[],factor=1)=>`rgb(${colour.map(v=>Math.round(Math.min(255,v*factor))).join(',')})`;

export function createInfinityCurrent(canvas:HTMLCanvasElement) {
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return null;
  const dots=makeSurface();let scale=1;
  return {
    resize(width:number) {
      canvas.width=Math.round(width*Math.min(window.devicePixelRatio||1,1.75));
      canvas.height=Math.round(canvas.width*2/3);scale=canvas.width/900;
    },
    draw(seconds:number,motion:boolean) {
      ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,900,600);
      const time=motion?seconds:0;
      const breath=Math.sin(time*TAU/14)*.001;
      for(const dot of dots) {
          const phase=dot.u,wave=Math.sin(TAU*(phase*2-time/18));
          const drift=Math.sin(TAU*(phase-time/16))*.55;
          const x=449+(dot.x-449)*(1+breath)-dot.ny*drift;
          const y=278+(dot.y-278)*(1+breath)+dot.nx*drift-wave*.25;
          const r=dot.r*(1+wave*.008);
          // A smooth current crosses the sampled surface; colour depends on
          // continuous path position, not row indices or rectangular regions.
          const tail=wrap(.12+time/40-phase,1),pigmentColour=colours[Math.min(511,Math.floor(tail*511))];
          const light=.45+.55*Math.exp(-Math.pow((dot.v+8)/66,2));
          const colour=pigmentColour.map(c=>c*light);
          ctx.globalAlpha=.1;ctx.fillStyle='#171922';
          ctx.beginPath();ctx.arc(x+.5,y+1.05,r,0,TAU);ctx.fill();
          ctx.globalAlpha=1;
          const pigment=ctx.createRadialGradient(x-r*.3,y-r*.35,r*.05,x,y,r*1.2);
          pigment.addColorStop(0,rgb(colour,1.13));pigment.addColorStop(.5,rgb(colour));pigment.addColorStop(1,rgb(colour,.8));
          ctx.fillStyle=pigment;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
      }
      ctx.globalAlpha=1;
    },
  };
}
