import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/models';
import { COMPANY_ID_STORAGE_KEY, ROLES, type UserRole } from '@/lib/constants';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    activeCompanyId: number | null;
    setUser: (user: User | null) => void;
    setActiveCompanyId: (companyId: number | null) => void;
    clearAuth: () => void;
    getPrimaryRole: () => UserRole | null;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            activeCompanyId: null,
            setUser: (user) => {
                const companyId =
                    user?.employer_context?.find((c) => c.is_primary)?.company_id ??
                    user?.employer_context?.[0]?.company_id ??
                    null;
                if (companyId) {
                    localStorage.setItem(COMPANY_ID_STORAGE_KEY, String(companyId));
                }
                set({
                    user,
                    isAuthenticated: !!user,
                    activeCompanyId: companyId,
                });
            },
            setActiveCompanyId: (companyId) => {
                if (companyId) {
                    localStorage.setItem(COMPANY_ID_STORAGE_KEY, String(companyId));
                } else {
                    localStorage.removeItem(COMPANY_ID_STORAGE_KEY);
                }
                set({ activeCompanyId: companyId });
            },
            clearAuth: () => {
                localStorage.removeItem(COMPANY_ID_STORAGE_KEY);
                set({ user: null, isAuthenticated: false, activeCompanyId: null });
            },
            getPrimaryRole: () => {
                const roles = get().user?.roles ?? [];
                if (roles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
                if (roles.includes(ROLES.EMPLOYER)) return ROLES.EMPLOYER;
                if (roles.includes(ROLES.JOB_SEEKER)) return ROLES.JOB_SEEKER;
                return null;
            },
        }),
        {
            name: 'talentbridge-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                activeCompanyId: state.activeCompanyId,
            }),
        },
    ),
);
