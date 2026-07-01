import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] motion-reduce:active:scale-100',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-elevation-1 hover:bg-primary/90 hover:shadow-elevation-2 hover:-translate-y-px motion-reduce:hover:translate-y-0',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline:
                    'border border-input bg-background shadow-xs hover:bg-accent/50 hover:text-accent-foreground hover:border-border/80 hover:-translate-y-px motion-reduce:hover:translate-y-0',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-elevation-1 hover:bg-secondary/90 hover:shadow-elevation-2',
                ghost: 'hover:bg-muted/80 hover:text-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                gold: 'bg-gold text-gold-foreground shadow-elevation-1 hover:bg-gold/90 hover:shadow-elevation-2 hover:-translate-y-px motion-reduce:hover:translate-y-0',
                highlight:
                    'bg-highlight text-highlight-foreground shadow-elevation-1 hover:bg-highlight/90 hover:shadow-elevation-2 hover:-translate-y-px motion-reduce:hover:translate-y-0',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-xl px-3.5 text-xs',
                lg: 'h-11 rounded-xl px-8 text-base',
                xl: 'h-12 rounded-xl px-7 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
