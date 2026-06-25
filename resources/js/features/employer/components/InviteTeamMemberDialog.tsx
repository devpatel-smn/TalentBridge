import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { employerApi } from '@/features/employer/api/employer-api';
import { getApiErrorMessage, getValidationErrors } from '@/lib/api-client';

interface InviteTeamMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

interface FormState {
    email: string;
    job_title: string;
    is_primary: string;
}

const EMPTY_FORM: FormState = {
    email: '',
    job_title: '',
    is_primary: 'false',
};

export function InviteTeamMemberDialog({ open, onOpenChange, onSuccess }: InviteTeamMemberDialogProps) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!open) {
            setForm(EMPTY_FORM);
            setErrors({});
        }
    }, [open]);

    const mutation = useMutation({
        mutationFn: () =>
            employerApi.team.invite({
                email: form.email.trim(),
                job_title: form.job_title.trim() || null,
                is_primary: form.is_primary === 'true',
            }),
        onSuccess: (member) => {
            toast.success(
                member.invite_pending
                    ? 'Invitation email sent successfully'
                    : 'Team member added successfully',
            );
            onSuccess();
            onOpenChange(false);
        },
        onError: (error) => {
            const validationErrors = getValidationErrors(error);
            if (validationErrors) {
                const mapped: Record<string, string> = {};
                Object.entries(validationErrors).forEach(([key, messages]) => {
                    if (messages[0]) mapped[key] = messages[0];
                });
                setErrors(mapped);
            }
            toast.error(getApiErrorMessage(error, 'Failed to invite team member'));
        },
    });

    const updateField = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        mutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Invite team member</DialogTitle>
                    <DialogDescription>
                        Invite a colleague by email. New users will receive an invitation link to set their
                        password and join your company&apos;s hiring team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField label="Email" htmlFor="team_invite_email" error={errors.email} required>
                        <Input
                            id="team_invite_email"
                            type="email"
                            value={form.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="colleague@company.com"
                            required
                        />
                    </FormField>

                    <FormField label="Job title" htmlFor="team_invite_job_title" error={errors.job_title}>
                        <Input
                            id="team_invite_job_title"
                            value={form.job_title}
                            onChange={(e) => updateField('job_title', e.target.value)}
                            placeholder="e.g. Hiring Manager"
                        />
                    </FormField>

                    <FormField label="Primary contact" htmlFor="team_invite_is_primary" error={errors.is_primary}>
                        <Select value={form.is_primary} onValueChange={(value) => updateField('is_primary', value)}>
                            <SelectTrigger id="team_invite_is_primary">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="false">No</SelectItem>
                                <SelectItem value="true">Yes — set as company primary contact</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Inviting...' : 'Send invite'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
