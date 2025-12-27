"use client";

import React from "react";
import { ThemeContext } from "@/components/ThemeProvider";
import { THEMES } from "@/lib/themes";

export function ThemeMenu() {
    const ctx = React.useContext(ThemeContext);
    if (!ctx) return null;

    const current = THEMES.find((t) => t.id === ctx.theme)?.label ?? "Theme";

    return (
        <div className="dropdown">
            <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Theme: {current}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                {THEMES.map((t) => (
                    <li key={t.id}>
                        <button
                            type="button"
                            className={"dropdown-item" + (ctx.theme === t.id ? " active" : "")}
                            onClick={() => ctx.setTheme(t.id)}
                        >
                            <i className={t.iconClass + " me-2"} aria-hidden="true" />
                            {t.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
