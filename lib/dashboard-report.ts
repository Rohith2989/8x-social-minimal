import { compact, demoCreators, totals, type DemoPost } from './dashboard-demo';

/** Small, dependency-free, single-page PDF summary. CSV remains the full dataset. */
export function downloadReportPDF(posts: DemoPost[], campaign: string, period: string) {
  const metrics = totals(posts);
  const literal = (s: string) => s.replace(/[^\x20-\x7e]/g, '-').replace(/([\\()])/g, '\\$1');
  const commands: string[] = [];
  const text = (value: string, x: number, y: number, size = 11, colour = '0.08 0.11 0.16') => commands.push(`${colour} rg BT /F1 ${size} Tf ${x} ${y} Td (${literal(value)}) Tj ET`);
  commands.push('0.0 0.13 0.8 rg 0 744 595 98 re f');
  text('8x social / Campaign report', 42, 798, 24, '1 1 1');
  text(`${campaign} | ${period}`, 42, 770, 11, '1 1 1');
  text('Performance at a glance', 42, 704, 18);
  [[String(metrics.posts), 'Posts'], [String(metrics.creators), 'Creators'], [compact(metrics.views), 'Views']].forEach(([value, label], i) => { text(value, 42 + i * 177, 660, 28); text(label, 42 + i * 177, 640, 10); });
  text(`${compact(metrics.likes)} likes   |   ${compact(metrics.comments)} comments   |   ${compact(metrics.shares)} shares`, 42, 603);
  text(`${metrics.rate.toFixed(1)}% engagement rate`, 42, 582);
  text('Top posts in the selected report', 42, 539, 16);
  text('Creator', 42, 512, 10); text('Platform', 282, 512, 10); text('Views', 445, 512, 10);
  [...posts].sort((a, b) => b.views - a.views).slice(0, 10).forEach((post, i) => {
    const y = 484 - i * 29;
    commands.push(`0.89 0.92 0.97 RG 42 ${y - 10} m 553 ${y - 10} l S`);
    text(demoCreators[post.creator].handle, 42, y); text(post.platform, 282, y); text(post.views.toLocaleString('en-US'), 445, y);
  });
  if (!posts.length) text('No posts match the current filters.', 42, 484);
  text('Current filters included. Download CSV for all post-level records.', 42, 133, 10);
  text('Demo workspace: illustrative identities and campaign results.', 42, 64, 9, '0.4 0.46 0.55');
  const stream = commands.join('\n');
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((object, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
  const link = document.createElement('a'); link.href = url; link.download = '8x-campaign-report.pdf'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
