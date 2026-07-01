import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { PageMeta } from '@/components/common/PageMeta';
import { cn } from '@/lib/utils';

const faqs = [
    {
        q: 'Is TalentBridge free for job seekers?',
        a: 'Yes! Creating an account, searching jobs, applying, and using our resume builder are completely free for job seekers.',
    },
    {
        q: 'How do employers get verified?',
        a: 'Employers submit business verification documents through their dashboard. Our team reviews submissions within 2-3 business days.',
    },
    {
        q: 'Can I apply without creating an account?',
        a: 'You can browse all published jobs without an account. To apply, save jobs, or track applications, you\'ll need a free job seeker account.',
    },
    {
        q: 'How does job matching work?',
        a: 'Our recommendation engine analyzes your skills, experience, location preferences, and salary expectations to surface roles with the highest match scores.',
    },
    {
        q: 'Is my data secure?',
        a: 'We use industry-standard encryption, secure file storage, and strict access controls. See our Privacy Policy for full details.',
    },
    {
        q: 'How do I delete my account?',
        a: 'You can request account deletion from your Account Settings page. We\'ll process your request in accordance with our data retention policy.',
    },
];

export function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <>
            <PageMeta
                title="FAQ"
                description="Answers to common questions about TalentBridge for job seekers and employers."
            />
            <PageHero
                title="Frequently asked questions"
                description="Everything you need to know about TalentBridge"
                className="text-center [&_.page-hero-inner]:max-w-3xl [&_.page-hero-inner]:text-center [&_.page-hero-description]:mx-auto"
            />

            <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const panelId = `faq-panel-${index}`;
                        const isOpen = openIndex === index;
                        return (
                        <div key={faq.q} className="overflow-hidden rounded-xl border border-border/60 bg-card">
                            <button
                                type="button"
                                id={`faq-trigger-${index}`}
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold transition-colors hover:bg-muted/50 sm:text-base"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                            >
                                {faq.q}
                                <ChevronDown
                                    className={cn(
                                        'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none',
                                        isOpen && 'rotate-180',
                                    )}
                                    aria-hidden="true"
                                />
                            </button>
                            <div
                                id={panelId}
                                role="region"
                                aria-labelledby={`faq-trigger-${index}`}
                                hidden={!isOpen}
                                className={cn(
                                    'border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground',
                                    !isOpen && 'hidden',
                                )}
                            >
                                {faq.a}
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
