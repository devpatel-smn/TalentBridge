import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('public/images');

async function cropCover({ input, outputWebp, outputJpg, width, height, position = 'centre' }) {
    const inputPath = path.join(root, input);
    const pipeline = sharp(inputPath).rotate().resize(width, height, {
        fit: 'cover',
        position,
    });

    await mkdir(path.dirname(path.join(root, outputWebp)), { recursive: true });

    await pipeline.clone().webp({ quality: 82 }).toFile(path.join(root, outputWebp));

    if (outputJpg) {
        await pipeline.clone().jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(root, outputJpg));
    }

    const meta = await sharp(path.join(root, outputWebp)).metadata();
    console.log(`✓ ${outputWebp} (${meta.width}x${meta.height})`);
}

const jobs = [
  {
    input: 'christina-wocintechchat-com-m-0Zx1bDv5BNY-unsplash.jpg',
    outputWebp: 'hero/professional-hero.webp',
    outputJpg: 'hero/professional-hero.jpg',
    width: 1000,
    height: 1250,
    position: 'centre',
  },
  {
    input: 'job-seeker.webp',
    outputWebp: 'cta/job-seeker.webp',
    outputJpg: 'cta/job-seeker.jpg',
    width: 1200,
    height: 720,
    position: 'centre',
  },
  {
    input: 'alex-kotliarskyi-QBpZGqEMsKg-unsplash.jpg',
    outputWebp: 'jobs/card-freshers.webp',
    width: 1600,
    height: 550,
    position: 'centre',
  },
  {
    input: 'arlington-research-kN_kViDchA0-unsplash.jpg',
    outputWebp: 'jobs/card-full-time.webp',
    width: 1600,
    height: 550,
    position: 'centre',
  },
  {
    input: 'redd-francisco-PTRzqc_h1r4-unsplash.jpg',
    outputWebp: 'jobs/card-part-time.webp',
    width: 1600,
    height: 550,
    position: 'centre',
  },
  {
    input: 'lyubomyr-reverchuk-rtD_lcsN6_U-unsplash.jpg',
    outputWebp: 'jobs/card-remote.webp',
    width: 1600,
    height: 550,
    position: 'centre',
  },
  {
    input: 'vitaly-gariev-LlcpQWSWPUo-unsplash.jpg',
    outputWebp: 'success-stories/seeker-ananya.webp',
    width: 960,
    height: 600,
    position: 'right',
  },
  {
    input: 'pexels-kampus-8204363.jpg',
    outputWebp: 'success-stories/employer-rahul.webp',
    width: 960,
    height: 600,
    position: 'centre',
  },
  {
    input: 'pexels-mikhail-nilov-6894221.jpg',
    outputWebp: 'success-stories/seeker-priya.webp',
    width: 960,
    height: 600,
    position: 'left',
  },
  {
    input: 'proxyclick-visitor-management-system-s86WhGhp25Y-unsplash.jpg',
    outputWebp: 'success-stories/employer-james.webp',
    width: 960,
    height: 600,
    position: 'centre',
  },
];

for (const job of jobs) {
    await cropCover(job);
}

console.log('Done — all homepage images cropped and saved.');
