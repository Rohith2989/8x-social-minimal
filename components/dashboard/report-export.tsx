'use client';

import { useState } from 'react';
import { compact, totals, type DemoPost } from '@/lib/dashboard-demo';
import { downloadReportPDF } from '@/lib/dashboard-report';
import { CurrentButton } from './current-button';
import { RasterButton } from './raster-button';
import { Dots, Icon } from './ui';

export function ReportExport({ posts, campaign, period, onCSV, onClose }: { posts: DemoPost[]; campaign: string; period: string; onCSV: () => void; onClose: () => void }) {
  const [format, setFormat] = useState('CSV');
  const metrics = totals(posts);
  return <div className="ds-report-export">
    <p className="ds-popup-intro">Choose what goes into your report.</p>
    <dl className="ds-report-metrics">{[[posts.length, 'posts'], [metrics.creators, 'creators'], [compact(metrics.views), 'views']].map(([value, label]) => <div key={label}><dd>{value}</dd><dt>{label}</dt></div>)}</dl>
    <fieldset className="ds-report-formats"><legend>File format</legend><div>{['CSV', 'PDF'].map(value => <RasterButton key={value} aria-pressed={format === value} onClick={() => setFormat(value)}><Icon name={value === 'CSV' ? 'posts' : 'download'} /><span>{value}<small>{value === 'CSV' ? 'Every filtered post' : 'Summary & top 10 posts'}</small></span><span className="ds-format-check">{format === value && <Icon name="check" size={14} />}</span></RasterButton>)}</div></fieldset>
    <div className="ds-report-included"><Icon name="filter" size={18} /><span>Current filters included<small>{campaign} · {period}</small></span><Dots /></div>
    <div className="ds-popup-footer"><RasterButton className="ds-popup-cancel" onClick={onClose}>Cancel</RasterButton><CurrentButton key={format} icon="download" onAction={async () => { if (format === 'CSV') onCSV(); else downloadReportPDF(posts, campaign, period); }} readyLabel="Report ready">Download {format}</CurrentButton></div>
  </div>;
}
