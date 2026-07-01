import { PageHero } from '@/components/common/PageHero';
import { PageMeta } from '@/components/common/PageMeta';

export function TermsPage() {
    return (
        <>
            <PageMeta title="Terms of Service" description="Terms and conditions for using the TalentBridge platform." />
            <PageHero title="Terms of Service" description="Last updated: June 2026" />
            <article className="prose-readable mx-auto max-w-3xl space-y-8 px-4 py-12 text-muted-foreground md:px-6 md:py-16">
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">1. Acceptance of terms</h2>
                    <p>
                        By accessing or using TalentBridge, you agree to be bound by these Terms of Service. If you do
                        not agree, please do not use our platform.
                    </p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">2. Account responsibilities</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials and for all
                        activity under your account. You must provide accurate information and keep your profile up to date.
                    </p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">3. Acceptable use</h2>
                    <p>
                        You may not use TalentBridge for unlawful purposes, spam, harassment, or to post misleading job
                        listings. Employers must comply with applicable employment and anti-discrimination laws.
                    </p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">4. Intellectual property</h2>
                    <p>
                        TalentBridge and its content are protected by intellectual property laws. You retain ownership of
                        content you upload but grant us a license to use it to provide our services.
                    </p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">5. Limitation of liability</h2>
                    <p>
                        TalentBridge is provided &ldquo;as is.&rdquo; We are not responsible for hiring decisions, employment
                        outcomes, or the accuracy of user-submitted content.
                    </p>
                </section>
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
                    <p>Questions about these terms? Contact legal@talentbridge.com.</p>
                </section>
            </article>
        </>
    );
}
