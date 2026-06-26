import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    Code2,
    HeartPulse,
    LineChart,
    Palette,
    Shield,
    Truck,
    Users,
} from 'lucide-react';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { PUBLIC_PATHS } from '@/lib/paths';
import { RevealSection, StaggerReveal } from '@/components/common/RevealSection';
import type { LucideIcon } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
    engineering: Code2,
    technology: Code2,
    design: Palette,
    marketing: LineChart,
    sales: Users,
    healthcare: HeartPulse,
    logistics: Truck,
    security: Shield,
};

const categoryImages: Record<string, string> = {
    engineering: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=240&q=80',
    technology: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=240&q=80',
    design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=240&q=80',
    marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=240&q=80',
    sales: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=240&q=80',
    healthcare: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=240&q=80',
    operations: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=240&q=80',
    logistics: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=240&q=80',
};

const defaultCategories = [
    { name: 'Engineering', slug: 'engineering', icon: Code2, num: '01' },
    { name: 'Design', slug: 'design', icon: Palette, num: '02' },
    { name: 'Marketing', slug: 'marketing', icon: LineChart, num: '03' },
    { name: 'Sales', slug: 'sales', icon: Users, num: '04' },
    { name: 'Healthcare', slug: 'healthcare', icon: HeartPulse, num: '05' },
    { name: 'Operations', slug: 'operations', icon: Truck, num: '06' },
];

const sectionImage =
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=85';

export function CategoriesSection() {
    const { data: categories = [] } = useQuery({
        queryKey: ['job-categories'],
        queryFn: jobsApi.categories,
    });

    const display =
        categories.length > 0
            ? categories.slice(0, 6).map((c, i) => ({
                  name: c.name,
                  slug: c.slug,
                  icon: categoryIcons[c.slug] ?? Briefcase,
                  image: categoryImages[c.slug] ?? categoryImages.engineering,
                  num: String(i + 1).padStart(2, '0'),
              }))
            : defaultCategories.map((c) => ({
                  ...c,
                  image: categoryImages[c.slug] ?? categoryImages.engineering,
              }));

    return (
        <section className="surface-navy grain-overlay overflow-x-clip py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="grid min-w-0 gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-16">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <RevealSection variant="fade-up">
                            <p className="font-display text-sm font-medium tracking-wide text-gold md:text-base">
                                Categories
                            </p>
                            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                                Find your field
                            </h2>
                            <p className="mt-5 text-base leading-relaxed text-white/55 md:text-lg md:leading-[1.75]">
                                Browse roles across industries — from early-stage startups to global enterprises.
                                Whether you are building products, shaping brands, or leading teams, discover
                                opportunities matched to your expertise.
                            </p>
                            <p className="mt-4 text-sm leading-relaxed text-white/45 md:text-base">
                                Six core disciplines. Thousands of open roles. One platform built for serious
                                professionals.
                            </p>
                        </RevealSection>

                        <RevealSection variant="fade-up" delay={120} className="mt-8">
                            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-elevation-2">
                                <img
                                    src={sectionImage}
                                    alt="Professionals collaborating across industries"
                                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5">
                                    <p className="font-display text-lg font-medium text-white md:text-xl">
                                        Roles across every industry
                                    </p>
                                    <p className="mt-1 text-sm text-white/70">
                                        From engineering to healthcare — find where you belong.
                                    </p>
                                </div>
                            </div>
                        </RevealSection>

                        <div className="mt-8 hidden h-px w-16 bg-gold/40 lg:block" aria-hidden />
                    </div>

                    <StaggerReveal variant="fade-up" staggerMs={80} className="min-w-0 space-y-3">
                        {display.map((cat) => (
                            <Link
                                key={cat.slug}
                                to={`${PUBLIC_PATHS.jobs}?category=${cat.slug}`}
                                className="category-row group flex min-w-0 items-center gap-4 rounded-xl px-4 py-5 transition-colors hover:bg-white/5 md:gap-5 md:px-5 md:py-6"
                            >
                                <span className="category-num w-10 shrink-0 font-display text-2xl font-medium text-white/20 md:text-3xl">
                                    {cat.num}
                                </span>
                                <div className="category-thumb-wrap category-icon-wrap flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-elevation-1 md:h-[4.5rem] md:w-[4.5rem]">
                                    <img src={cat.image} alt="" className="absolute inset-0" loading="lazy" />
                                    <div className="category-thumb-overlay" aria-hidden />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-display text-xl font-medium text-white transition-colors duration-300 group-hover:text-gold md:text-2xl">
                                        {cat.name}
                                    </p>
                                    <p className="mt-1 text-sm text-white/45">Explore open positions</p>
                                </div>
                                <span className="hidden shrink-0 translate-x-2 text-sm font-medium text-gold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
                                    Browse →
                                </span>
                            </Link>
                        ))}
                    </StaggerReveal>
                </div>
            </div>
        </section>
    );
}
