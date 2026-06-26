import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Software Engineer',
        company: 'Now at Stripe',
        quote: 'TalentBridge made my job search feel effortless. I found my dream role in two weeks with personalized recommendations that actually understood my background.',
        avatar: 'SC',
        featured: true,
    },
    {
        name: 'Marcus Johnson',
        role: 'Head of Talent',
        company: 'ScaleUp Inc.',
        quote: 'Our hiring velocity increased 3x. The employer dashboard gives us everything we need without the CRM complexity.',
        avatar: 'MJ',
        featured: false,
    },
    {
        name: 'Priya Sharma',
        role: 'Product Designer',
        company: 'Now at Figma',
        quote: 'The application tracking and interview scheduling saved me hours. Finally a platform that respects candidates.',
        avatar: 'PS',
        featured: false,
    },
];

export function TestimonialsSection() {
    const [featured, ...rest] = testimonials;

    return (
        <section className="landing-section-canvas overflow-x-clip py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Testimonials</p>
                        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">
                            Trusted by talent & teams
                        </h2>
                    </div>
                    <div className="flex items-center gap-0.5 text-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">4.9 average rating</span>
                    </div>
                </div>

                <div className="mt-10 grid gap-5 lg:grid-cols-12">
                    <div className="lg:col-span-7">
                        <blockquote className="card-glow-hover group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-8 dark:border-border/80 md:p-10">
                            <span
                                className="pointer-events-none absolute -right-1 -top-2 font-display text-[6rem] leading-none text-gold/6 md:text-[7rem]"
                                aria-hidden
                            >
                                &ldquo;
                            </span>
                            <div className="relative">
                                <div className="flex gap-0.5 text-gold">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                                    ))}
                                </div>
                                <p className="mt-6 font-display text-xl font-medium leading-[1.35] tracking-tight md:text-2xl lg:text-[1.75rem]">
                                    {featured.quote}
                                </p>
                            </div>
                            <div className="relative mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                                <Avatar className="h-11 w-11 ring-2 ring-gold/20">
                                    <AvatarFallback className="bg-navy/8 text-sm font-semibold text-navy dark:bg-gold/10 dark:text-gold">
                                        {getInitials(featured.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{featured.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {featured.role} · {featured.company}
                                    </p>
                                </div>
                            </div>
                        </blockquote>
                    </div>

                    <div className="flex flex-col gap-5 lg:col-span-5">
                        {rest.map((t) => (
                            <blockquote
                                key={t.name}
                                className="card-glow-hover flex flex-1 flex-col rounded-xl border border-border/60 bg-muted/25 p-6 dark:border-border/80 dark:bg-card/60"
                            >
                                <div className="flex gap-0.5 text-gold">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-current" />
                                    ))}
                                </div>
                                <p className="mt-3 flex-1 text-sm leading-[1.7] text-muted-foreground">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="mt-4 flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="bg-card text-xs font-semibold text-foreground">
                                            {getInitials(t.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {t.role} · {t.company}
                                        </p>
                                    </div>
                                </div>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
