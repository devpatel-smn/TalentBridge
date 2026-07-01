import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, MapPin, Users } from 'lucide-react';
import { CompanyAvatar } from '@/components/common/CompanyAvatar';
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { StaggerReveal } from '@/components/common/RevealSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeaturedEmployers, type CompanyWithMeta } from '@/features/public/hooks/useHomepageJobs';
import { employerCardImage } from '@/lib/images';
import { PUBLIC_PATHS } from '@/lib/paths';

const industryDescriptions: Record<string, string> = {
    Technology: 'Building products that shape how teams work and connect.',
    Finance: 'Driving innovation across payments, banking, and fintech.',
    Healthcare: 'Improving patient outcomes through modern care delivery.',
    Retail: 'Reimagining commerce with data-driven customer experiences.',
    Education: 'Expanding access to learning through digital platforms.',
};

function companyDescription(company: CompanyWithMeta): string {
    if (company.industry && industryDescriptions[company.industry]) {
        return industryDescriptions[company.industry];
    }
    return `Growing ${company.industry ?? 'company'} hiring talented professionals across multiple teams.`;
}

function EmployerCard({ company, index }: { company: CompanyWithMeta; index: number }) {
    const location = company.headquarters ?? 'Global';
    const employees = company.company_size ?? 'Growing team';
    const description = companyDescription(company);

    return (
        <article className="landing-card group flex h-full min-w-0 flex-col overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[5/3]">
                <OptimizedImage
                    src={employerCardImage(index)}
                    alt={`${company.name} workplace`}
                    className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-card/30" />
                <div className="absolute bottom-3 left-4">
                    <CompanyAvatar name={company.name} size="lg" className="ring-2 ring-background/80" />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="min-w-0">
                    <Link
                        to={PUBLIC_PATHS.company(company.slug)}
                        className="truncate font-display text-lg font-medium text-foreground transition-colors hover:text-gold"
                    >
                        {company.name}
                    </Link>
                    {company.industry && (
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">{company.industry}</p>
                    )}
                    {company.verification_status === 'approved' && (
                        <Badge variant="secondary" className="mt-2 rounded-full px-2 py-0 text-[0.625rem]">
                            Verified employer
                        </Badge>
                    )}
                </div>

                <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>

                <div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                        <span className="truncate">{location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                        <span className="truncate">{employees}</span>
                    </p>
                    <p className="flex items-center gap-2 font-medium text-foreground">
                        <Briefcase className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                        {company.openPositions} open {company.openPositions === 1 ? 'role' : 'roles'}
                    </p>
                </div>

                <Button variant="outline" asChild className="mt-5 w-full rounded-xl">
                    <Link to={PUBLIC_PATHS.company(company.slug)}>
                        View jobs
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </article>
    );
}

export function FeaturedEmployersSection() {
    const { companies, isLoading } = useFeaturedEmployers();

    if (!isLoading && companies.length === 0) {
        return null;
    }

    return (
        <section data-section-tone="light" className="landing-section-alt section-spacing overflow-x-clip">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div className="min-w-0 max-w-xl">
                        <p className="section-eyebrow">Featured employers</p>
                        <h2 className="section-title-lg">Companies hiring now</h2>
                        <p className="section-description">
                            Explore verified teams actively recruiting — with culture, scale, and open roles in one view.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="shrink-0 rounded-xl">
                        <Link to={PUBLIC_PATHS.companies}>
                            View all companies
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-96 rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <StaggerReveal
                        variant="fade-up"
                        staggerMs={80}
                        className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {companies.map((company, index) => (
                            <EmployerCard key={company.slug} company={company} index={index} />
                        ))}
                    </StaggerReveal>
                )}
            </div>
        </section>
    );
}
