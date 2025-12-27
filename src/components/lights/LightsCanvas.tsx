"use client";

import React from "react";
import { LightsConfig, Blob } from "./types";
import { mulberry32, rand } from "./noise";
import { generateSplatShape } from "./splatShape";

const DEFAULTS: LightsConfig = {
    blobCount: 12,
    radius: { min: 0.14, max: 0.5 },
    speed: { min: 0.04, max: 0.14 },

    scaleDrift: {
        min: 0.92,
        max: 1.08,
        speed: 0.000015,
    },

    fadeMs: 1400,
    vignette: { strength: 0.35, focusY: 0.35 },
    wrapMargin: 140,
    dprCap: 2,

    // will be overridden from CSS anyway
    composite: "screen",
    blurPx: 20,
    opacity: 0.95,
    colors: ["rgba(120,190,255,0.55)"],

    splat: {
        steps: 72,
        irregularity: 0.7,
        lumps: 0.65,
        lumpFreq: 3.4,
        anisotropy: 0.4,
        edgeSoftness: 0.22,
        offCenter: 0.55,
    },
};

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

function getThemeFxFromCSS() {
    const s = getComputedStyle(document.documentElement);

    const colors = [
        s.getPropertyValue("--ls-fx-c1").trim(),
        s.getPropertyValue("--ls-fx-c2").trim(),
        s.getPropertyValue("--ls-fx-c3").trim(),
        s.getPropertyValue("--ls-fx-c4").trim(),
    ].filter(Boolean);

    const composite = (s.getPropertyValue("--ls-fx-composite").trim() || "screen") as GlobalCompositeOperation;
    const blurPx = parseFloat(s.getPropertyValue("--ls-fx-blur")) || 20;
    const opacity = parseFloat(s.getPropertyValue("--ls-fx-opacity")) || 0.95;

    return { colors, composite, blurPx, opacity };
}

export function LightsCanvas({ settings }: { settings?: Partial<LightsConfig> }) {
    const ref = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const canvas = ref.current!;
        const ctx = canvas.getContext("2d", { alpha: true })!;
        const rng = mulberry32(1337);

        // Merge only geometry-ish parts from settings (colors/composite/blur/opacity come from CSS)
        let cfg: LightsConfig = {
            ...DEFAULTS,
            ...settings,
            radius: { ...DEFAULTS.radius, ...settings?.radius },
            speed: { ...DEFAULTS.speed, ...settings?.speed },
            scaleDrift: { ...DEFAULTS.scaleDrift, ...settings?.scaleDrift },
            vignette: { ...DEFAULTS.vignette, ...settings?.vignette },
            splat: { ...DEFAULTS.splat, ...settings?.splat },
        };

        // Theme FX is dynamic and always from CSS
        let themeFx = getThemeFxFromCSS();

        const applyThemeFx = () => {
            themeFx = getThemeFxFromCSS();

            // hard guarantee: always use theme colors, even if empty fallback
            if (!themeFx.colors.length) {
                themeFx.colors = DEFAULTS.colors;
            }

            // Apply CSS-derived blur/opacity to the element (matches your CSS variables)
            canvas.style.filter = `blur(${themeFx.blurPx}px) saturate(1.15)`;
            canvas.style.opacity = String(clamp(themeFx.opacity, 0, 1));
        };

        const resize = () => {
            const dpr = Math.min(cfg.dprCap, window.devicePixelRatio || 1);
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        type RadiusPx = { min: number; max: number };
        let radiusPx: RadiusPx = { min: 120, max: 520 };
        const recomputeRadiusPx = () => {
            const base = Math.min(window.innerWidth, window.innerHeight);
            radiusPx = {
                min: Math.max(60, base * cfg.radius.min),
                max: Math.max(61, base * cfg.radius.max),
            };
        };

        // init blobs
        const blobs: Blob[] = [];
        for (let i = 0; i < cfg.blobCount; i++) {
            const baseR = rand(rng, radiusPx.min, radiusPx.max);
            blobs.push({
                x: rand(rng, 0, window.innerWidth),
                y: rand(rng, 0, window.innerHeight),
                vx: rand(rng, -1, 1) * rand(rng, cfg.speed.min, cfg.speed.max),
                vy: rand(rng, -1, 1) * rand(rng, cfg.speed.min, cfg.speed.max),
                baseR,
                scale: 1,
                scaleTarget: rand(rng, cfg.scaleDrift.min, cfg.scaleDrift.max),
                alpha: 1,
                state: "alive",
                colorIndex: i % Math.max(1, themeFx.colors.length),
                shape: generateSplatShape(i * 999, baseR, cfg.splat),
            });
        }

        // respawn on opposite side with smooth fade
        function respawnOpposite(b: Blob, out: { left: boolean; right: boolean; top: boolean; bottom: boolean }) {
            const r = b.baseR * b.scale;
            const pad = cfg.wrapMargin + r * 1.2;

            if (out.left) {
                b.x = window.innerWidth + pad;
                b.y = rand(rng, 0, window.innerHeight);
            } else if (out.right) {
                b.x = -pad;
                b.y = rand(rng, 0, window.innerHeight);
            } else if (out.top) {
                b.y = window.innerHeight + pad;
                b.x = rand(rng, 0, window.innerWidth);
            } else {
                b.y = -pad;
                b.x = rand(rng, 0, window.innerWidth);
            }

            // optional: new motion so it doesn't look “teleported”
            const sp = rand(rng, cfg.speed.min, cfg.speed.max);
            const ang = rand(rng, 0, Math.PI * 2);
            b.vx = Math.cos(ang) * sp;
            b.vy = Math.sin(ang) * sp;

            // slow size drift target (still very slow)
            b.scaleTarget = rand(rng, cfg.scaleDrift.min, cfg.scaleDrift.max);

            // IMPORTANT: always theme palette
            b.colorIndex = (b.colorIndex | 0) % Math.max(1, themeFx.colors.length);

            b.alpha = 0;
            b.state = "fadeIn";
        }

        // vignette (optional)
        const drawVignette = () => {
            if (cfg.vignette.strength <= 0) return;

            const g = ctx.createRadialGradient(
                window.innerWidth * 0.5,
                window.innerHeight * cfg.vignette.focusY,
                120,
                window.innerWidth * 0.5,
                window.innerHeight * cfg.vignette.focusY,
                Math.max(window.innerWidth, window.innerHeight) * 0.9
            );
            g.addColorStop(0, "rgba(0,0,0,0)");
            g.addColorStop(1, `rgba(0,0,0,${clamp(cfg.vignette.strength, 0, 1)})`);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        };

        // Observe theme changes: refresh colors/composite/blur/opacity and remap indices
        const mo = new MutationObserver(() => {
            const oldLen = Math.max(1, themeFx.colors.length);
            applyThemeFx();
            const newLen = Math.max(1, themeFx.colors.length);

            if (oldLen !== newLen) {
                for (const b of blobs) b.colorIndex = b.colorIndex % newLen;
            }

            // also re-read radius if user changes breakpoints? not needed here
        });
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        const onResize = () => {
            // Keep cfg geometry possibly updated (if you want breakpoint logic, do it here)
            resize();
            recomputeRadiusPx();
        };

        // initial setup
        applyThemeFx();
        resize();
        recomputeRadiusPx();
        window.addEventListener("resize", onResize);

        let raf = 0;
        let last = performance.now();

        const frame = (now: number) => {
            const dt = Math.min(32, now - last);
            last = now;

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            drawVignette();

            // ALWAYS from theme vars:
            ctx.globalCompositeOperation = themeFx.composite;
            // NOTE: per-blob alpha below; base opacity is from CSS var
            const baseOpacity = clamp(themeFx.opacity, 0, 1);

            for (const b of blobs) {
                // move
                b.x += b.vx * dt;
                b.y += b.vy * dt;

                // ultra slow scale drift (no pumping)
                b.scale += (b.scaleTarget - b.scale) * cfg.scaleDrift.speed * dt;
                if (Math.abs(b.scale - b.scaleTarget) < 0.002) {
                    b.scaleTarget = rand(rng, cfg.scaleDrift.min, cfg.scaleDrift.max);
                }

                const r = b.baseR * b.scale;
                const margin = r + cfg.wrapMargin;

                const out = {
                    left: b.x < -margin,
                    right: b.x > window.innerWidth + margin,
                    top: b.y < -margin,
                    bottom: b.y > window.innerHeight + margin,
                };
                const isOut = out.left || out.right || out.top || out.bottom;

                if (b.state === "alive" && isOut) b.state = "fadeOut";

                const fadeStep = dt / cfg.fadeMs;

                if (b.state === "fadeOut") {
                    b.alpha -= fadeStep;
                    if (b.alpha <= 0) {
                        // respawn opposite side smoothly
                        respawnOpposite(b, out);
                    }
                } else if (b.state === "fadeIn") {
                    b.alpha += fadeStep;
                    if (b.alpha >= 1) {
                        b.alpha = 1;
                        b.state = "alive";
                    }
                }

                // draw splat
                const color = themeFx.colors[b.colorIndex] || themeFx.colors[0];

                // gradient center drift (does not change shape)
                const off = r * cfg.splat.offCenter;
                const gx = b.x + Math.sin(now * 0.00012) * off;
                const gy = b.y + Math.cos(now * 0.00010) * off;

                const { rx, ry } = b.shape;
                const steps = rx.length - 1;

                const s = r / b.baseR;

                const path = new Path2D();
                // start at first point (avoid implicit line from 0,0)
                {
                    const a0 = 0;
                    path.moveTo(b.x + Math.cos(a0) * rx[0] * s, b.y + Math.sin(a0) * ry[0] * s);
                }
                for (let i = 1; i <= steps; i++) {
                    const a = (i / steps) * Math.PI * 2;
                    path.lineTo(b.x + Math.cos(a) * rx[i] * s, b.y + Math.sin(a) * ry[i] * s);
                }
                path.closePath();

                ctx.save();
                ctx.clip(path);

                const g = ctx.createRadialGradient(gx, gy, 0, b.x, b.y, r * 1.15);
                g.addColorStop(0, color);
                g.addColorStop(1 - cfg.splat.edgeSoftness, color);
                g.addColorStop(1, "rgba(0,0,0,0)");

                ctx.globalAlpha = baseOpacity * clamp(b.alpha, 0, 1);
                ctx.fillStyle = g;
                ctx.fillRect(b.x - r * 1.6, b.y - r * 1.6, r * 3.2, r * 3.2);

                ctx.restore();
            }

            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
            raf = requestAnimationFrame(frame);
        };

        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            mo.disconnect();
        };
    }, [settings]);

    return <canvas ref={ref} className="lights-canvas" aria-hidden="true" />;
}
