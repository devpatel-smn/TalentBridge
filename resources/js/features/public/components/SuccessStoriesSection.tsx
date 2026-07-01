import { ArrowRight, Building2, Quote } from 'lucide-react';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { CompanyAvatar } from '@/components/common/CompanyAvatar';
import { RevealSection, StaggerReveal } from '@/components/common/RevealSection';
import { IMAGES } from '@/lib/images';
import { cn } from '@/lib/utils';

interface SuccessStory {
    name: string;
    role: string;
    company: string;
    metric: string;
    metricLabel: string;
    quote: string;
    type: 'seeker' | 'employer';
    image: string;
    imageAlt: string;
    imagePosition: string;
}

const stories: SuccessStory[] = [
    {
        name: 'Ananya Reddy',
        role: 'Senior Software Engineer',
        company: 'Infosys',
        metric: '18 days',
        metricLabel: 'Time to offer',
        quote:
            'After six years in enterprise IT, I wanted a product role without sending hundreds of applications. TalentBridge surfaced three verified openings in Bangalore — I accepted an offer in under three weeks.',
        type: 'seeker',
        image: IMAGES.successStories.seekerAnanya,
        imageAlt: 'Software engineer in a modern Bangalore office',
        imagePosition: 'object-center',
    },
    {
        name: 'Rahul Mehta',
        role: 'Head of Talent Acquisition',
        company: 'Flipkart',
        metric: '24 hires',
        metricLabel: 'In six weeks',
        quote:
            'We needed to scale our logistics tech team ahead of peak season. The verified pipeline and interview scheduling cut our time-to-hire by nearly half compared to our previous process.',
        type: 'employer',
        image: IMAGES.successStories.employerRahul,
        imageAlt: 'Hiring team reviewing candidates in a conference room',
        imagePosition: 'object-center',
    },
    {
        name: 'Priya Sharma',
        role: 'Lead Product Designer',
        company: 'Google',
        metric: '12 days',
        metricLabel: 'Offer to start',
        quote:
            'I relocated from Pune to Hyderabad for my new role. Application tracking kept every recruiter conversation in one place — no more lost threads across email and LinkedIn.',
        type: 'seeker',
        image: IMAGES.successStories.seekerPriya,
        imageAlt: 'Product designer working at a modern desk',
        imagePosition: 'object-center',
    },
    {
        name: 'James Okonkwo',
        role: 'VP of People',
        company: 'Stripe',
        metric: '89%',
        metricLabel: 'Offer acceptance',
        quote:
            'TalentBridge helped us reach senior engineers we were missing on traditional boards. The quality of shortlisted candidates was consistently higher, and our leadership team trusted the analytics.',
        type: 'employer',
        image: IMAGES.successStories.employerJames,
        imageAlt: 'People operations leader in a professional setting',
        imagePosition: 'object-center',
    },
];

function StoryCard({ story, priority }: { story: SuccessStory; priority?: boolean }) {
    return (
        <article className="landing-card group flex h-full min-h-0 flex-col overflow-hidden">
            <div className="relative aspect-[3/2] overflow-hidden sm:aspect-[16/10]">
                <OptimizedImage
                    src={story.image}
                    alt={story.imageAlt}
                    priority={priority}
                    className={cn(
                        'object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
                        story.imagePosition,
                    )}
                />
                <div className="absolute inset-0 bg-navy/40" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{story.name}</p>
                        <p className="truncate text-xs text-white/80">{story.role}</p>
                    </div>
                    <CompanyAvatar name={story.company} size="sm" className="ring-2 ring-white/25" />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                    {story.type === 'seeker' ? (
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                        <Building2 className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                    {story.type === 'seeker' ? 'Career move' : 'Hiring win'}
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-medium tracking-tight text-foreground">{story.metric}</span>
                    <span className="text-sm text-muted-foreground">{story.metricLabel}</span>
                </div>

                <blockquote className="mt-4 flex-1">
                    <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gold/25 bg-gold/10">
                        <Quote className="h-4 w-4 text-gold" strokeWidth={2} aria-hidden />
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] md:leading-[1.72]">
                        {story.quote}
                    </p>
                </blockquote>

                <p className="mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{story.company}</span>
                    {story.type === 'seeker' ? ' · New role secured' : ' · Team expanded'}
                </p>
            </div>
        </article>
    );
}

export function SuccessStoriesSection() {
    return (
        <section data-section-tone="light" className="landing-section-alt section-spacing overflow-x-clip">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <RevealSection variant="fade-up" className="mx-auto max-w-2xl text-center">
                    <p className="section-eyebrow">Success stories</p>
                    <h2 className="section-title-lg">Real outcomes, real people</h2>
                    <p className="section-description md:text-lg">
                        From faster hires to dream roles — measurable results from talent and teams on TalentBridge.
                    </p>
                </RevealSection>

                <StaggerReveal
                    variant="fade-up"
                    staggerMs={60}
                    className="mt-12 grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {stories.map((story, index) => (
                        <StoryCard key={story.name} story={story} priority={index < 2} />
                    ))}
                </StaggerReveal>
            </div>
        </section>
    );
}
