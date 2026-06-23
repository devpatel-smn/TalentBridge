import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean().optional(),
});

export const registerSchema = z
    .object({
        first_name: z.string().min(1, 'First name is required').max(100),
        last_name: z.string().min(1, 'Last name is required').max(100),
        email: z.string().email('Please enter a valid email'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Must contain uppercase letter')
            .regex(/[a-z]/, 'Must contain lowercase letter')
            .regex(/[0-9]/, 'Must contain a number')
            .regex(/[^A-Za-z0-9]/, 'Must contain a symbol'),
        password_confirmation: z.string(),
        phone: z.string().max(20).optional(),
        role: z.enum(['employer', 'job_seeker']),
        company_name: z.string().max(255).optional(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
    })
    .refine((data) => data.role !== 'employer' || !!data.company_name?.trim(), {
        message: 'Company name is required for employers',
        path: ['company_name'],
    });

export const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email'),
});

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, 'Password must be at least 8 characters'),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
    });

export const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, 'Current password is required'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
