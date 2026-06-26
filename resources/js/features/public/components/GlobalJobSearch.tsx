import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PUBLIC_PATHS } from '@/lib/paths';
import { cn } from '@/lib/utils';

interface GlobalJobSearchProps {
    className?: string;
    variant?: 'default' | 'hero';
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
                'flex w-full max-w-full min-w-0 flex-col gap-2 rounded-xl p-2 shadow-elevation-3 sm:flex-row sm:items-stretch',
                isHero
                    ? 'border border-border/70 bg-card shadow-elevation-3'
                    : 'border border-border/70 bg-card',
                className,
            )}
        >
            <div className="relative min-w-0 flex-[1.2]">
                <Search
                    className={cn(
                        'absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground',
                    )}
                />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Job title, keywords, or company"
                    className={cn(
                        'h-12 rounded-lg border-0 pl-11 text-base shadow-none focus-visible:ring-1 bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring',
                    )}
                />
            </div>
            <div className="relative min-w-0 flex-1 sm:max-w-[220px]">
                <MapPin
                    className={cn(
                        'absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground',
                    )}
                />
                <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or remote"
                    className={cn(
                        'h-12 rounded-lg border-0 pl-11 text-base shadow-none focus-visible:ring-1 bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring',
                    )}
                />
            </div>
            <Button
                type="submit"
                size="lg"
                className={cn(
                    'h-12 w-full min-w-0 rounded-lg px-6 text-base font-semibold sm:w-auto sm:px-8',
                    isHero && 'bg-highlight text-highlight-foreground hover:bg-highlight/90',
                )}
            >
                Search
            </Button>
        </form>
    );
}
