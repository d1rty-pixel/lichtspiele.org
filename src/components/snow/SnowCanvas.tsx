"use client";

import React from "react";

type SnowConfig = {
    flakes: number;          // Anzahl Flocken
    speedMin: number;        // px/ms
    speedMax: number;
    sizeMin: number;         // px
    sizeMax: number;
    wind: number;            // px/ms (negativ = nach links)
    swirl: number;           // seitliches “schwimmen” (0..1)
    opacity: number;         // 0..1
    dprCap: number;
};

const DEFAULTS: SnowConfig = {
    flakes: 160,
    speedMin: 0.03,
    speedMax: 0.14,
    sizeMin: 0.8,
    sizeMax: 3.2,
    wind: 0.015,
    swirl: 0.6,
    opacity: 0.85,
    dprCap: 2,
};

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function SnowCanvas({ settings }: { settings?: Partial<SnowConfig> }) {
    const ref = React.useRef<HTMLCanvasElement | null>(null);

    React.useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const cfg: SnowConfig = { ...DEFAULTS, ...settings };

        const resize = () => {
            const dpr = Math.max(1, Math.min(cfg.dprCap, window.devicePixelRatio || 1));
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        type Flake = {
            x: number;
            y: number;
            r: number;
            vy: number;
            phase: number;
            amp: number;
        };

        const spawn = (y = rand(-50, -10)): Flake => ({
            x: rand(0, window.innerWidth),
            y,
            r: rand(cfg.sizeMin, cfg.sizeMax),
            vy: rand(cfg.speedMin, cfg.speedMax),
            phase: rand(0, Math.PI * 2),
            amp: rand(0.3, 1.2),
        });

        let flakes: Flake[] = Array.from({ length: cfg.flakes }, () => spawn(rand(0, window.innerHeight)));
        let raf = 0;
        let t0 = performance.now();

        const frame = (now: number) => {
            const dt = Math.min(32, now - t0);
            t0 = now;

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = cfg.opacity;

            // leichte Tiefenwirkung über Alpha/Blur: kleine Flakes sind “weiter weg”
            for (const f of flakes) {
                f.phase += dt * 0.0012 * cfg.swirl;
                f.y += f.vy * dt;
                f.x += cfg.wind * dt + Math.sin(f.phase) * f.amp * cfg.swirl;

                if (f.y > window.innerHeight + 20) {
                    Object.assign(f, spawn());
                }
                if (f.x < -20) f.x = window.innerWidth + 20;
                if (f.x > window.innerWidth + 20) f.x = -20;

                // soft flake
                const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 2.2);
                g.addColorStop(0, "rgba(255,255,255,0.95)");
                g.addColorStop(0.35, "rgba(255,255,255,0.35)");
                g.addColorStop(1, "rgba(255,255,255,0)");

                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r * 2.2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(frame);
        };

        const onResize = () => {
            resize();
            // respawn passend zur neuen Größe
            flakes = Array.from({ length: cfg.flakes }, () => spawn(rand(0, window.innerHeight)));
        };

        resize();
        window.addEventListener("resize", onResize);
        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, [settings]);

    return <canvas ref={ref} className="snow-canvas" aria-hidden="true" />;
}
