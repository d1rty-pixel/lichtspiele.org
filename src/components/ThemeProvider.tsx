"use client";

import React from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES, type ThemeId } from "@/lib/themes";

type ThemeContextValue = {
    theme: ThemeId;
    setTheme: (t: ThemeId) => void;
};

export const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function isThemeId(x: string): x is ThemeId {
    return THEMES.some((t) => t.id === x);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = React.useState<ThemeId>(DEFAULT_THEME);

    const applyThemeToDom = React.useCallback((t: ThemeId) => {
        const html = document.documentElement;
        html.setAttribute("data-theme", t);

        const def = THEMES.find((x) => x.id === t) ?? THEMES[0];
        html.setAttribute("data-bs-theme", def.bsTheme);
    }, []);

    React.useEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        const initial = stored && isThemeId(stored) ? stored : DEFAULT_THEME;
        setThemeState(initial);
        applyThemeToDom(initial);
    }, [applyThemeToDom]);

    const setTheme = React.useCallback(
        (t: ThemeId) => {
            setThemeState(t);
            localStorage.setItem(THEME_STORAGE_KEY, t);
            applyThemeToDom(t);
        },
        [applyThemeToDom],
    );

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
