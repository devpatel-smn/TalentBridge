import { Link } from 'react-router-dom';
import { Briefcase, LockKeyhole, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { setReturnUrl } from '@/lib/auth-redirect';
import { PUBLIC_PATHS } from '@/lib/paths';

interface AuthPromptDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    returnTo?: string;
    title?: string;
    description?: string;
}

export function AuthPromptDialog({
    open,
    onOpenChange,
    returnTo,
    title = 'Sign in to continue',
    description = 'Please sign in to continue exploring TalentBridge.',
}: AuthPromptDialogProps) {
    const handleNavigate = (path: string) => {
        if (returnTo) setReturnUrl(returnTo);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border-border/60 p-0 shadow-elevation-3">
                <div className="relative overflow-hidden px-6 pb-2 pt-8 text-center">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15)_0%,_transparent_70%)]" />
                    <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-elevation-1">
                        <LockKeyhole className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <DialogHeader className="relative space-y-2 text-center">
                        <DialogTitle className="text-xl font-bold tracking-tight">{title}</DialogTitle>
                        <DialogDescription className="text-base leading-relaxed">{description}</DialogDescription>
                    </DialogHeader>
                </div>

                <div className="space-y-3 px-6 py-6">
                    <Button asChild className="h-11 w-full rounded-xl" size="lg">
                        <Link
                            to={PUBLIC_PATHS.login}
                            state={returnTo ? { from: returnTo } : undefined}
                            onClick={() => handleNavigate(PUBLIC_PATHS.login)}
                        >
                            Sign in
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-11 w-full rounded-xl" size="lg">
                        <Link
                            to={PUBLIC_PATHS.register}
                            state={returnTo ? { from: returnTo } : undefined}
                            onClick={() => handleNavigate(PUBLIC_PATHS.register)}
                        >
                            Create free account
                        </Link>
                    </Button>
                </div>

                <div className="border-t border-border/60 bg-muted/30 px-6 py-4">
                    <div className="flex items-start gap-3 text-left text-sm text-muted-foreground">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <p>Unlock full job details, save roles, apply instantly, and track your career journey.</p>
                    </div>
                    <div className="mt-3 flex items-start gap-3 text-left text-sm text-muted-foreground">
                        <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                        <p>Browse thousands of opportunities from verified employers worldwide.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
