import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { jobsApi } from '@/features/jobs/api/jobs-api';
import { PUBLIC_PATHS } from '@/lib/paths';
import { cn } from '@/lib/utils';

interface GlobalJobSearchProps {
    className?: string;
    variant?: 'default' | 'hero';
}

type CategoryOption = {
    id: number;
    name: string;
    slug: string;
};

type ApiCategory = CategoryOption & {
    children?: CategoryOption[];
};

const DEFAULT_CATEGORIES: CategoryOption[] = [
    { id: 0, name: 'Engineering', slug: 'engineering' },
    { id: 0, name: 'Design', slug: 'design' },
    { id: 0, name: 'Marketing', slug: 'marketing' },
    { id: 0, name: 'Sales', slug: 'sales' },
    { id: 0, name: 'Healthcare', slug: 'healthcare' },
    { id: 0, name: 'Operations', slug: 'operations' },
];

const categoryItemClass =
    'relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground focus:bg-accent focus:text-accent-foreground';

function flattenCategories(categories: ApiCategory[]): CategoryOption[] {
    const flat: CategoryOption[] = [];

    for (const category of categories) {
        flat.push({ id: category.id, name: category.name, slug: category.slug });
        for (const child of category.children ?? []) {
            flat.push({ id: child.id, name: child.name, slug: child.slug });
        }
    }

    return flat;
}

function categoryValue(category: CategoryOption) {
    return category.id > 0 ? String(category.id) : `slug:${category.slug}`;
}

function CategorySelect({
    value,
    onValueChange,
    categories,
}: {
    value: string;
    onValueChange: (value: string) => void;
    categories: CategoryOption[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <SelectPrimitive.Root value={value} onValueChange={onValueChange} open={open} onOpenChange={setOpen}>
            <SelectPrimitive.Trigger
                className={cn(
                    'flex h-12 w-full min-w-0 items-center justify-between rounded-lg border-0 bg-muted/40 px-3 text-base shadow-none outline-none transition-colors',
                    'focus-visible:ring-1 focus-visible:ring-highlight/40',
                    'data-[state=open]:ring-1 data-[state=open]:ring-highlight/40',
                    '[&>span]:line-clamp-1',
                )}
                aria-label="Field or category"
            >
                <SelectPrimitive.Value placeholder="Field / Category" />
                <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-70" />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    collisionPadding={16}
                    className={cn(
                        'z-50 w-[var(--radix-select-trigger-width)] max-w-[min(var(--radix-select-trigger-width),calc(100vw-2rem))] overflow-hidden rounded-xl border border-border/70 bg-card text-foreground shadow-elevation-3',
                        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    )}
                >
                    <SelectPrimitive.Viewport className="max-h-60 overflow-y-auto overscroll-contain p-1.5">
                        <SelectPrimitive.Item value="all" className={categoryItemClass}>
                            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                <SelectPrimitive.ItemIndicator>
                                    <Check className="h-4 w-4 text-primary" strokeWidth={2.5} />
                                </SelectPrimitive.ItemIndicator>
                            </span>
                            <SelectPrimitive.ItemText>All categories</SelectPrimitive.ItemText>
                        </SelectPrimitive.Item>
                        {categories.map((category) => (
                            <SelectPrimitive.Item
                                key={`${category.slug}-${category.id}`}
                                value={categoryValue(category)}
                                className={categoryItemClass}
                            >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                    <SelectPrimitive.ItemIndicator>
                                        <Check className="h-4 w-4 text-primary" strokeWidth={2.5} />
                                    </SelectPrimitive.ItemIndicator>
                                </span>
                                <SelectPrimitive.ItemText>{category.name}</SelectPrimitive.ItemText>
                            </SelectPrimitive.Item>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}

export function GlobalJobSearch({ className, variant = 'default' }: GlobalJobSearchProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const { data: categories = [] } = useQuery({
        queryKey: ['job-categories', 'global-search'],
        queryFn: jobsApi.categories,
        staleTime: 10 * 60 * 1000,
    });

    const displayCategories = useMemo(() => {
        const flat = flattenCategories(categories as ApiCategory[]);
        return flat.length > 0 ? flat : DEFAULT_CATEGORIES;
    }, [categories]);

    const isHero = variant === 'hero';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set('search', query.trim());
        if (location.trim()) params.set('location', location.trim());
        if (categoryId !== 'all') {
            if (categoryId.startsWith('slug:')) {
                const slug = categoryId.replace('slug:', '');
                const match = displayCategories.find((category) => category.slug === slug);
                if (match?.id && match.id > 0) {
                    params.set('category_id', String(match.id));
                } else if (match) {
                    params.set('search', match.name);
                }
            } else {
                params.set('category_id', categoryId);
            }
        }
        const qs = params.toString();
        navigate(`${PUBLIC_PATHS.jobs}${qs ? `?${qs}` : ''}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className={cn(
                'flex w-full max-w-full min-w-0 flex-col gap-2 overflow-hidden rounded-xl p-2 shadow-elevation-3 sm:flex-row sm:items-stretch',
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
            <div className="min-w-0 flex-1 sm:max-w-[220px]">
                <CategorySelect value={categoryId} onValueChange={setCategoryId} categories={displayCategories} />
            </div>
            <Button
                type="submit"
                size="lg"
                className={cn(
                    'h-12 w-full min-w-0 shrink-0 rounded-lg px-6 text-base font-semibold sm:w-auto sm:px-8',
                    isHero && 'bg-highlight text-highlight-foreground hover:bg-highlight/90',
                )}
            >
                Search
            </Button>
        </form>
    );
}
