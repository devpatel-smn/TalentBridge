import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
    ({ className, ...props }, ref) => (
        <textarea
            className={cn(
                'flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm shadow-xs transition-all duration-200 placeholder:text-muted-foreground hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20',
                className,
            )}
            ref={ref}
            {...props}
        />
    ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
