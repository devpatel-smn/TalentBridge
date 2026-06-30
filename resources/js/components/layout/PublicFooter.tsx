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
            <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14 lg:px-8">
                <div className="border-b border-white/10 pb-10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
                        <p className="font-display text-3xl font-medium leading-[1.12] tracking-tight text-white md:text-4xl">
                            Build careers.
                            <br />
                            Build teams.
                        </p>
                        <div className="max-w-md space-y-3 md:pt-1">
                            <p className="text-sm leading-relaxed text-white">
                                The recruitment platform for organizations that take hiring seriously — and professionals
                                who deserve better.
                            </p>
                            <p className="text-sm leading-relaxed text-white">
                                From first application to final offer, TalentBridge connects job seekers and employers
                                with tools built for clarity, speed, and trust.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-10 pt-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <AppLogo size="lg" showWordmark variant="light" />
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white">
                            Connecting exceptional talent with forward-thinking companies across 45+ countries. Search
                            roles, manage applications, and grow your career — or your team — on one platform.
                        </p>
                        <p className="mt-3 max-w-xs text-xs leading-relaxed text-white">
                            Trusted by thousands of job seekers and hiring teams worldwide.
                        </p>
                        <div className="mt-6 flex gap-2">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="group flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
                                >
                                    <Icon className="h-[17px] w-[17px] transition-transform duration-300 group-hover:scale-110" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:col-start-6">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white">
                            Explore
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="group inline-flex items-center gap-1 text-sm text-white transition-colors duration-300 hover:text-white/80"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-white transition-colors duration-300 hover:text-white/80"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 text-xs leading-relaxed text-white">
                            Your data is protected. Read our policies to learn how we handle privacy and platform use.
                        </p>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white">
                            For Employers
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {employerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="group inline-flex items-center gap-1 text-sm text-white transition-colors duration-300 hover:text-white/80"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 text-xs leading-relaxed text-white">
                            Publish roles, review applicants, and schedule interviews — all from a single employer
                            workspace.
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs text-white">
                        © {new Date().getFullYear()} TalentBridge. All rights reserved. Empowering careers, one
                        connection at a time.
                    </p>
                    <div className="flex gap-6 text-xs text-white">
                        <Link to={PUBLIC_PATHS.privacy} className="transition-colors hover:text-white/80">
                            Privacy
                        </Link>
                        <Link to={PUBLIC_PATHS.terms} className="transition-colors hover:text-white/80">
                            Terms
                        </Link>
                        <Link to={PUBLIC_PATHS.contact} className="transition-colors hover:text-white/80">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
