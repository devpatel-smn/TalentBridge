import { Link } from 'react-router-dom';
import { ArrowUpRight, Facebook, Github, Linkedin, Twitter, Youtube } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { PUBLIC_PATHS } from '@/lib/paths';

const quickLinks = [
    { label: 'Browse Jobs', href: PUBLIC_PATHS.jobs },
    { label: 'Companies', href: PUBLIC_PATHS.companies },
    { label: 'About', href: PUBLIC_PATHS.about },
    { label: 'Contact', href: PUBLIC_PATHS.contact },
    { label: 'Sign In', href: PUBLIC_PATHS.login },
    { label: 'Create Account', href: PUBLIC_PATHS.register },
];

const legalLinks = [
    { label: 'Privacy Policy', href: PUBLIC_PATHS.privacy },
    { label: 'Terms of Service', href: PUBLIC_PATHS.terms },
    { label: 'FAQ', href: PUBLIC_PATHS.faq },
];

const employerLinks = [
    { label: 'Post a job', href: PUBLIC_PATHS.register },
    { label: 'Hire top talent', href: PUBLIC_PATHS.register },
    { label: 'Company profiles', href: PUBLIC_PATHS.companies },
    { label: 'Employer sign in', href: PUBLIC_PATHS.login },
];

const socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
    { label: 'GitHub', href: 'https://github.com', icon: Github },
];

export function PublicFooter() {
    return (
        <footer className="footer-editorial grain-overlay text-white">
            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-14 md:px-6 lg:px-8 lg:py-16">
                <div className="border-b border-white/10 pb-8 sm:pb-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10 lg:gap-12">
                        <p className="max-w-md font-display text-2xl font-medium leading-[1.12] tracking-tight text-white sm:text-3xl md:text-4xl">
                            Build careers.
                            <br />
                            <span className="text-gold">Build teams.</span>
                        </p>
                        <div className="max-w-md space-y-3 md:pt-1">
                            <p className="text-sm leading-relaxed text-white/90 sm:text-[0.9375rem]">
                                The recruitment platform for organizations that take hiring seriously — and professionals
                                who deserve better.
                            </p>
                            <p className="text-sm leading-relaxed text-white/75">
                                From first application to final offer, TalentBridge connects job seekers and employers
                                with tools built for clarity, speed, and trust.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-10 pt-8 sm:grid-cols-2 sm:gap-8 sm:pt-10 lg:grid-cols-12 lg:gap-8">
                    <div className="sm:col-span-2 lg:col-span-4">
                        <AppLogo size="lg" showWordmark variant="light" />
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85">
                            Connecting exceptional talent with forward-thinking companies across 45+ countries. Search
                            roles, manage applications, and grow your career — or your team — on one platform.
                        </p>
                        <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/60">
                            Trusted by thousands of job seekers and hiring teams worldwide.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2.5">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="group flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/20 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10 motion-reduce:hover:translate-y-0"
                                >
                                    <Icon className="h-[17px] w-[17px] stroke-[1.75] transition-transform duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:col-start-6">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/90">
                            Explore
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="group inline-flex min-h-[36px] items-center gap-1 text-sm text-white/90 transition-colors duration-300 hover:text-white"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100 motion-reduce:group-hover:opacity-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/90">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="inline-flex min-h-[36px] items-center text-sm text-white/90 transition-colors duration-300 hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 max-w-xs text-xs leading-relaxed text-white/60">
                            Your data is protected. Read our policies to learn how we handle privacy and platform use.
                        </p>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/90">
                            For Employers
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {employerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="group inline-flex min-h-[36px] items-center gap-1 text-sm text-white/90 transition-colors duration-300 hover:text-white"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100 motion-reduce:group-hover:opacity-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 max-w-xs text-xs leading-relaxed text-white/60">
                            Publish roles, review applicants, and schedule interviews — all from a single employer
                            workspace.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:mt-10 sm:flex-row sm:items-center">
                    <p className="text-xs leading-relaxed text-white/70">
                        © {new Date().getFullYear()} TalentBridge. All rights reserved. Empowering careers, one
                        connection at a time.
                    </p>
                    <div className="flex flex-wrap gap-5 text-xs text-white/70">
                        <Link to={PUBLIC_PATHS.privacy} className="transition-colors hover:text-white">
                            Privacy
                        </Link>
                        <Link to={PUBLIC_PATHS.terms} className="transition-colors hover:text-white">
                            Terms
                        </Link>
                        <Link to={PUBLIC_PATHS.contact} className="transition-colors hover:text-white">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
