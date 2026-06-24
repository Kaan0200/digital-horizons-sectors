import type React from 'react';
import { useEffect, useRef } from 'react';

import { camera, camState, camVel } from './camera';
import { hash2, mulberry32 } from './seed';
import TopoField from './TopoField';
import type { World } from './worlds';

interface Star {
    x: number;
    y: number;
    r: number;
    a: number;
    tw: number;
    c: string;
}
interface Layer {
    factor: number;
    density: number;
    size: [number, number];
    hue: string;
}

const TILE = 320;
const LAYERS: Layer[] = [
    { factor: 0.18, density: 3, size: [0.6, 1.3], hue: 'far' },
    { factor: 0.42, density: 4, size: [0.8, 1.8], hue: 'mid' },
    { factor: 0.8, density: 3, size: [1.0, 2.6], hue: 'near' },
];

function starColor(hue: string, r: number): string {
    if (hue === 'far') return 'rgb(150,150,200)';
    if (hue === 'mid') return r > 0.7 ? 'rgb(180,200,255)' : 'rgb(230,225,250)';
    return r > 0.8 ? 'rgb(255,225,190)' : 'rgb(255,255,255)';
}

interface Props {
    worlds: World[];
    edges: Array<[number, number]>;
    onSelect: (w: World) => void;
    activeId: string;
    playingId: string;
    /** count of other listeners per mix id (multiplayer) */
    listeners?: Record<string, number>;
}

/**
 * The infinite star chart. Owns the starfield <canvas>, drag-to-pan with
 * inertia, constellation lines, and per-frame positioning of the world nodes.
 * Camera state is shared (module-level) so this never re-renders while panning.
 */
export default function StarMap({
    worlds,
    edges,
    onSelect,
    activeId,
    playingId,
    listeners,
}: Props): React.JSX.Element {
    const stageRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const stage = stageRef.current!;
        const ctx = canvas.getContext('2d')!;
        let W = 0;
        let H = 0;
        let raf = 0;
        let last = 0;
        let t = 0;
        const tileCache = new Map<string, Star[]>();

        const genTile = (li: number, tx: number, ty: number): Star[] => {
            const key = `${li}:${tx}:${ty}`;
            const hit = tileCache.get(key);
            if (hit) return hit;
            const L = LAYERS[li];
            const rnd = mulberry32(
                hash2((tx * 73856093) ^ (li * 19349663), ty * 83492791),
            );
            const stars: Star[] = [];
            for (let i = 0; i < L.density; i++) {
                const r = L.size[0] + rnd() * (L.size[1] - L.size[0]);
                stars.push({
                    x: tx * TILE + rnd() * TILE,
                    y: ty * TILE + rnd() * TILE,
                    r,
                    a: 0.35 + rnd() * 0.65,
                    tw: rnd() * Math.PI * 2,
                    c: starColor(L.hue, rnd()),
                });
            }
            if (tileCache.size > 4000) tileCache.clear();
            tileCache.set(key, stars);
            return stars;
        };

        const resize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
        };
        resize();
        window.addEventListener('resize', resize);

        // --- drag to pan with inertia ---
        // A press starts a *potential* drag. We only commit to dragging (and capture
        // the pointer) once it moves past DRAG_THRESHOLD — otherwise the press is a
        // click and must reach the node's button untouched. Capturing on pointerdown
        // would redirect the click to the stage and swallow node selection.
        const DRAG_THRESHOLD = 4;
        let pressing = false;
        let dragging = false;
        let pointerId = -1;
        let downPt = { x: 0, y: 0 };
        let lastPt = { x: 0, y: 0 };
        const onDown = (e: PointerEvent) => {
            pressing = true;
            dragging = false;
            pointerId = e.pointerId;
            downPt = { x: e.clientX, y: e.clientY };
            lastPt = { x: e.clientX, y: e.clientY };
            camVel.x = camVel.y = 0;
            camState.warp = null;
        };
        const onMove = (e: PointerEvent) => {
            if (!pressing) return;
            if (!dragging) {
                if (
                    Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) <=
                    DRAG_THRESHOLD
                )
                    return;
                dragging = true;
                stage.classList.add('dragging');
                stage.setPointerCapture(pointerId); // now redirect; the click is forfeit
            }
            const dx = e.clientX - lastPt.x;
            const dy = e.clientY - lastPt.y;
            camera.x -= dx;
            camera.y -= dy;
            camVel.x = -dx;
            camVel.y = -dy;
            lastPt = { x: e.clientX, y: e.clientY };
        };
        const onUp = () => {
            pressing = false;
            dragging = false;
            stage.classList.remove('dragging');
        };
        stage.addEventListener('pointerdown', onDown);
        stage.addEventListener('pointermove', onMove);
        stage.addEventListener('pointerup', onUp);
        stage.addEventListener('pointercancel', onUp);

        const positionNodes = () => {
            for (let i = 0; i < worlds.length; i++) {
                const el = nodeRefs.current[i];
                if (!el) continue;
                const sx = worlds[i].x - camera.x + W / 2;
                const sy = worlds[i].y - camera.y + H / 2;
                if (sx < -140 || sx > W + 140 || sy < -140 || sy > H + 140) {
                    el.style.display = 'none';
                } else {
                    el.style.display = 'block';
                    el.style.transform = `translate(${sx}px, ${sy}px)`;
                }
            }
        };

        const draw = () => {
            raf = requestAnimationFrame(draw);
            const now = performance.now();
            if (now - last < 30) return; // ~33fps
            last = now;
            t += 0.016;
            ctx.clearRect(0, 0, W, H);

            // stars
            for (let li = 0; li < LAYERS.length; li++) {
                const f = LAYERS[li].factor;
                const ox = camera.x * f;
                const oy = camera.y * f;
                const minTx = Math.floor((ox - W / 2) / TILE) - 1;
                const maxTx = Math.floor((ox + W / 2) / TILE) + 1;
                const minTy = Math.floor((oy - H / 2) / TILE) - 1;
                const maxTy = Math.floor((oy + H / 2) / TILE) + 1;
                for (let tx = minTx; tx <= maxTx; tx++) {
                    for (let ty = minTy; ty <= maxTy; ty++) {
                        for (const s of genTile(li, tx, ty)) {
                            const sx = s.x - ox + W / 2;
                            const sy = s.y - oy + H / 2;
                            const tw = 0.5 + 0.5 * Math.sin(t * 1.9 + s.tw);
                            ctx.globalAlpha = s.a * tw;
                            ctx.fillStyle = s.c;
                            ctx.fillRect(sx, sy, s.r, s.r);
                        }
                    }
                }
            }
            ctx.globalAlpha = 1;

            // constellation lines (full parallax, brass hairline)
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(201,164,104,0.15)';
            ctx.beginPath();
            for (const [i, j] of edges) {
                if (!worlds[i] || !worlds[j]) continue;
                ctx.moveTo(
                    worlds[i].x - camera.x + W / 2,
                    worlds[i].y - camera.y + H / 2,
                );
                ctx.lineTo(
                    worlds[j].x - camera.x + W / 2,
                    worlds[j].y - camera.y + H / 2,
                );
            }
            ctx.stroke();

            // inertia
            if (!dragging) {
                camera.x += camVel.x;
                camera.y += camVel.y;
                camVel.x *= 0.92;
                camVel.y *= 0.92;
                if (Math.abs(camVel.x) < 0.01) camVel.x = 0;
                if (Math.abs(camVel.y) < 0.01) camVel.y = 0;
            }
            // warp glide
            if (camState.warp) {
                camera.x += (camState.warp.x - camera.x) * 0.12;
                camera.y += (camState.warp.y - camera.y) * 0.12;
                if (
                    Math.hypot(camState.warp.x - camera.x, camState.warp.y - camera.y) <
                    0.5
                ) {
                    camera.x = camState.warp.x;
                    camera.y = camState.warp.y;
                    camState.warp = null;
                }
            }

            positionNodes();
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            stage.removeEventListener('pointerdown', onDown);
            stage.removeEventListener('pointermove', onMove);
            stage.removeEventListener('pointerup', onUp);
            stage.removeEventListener('pointercancel', onUp);
        };
    }, [worlds, edges]);

    return (
        <div className="dh-stage" ref={stageRef}>
            <TopoField />
            <canvas className="dh-starfield" ref={canvasRef} />
            <div className="dh-sector-layer">
                {worlds.map((w, i) => (
                    <div
                        className={`sector${w.id === activeId ? ' active' : ''}${w.id === playingId ? ' playing' : ''}`}
                        key={w.id}
                        ref={(el) => {
                            nodeRefs.current[i] = el;
                        }}
                    >
                        <button
                            className="node left-0 top-0 p-0 w-14 h-14 border-none rounded-full"
                            style={{ ['--c' as string]: w.color } as React.CSSProperties}
                            onClick={() => onSelect(w)}
                            aria-label={`${w.cat} — ${w.name}`}
                        />
                        <div className="label">
                            <b>{w.cat}</b>
                            <span>{w.name}</span>
                        </div>
                        {listeners && listeners[w.id] ? (
                            <div
                                className="listeners"
                                title={`${listeners[w.id]} listening now`}
                            >
                                ♪ {listeners[w.id]}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}
