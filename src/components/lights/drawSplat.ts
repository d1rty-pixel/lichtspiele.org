import { LightsConfig, Blob } from "./types";

export function drawSplat(
    ctx: CanvasRenderingContext2D,
    blob: Blob,
    now: number,
    cfg: LightsConfig
) {
    const { rx, ry } = blob.shape;
    const steps = rx.length - 1;

    const breathe =
        1 + Math.sin(blob.phase) * cfg.breathe.amount;

    const rScale = blob.baseR * breathe;

    const off = rScale * cfg.splat.offCenter;
    const gx = blob.x + Math.sin(now * 0.00015) * off;
    const gy = blob.y + Math.cos(now * 0.00012) * off;

    const path = new Path2D();
    for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const px = blob.x + Math.cos(a) * rx[i] * breathe;
        const py = blob.y + Math.sin(a) * ry[i] * breathe;
        if (i === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
    }
    path.closePath();

    ctx.save();
    ctx.clip(path);

    const g = ctx.createRadialGradient(
        gx,
        gy,
        0,
        blob.x,
        blob.y,
        rScale * 1.15
    );
    g.addColorStop(0, cfg.colors[blob.colorIndex]);
    g.addColorStop(
        1 - cfg.splat.edgeSoftness,
        cfg.colors[blob.colorIndex]
    );
    g.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = g;
    ctx.fillRect(
        blob.x - rScale * 1.4,
        blob.y - rScale * 1.4,
        rScale * 2.8,
        rScale * 2.8
    );

    ctx.restore();
}
