"use client";

import { useEffect } from "react";

export default function LayoutHeightsFix() {
    useEffect(() => {
        const root = document.documentElement;

        const getSingleNav = (): HTMLElement | null => {
            const navs = document.getElementsByTagName("nav");
            if (navs.length !== 1) return null;
            return navs.item(0) as HTMLElement | null;
        };

        const apply = () => {
            const nav = getSingleNav();
            if (!nav) return;

            const footer = document.getElementById("site-footer") as HTMLElement | null;

            const navH = Math.round(nav.getBoundingClientRect().height);
            const footerH = Math.round(footer?.getBoundingClientRect().height ?? 0);

            // visible viewport height (mobile-safe)
            const vvH = Math.round(window.visualViewport?.height ?? window.innerHeight);

            root.style.setProperty("--site-nav-h", `${navH}px`);
            root.style.setProperty("--site-footer-h", `${footerH}px`);
            root.style.setProperty("--vvh", `${vvH}px`);
        };

        const onChange = () => apply();

        apply();

        const ro = new ResizeObserver(onChange);
        const nav = getSingleNav();
        const footer = document.getElementById("site-footer");
        if (nav) ro.observe(nav);
        if (footer) ro.observe(footer);

        window.addEventListener("resize", onChange);
        window.visualViewport?.addEventListener("resize", onChange);
        window.visualViewport?.addEventListener("scroll", onChange);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onChange);
            window.visualViewport?.removeEventListener("resize", onChange);
            window.visualViewport?.removeEventListener("scroll", onChange);
        };
    }, []);

    return null;
}
