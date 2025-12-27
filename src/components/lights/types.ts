export type LightsConfig = {
    blobCount: number;

    radius: { min: number; max: number };
    speed: { min: number; max: number };

    // VERY slow scale drift
    scaleDrift: {
        min: number;      // e.g. 0.92
        max: number;      // e.g. 1.08
        speed: number;    // e.g. 0.000015
    };

    fadeMs: number;

    vignette: { strength: number; focusY: number };

    wrapMargin: number;
    dprCap: number;

    // These are ALWAYS taken from CSS theme vars at runtime:
    composite: GlobalCompositeOperation;
    blurPx: number;
    opacity: number;
    colors: string[];

    splat: {
        steps: number;
        irregularity: number;
        lumps: number;
        lumpFreq: number;
        anisotropy: number;
        edgeSoftness: number;
        offCenter: number;
    };
};

export type SplatShape = {
    rx: number[];
    ry: number[];
};

export type Blob = {
    x: number;
    y: number;
    vx: number;
    vy: number;

    baseR: number;
    scale: number;
    scaleTarget: number;

    alpha: number;
    state: "alive" | "fadeOut" | "fadeIn";

    colorIndex: number;
    shape: SplatShape;
};
