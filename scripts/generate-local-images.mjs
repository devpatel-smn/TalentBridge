/** Generate branded local workplace SVG illustrations (no network). */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');

function svg({ label, accentX = 50, accentY = 42, variant = 0 }) {
    const shapes =
        variant === 0
            ? `<circle cx="${accentX}%" cy="${accentY}%" r="18%" fill="#e8a04a" fill-opacity="0.22"/>
       <rect x="12%" y="58%" width="76%" height="2%" rx="1%" fill="#f5f0ea" fill-opacity="0.14"/>
       <rect x="18%" y="64%" width="64%" height="1.2%" rx="0.6%" fill="#f5f0ea" fill-opacity="0.09"/>`
            : variant === 1
              ? `<rect x="20%" y="28%" width="60%" height="34%" rx="3%" fill="#e8a04a" fill-opacity="0.12"/>
       <rect x="26%" y="36%" width="48%" height="18%" rx="2%" fill="#f5f0ea" fill-opacity="0.08"/>`
              : `<ellipse cx="${accentX}%" cy="${accentY}%" rx="22%" ry="16%" fill="#e8a04a" fill-opacity="0.18"/>
       <rect x="14%" y="62%" width="72%" height="18%" rx="3%" fill="#f5f0ea" fill-opacity="0.06"/>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" fill="none" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1816"/>
      <stop offset="55%" stop-color="#252119"/>
      <stop offset="100%" stop-color="#2f2a24"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#e8a04a" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#e8a04a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="960" height="720" fill="url(#bg)"/>
  <rect width="960" height="720" fill="url(#glow)"/>
  <rect x="6%" y="10%" width="88%" height="80%" rx="3%" fill="#f5f0ea" fill-opacity="0.04"/>
  ${shapes}
</svg>`;
}

const assets = {
    'hero/team-collaboration.svg': { label: 'Team collaboration in a modern office', variant: 0, accentX: 35, accentY: 38 },
    'hero/hr-meeting.svg': { label: 'HR professionals in a strategy meeting', variant: 1 },
    'hero/job-interview.svg': { label: 'Professional job interview', variant: 2, accentX: 55, accentY: 40 },
    'hero/career-consultation.svg': { label: 'Career consultation session', variant: 0, accentX: 62, accentY: 36 },
    'hero/modern-workplace.svg': { label: 'Modern collaborative workplace', variant: 1 },
    'hero/hiring-review.svg': { label: 'Hiring managers reviewing candidates', variant: 2, accentX: 48, accentY: 44 },
    'locations/san-francisco.svg': { label: 'San Francisco skyline', variant: 1 },
    'locations/new-york.svg': { label: 'New York cityscape', variant: 0, accentX: 50, accentY: 35 },
    'locations/london.svg': { label: 'London cityscape', variant: 2, accentX: 45, accentY: 38 },
    'locations/berlin.svg': { label: 'Berlin cityscape', variant: 1 },
    'locations/toronto.svg': { label: 'Toronto cityscape', variant: 0, accentX: 58, accentY: 40 },
    'locations/sydney.svg': { label: 'Sydney harbour', variant: 2, accentX: 52, accentY: 36 },
    'locations/dubai.svg': { label: 'Dubai skyline', variant: 1 },
    'locations/remote.svg': { label: 'Remote work setup', variant: 0, accentX: 42, accentY: 45 },
    'jobs/freshers.svg': { label: 'Early career professionals', variant: 0, accentX: 50, accentY: 40 },
    'jobs/full-time.svg': { label: 'Full-time team at work', variant: 1 },
    'jobs/part-time.svg': { label: 'Flexible work environment', variant: 2, accentX: 54, accentY: 42 },
    'jobs/remote-work.svg': { label: 'Work from home', variant: 0, accentX: 46, accentY: 38 },
    'cta/hiring-team.svg': { label: 'Hiring team collaborating', variant: 1 },
    'about/team-meeting.svg': { label: 'Professional team meeting', variant: 2, accentX: 50, accentY: 40 },
};

for (const [relativePath, meta] of Object.entries(assets)) {
    const dest = join(root, relativePath);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, svg(meta), 'utf8');
    console.log(`Wrote ${relativePath}`);
}

console.log('Generated local image assets.');
