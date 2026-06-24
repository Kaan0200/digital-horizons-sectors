import p5 from 'p5';
import type React from 'react';
import { useEffect, useRef } from 'react';

import { makePlanetSketch } from '../engine/sketches';
import type { World } from '../engine/worlds';

/** A living procedural planet for one world. Rebuilds when the world changes. */
export default function Planet({
    world,
    spinning = true,
}: {
    world: World;
    spinning?: boolean;
}): React.JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
    // Live spin flag — read by the sketch each frame so toggling play/pause
    // starts/stops the rotation without rebuilding the planet.
    const spinningRef = useRef(spinning);
    spinningRef.current = spinning;
    useEffect(() => {
        const host = ref.current;
        if (!host) return;
        // Mount p5 into a throwaway child container. p5 v2's remove() stops the
        // draw loop but doesn't reliably detach its <canvas>, so we own the
        // container and drop the whole thing on cleanup — guaranteeing exactly
        // one planet even under StrictMode's mount/remount double-invoke.
        const mount = document.createElement('div');
        host.appendChild(mount);
        const inst = new p5(
            makePlanetSketch(world, () => spinningRef.current),
            mount,
        );
        return () => {
            try {
                inst.remove();
            } catch {
                /* already gone */
            }
            mount.remove();
        };
    }, [world.id]);
    return <div ref={ref} />;
}
