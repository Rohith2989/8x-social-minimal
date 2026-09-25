export const familyThemes = {
  cobalt:{surface:'#0021CC',ink:'#F4F6FA',accent:'#A6CFFF',light:true},
  polar:{surface:'#F4F6FA',ink:'#171922',accent:'#FFD438',light:false},
  social:{surface:'#FFD438',ink:'#171922',accent:'#F4F6FA',light:false},
  business:{surface:'#4D2C91',ink:'#F4F6FA',accent:'#FFD438',light:true},
  sale:{surface:'#F34B32',ink:'#171922',accent:'#FFD438',light:false},
  careers:{surface:'#78AEE8',ink:'#171922',accent:'#FFD438',light:false},
  research:{surface:'#9DADC2',ink:'#171922',accent:'#F4F6FA',light:false},
} as const;
export type FamilyTheme=keyof typeof familyThemes;

// Follow the image's existing loops; never generate replacement beads.
const curves=[
  [[1000,390],[1340,780],[1880,790],[1860,380]],
  [[1860,380],[1840,-30],[1350,-10],[1000,390]],
  [[1000,390],[655,805],[120,815],[130,380]],
  [[130,380],[140,-40],[660,-10],[1000,390]],
];
const samples=curves.flatMap(c=>Array.from({length:180},(_,i)=>{
  const t=i/179,q=1-t;
  return {x:q*q*q*c[0][0]+3*q*q*t*c[1][0]+3*q*t*t*c[2][0]+t*t*t*c[3][0],y:q*q*q*c[0][1]+3*q*q*t*c[1][1]+3*q*t*t*c[2][1]+t*t*t*c[3][1],distance:0};
}));
for(let i=1;i<samples.length;i++)samples[i].distance=samples[i-1].distance+Math.hypot(samples[i].x-samples[i-1].x,samples[i].y-samples[i-1].y);
const total=samples.at(-1)!.distance;
export function familyCurrentPosition(phase:number){
  const target=((phase%1)+1)%1*total;
  let lo=0,hi=samples.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(samples[mid].distance<target)lo=mid+1;else hi=mid;}
  const b=samples[lo],a=samples[Math.max(0,lo-1)],mix=(target-a.distance)/(b.distance-a.distance||1);
  return {x:a.x+(b.x-a.x)*mix,y:a.y+(b.y-a.y)*mix,angle:Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI};
}
