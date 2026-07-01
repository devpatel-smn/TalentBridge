import { FeaturedEmployersSection } from '@/features/public/components/FeaturedEmployersSection';
import { FeaturedJobsSection } from '@/features/public/components/FeaturedJobsSection';
import { HeroSection } from '@/features/public/components/HeroSection';
import { HowItWorksSection } from '@/features/public/components/HowItWorksSection';
import { LocationsSection } from '@/features/public/components/LocationsSection';
import { PlatformStatsSection } from '@/features/public/components/PlatformStatsSection';
import { PopularJobsSection } from '@/features/public/components/PopularJobsSection';
import { SuccessStoriesSection } from '@/features/public/components/SuccessStoriesSection';
import { TrustedCompaniesLogosSection } from '@/features/public/components/TrustedCompaniesLogosSection';
import { WhyChooseSection } from '@/features/public/components/WhyChooseSection';
import { CTASection } from '@/features/public/components/CTASection';
import { PageMeta } from '@/components/common/PageMeta';

export function HomePage() {
    return (
        <div className="min-w-0 max-w-full">
            <PageMeta
                title="TalentBridge"
                description="Where exceptional talent meets exceptional teams. Search jobs, explore companies, and manage your career on a premium recruitment platform."
            />
            <HeroSection />
            <TrustedCompaniesLogosSection />
            <PlatformStatsSection />
            <FeaturedJobsSection />
            <FeaturedEmployersSection />
            <HowItWorksSection />
            <WhyChooseSection />
            <PopularJobsSection />
            <LocationsSection />
            <SuccessStoriesSection />
            <CTASection />
            <CTASection variant="employer" />
        </div>
    );
}
