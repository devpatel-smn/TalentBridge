import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className }: SearchInputProps) {
    return (
        <div
            className={cn(
                'input-surface flex h-10 w-full items-center gap-2.5 px-3.5',
                className,
            )}
        >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm shadow-none outline-none ring-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
                aria-label={placeholder}
            />
            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
}
