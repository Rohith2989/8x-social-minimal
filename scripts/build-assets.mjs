import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/media', {recursive:true});
const src='assets/hero/portraits-complete-v2.png';
const meta=await sharp(src).metadata();
if(!meta.hasAlpha) throw new Error('Portrait cutout has no alpha channel');
await sharp(src).resize({width:1944,withoutEnlargement:true}).webp({quality:90,alphaQuality:100,effort:6}).toFile('public/media/portraits-v2.webp');
await sharp(src).resize({width:1100,withoutEnlargement:true}).webp({quality:87,alphaQuality:100,effort:6}).toFile('public/media/portraits-small-v2.webp');
console.log('Portrait web derivatives saved; original retained.', meta.width, meta.height);
