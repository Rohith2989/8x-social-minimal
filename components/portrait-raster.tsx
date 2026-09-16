'use client';
import { useEffect, useRef } from 'react';

// An overlay masks only the photographic perimeter. Circle holes reveal the
// actual video below, so the print-screen remains attached to moving footage.
export function PortraitRaster() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current!, host = el.parentElement!, ctx = el.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, raf = 0, visible = false, start = 0, until = 0, last = 0;
    let pointerY = .5;
    const smooth = (x: number) => { const t = Math.max(0, Math.min(1, x)); return t*t*(3-2*t); };
    const draw = (time: number) => {
      if (!width || !height) return;
      const top = height * .095, bottom = height * .25, left = width * .115, right = width * .30;
      const pitch = width < 400 ? 5 : 6;
      const envelope = reduced.matches || time >= until ? 0 : Math.sin(Math.PI * Math.min(1, (time-start)/(until-start)));
      const wave = (time-start)/650;
      const rect = el.getBoundingClientRect();
      const scrollPhase = reduced.matches ? .5 : Math.max(0, Math.min(1, 1-rect.top/innerHeight));
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0,0,width,height);
      ctx.fillStyle = '#e9e5dc';
      ctx.fillRect(0,0,width,height);
      ctx.clearRect(left,top,width-left-right,height-top-bottom);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      for (let y=pitch/2;y<height;y+=pitch) for (let x=pitch/2;x<width;x+=pitch) {
        // No canvas work over the face / central photographic area.
        if (x>left+pitch && x<width-right-pitch && y>top+pitch && y<height-bottom-pitch) continue;
        const density = Math.min(x/left,(width-x)/right,y/top,(height-y)/bottom);
        const pulse = Math.sin(y/height*7 + x/width*3 - wave + pointerY*2) * .095 * envelope;
        const scroll = .025*Math.sin(y/height*5 + scrollPhase*3);
        const d = smooth(density + (pulse+scroll)*Math.sin(Math.max(0,Math.min(1,density))*Math.PI));
        const r = pitch*.73*d;
        if (r<.12) continue;
        ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,Math.PI*2);
      }
      ctx.fill();ctx.globalCompositeOperation='source-over';
    };
    const tick = (time: number) => {
      raf=0;
      if (!visible || document.hidden) return;
      if (time-last>=1000/24) { draw(time);last=time; }
      if (!reduced.matches && time<until) raf=requestAnimationFrame(tick);
      else draw(time);
    };
    const schedule = () => {
      const rect=host.getBoundingClientRect();
      const shown=rect.bottom>0 && rect.top<innerHeight && rect.width>0;
      if (shown && !visible) { start=performance.now();until=start+1800; }
      visible=shown;
      if (!visible || document.hidden) { cancelAnimationFrame(raf);raf=0;return; }
      if (!raf) raf=requestAnimationFrame(tick);
    };
    const enter = () => { start=performance.now();until=start+1600;schedule(); };
    const move = (event: PointerEvent) => {
      pointerY=(event.clientY-host.getBoundingClientRect().top)/height;
      schedule();
    };
    const resize = () => {
      width=el.clientWidth;height=el.clientHeight;
      const dpr=Math.min(devicePixelRatio,1.5);
      el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now());schedule();
    };
    const observer=new IntersectionObserver(schedule);observer.observe(host);
    const size=new ResizeObserver(resize);size.observe(host);resize();
    window.addEventListener('scroll',schedule,{passive:true});
    host.addEventListener('pointerenter',enter);host.addEventListener('pointermove',move);host.addEventListener('focusin',enter);
    document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);
    return () => { cancelAnimationFrame(raf);observer.disconnect();size.disconnect();window.removeEventListener('scroll',schedule);host.removeEventListener('pointerenter',enter);host.removeEventListener('pointermove',move);host.removeEventListener('focusin',enter);document.removeEventListener('visibilitychange',schedule);reduced.removeEventListener('change',schedule); };
  }, []);
  return <canvas className="portrait-raster" ref={canvas} aria-hidden="true" />;
}
