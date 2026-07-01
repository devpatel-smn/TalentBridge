/**
 * One-time script to download optimized WebP workplace images into public/images/.
 * Run: node scripts/fetch-local-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const images = {
    'public/images/hero/team-collaboration.webp':
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=960&q=85&fm=webp&fit=crop',
    'public/images/hero/hr-meeting.webp':
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=960&q=85&fm=webp&fit=crop',
    'public/images/hero/job-interview.webp':
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=960&q=85&fm=webp&fit=crop',
    'public/images/hero/career-consultation.webp':
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=960&q=85&fm=webp&fit=crop',
    'public/images/hero/modern-workplace.webp':
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=960&q=85&fm=webp&fit=crop',
    'public/images/hero/hiring-review.webp':
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=960&q=85&fm=webp&fit=crop',
    'public/images/locations/san-francisco.webp':
        'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80&fm=webp&fit=crop',
    'public/images/locations/new-york.webp':
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80&fm=webp&fit=crop',
    'public/images/locations/london.webp':
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80&fm=webp&fit=crop',
    'public/images/locations/berlin.webp':
        'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80&fm=webp&fit=crop',
    'public/images/locations/toronto.webp':
        'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&q=80&fm=webp&fit=crop',
    'public/images/locations/sydney.webp':
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80&fm=webp&fit=crop',
    'public/images/locations/dubai.webp':
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80&fm=webp&fit=crop',
    'public/images/locations/remote.webp':
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80&fm=webp&fit=crop',
    'public/images/jobs/freshers.webp':
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&fm=webp&fit=crop',
    'public/images/jobs/full-time.webp':
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&fm=webp&fit=crop',
    'public/images/jobs/part-time.webp':
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&fm=webp&fit=crop',
    'public/images/jobs/remote-work.webp':
        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80&fm=webp&fit=crop',
    'public/images/cta/hiring-team.webp':
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&fm=webp&fit=crop',
    'public/images/about/team-meeting.webp':
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&fm=webp&fit=crop',
};

for (const [relativePath, url] of Object.entries(images)) {
    const dest = join(root, relativePath);
    await mkdir(dirname(dest), { recursive: true });
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed ${relativePath}: ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(dest, buffer);
    console.log(`Saved ${relativePath}`);
}

console.log('Done.');
