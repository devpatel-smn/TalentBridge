export function PrivacyPage() {
    return (
        <>
            <div className="border-b border-border/60 bg-muted/30">
                <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
                    <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="mt-4 text-muted-foreground">Last updated: June 2026</p>
                </div>
            </div>
            <article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-16 md:px-6">
                <section className="space-y-4 text-muted-foreground">
                    <h2 className="text-xl font-semibold text-foreground">1. Information we collect</h2>
                    <p>
                        We collect information you provide directly, including account details, profile information,
                        resumes, application data, and communications. We also collect usage data and device information
                        to improve our services.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground">2. How we use your information</h2>
                    <p>
                        Your information is used to provide and improve TalentBridge, facilitate job applications and
                        hiring processes, send notifications you&apos;ve opted into, and ensure platform security.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground">3. Information sharing</h2>
                    <p>
                        We share applicant information with employers when you apply to their jobs. We do not sell your
                        personal data. We may share data with service providers who assist in operating our platform.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground">4. Data retention</h2>
                    <p>
                        We retain your data for as long as your account is active or as needed to provide services. You
                        may request deletion of your account and associated data at any time.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground">5. Your rights</h2>
                    <p>
                        Depending on your location, you may have rights to access, correct, delete, or export your personal
                        data. Contact us at privacy@talentbridge.com to exercise these rights.
                    </p>

                    <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
                    <p>
                        For privacy-related inquiries, email us at privacy@talentbridge.com.
                    </p>
                </section>
            </article>
        </>
    );
}
