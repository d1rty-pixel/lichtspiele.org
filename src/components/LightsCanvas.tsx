"use client";

import React from "react";

type LightsConfig = {
    blobCount: number;

    /** Radius ist RELATIV zur kleineren Viewport-Kante (0..1). */
    radius: { min: number; max: number };

    /** px/ms */
    speed: { min: number; max: number };

    breathe: { amount: number; speed: number };
    vignette: { strength: number; focusY: number };
    wrapMargin: number;
    dprCap: number;
    composite: GlobalCompositeOperation;
    blurPx: number;
    opacity: number;
    colors: string[];
};

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}
function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function getThemeFxFromCSS(): Pick<LightsConfig, "colors" | "composite" | "blurPx" | "opacity"> {
    const s = getComputedStyle(document.documentElement);
    const colors = [
        s.getPropertyValue("--fx-c1").trim(),
        s.getPropertyValue("--fx-c2").trim(),
        s.getPropertyValue("--fx-c3").trim(),
        s.getPropertyValue("--fx-c4").trim(),
    ].filter(Boolean);

    const composite = (s.getPropertyValue("--fx-composite").trim() || "screen") as GlobalCompositeOperation;
    const blurPx = parseFloat(s.getPropertyValue("--fx-blur")) || 20;
    const opacity = parseFloat(s.getPropertyValue("--fx-opacity")) || 0.95;

    return { colors, composite, blurPx, opacity };
}

/**
 * Breakpoint-abhängige Defaults.
 * radius.* ist Anteil der kleineren Viewport-Kante.
 */
function pickDefaults() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const base = Math.min(w, h);

    // Grobe Breakpoints (pragmatisch)
    const isMobile = base < 520;
    const isTablet = base >= 520 && base < 900;
    const isDesktop = base >= 900 && base < 1400;
    const isHuge = base >= 1400;

    let blobCount = 10;
    let radius = { min: 0.14, max: 0.50 };
    let blurPx = 25;
    let speed = { min: 0.05, max: 0.18 };

    if (isMobile) {
        blobCount = 7;
        radius = { min: 0.18, max: 0.62 };
        blurPx = 26;
        speed = { min: 0.04, max: 0.14 };
    } else if (isTablet) {
        blobCount = 9;
        radius = { min: 0.16, max: 0.58 };
        blurPx = 26;
        speed = { min: 0.045, max: 0.16 };
    } else if (isDesktop) {
        blobCount = 11;
        radius = { min: 0.14, max: 0.52 };
        blurPx = 25;
        speed = { min: 0.05, max: 0.18 };
    } else if (isHuge) {
        blobCount = 13;
        radius = { min: 0.12, max: 0.48 };
        blurPx = 24;
        speed = { min: 0.05, max: 0.20 };
    }

    return { blobCount, radius, blurPx, speed };
}

export function LightsCanvas() {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const d = pickDefaults();

        let config: LightsConfig = {
            blobCount: d.blobCount,
            radius: d.radius,
            speed: d.speed,
            breathe: { amount: prefersReduced ? 0.03 : 0.08, speed: 0.00035 },
            vignette: { strength: 0.35, focusY: 0.35 },
            wrapMargin: 80,
            dprCap: 2,
            composite: "screen",
            blurPx: d.blurPx,
            opacity: 0.95,
            colors: ["rgba(120, 190, 255, 0.55)"],
        };

        // abgeleitete Pixelwerte aus relativen Radien
        let radiusPx = { min: 180, max: 620 };

        const recomputeRadiusPx = () => {
            const base = Math.min(window.innerWidth, window.innerHeight);

            // Sicherheitsnetz: nie zu klein (sonst “körnig”), nie absurd groß
            const minPx = Math.max(60, base * config.radius.min);
            const maxPx = Math.max(minPx + 1, base * config.radius.max);

            radiusPx = { min: minPx, max: maxPx };
        };

        const applyTheme = () => {
            const fx = getThemeFxFromCSS();
            config = {
                ...config,
                colors: fx.colors.length ? fx.colors : config.colors,
                composite: fx.composite || config.composite,
                blurPx: fx.blurPx || config.blurPx,
                opacity: clamp(fx.opacity, 0, 1),
            };

            canvas.style.filter = `blur(${config.blurPx}px) saturate(1.15)`;
            canvas.style.opacity = String(config.opacity);
        };

        const resize = () => {
            const dpr = Math.max(1, Math.min(config.dprCap, window.devicePixelRatio || 1));
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            recomputeRadiusPx();
        };

        type Blob = {
            x: number;
            y: number;
            r: number;
            vx: number;
            vy: number;
            colorIndex: number;
            phase: number;
        };

        let blobs: Blob[] = [];
        const initBlobs = () => {
            blobs = [];
            const cLen = Math.max(1, config.colors.length);

            for (let i = 0; i < config.blobCount; i++) {
                const sp = rand(config.speed.min, config.speed.max);
                const ang = rand(0, Math.PI * 2);

                blobs.push({
                    x: rand(0, window.innerWidth),
                    y: rand(0, window.innerHeight),
                    r: rand(radiusPx.min, radiusPx.max),
                    vx: Math.cos(ang) * sp,
                    vy: Math.sin(ang) * sp,
                    colorIndex: i % cLen,
                    phase: rand(0, Math.PI * 2),
                });
            }
        };

        const drawVignette = () => {
            if (config.vignette.strength <= 0) return;

            const g = ctx.createRadialGradient(
                window.innerWidth * 0.5,
                window.innerHeight * config.vignette.focusY,
                120,
                window.innerWidth * 0.5,
                window.innerHeight * config.vignette.focusY,
                Math.max(window.innerWidth, window.innerHeight) * 0.8,
            );
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(1, `rgba(0,0,0,${clamp(config.vignette.strength, 0, 1)})`);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        };

        let running = !prefersReduced;
        let raf = 0;
        let t0 = performance.now();

        const frame = (now: number) => {
            const dt = Math.min(32, now - t0);
            t0 = now;

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            drawVignette();

            ctx.globalCompositeOperation = config.composite;

            for (const b of blobs) {
                b.phase += dt * config.breathe.speed;
                const breathe = 1 + Math.sin(b.phase) * config.breathe.amount;
                const rr = b.r * breathe;

                if (running) {
                    b.x += b.vx * dt;
                    b.y += b.vy * dt;
                }

                const margin = rr + config.wrapMargin;
                if (b.x < -margin) b.x = window.innerWidth + margin;
                if (b.x > window.innerWidth + margin) b.x = -margin;
                if (b.y < -margin) b.y = window.innerHeight + margin;
                if (b.y > window.innerHeight + margin) b.y = -margin;

                const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rr);
                grad.addColorStop(0, config.colors[b.colorIndex] || config.colors[0]);
                grad.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(b.x, b.y, rr, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = "source-over";
            raf = requestAnimationFrame(frame);
        };

        // Theme change: update FX + restart blobs
        const mo = new MutationObserver(() => {
            applyTheme();
            resize();
            initBlobs();
        });
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        // Resize: recompute radii + restart blobs (so size tracks resolution)
        const onResize = () => {
            // optional: update breakpoint defaults too
            const nd = pickDefaults();
            config = {
                ...config,
                blobCount: nd.blobCount,
                radius: nd.radius,
                speed: nd.speed,
                blurPx: nd.blurPx,
            };

            applyTheme();
            resize();
            initBlobs();
        };
        window.addEventListener("resize", onResize);

        applyTheme();
        resize();
        initBlobs();
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            mo.disconnect();
        };
    }, []);

    return <canvas ref={canvasRef} className="lights-canvas" aria-hidden="true" />;
}
