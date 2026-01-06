"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type AsciiPortraitProps = {
    src: string;
    alt?: string;
    /** Breite in Zeichen (nicht Pixel). 80–140 ist meist gut. */
    cols?: number;
    /** Zeilenhöhe-Faktor fürs <pre> (optischer Feinschliff) */
    lineHeight?: number;
    /** Zeichen-Set: von dunkel -> hell */
    charset?: string;
    /** Wenn true: der Zerfall läuft auch ohne Hover einmal kurz beim Mount */
    glitchOnce?: boolean;
};

const DEFAULT_CHARSET = "@%#*+=-:. ";

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

export default function AsciiPortrait({
                                          src,
                                          alt = "Portrait",
                                          cols = 110,
                                          lineHeight = 1.05,
                                          charset = DEFAULT_CHARSET,
                                          glitchOnce = false,
                                      }: AsciiPortraitProps) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const preRef = useRef<HTMLPreElement | null>(null);

    const [loaded, setLoaded] = useState(false);
    const [hover, setHover] = useState(false);

    const baseAsciiRef = useRef<string>(""); // "sauberes" ASCII
    const rafRef = useRef<number | null>(null);
    const phaseRef = useRef<number>(0); // 0..1 (0 = normal ascii, 1 = komplett zerfallen)
    const runningRef = useRef<boolean>(false);

    const charsetArr = useMemo(() => charset.split(""), [charset]);

    useEffect(() => {
        let cancelled = false;

        const img = new Image();
        img.crossOrigin = "anonymous"; // ok für same-origin; falls extern evtl. CORS nötig
        img.src = src;

        img.onload = () => {
            if (cancelled) return;

            // Zielgröße im ASCII-Raster:
            // Zeilenhöhe muss "korrigiert" werden, weil Textzellen nicht quadratisch sind.
            const w = cols;
            const aspect = img.height / img.width;
            const charAspect = 0.5; // grobe Korrektur: Zeichen sind höher als breit
            const h = Math.max(20, Math.round(w * aspect * charAspect));

            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            const ctx = c.getContext("2d", { willReadFrequently: true });
            if (!ctx) return;

            // Bild reinzeichnen (klein skaliert)
            ctx.drawImage(img, 0, 0, w, h);
            const { data } = ctx.getImageData(0, 0, w, h);

            // ASCII bauen
            const lines: string[] = [];
            for (let y = 0; y < h; y++) {
                let line = "";
                for (let x = 0; x < w; x++) {
                    const i = (y * w + x) * 4;
                    const r = data[i] ?? 0;
                    const g = data[i + 1] ?? 0;
                    const b = data[i + 2] ?? 0;

                    // Luminanz (perceived brightness)
                    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0..255
                    const t = lum / 255; // 0..1
                    // dunkel -> vorn im charset (mehr "Ink")
                    const idx = Math.round((1 - t) * (charsetArr.length - 1));
                    line += charsetArr[clamp(idx, 0, charsetArr.length - 1)] ?? " ";
                }
                lines.push(line);
            }

            baseAsciiRef.current = lines.join("\n");
            if (preRef.current) preRef.current.textContent = baseAsciiRef.current;

            setLoaded(true);

            if (glitchOnce) {
                // kurzes “zerfall und zurück”
                startAnimation(true);
            }
        };

        img.onerror = () => {
            // wenn Bild nicht lädt, nichts tun
        };

        return () => {
            cancelled = true;
            stopAnimation();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, cols, charset]);

    function stopAnimation() {
        runningRef.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    }

    function startAnimation(runOnce: boolean) {
        if (!preRef.current) return;
        if (!baseAsciiRef.current) return;

        runningRef.current = true;

        const base = baseAsciiRef.current;
        const baseChars = base.split(""); // ja, kostet — aber nur bei hover, ok
        const len = baseChars.length;

        const tick = () => {
            if (!runningRef.current) return;

            // Zielphase: hover => 1, sonst => 0
            const target = hover ? 1 : 0;

            // easing: schnell hin, etwas langsamer zurück
            const speed = target > phaseRef.current ? 0.12 : 0.08;
            phaseRef.current = phaseRef.current + (target - phaseRef.current) * speed;

            // Wenn runOnce: oszillieren einmal: 0 -> 1 -> 0
            if (runOnce) {
                // simple Dreiecksfunktion über ~1.2s
                const t = (performance.now() % 1200) / 1200;
                const tri = t < 0.5 ? t * 2 : (1 - t) * 2; // 0..1..0
                phaseRef.current = tri;
            }

            const p = clamp(phaseRef.current, 0, 1);

            // Zerfall: ab p ~0.2 fängt es an "wegzubröseln"
            // - random dropouts
            // - noise chars gelegentlich
            const out: string[] = new Array(len);

            // wie viele Zeichen "kaputt"?
            const dropoutProb = p * 0.55; // 0..0.55
            const noiseProb = p * 0.10;   // 0..0.10

            for (let i = 0; i < len; i++) {
                const ch = baseChars[i];

                // newlines behalten, sonst bricht das layout
                if (ch === "\n") {
                    out[i] = "\n";
                    continue;
                }

                const r = Math.random();
                if (r < dropoutProb) {
                    out[i] = " ";
                    continue;
                }

                if (r < dropoutProb + noiseProb) {
                    // noise char (aus dem "dichten" Teil des Sets)
                    const ni = Math.floor(Math.random() * Math.min(6, charsetArr.length));
                    out[i] = charsetArr[ni] ?? "#";
                    continue;
                }

                out[i] = ch;
            }

            // optional: scanline slice glitch bei hohem p
            if (p > 0.6) {
                // ein paar Zeilen zufällig verschieben
                const text = out.join("");
                const lines = text.split("\n");
                const n = Math.floor(1 + p * 4);
                for (let k = 0; k < n; k++) {
                    const y = Math.floor(Math.random() * lines.length);
                    const line = lines[y] ?? "";
                    const shift = Math.floor((Math.random() - 0.5) * 10); // -5..+5
                    if (shift > 0) lines[y] = " ".repeat(shift) + line.slice(0, Math.max(0, line.length - shift));
                    if (shift < 0) lines[y] = line.slice(-shift) + " ".repeat(-shift);
                }
                preRef.current!.textContent = lines.join("\n");
            } else {
                preRef.current!.textContent = out.join("");
            }

            // Ende-Condition für runOnce
            if (runOnce) {
                // stop nach ~1.2s und zurück auf base
                // (wir stoppen, wenn t fast wieder 0 ist)
                const t = (performance.now() % 1200) / 1200;
                if (t > 0.98) {
                    preRef.current!.textContent = base;
                    phaseRef.current = 0;
                    stopAnimation();
                    return;
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
    }

    // Start/Stop Animation wenn hover sich ändert
    useEffect(() => {
        if (!loaded) return;

        // Wenn wir hovern oder gerade nicht bei 0 sind, animieren
        if (hover || phaseRef.current > 0.01) {
            if (!runningRef.current) startAnimation(false);
        } else {
            // sicherstellen: base text
            if (preRef.current) preRef.current.textContent = baseAsciiRef.current;
            stopAnimation();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hover, loaded]);

    return (
        <div
            ref={wrapRef}
            className="ascii-portrait overflow-hidden"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            tabIndex={0}
            role="img"
            aria-label={alt}
            title={alt}
        >
            {/* Bild als Fallback / Hintergrund */}
            <img className="ascii-portrait__img" src={src} alt="" aria-hidden="true" />

            {/* ASCII Overlay */}
            <pre
                ref={preRef}
                className="ascii-portrait__pre"
                style={{ lineHeight }}
                aria-hidden="true"
            />
        </div>
    );
}
