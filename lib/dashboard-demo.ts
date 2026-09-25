import { previewClips } from './dashboard-preview';

export type Platform = 'TikTok' | 'Instagram';
export type Section = 'overview' | 'creators' | 'posts' | 'feed' | 'plan' | 'analytics' | 'team';
export type Metric = 'views' | 'posts' | 'engagement';
export const sections: { id: Section; label: string; description: string }[] = [
  { id: 'overview', label: 'Overview', description: 'Your campaign, at a glance.' },
  { id: 'creators', label: 'Creators', description: 'The people behind your reach.' },
  { id: 'posts', label: 'Posts', description: 'Every post. Every result.' },
  { id: 'feed', label: 'Feed', description: 'Your network, in motion.' },
  { id: 'plan', label: 'Content plan', description: 'A shared direction. Original voices.' },
  { id: 'analytics', label: 'Analytics', description: 'Understand what moves your audience.' },
  { id: 'team', label: 'Team', description: 'Your people, connected.' },
];
export const campaigns = [{ id: 'autumn', name: 'Autumn launch', country: 'United States', end: 30 }, { id: 'everyday', name: 'Everyday essentials', country: 'United Kingdom', end: 30 }];
const names = ['Lena Hayes', 'Marcus Cole', 'Sofia Reed', 'Daniel Park', 'Mia Taylor', 'Theo Brooks', 'Ava Stone', 'Noah Ellis', 'Ella Morgan', 'Lucas Bell', 'Isla Carter', 'Leo James', 'Chloe Hall', 'Finn Miles', 'Zoe Lane', 'Oliver West', 'Ruby Quinn', 'Ethan Young', 'Grace Lee', 'Arlo Scott', 'Ivy Blake', 'Oscar Reed', 'Nina Rose', 'Jude Wells'];
const handles = ['lena.creates', 'marcus.daily', 'sofia.finds', 'daniel.studio', 'mia.edit', 'theo.today', 'ava.notes', 'noah.makes', 'ella.everyday', 'lucas.life', 'isla.inframe', 'leo.inmotion', 'chloe.collects', 'finn.film', 'zoe.routine', 'oliver.original', 'ruby.real', 'ethan.tries', 'grace.curates', 'arlo.outside', 'ivy.stories', 'oscar.creates', 'nina.notes', 'jude.daily'];
const titles = ['A fresh perspective', 'The everyday edit', 'Little things, big difference', 'Worth sharing', 'Made for the moment', 'A different kind of routine', 'In my own words', 'The things I come back to'];
export const demoCreators = names.map((name, i) => ({ id: i, name, handle: `@${handles[i]}`, poster: previewClips[(i + 4) % previewClips.length].poster, country: i % 5 === 0 ? 'Canada' : 'United States', status: i > 20 ? 'Inactive' : 'Active', joined: 1 + (i % 19) }));
export type DemoPost = { id: string; creator: number; day: number; platform: Platform; title: string; video: string; poster: string; source: string; views: number; likes: number; comments: number; shares: number; spark: string; status: 'Live' | 'Deleted' };

function allocate(total: number, weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const result = weights.map(w => Math.floor(total * w / sum));
  let rest = total - result.reduce((a, b) => a + b, 0);
  for (let i = 0; rest > 0; i++, rest--) result[i % result.length]++;
  return result;
}

// Explicit fixtures, never production figures. Every chart, count, list and CSV
// derives from these same 248 records so filtering cannot change their meaning.
const base = Array.from({ length: 248 }, (_, i) => {
  const media = previewClips[(i + 4) % previewClips.length];
  return { id: `MX-${String(i + 1).padStart(4, '0')}`, creator: i % 24, day: i < 4 ? [21, 19, 23, 18][i] : 1 + ((i * 7 + Math.floor(i / 24) * 3) % 24), platform: (i < 4 ? (i % 2 ? 'Instagram' : 'TikTok') : i < 162 ? 'TikTok' : 'Instagram') as Platform, title: titles[i % titles.length], video: media.video, poster: media.poster, source: media.source, spark: i % 3 === 0 ? `8X-DEMO-${1000 + i}` : '', status: 'Live' as const };
});
const viewValues = Array<number>(248).fill(0);
(['TikTok', 'Instagram'] as Platform[]).forEach(platform => {
  const indexes = base.map((p, i) => p.platform === platform ? i : -1).filter(i => i >= 4);
  const top = platform === 'TikTok' ? 182000 + 121000 : 146000 + 98000;
  const distribution = allocate((platform === 'TikTok' ? 1500000 : 900000) - top, indexes.map(i => 40 + base[i].day * 8 + (i * 31) % 110));
  indexes.forEach((index, j) => { viewValues[index] = distribution[j]; });
});
[182000, 146000, 121000, 98000].forEach((v, i) => { viewValues[i] = v; });
const likes = allocate(112800, viewValues), comments = allocate(8400, viewValues), shares = allocate(10800, viewValues);
export const demoPosts: DemoPost[] = base.map((p, i) => ({ ...p, views: viewValues[i], likes: likes[i], comments: comments[i], shares: shares[i] }));
export function campaignPosts(id: string): DemoPost[] {
  return id === 'everyday' ? demoPosts.filter((_, i) => i % 2 === 0).map(p => ({ ...p, views: Math.round(p.views * .7), likes: Math.round(p.likes * .7), comments: Math.round(p.comments * .7), shares: Math.round(p.shares * .7) })) : demoPosts;
}
export function totals(posts: DemoPost[]) {
  const r = posts.reduce((a, p) => ({ views: a.views + p.views, likes: a.likes + p.likes, comments: a.comments + p.comments, shares: a.shares + p.shares }), { views: 0, likes: 0, comments: 0, shares: 0 });
  const engagement = r.likes + r.comments + r.shares;
  return { ...r, engagement, rate: r.views ? engagement / r.views * 100 : 0, posts: posts.length, creators: new Set(posts.map(p => p.creator)).size };
}
export function compact(n: number) { return n >= 1000000 ? `${(n / 1000000).toFixed(2)}M` : n >= 10000 ? `${+(n / 1000).toFixed(1)}K` : n.toLocaleString('en-US'); }
export const count = (n: number) => n.toLocaleString('en-US');
export const postEngagement = (p: DemoPost) => p.likes + p.comments + p.shares;
export function csvFile(posts: DemoPost[], name = '8x-demo-posts') {
  const cell = (v: unknown) => `"${String(v).replaceAll('"', '""')}"`;
  const rows = [['DEMO DATA — illustrative campaign records, not real creator results'], ['ID', 'Creator (fictional)', 'Platform', 'Posted', 'Views', 'Likes', 'Comments', 'Shares', 'Title'], ...posts.map(p => [p.id, demoCreators[p.creator].handle, p.platform, `2026-09-${String(p.day).padStart(2, '0')}`, p.views, p.likes, p.comments, p.shares, p.title])];
  const url = URL.createObjectURL(new Blob([rows.map(r => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `${name}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
