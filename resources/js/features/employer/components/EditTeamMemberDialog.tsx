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
import type { TeamMember } from '@/types/models';

interface EditTeamMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: TeamMember | null;
    isSelf: boolean;
    onSuccess: () => void;
}

interface FormState {
    job_title: string;
    is_primary: string;
    is_active: string;
}

export function EditTeamMemberDialog({ open, onOpenChange, member, isSelf, onSuccess }: EditTeamMemberDialogProps) {
    const [form, setForm] = useState<FormState>({
        job_title: '',
        is_primary: 'false',
        is_active: 'true',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!open || !member) {
            setErrors({});
            return;
        }

        setForm({
            job_title: member.job_title ?? '',
            is_primary: member.is_primary ? 'true' : 'false',
            is_active: member.is_active ? 'true' : 'false',
        });
        setErrors({});
    }, [open, member]);

    const mutation = useMutation({
        mutationFn: () =>
            employerApi.team.update(member!.id, {
                job_title: form.job_title.trim() || null,
                is_primary: form.is_primary === 'true',
                is_active: form.is_active === 'true',
            }),
        onSuccess: () => {
            toast.success('Team member updated successfully');
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
            toast.error(getApiErrorMessage(error, 'Failed to update team member'));
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

    if (!member) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit team member</DialogTitle>
                    <DialogDescription>
                        Update {member.user?.full_name ?? 'team member'}&apos;s role and status on your hiring team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField label="Email">
                        <Input value={member.user?.email ?? ''} disabled />
                    </FormField>

                    <FormField label="Job title" htmlFor="team_edit_job_title" error={errors.job_title}>
                        <Input
                            id="team_edit_job_title"
                            value={form.job_title}
                            onChange={(e) => updateField('job_title', e.target.value)}
                            placeholder="e.g. Recruiter"
                        />
                    </FormField>

                    <FormField label="Primary contact" htmlFor="team_edit_is_primary" error={errors.is_primary}>
                        <Select value={form.is_primary} onValueChange={(value) => updateField('is_primary', value)}>
                            <SelectTrigger id="team_edit_is_primary">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="false">No</SelectItem>
                                <SelectItem value="true">Yes — primary contact</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <FormField
                        label="Membership status"
                        htmlFor="team_edit_is_active"
                        error={errors.is_active}
                        hint={isSelf ? 'You cannot deactivate your own membership.' : undefined}
                    >
                        <Select
                            value={form.is_active}
                            onValueChange={(value) => updateField('is_active', value)}
                            disabled={isSelf}
                        >
                            <SelectTrigger id="team_edit_is_active">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormField>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
