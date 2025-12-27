"use client";

import { useEffect } from "react";
import { OverlayScrollbars } from "overlayscrollbars";

export default function OSInit() {
    useEffect(() => {
        const el = document.getElementById("scrollRoot");
        if (!el) return;

        const os = OverlayScrollbars(el, {
            scrollbars: {
                autoHide: "leave",
            },
        });

        return () => {
            os?.destroy();
        };
    }, []);

    return null;
}
