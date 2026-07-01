import { type ReactNode } from 'react';
import { RevealSection } from '@/components/common/RevealSection';
import { cn } from '@/lib/utils';

interface PageHeroProps {
    title: string;
    description?: string;
    eyebrow?: string;
    children?: ReactNode;
    className?: string;
}

export function PageHero({ title, description, eyebrow, children, className }: PageHeroProps) {
    return (
        <div className={cn('page-hero', className)}>
            <div className="page-hero-inner">
                <RevealSection variant="fade-up">
                    {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
                    <h1 className={cn('page-hero-title', eyebrow && 'mt-3')}>{title}</h1>
                    {description && <p className="page-hero-description">{description}</p>}
                    {children}
                </RevealSection>
            </div>
        </div>
    );
}
