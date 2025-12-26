"use client";

import { useEffect } from "react";
import { OverlayScrollbars } from "overlayscrollbars";

export default function OSInit() {
    useEffect(() => {
        const el = document.getElementById("scrollRoot");
        if (!el) return;

        const inst = OverlayScrollbars(el, {
            scrollbars: {
                theme: "os-theme-dark",
                autoHide: "leave",
                autoHideDelay: 600,
            },
        });

        return () => inst?.destroy();
    }, []);

    return null;
}
