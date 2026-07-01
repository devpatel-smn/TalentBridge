import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PUBLIC_PATHS } from '@/lib/paths';
import { cn } from '@/lib/utils';

interface GlobalJobSearchProps {
    className?: string;
    variant?: 'default' | 'hero';
}

const fieldShell =
    'relative flex h-12 min-h-12 w-full min-w-0 items-center gap-3 rounded-xl border border-border/80 bg-background px-4 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-gold/30 focus-within:border-gold/40 focus-within:ring-2 focus-within:ring-gold/15';

const fieldInput =
    'h-full min-h-0 w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.9375rem] leading-normal shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0';

function FieldIcon({ children }: { children: ReactNode }) {
    return (
        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-muted-foreground">
            {children}
        </span>
    );
}

export function GlobalJobSearch({ className, variant = 'default' }: GlobalJobSearchProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    const isHero = variant === 'hero';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set('search', query.trim());
        if (location.trim()) params.set('location', location.trim());
        const qs = params.toString();
        navigate(`${PUBLIC_PATHS.jobs}${qs ? `?${qs}` : ''}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className={cn(
                'w-full max-w-full min-w-0 rounded-2xl border border-border/70 bg-card p-3 shadow-elevation-2',
                isHero && 'p-3.5 md:p-4',
                className,
            )}
        >
            <div className="flex w-full min-w-0 flex-col gap-2.5 lg:flex-row lg:items-stretch">
                <div className={cn(fieldShell, 'flex-[1.5]')}>
                    <FieldIcon>
                        <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </FieldIcon>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Job title, keywords, or company"
                        className={fieldInput}
                        aria-label="Job title, keywords, or company"
                    />
                </div>

                <div className={cn(fieldShell, 'flex-1 lg:max-w-[280px]')}>
                    <FieldIcon>
                        <MapPin className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    </FieldIcon>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City or remote"
                        className={fieldInput}
                        aria-label="City or remote"
                    />
                </div>

                <Button
                    type="submit"
                    variant={isHero ? 'gold' : 'default'}
                    size="xl"
                    className="w-full shrink-0 lg:w-auto lg:min-w-[9.5rem]"
                >
                    <Search className="h-[18px] w-[18px]" strokeWidth={2} />
                    Search jobs
                </Button>
            </div>
        </form>
    );
}
