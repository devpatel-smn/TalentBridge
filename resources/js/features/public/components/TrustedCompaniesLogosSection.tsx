import { IMAGES } from '@/lib/images';

const trustedCompanies = [
    { name: 'TCS', logo: IMAGES.logos.tcs },
    { name: 'Infosys', logo: IMAGES.logos.infosys },
    { name: 'Wipro', logo: IMAGES.logos.wipro },
    { name: 'HCL', logo: IMAGES.logos.hcl },
    { name: 'Flipkart', logo: IMAGES.logos.flipkart },
    { name: 'Tata', logo: IMAGES.logos.tata },
    { name: 'Google', logo: IMAGES.logos.google },
    { name: 'Microsoft', logo: IMAGES.logos.microsoft },
    { name: 'Amazon', logo: IMAGES.logos.amazon },
    { name: 'Stripe', logo: IMAGES.logos.stripe },
    { name: 'Accenture', logo: IMAGES.logos.accenture },
    { name: 'Shopify', logo: IMAGES.logos.shopify },
];

function LogoItem({ name, logo }: { name: string; logo: string }) {
    return (
        <div className="flex h-12 shrink-0 items-center justify-center px-3 md:h-14">
            <img
                src={logo}
                alt={`${name} logo`}
                className="h-9 w-auto max-w-[7.5rem] object-contain object-center md:h-10 md:max-w-[8.5rem]"
                loading="lazy"
                decoding="async"
            />
        </div>
    );
}

export function TrustedCompaniesLogosSection() {
    const marqueeLogos = [...trustedCompanies, ...trustedCompanies];

    return (
        <section
            data-section-tone="light"
            className="flex min-h-[13.5rem] flex-col justify-center border-b border-border bg-surface-sunken py-10 md:min-h-[15rem] md:py-12"
            aria-label="Trusted companies"
        >
            <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
                <p className="text-center text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground md:text-[0.8125rem]">
                    Trusted by teams at leading companies worldwide
                </p>
                <div className="marquee-container mt-6 md:mt-8">
                    <div className="marquee-track items-center gap-10 sm:gap-12 md:gap-14 motion-reduce:flex motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:[animation:none]">
                        {marqueeLogos.map((company, index) => (
                            <LogoItem key={`${company.name}-${index}`} name={company.name} logo={company.logo} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
