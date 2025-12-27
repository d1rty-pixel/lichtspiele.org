export type ThemeId = "dark" | "light" | "ink" | "xmas";

export type ThemeDef = {
    id: ThemeId;
    label: string;
    bsTheme: "dark" | "light";
    iconClass: string;
};

export const THEMES: ThemeDef[] = [
    { id: "dark", label: "Dark", bsTheme: "dark", iconClass: "fa-solid fa-moon" },
    { id: "light", label: "Light", bsTheme: "light", iconClass: "fa-solid fa-sun" },
    { id: "ink", label: "Ink", bsTheme: "dark", iconClass: "fa-solid fa-droplet" },
    { id: "xmas", label: "X-Mas", bsTheme: "dark", iconClass: "fa-solid fa-snowflake" },
];

export const DEFAULT_THEME: ThemeId = "dark";
export const THEME_STORAGE_KEY = "lichtspiele.theme";
