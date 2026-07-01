import { Briefcase, FileText, Search, UserPlus, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RevealSection } from '@/components/common/RevealSection';
import { cn } from '@/lib/utils';

interface Step {
    icon: LucideIcon;
    title: string;
    description: string;
}

const jobSeekerSteps: Step[] = [
    {
        icon: UserPlus,
        title: 'Create Profile',
        description: 'Build a polished profile that showcases your skills, experience, and career goals.',
    },
    {
        icon: FileText,
        title: 'Apply',
        description: 'Discover matched roles and submit applications with one click — tracked in real time.',
    },
    {
        icon: Briefcase,
        title: 'Get Hired',
        description: 'Interview, receive offers, and land your next role with full visibility every step.',
    },
];

const employerSteps: Step[] = [
    {
        icon: FileText,
        title: 'Post Job',
        description: 'Publish roles in minutes with structured listings that attract qualified candidates.',
    },
    {
        icon: Search,
        title: 'Review Candidates',
        description: 'Manage your pipeline, shortlist talent, and schedule interviews from one workspace.',
    },
    {
        icon: Users,
        title: 'Hire Faster',
        description: 'Move from posting to offer with tools designed to reduce time-to-hire.',
    },
];

function StepFlow({ steps }: { steps: Step[] }) {
    return (
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                    {index < steps.length - 1 && (
                        <div
                            className="pointer-events-none absolute top-8 hidden h-px w-[calc(100%-4rem)] translate-x-[calc(50%+2rem)] bg-border md:block"
                            aria-hidden
                        />
                    )}
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/25 bg-gold/8 text-gold transition-colors duration-300">
                        <step.icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <span className="mt-4 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-gold">
                        Step {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-2 card-heading md:text-xl">{step.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
            ))}
        </div>
    );
}

export function HowItWorksSection() {
    return (
        <section data-section-tone="light" className="section-spacing overflow-x-clip bg-background">
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
                <RevealSection variant="fade-up" className="mx-auto max-w-2xl text-center">
                    <p className="section-eyebrow">How it works</p>
                    <h2 className="section-title-lg">How TalentBridge works</h2>
                    <p className="section-description md:text-lg">
                        A simple path for job seekers and employers — designed for clarity at every step.
                    </p>
                </RevealSection>

                <RevealSection variant="fade-up" delay={100} className="mt-10 md:mt-12">
                    <Tabs defaultValue="seekers" className="mx-auto max-w-4xl">
                        <TabsList className="mx-auto mb-10 grid h-12 w-full max-w-md grid-cols-2 rounded-xl bg-muted p-1">
                            <TabsTrigger
                                value="seekers"
                                className={cn(
                                    'rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                                )}
                            >
                                For Job Seekers
                            </TabsTrigger>
                            <TabsTrigger
                                value="employers"
                                className={cn(
                                    'rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                                )}
                            >
                                For Employers
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="seekers">
                            <StepFlow steps={jobSeekerSteps} />
                        </TabsContent>
                        <TabsContent value="employers">
                            <StepFlow steps={employerSteps} />
                        </TabsContent>
                    </Tabs>
                </RevealSection>
            </div>
        </section>
    );
}
