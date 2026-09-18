import { clips, dayCreator, reachCreator } from './content';

export type Platform = 'TikTok' | 'Instagram' | 'YouTube Shorts';
export type PreviewClip = { id: string; title: string; poster: string; video: string; source: string; platform?: Platform; handle?: string };
export const platformFiles: Record<Platform, string> = { TikTok: 'tiktok', Instagram: 'instagram', 'YouTube Shorts': 'youtubeshorts' };
export const creators = [
  ...clips.map(c => ({ id: c.id, handle: c.handle, platform: c.platform as Platform, source: c.source })),
  { ...reachCreator, platform: 'Instagram' as Platform },
  { ...dayCreator, platform: 'TikTok' as Platform },
  { id: 'judy', handle: '@judyintech', platform: 'Instagram' as Platform, source: 'https://www.instagram.com/judyintech/' },
  { id: 'jack', handle: '@jack.jobsearch', platform: 'TikTok' as Platform, source: 'https://www.tiktok.com/@jack.jobsearch' },
];
const showcaseIds = [5, 41, 3, 28, 6, 11, 23, 32, 2, 13, 36, 7, 12, 40, 9, 29, 42, 45, 19, 20, 1, 4, 10, 14, 15, 16, 17, 18, 21, 22, 24, 25, 27, 30, 31, 33, 34, 35, 37, 38, 39, 43];
const titles: Record<number, string> = { 5: 'A tech job search', 41: 'A role at a startup', 3: 'A different perspective', 28: 'Everyday matcha', 6: 'Music, in the moment', 11: 'Applying for jobs' };
export const previewClips: PreviewClip[] = [
  ...creators.slice(0, 4).map(c => ({ ...c, title: clips.find(clip => clip.id === c.id)?.title ?? 'Companies to know', poster: `/media/${c.id}-v1.jpg`, video: `/media/${c.id}-v1.mp4` })),
  ...showcaseIds.map(id => ({ id: `showcase-${id}`, title: titles[id] ?? `Creator showcase ${String(id).padStart(2, '0')}`, poster: `/media/showcase/${id}.jpg`, video: `/media/showcase/${id}.mp4`, source: `https://cdn-mrktng.8x.social/assets/videos/video-${id}.mp4` })),
];
// Example figures transcribed from the original 8x product screenshot. They are
// not a live feed or newly claimed customer outcomes. Keep the preview label.
export const campaigns = [
  { name: 'AiApply', target: 300, markets: 4, applications: '1.2K', progress: 68 },
  { name: 'Astra AI', target: 500, markets: 1, applications: '890', progress: 72 },
  { name: 'JobCopilot', target: 240, markets: 3, applications: '620', progress: 51 },
];
export const applicationStatus = [
  { name: 'Approved', count: '12.4K', percent: 54 }, { name: 'In review', count: '6.8K', percent: 30 },
  { name: 'Pending', count: '2.1K', percent: 9 }, { name: 'Rejected', count: '1.6K', percent: 7 },
];
