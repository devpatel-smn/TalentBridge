import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';
import { AppLogo } from '@/components/common/AppLogo';
import { PUBLIC_PATHS } from '@/lib/paths';

const quickLinks = [
    { label: 'Browse Jobs', href: PUBLIC_PATHS.jobs },
    { label: 'Companies', href: PUBLIC_PATHS.companies },
    { label: 'About', href: PUBLIC_PATHS.about },
    { label: 'Contact', href: PUBLIC_PATHS.contact },
];

const legalLinks = [
    { label: 'Privacy Policy', href: PUBLIC_PATHS.privacy },
    { label: 'Terms of Service', href: PUBLIC_PATHS.terms },
    { label: 'FAQ', href: PUBLIC_PATHS.faq },
];

const socialLinks = [
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { label: 'GitHub', href: 'https://github.com', icon: Github },
];

export function PublicFooter() {
    return (
        <footer className="footer-editorial grain-overlay">
            <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14 lg:px-8">
                <div className="border-b border-white/8 pb-10">
                    <p className="font-display text-3xl font-medium leading-[1.12] tracking-tight text-white md:text-4xl">
                        Build careers.
                        <br />
                        <span className="text-accent-gold">Build teams.</span>
                    </p>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
                        The recruitment platform for organizations that take hiring seriously — and professionals
                        who deserve better.
                    </p>
                </div>

                <div className="grid gap-10 pt-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <AppLogo size="md" showWordmark variant="light" />
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
                            Connecting exceptional talent with forward-thinking companies across 45+ countries.
                        </p>
                        <div className="mt-6 flex gap-2">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="group flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/45 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/35 hover:bg-gold/10 hover:text-gold hover:shadow-[0_4px_16px_-4px_hsl(var(--gold)/0.25)]"
                                >
                                    <Icon className="h-[17px] w-[17px] transition-transform duration-300 group-hover:scale-110" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:col-start-6">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/65">
                            Explore
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="group inline-flex items-center gap-1 text-sm text-white/45 transition-colors duration-300 hover:text-white"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/65">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-white/45 transition-colors duration-300 hover:text-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/65">
                            For Employers
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            <li>
                                <Link
                                    to={PUBLIC_PATHS.register}
                                    className="group inline-flex items-center gap-1 text-sm text-white/45 transition-colors duration-300 hover:text-white"
                                >
                                    Post a job
                                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={PUBLIC_PATHS.register}
                                    className="group inline-flex items-center gap-1 text-sm text-white/45 transition-colors duration-300 hover:text-white"
                                >
                                    Hire top talent
                                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/8 pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs text-white/30">
                        © {new Date().getFullYear()} TalentBridge. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-white/30">
                        <Link to={PUBLIC_PATHS.privacy} className="transition-colors hover:text-white/60">
                            Privacy
                        </Link>
                        <Link to={PUBLIC_PATHS.terms} className="transition-colors hover:text-white/60">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
