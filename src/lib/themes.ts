export type ThemeId = "studio" | "neon" | "aurora" | "paper" | "mono";

export type ThemeDef = {
    id: ThemeId;
    label: string;
    bsTheme: "dark" | "light";
};

export const THEMES: ThemeDef[] = [
    { id: "studio", label: "Studio", bsTheme: "dark" },
    { id: "neon", label: "Neon", bsTheme: "dark" },
    { id: "aurora", label: "Aurora", bsTheme: "dark" },
    { id: "paper", label: "Paper", bsTheme: "light" },
    { id: "mono", label: "Mono", bsTheme: "dark" },
];

export const DEFAULT_THEME: ThemeId = "studio";
export const THEME_STORAGE_KEY = "lichtspiele.theme";
