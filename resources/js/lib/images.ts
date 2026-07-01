/** Local optimized image assets — never hotlink external URLs */

function img(path: string) {
    return `/images/${path}`;
}

/** Prefer WebP with JPG fallback for browsers that need it */
function imgWebp(webpPath: string, jpgPath: string) {
    return { webp: img(webpPath), fallback: img(jpgPath) };
}

export const IMAGES = {
    hero: {
        professional: imgWebp('hero/professional-hero.webp', 'hero/professional-hero.jpg'),
        teamCollaboration: imgWebp('hero/team-collaboration.webp', 'hero/team-collaboration.jpg'),
        hrMeeting: imgWebp('hero/hr-meeting.webp', 'hero/hr-meeting.jpg'),
        jobInterview: imgWebp('hero/job-interview.webp', 'hero/job-interview.jpg'),
        careerConsultation: imgWebp('hero/career-consultation.webp', 'hero/career-consultation.jpg'),
        modernWorkplace: imgWebp('hero/modern-workplace.webp', 'hero/modern-workplace.jpg'),
        hiringReview: imgWebp('hero/hiring-review.webp', 'hero/hiring-review.jpg'),
    },
    locations: {
        sanFrancisco: imgWebp('locations/san-francisco.webp', 'locations/san-francisco.jpg'),
        newYork: imgWebp('locations/new-york.webp', 'locations/new-york.jpg'),
        london: imgWebp('locations/london.webp', 'locations/london.jpg'),
        berlin: imgWebp('locations/berlin.webp', 'locations/berlin.jpg'),
        toronto: imgWebp('locations/toronto.webp', 'locations/toronto.jpg'),
        sydney: imgWebp('locations/sydney.webp', 'locations/sydney.jpg'),
        dubai: imgWebp('locations/dubai.webp', 'locations/dubai.jpg'),
        remote: imgWebp('locations/remote.webp', 'locations/remote.jpg'),
    },
    jobs: {
        freshers: img('jobs/card-freshers.webp'),
        fullTime: img('jobs/card-full-time.webp'),
        partTime: img('jobs/card-part-time.webp'),
        remoteWork: img('jobs/card-remote.webp'),
    },
    successStories: {
        seekerAnanya: img('success-stories/seeker-ananya.webp'),
        employerRahul: img('success-stories/employer-rahul.webp'),
        seekerPriya: img('success-stories/seeker-priya.webp'),
        employerJames: img('success-stories/employer-james.webp'),
    },
    employers: {
        office1: imgWebp('employers/office-1.webp', 'employers/office-1.jpg'),
        office2: imgWebp('employers/office-2.webp', 'employers/office-2.jpg'),
        office3: imgWebp('employers/office-3.webp', 'employers/office-3.jpg'),
        office4: imgWebp('employers/office-4.webp', 'employers/office-4.jpg'),
    },
    featuredJobs: {
        remote: imgWebp('jobs/remote-work.webp', 'jobs/remote-work.jpg'),
        hybrid: imgWebp('jobs/full-time.webp', 'jobs/full-time.jpg'),
        onsite: imgWebp('jobs/part-time.webp', 'jobs/part-time.jpg'),
        default: imgWebp('jobs/freshers.webp', 'jobs/freshers.jpg'),
    },
    cta: {
        hiringTeam: imgWebp('cta/hiring-team.webp', 'cta/hiring-team.jpg'),
        jobSeeker: imgWebp('cta/job-seeker.webp', 'cta/job-seeker.jpg'),
    },
    about: {
        teamMeeting: img('about/team-meeting.jpg'),
    },
    logos: {
        tcs: img('logos/tcs.svg'),
        infosys: img('logos/infosys.svg'),
        wipro: img('logos/wipro.svg'),
        hcl: img('logos/hcl.svg'),
        flipkart: img('logos/flipkart.svg'),
        tata: img('logos/tata.svg'),
        google: img('logos/google.svg'),
        microsoft: img('logos/microsoft.svg'),
        amazon: img('logos/amazon.svg'),
        stripe: img('logos/stripe.svg'),
        accenture: img('logos/accenture.svg'),
        shopify: img('logos/shopify.svg'),
    },
} as const;

export type ImageSource = string | { webp: string; fallback: string };

export function resolveImageSrc(source: ImageSource): string {
    return typeof source === 'string' ? source : source.webp;
}

export function resolveImageFallback(source: ImageSource): string | undefined {
    return typeof source === 'string' ? undefined : source.fallback;
}

export function jobCardImage(workMode: string): ImageSource {
    if (workMode === 'remote') return IMAGES.featuredJobs.remote;
    if (workMode === 'hybrid') return IMAGES.featuredJobs.hybrid;
    if (workMode === 'onsite') return IMAGES.featuredJobs.onsite;
    return IMAGES.featuredJobs.default;
}

export function employerCardImage(index: number): ImageSource {
    const pool = [
        IMAGES.employers.office1,
        IMAGES.employers.office2,
        IMAGES.employers.office3,
        IMAGES.employers.office4,
    ];
    return pool[index % pool.length];
}

/** Consistent object-position presets for crisp photo crops */
export const IMAGE_CROP = {
    hero: 'object-cover object-center',
    heroPortrait: 'object-cover object-[center_20%]',
    cardWide: 'object-cover object-center',
    cardPortrait: 'object-cover object-[center_15%]',
    location: 'object-cover object-center',
} as const;
