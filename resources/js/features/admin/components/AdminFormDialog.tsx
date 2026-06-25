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
import { adminApi } from '@/features/admin/api/admin-api';
import { getApiErrorMessage, getValidationErrors } from '@/lib/api-client';
import { ROLES } from '@/lib/constants';

export interface AdminAccount {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    status: string;
}

interface AdminFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    admin?: AdminAccount | null;
    onSuccess: () => void;
}

interface FormState {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    status: string;
}

const EMPTY_FORM: FormState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    status: 'active',
};

export function AdminFormDialog({ open, onOpenChange, admin, onSuccess }: AdminFormDialogProps) {
    const isEdit = Boolean(admin);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!open) {
            setForm(EMPTY_FORM);
            setErrors({});
            return;
        }

        if (admin) {
            setForm({
                first_name: admin.first_name,
                last_name: admin.last_name,
                email: admin.email,
                phone: admin.phone ?? '',
                password: '',
                password_confirmation: '',
                status: admin.status,
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [open, admin]);

    const mutation = useMutation({
        mutationFn: async (payload: Record<string, unknown>) => {
            if (isEdit && admin) {
                return adminApi.updateUser(admin.id, payload);
            }
            return adminApi.createUser(payload);
        },
        onSuccess: () => {
            toast.success(isEdit ? 'Admin updated successfully' : 'Admin created successfully');
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
            toast.error(getApiErrorMessage(error, isEdit ? 'Failed to update admin' : 'Failed to create admin'));
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

        const payload: Record<string, unknown> = {
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone || null,
            role: ROLES.ADMIN,
        };

        if (!isEdit) {
            payload.password = form.password;
            payload.password_confirmation = form.password_confirmation;
            payload.email_verified = true;
            payload.status = 'active';
        } else {
            payload.status = form.status;
            if (form.password) {
                payload.password = form.password;
                payload.password_confirmation = form.password_confirmation;
            }
        }

        mutation.mutate(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit admin' : 'Create admin'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Update admin account details. Leave password blank to keep the current password.'
                            : 'Create a new platform administrator. Inactive admins cannot sign in.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="First name" htmlFor="admin_first_name" error={errors.first_name} required>
                            <Input
                                id="admin_first_name"
                                value={form.first_name}
                                onChange={(e) => updateField('first_name', e.target.value)}
                                required
                            />
                        </FormField>
                        <FormField label="Last name" htmlFor="admin_last_name" error={errors.last_name} required>
                            <Input
                                id="admin_last_name"
                                value={form.last_name}
                                onChange={(e) => updateField('last_name', e.target.value)}
                                required
                            />
                        </FormField>
                    </div>

                    <FormField label="Email" htmlFor="admin_email" error={errors.email} required>
                        <Input
                            id="admin_email"
                            type="email"
                            value={form.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            required
                        />
                    </FormField>

                    <FormField label="Phone" htmlFor="admin_phone" error={errors.phone}>
                        <Input
                            id="admin_phone"
                            value={form.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                        />
                    </FormField>

                    {isEdit && (
                        <FormField label="Status" htmlFor="admin_status" error={errors.status}>
                            <Select value={form.status} onValueChange={(value) => updateField('status', value)}>
                                <SelectTrigger id="admin_status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormField>
                    )}

                    <FormField
                        label={isEdit ? 'New password' : 'Password'}
                        htmlFor="admin_password"
                        error={errors.password}
                        required={!isEdit}
                        hint={isEdit ? 'Optional — only fill in to reset the password.' : undefined}
                    >
                        <Input
                            id="admin_password"
                            type="password"
                            value={form.password}
                            onChange={(e) => updateField('password', e.target.value)}
                            required={!isEdit}
                        />
                    </FormField>

                    <FormField
                        label="Confirm password"
                        htmlFor="admin_password_confirmation"
                        error={errors.password_confirmation}
                        required={!isEdit || Boolean(form.password)}
                    >
                        <Input
                            id="admin_password_confirmation"
                            type="password"
                            value={form.password_confirmation}
                            onChange={(e) => updateField('password_confirmation', e.target.value)}
                            required={!isEdit || Boolean(form.password)}
                        />
                    </FormField>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Create admin'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
