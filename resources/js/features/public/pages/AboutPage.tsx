import { Link } from 'react-router-dom';
import { Target, Users, Zap } from 'lucide-react';
import { IconBox } from '@/components/common/IconBox';
import { CTASection } from '@/features/public/components/CTASection';
import { PUBLIC_PATHS } from '@/lib/paths';

export function AboutPage() {
    return (
        <>
            <div className="page-hero">
                <div className="page-hero-inner">
                    <h1 className="page-hero-title">About TalentBridge</h1>
                    <p className="page-hero-description">
                        We&apos;re building the recruitment platform we always wished existed — beautiful, fast, and
                        designed for both candidates and hiring teams.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="aspect-video overflow-hidden rounded-2xl border border-border/60 shadow-elevation-2">
                        <img
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                            alt="Professional team meeting"
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">Our mission</h2>
                        <p className="leading-relaxed text-muted-foreground">
                            TalentBridge exists to make hiring human again. We believe great careers start with great
                            matches — and that technology should remove friction, not add it. Whether you&apos;re searching
                            for your next role or building a world-class team, we give you the tools to move with
                            confidence.
                        </p>
                        <p className="leading-relaxed text-muted-foreground">
                            Founded with a vision to rival the best job platforms in the world, TalentBridge combines
                            enterprise-grade ATS capabilities with a consumer-grade experience that candidates actually
                            enjoy using.
                        </p>
                    </div>
                </div>

                <div className="mt-20 grid gap-6 md:grid-cols-3">
                    {[
                        {
                            icon: Target,
                            title: 'Purpose-driven',
                            description: 'Every feature we build serves real hiring and career goals.',
                            variant: 'primary' as const,
                        },
                        {
                            icon: Users,
                            title: 'People first',
                            description: 'Candidates and recruiters deserve tools that respect their time.',
                            variant: 'success' as const,
                        },
                        {
                            icon: Zap,
                            title: 'Always improving',
                            description: 'We ship continuously to stay ahead of how work is changing.',
                            variant: 'warning' as const,
                        },
                    ].map((item) => (
                        <div key={item.title} className="card-glow-hover rounded-xl border border-border/60 bg-card p-6">
                            <IconBox icon={item.icon} variant={item.variant} size="md" className="mb-4" />
                            <h3 className="font-display font-medium">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <CTASection />
        </>
    );
}
