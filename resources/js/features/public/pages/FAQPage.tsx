import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
            <div className="border-b border-border/60 bg-muted/30 pt-header">
                <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
                    <h1 className="text-4xl font-bold tracking-tight">Frequently asked questions</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Everything you need to know about TalentBridge</p>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={faq.q} className="rounded-xl border border-border/60 bg-card overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold transition-colors hover:bg-muted/50"
                                aria-expanded={openIndex === index}
                            >
                                {faq.q}
                                <ChevronDown
                                    className={cn(
                                        'h-5 w-5 shrink-0 text-muted-foreground transition-transform',
                                        openIndex === index && 'rotate-180',
                                    )}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
