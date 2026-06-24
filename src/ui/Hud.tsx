import { observer } from 'mobx-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useStore } from '../stores/RootStore';
import { camera, recenter } from '../engine/camera';

/** Brand, live coordinate readout, and top-right chart controls. */
const Hud = observer((): React.JSX.Element => {
    const store = useStore();
    const coordRef = useRef<HTMLDivElement>(null);
    const [hintGone, setHintGone] = useState(false);

    // live coordinate readout — cheap rAF that only writes text, no React state.
    useEffect(() => {
        let raf = 0;
        let last = 0;
        const pad = (n: number) => String(Math.round(n)).padStart(4, '0');
        const tick = () => {
            raf = requestAnimationFrame(tick);
            const now = performance.now();
            if (now - last < 120) return;
            last = now;
            if (coordRef.current) {
                coordRef.current.innerHTML = `X&nbsp;<b>${pad(camera.x)}</b>&nbsp;&nbsp;Y&nbsp;<b>${pad(camera.y)}</b>`;
            }
        };
        tick();
        const timer = window.setTimeout(() => setHintGone(true), 6000);
        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(timer);
        };
    }, []);

    return (
        <div className="hud">
            <div className="brand">
                <div className="mark" />
                <div>
                    <h1>Digital Horizons</h1>
                    <div className="sub">Celestial Almanac</div>
                </div>
            </div>
            <div className="coords" ref={coordRef} />

            <div className="topright">
                <button
                    className="gbtn"
                    title="Return to origin"
                    onClick={() => recenter()}
                >
                    ⌖
                </button>
                <button
                    className="gbtn"
                    title="Open the catalogue"
                    onClick={() => store.openDrawer()}
                >
                    ☰
                </button>
            </div>

            {!hintGone && (
                <div className="hint">Drift the chart · select a world to tune in</div>
            )}
        </div>
    );
});

export default Hud;
