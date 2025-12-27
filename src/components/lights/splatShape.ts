import { LightsConfig, SplatShape } from "./types";
import { mulberry32, rand } from "./noise";

export function generateSplatShape(
    seed: number,
    r: number,
    cfg: LightsConfig["splat"]
): SplatShape {
    const rng = mulberry32(seed);
    const steps = cfg.steps;

    const rx: number[] = [];
    const ry: number[] = [];

    const ax = 1 + rand(rng, -cfg.anisotropy, cfg.anisotropy);
    const ay = 1 + rand(rng, -cfg.anisotropy, cfg.anisotropy);

    // 1) raw samples
    for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;

        const lump =
            Math.sin(a * cfg.lumpFreq + rand(rng, 0, Math.PI * 2)) * 0.5 + 0.5;

        const irr = rand(rng, -1, 1) * cfg.irregularity;

        const shape =
            1 +
            irr * 0.25 +
            (lump - 0.5) * 2 * cfg.lumps * 0.35;

        rx.push(r * shape * ax);
        ry.push(r * shape * ay);
    }

    // 2) prevent sharp bulges / dents (slope clamp)
    // max change per step as fraction of base radius:
    // smaller => smoother; bigger => more jaggy
    const maxDelta = r * 0.020; // 2.0% pro Sample (typisch gut: 0.015..0.03)
    clampDeltaCircular(rx, maxDelta);
    clampDeltaCircular(ry, maxDelta);

    // 3) smooth (more than before, but still keeps character)
    smoothCircular(rx, 3);
    smoothCircular(ry, 3);

    // 4) clamp again after smoothing to guarantee bound
    clampDeltaCircular(rx, maxDelta);
    clampDeltaCircular(ry, maxDelta);

    return { rx, ry };
}

/**
 * Limit how much adjacent samples may differ (circular array).
 * This kills sharp spikes in/out.
 */
function clampDeltaCircular(arr: number[], maxDelta: number) {
    const n = arr.length;
    if (n < 3) return;

    // do a few relaxation passes so the constraint propagates smoothly
    for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            const d = arr[j] - arr[i];
            if (d > maxDelta) arr[j] = arr[i] + maxDelta;
            else if (d < -maxDelta) arr[j] = arr[i] - maxDelta;
        }
        for (let i = n - 1; i >= 0; i--) {
            const j = (i - 1 + n) % n;
            const d = arr[j] - arr[i];
            if (d > maxDelta) arr[j] = arr[i] + maxDelta;
            else if (d < -maxDelta) arr[j] = arr[i] - maxDelta;
        }
    }
}

/**
 * Simple circular smoothing (low-pass).
 */
function smoothCircular(arr: number[], iters: number) {
    const n = arr.length;
    for (let k = 0; k < iters; k++) {
        const tmp = arr.slice();
        for (let i = 0; i < n; i++) {
            const prev = arr[(i - 1 + n) % n];
            const cur = arr[i];
            const next = arr[(i + 1) % n];
            tmp[i] = (prev + cur + next) / 3;
        }
        for (let i = 0; i < n; i++) arr[i] = tmp[i];
    }
}
