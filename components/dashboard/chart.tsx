'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { compact, type DemoPost, type Metric } from '@/lib/dashboard-demo';

export function PerformanceChart({ posts, from, to, metric, cumulative }: { posts: DemoPost[]; from: number; to: number; metric: Metric; cumulative: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(770);
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (height > 0) setWidth(width / height * 285);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const days = useMemo(() => {
    let sum = 0;
    return Array.from({ length: to - from + 1 }, (_, i) => {
      const day = from + i, rows = posts.filter(p => p.day === day);
      const value = metric === 'posts' ? rows.length : rows.reduce((a, p) => a + (metric === 'views' ? p.views : p.likes + p.comments + p.shares), 0);
      sum += value;
      return { day, value: cumulative ? sum : value };
    });
  }, [posts, from, to, metric, cumulative]);
  const maximum = Math.max(...days.map(d => d.value), 1);
  const power = 10 ** Math.floor(Math.log10(maximum));
  const ceiling = Math.ceil(maximum / power * 2) / 2 * power;
  const right = width - 28, plotWidth = right - 52;
  const points = days.map((d, i) => ({ x: 52 + i / Math.max(days.length - 1, 1) * plotWidth, y: 235 - d.value / ceiling * 180 }));
  // Monotone cubic interpolation passes through each real sample without
  // introducing peaks or dips that aren't present in the daily data.
  const slopes = points.slice(1).map((p, i) => (p.y - points[i].y) / (p.x - points[i].x));
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0] ?? 0;
    if (i === points.length - 1) return slopes[i - 1] ?? 0;
    const a = slopes[i - 1], b = slopes[i];
    return a * b <= 0 ? 0 : 2 * a * b / (a + b);
  });
  const path = points.map((p, i) => {
    if (!i) return `M${p.x},${p.y}`;
    const prev = points[i - 1], dx = (p.x - prev.x) / 3;
    return `C${prev.x + dx},${prev.y + tangents[i - 1] * dx} ${p.x - dx},${p.y - tangents[i] * dx} ${p.x},${p.y}`;
  }).join(' ');
  const selected = Math.min(hover ?? Math.max(0, days.length - 5), days.length - 1), point = points[selected], item = days[selected];
  const labels = [...new Set([0, Math.floor((days.length - 1) / 3), Math.floor((days.length - 1) * 2 / 3), days.length - 1])];
  return <div className="ds-chart-wrap" tabIndex={0} role="group" aria-label={`${cumulative ? 'Cumulative' : 'Daily'} ${metric} chart. Use left and right arrow keys to explore dates.`} onKeyDown={e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setHover(Math.max(0, Math.min(days.length - 1, selected + (e.key === 'ArrowLeft' ? -1 : 1)))); }
    if (e.key === 'Home') { e.preventDefault(); setHover(0); }
    if (e.key === 'End') { e.preventDefault(); setHover(days.length - 1); }
  }} onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width * width; setHover(Math.max(0, Math.min(days.length - 1, Math.round((x - 52) / plotWidth * (days.length - 1))))); }} onPointerLeave={() => setHover(null)}>
    <svg ref={svg} className="ds-chart-svg" viewBox={`0 0 ${width} 285`} role="img" aria-label={`${metric} from September ${from} to ${to}. ${item.day} September: ${item.value.toLocaleString()} ${metric}.`}>
      <defs><linearGradient id="ds-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d2e0ff" stopOpacity=".55" /><stop offset="1" stopColor="#d2e0ff" stopOpacity=".025" /></linearGradient></defs>
      {[0, .5, 1].map(n => <g key={n}><line x1="52" x2={right} y1={235 - n * 180} y2={235 - n * 180} stroke="white" opacity=".16" /><text x="38" y={240 - n * 180} textAnchor="end">{compact(Math.round(ceiling * n))}</text></g>)}
      <path d={`${path} L${right},235 L52,235 Z`} fill="url(#ds-chart-fill)" /><path d={path} fill="none" stroke="#f4f7ff" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />
      {labels.map(i => <text key={i} x={points[i].x} y="262" textAnchor={i === 0 ? 'start' : i === days.length - 1 ? 'end' : 'middle'}>{String(days[i].day).padStart(2, '0')} Sep</text>)}
      <line x1={point.x} x2={point.x} y1={point.y} y2="235" stroke="white" opacity=".55" strokeDasharray="2 5" /><circle cx={point.x} cy={point.y} r="6" fill="#fff" stroke="#aac9ff" strokeWidth="3" />
      <g transform={`translate(${Math.max(114, Math.min(width - 90, point.x))},${Math.max(4, point.y - 73)})`} className="ds-chart-tooltip"><rect x="-71" width="142" height="53" rx="19" fill="#fff" /><path d="M-7 52h14l-7 7Z" fill="#fff" /><circle cx="-47" cy="26" r="15" fill="#0021cc" /><path d="M-55 26q8-11 16 0-8 11-16 0Z" fill="none" stroke="white" strokeWidth="1.5" /><circle cx="-47" cy="26" r="2.5" fill="white" /><text x="-23" y="24" className="ds-tooltip-value">{compact(item.value)}</text><text x="-23" y="41" className="ds-tooltip-label">{metric} · {item.day} Sep</text></g>
    </svg>
    <span className="ds-sr" aria-live="polite">{item.day} September: {compact(item.value)} {metric}</span>
  </div>;
}
