/**
 * p5.js sketches (instance mode) for the chart's living visuals.
 *
 *  - makeFieldSketch:  the brass topographic field behind everything. Reads the
 *                      shared `camera` so its contours parallax-drift on pan.
 *  - makePlanetSketch: a soft, procedurally-textured little world, seeded per
 *                      mix and coloured from its spectral accent.
 *
 * Both are framework-agnostic factories; the React wrappers (TopoField, Planet)
 * just mount/unmount them.
 */
import p5 from 'p5';

import { camera } from './camera';
import { hexToRgb, hslToRgb, rgbToHsl, seedFromId } from './seed';
import type { World } from './worlds';

/**
 * Controls the speed of the planet's rotation, when it is rotating.
 */
const SPIN_SPEED = 0.009;

// FES adds heavy overhead; disable once at module load.
(p5 as any).disableFriendlyErrors = true;

/* ---------------- topographic field ---------------- */
export function makeFieldSketch() {
    const CELL = 36;
    const LEVELS = [0.36, 0.46, 0.56, 0.66, 0.74];
    const SCALE = 0.00165;
    const PARALLAX = 0.5;
    return (p: any) => {
        let cols = 0;
        let rows = 0;
        let vals: Float32Array = new Float32Array(0);
        const calc = () => {
            cols = Math.ceil(p.width / CELL) + 2;
            rows = Math.ceil(p.height / CELL) + 2;
            vals = new Float32Array((cols + 1) * (rows + 1));
        };
        const fbm = (x: number, y: number, z: number) => {
            let v = 0;
            let a = 0.5;
            let f = 1;
            let s = 0;
            for (let o = 0; o < 3; o++) {
                v += a * p.noise(x * f, y * f, z * f);
                s += a;
                a *= 0.5;
                f *= 2;
            }
            return v / s;
        };

        p.setup = () => {
            p.createCanvas(window.innerWidth, window.innerHeight);
            p.pixelDensity(1);
            p.frameRate(20);
            p.noiseSeed(1337);
            calc();
        };
        p.windowResized = () => {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
            calc();
        };

        p.draw = () => {
            p.background(12, 9, 22);
            const ox = camera.x * PARALLAX;
            const oy = camera.y * PARALLAX;
            const baseX = Math.floor(ox / CELL);
            const baseY = Math.floor(oy / CELL);
            const fracx = ox - baseX * CELL;
            const fracy = oy - baseY * CELL;
            const z = p.frameCount * 0.0026;

            const W1 = cols + 1;
            for (let j = 0; j <= rows; j++) {
                const wy = (baseY + j) * CELL * SCALE;
                for (let i = 0; i <= cols; i++)
                    vals[j * W1 + i] = fbm((baseX + i) * CELL * SCALE, wy, z);
            }

            p.noFill();
            // faint chart graticule
            const GRID = 156;
            p.stroke(201, 164, 104, 9);
            p.strokeWeight(1);
            for (let k = Math.floor(ox / GRID); k * GRID - ox < p.width; k++) {
                const sx = k * GRID - ox;
                p.line(sx, 0, sx, p.height);
            }
            for (let k = Math.floor(oy / GRID); k * GRID - oy < p.height; k++) {
                const sy = k * GRID - oy;
                p.line(0, sy, p.width, sy);
            }

            for (let li = 0; li < LEVELS.length; li++) {
                const L = LEVELS[li];
                const major = li % 2 === 1;
                p.stroke(201, 164, 104, major ? 26 : 14);
                p.strokeWeight(major ? 1.1 : 0.9);
                p.beginShape(p.LINES);
                for (let j = 0; j < rows; j++) {
                    for (let i = 0; i < cols; i++) {
                        const a = vals[j * W1 + i];
                        const b = vals[j * W1 + i + 1];
                        const c = vals[(j + 1) * W1 + i + 1];
                        const d = vals[(j + 1) * W1 + i];
                        let cs = 0;
                        if (a > L) cs |= 1;
                        if (b > L) cs |= 2;
                        if (c > L) cs |= 4;
                        if (d > L) cs |= 8;
                        if (cs === 0 || cs === 15) continue;
                        const x_ = i * CELL - fracx;
                        const y_ = j * CELL - fracy;
                        const T = () => p.vertex(x_ + CELL * ((L - a) / (b - a)), y_);
                        const R = () =>
                            p.vertex(x_ + CELL, y_ + CELL * ((L - b) / (c - b)));
                        const B = () =>
                            p.vertex(x_ + CELL * ((L - d) / (c - d)), y_ + CELL);
                        const Lf = () => p.vertex(x_, y_ + CELL * ((L - a) / (d - a)));
                        switch (cs) {
                            case 1:
                            case 14:
                                Lf();
                                T();
                                break;
                            case 2:
                            case 13:
                                T();
                                R();
                                break;
                            case 3:
                            case 12:
                                Lf();
                                R();
                                break;
                            case 4:
                            case 11:
                                R();
                                B();
                                break;
                            case 6:
                            case 9:
                                T();
                                B();
                                break;
                            case 7:
                            case 8:
                                Lf();
                                B();
                                break;
                            case 5:
                                Lf();
                                T();
                                R();
                                B();
                                break;
                            case 10:
                                T();
                                R();
                                Lf();
                                B();
                                break;
                        }
                    }
                }
                p.endShape();
            }
        };
    };
}

/* ---------------- planet ---------------- */
export function makePlanetSketch(world: World, isSpinning?: () => boolean) {
    const seed = seedFromId(world.id);
    const [H, S] = rgbToHsl(...hexToRgb(world.color));
    const PAL = [
        { th: 0.4, c: hslToRgb(H, Math.min(1, S * 1.05), 0.2) },
        { th: 0.52, c: hslToRgb(H, S * 0.95, 0.36) },
        { th: 0.66, c: hslToRgb(H + 12, S * 0.85, 0.52) },
        { th: 0.82, c: hslToRgb(H + 26, S * 0.7, 0.66) },
        { th: 1.01, c: hslToRgb(H + 8, S * 0.3, 0.86) },
    ];
    const ATMO = hslToRgb(H, Math.min(1, S * 0.8), 0.72);
    const L = (() => {
        const v = [-0.55, -0.45, 0.7];
        const m = Math.hypot(v[0], v[1], v[2]);
        return v.map((x) => x / m);
    })();

    return (p: any) => {
        const TW = 200;
        const TH = 100;
        let tr: Uint8ClampedArray;
        let tg: Uint8ClampedArray;
        let tb: Uint8ClampedArray;
        let D = 0;
        let R = 0;
        let cx = 0;
        let cy = 0;
        let x0 = 0;
        let x1 = 0;
        let y0 = 0;
        let y1 = 0;
        let rot = 0;
        const bgStars: Array<{ x: number; y: number; s: number; a: number }> = [];
        let moon: any = null;

        const fbm = (x: number, y: number, z: number) => {
            let v = 0;
            let a = 0.5;
            let f = 1;
            let sum = 0;
            for (let o = 0; o < 4; o++) {
                v += a * p.noise(x * f, y * f, z * f);
                sum += a;
                a *= 0.5;
                f *= 2;
            }
            return v / sum;
        };
        const colorFor = (v: number, lat: number) => {
            let c = PAL[PAL.length - 1].c;
            for (const stop of PAL) {
                if (v < stop.th) {
                    c = stop.c;
                    break;
                }
            }
            const ice = Math.max(0, (Math.abs(lat) - 1.15) / 0.45);
            if (ice > 0) {
                const sn = PAL[4].c;
                const k = Math.min(1, ice);
                return [
                    c[0] + (sn[0] - c[0]) * k,
                    c[1] + (sn[1] - c[1]) * k,
                    c[2] + (sn[2] - c[2]) * k,
                ];
            }
            return c;
        };
        const bakeTexture = () => {
            tr = new Uint8ClampedArray(TW * TH);
            tg = new Uint8ClampedArray(TW * TH);
            tb = new Uint8ClampedArray(TW * TH);
            for (let j = 0; j < TH; j++) {
                const lat = (j / TH - 0.5) * Math.PI;
                for (let i = 0; i < TW; i++) {
                    const lon = (i / TW) * Math.PI * 2;
                    const sx = Math.cos(lat) * Math.cos(lon);
                    const sy = Math.sin(lat);
                    const sz = Math.cos(lat) * Math.sin(lon);
                    const w = fbm(sx * 1.7 + 5, sy * 1.7 + 5, sz * 1.7 + 5);
                    const v = fbm(
                        sx * 2.2 + w * 1.2,
                        sy * 2.2 + w * 1.2,
                        sz * 2.2 + w * 1.2,
                    );
                    const c = colorFor(v, lat);
                    const idx = j * TW + i;
                    tr[idx] = c[0];
                    tg[idx] = c[1];
                    tb[idx] = c[2];
                }
            }
        };

        p.setup = () => {
            D = 220; // square planet within the fixed-height specimen banner
            p.createCanvas(D, D);
            p.pixelDensity(1);
            p.frameRate(30);
            p.noiseSeed(seed);
            p.randomSeed(seed);
            R = D * 0.32;
            cx = D / 2;
            cy = D * 0.46;
            x0 = Math.max(0, Math.floor(cx - R) - 1);
            x1 = Math.min(D, Math.ceil(cx + R) + 1);
            y0 = Math.max(0, Math.floor(cy - R) - 1);
            y1 = Math.min(D, Math.ceil(cy + R) + 1);
            bakeTexture();
            for (let i = 0; i < 34; i++)
                bgStars.push({
                    x: p.random(D),
                    y: p.random(D),
                    s: p.random(0.6, 1.8),
                    a: p.random(40, 150),
                });
            if (p.random() > 0.45) {
                moon = {
                    r: R * p.random(0.16, 0.24),
                    dist: R * p.random(1.5, 1.9),
                    squash: p.random(0.35, 0.6),
                    phase: p.random(Math.PI * 2),
                    col: hslToRgb(H, S * 0.2, p.random(0.6, 0.78)),
                };
            }
        };

        const drawMoon = (ang: number) => {
            const mx = cx + Math.cos(ang) * moon.dist;
            const my = cy + Math.sin(ang) * moon.dist * moon.squash;
            const g = p.drawingContext as CanvasRenderingContext2D;
            const grd = g.createRadialGradient(
                mx - moon.r * 0.3,
                my - moon.r * 0.3,
                0,
                mx,
                my,
                moon.r,
            );
            grd.addColorStop(0, `rgb(${moon.col.join(',')})`);
            grd.addColorStop(
                1,
                `rgba(${moon.col.map((c: number) => Math.round(c * 0.35)).join(',')},1)`,
            );
            p.noStroke();
            g.fillStyle = grd;
            g.beginPath();
            g.arc(mx, my, moon.r, 0, Math.PI * 2);
            g.fill();
        };

        p.draw = () => {
            p.clear();
            p.noStroke();
            for (const st of bgStars) {
                p.fill(235, 232, 250, st.a);
                p.circle(st.x, st.y, st.s);
            }
            const mAng = rot * 1.4 + (moon ? moon.phase : 0);
            const behind = moon && Math.sin(mAng) < 0;
            if (moon && behind) drawMoon(mAng);

            p.loadPixels();
            const px = p.pixels as number[];
            const Wd = p.width;
            for (let y = y0; y < y1; y++) {
                const ny = (y - cy) / R;
                for (let x = x0; x < x1; x++) {
                    const nx = (x - cx) / R;
                    const r2 = nx * nx + ny * ny;
                    if (r2 > 1) continue;
                    const nz = Math.sqrt(1 - r2);
                    const lon = Math.atan2(nx, nz) + rot;
                    let u = lon / (Math.PI * 2);
                    u -= Math.floor(u);
                    const lat = Math.asin(ny < -1 ? -1 : ny > 1 ? 1 : ny);
                    const v = lat / Math.PI + 0.5;
                    const ti = (u * TW) | 0;
                    let tj = (v * TH) | 0;
                    if (tj < 0) tj = 0;
                    else if (tj >= TH) tj = TH - 1;
                    const tIdx = tj * TW + ti;
                    let light = nx * L[0] + ny * L[1] + nz * L[2];
                    if (light < 0) light = 0;
                    const shade = 0.22 + 0.95 * light;
                    const fres = Math.pow(1 - nz, 3) * 0.6;
                    const rr = tr[tIdx] * shade + ATMO[0] * fres;
                    const gg = tg[tIdx] * shade + ATMO[1] * fres;
                    const bb = tb[tIdx] * shade + ATMO[2] * fres;
                    let a = 255;
                    if (r2 > 0.9) a = 255 * Math.max(0, (1 - r2) / 0.1);
                    const o = 4 * (y * Wd + x);
                    px[o] = rr > 255 ? 255 : rr;
                    px[o + 1] = gg > 255 ? 255 : gg;
                    px[o + 2] = bb > 255 ? 255 : bb;
                    px[o + 3] = a;
                }
            }
            p.updatePixels();

            const g = p.drawingContext as CanvasRenderingContext2D;
            g.save();
            g.globalCompositeOperation = 'lighter';
            const grd = g.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.35);
            grd.addColorStop(0, `rgba(${ATMO.join(',')},0)`);
            grd.addColorStop(0.72, `rgba(${ATMO.join(',')},0.16)`);
            grd.addColorStop(1, `rgba(${ATMO.join(',')},0)`);
            g.fillStyle = grd;
            g.beginPath();
            g.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
            g.fill();
            g.restore();

            if (moon && !behind) drawMoon(mAng);
            // spin only while the track is playing (a smidge faster than before)
            if (!isSpinning || isSpinning()) rot += SPIN_SPEED;
        };
    };
}
