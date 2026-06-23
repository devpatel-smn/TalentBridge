import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { THEME_STORAGE_KEY } from '@/lib/constants';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'system';
    });

    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

    useEffect(() => {
        applyTheme(resolvedTheme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme, resolvedTheme]);

    useEffect(() => {
        if (theme !== 'system') return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => applyTheme(getSystemTheme());
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, [theme]);

    const setTheme = (next: Theme) => setThemeState(next);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
    return ctx;
}
