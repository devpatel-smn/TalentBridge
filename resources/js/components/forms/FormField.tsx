import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    labelAction?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function FormField({ label, htmlFor, error, hint, required, labelAction, children, className }: FormFieldProps) {
    const errorId = error && htmlFor ? `${htmlFor}-error` : undefined;
    const hintId = hint && !error && htmlFor ? `${htmlFor}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    const enhancedChild = isValidElement(children)
        ? cloneElement(children, {
              'aria-describedby': describedBy,
              'aria-invalid': error ? true : undefined,
          } as Record<string, unknown>)
        : children;

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex items-center justify-between gap-3">
                <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
                    {label}
                    {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
                </Label>
                {labelAction}
            </div>
            {Children.count(children) === 1 ? enhancedChild : children}
            {error && (
                <p id={errorId} className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
            {hint && !error && <p id={hintId} className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}
