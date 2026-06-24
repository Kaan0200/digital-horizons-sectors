import p5 from 'p5';
import type React from 'react';
import { useEffect, useRef } from 'react';

import { makeFieldSketch } from '../engine/sketches';

/** Full-viewport p5 topographic field that sits behind the starfield. */
export default function TopoField(): React.JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref.current) return;
        const inst = new p5(makeFieldSketch(), ref.current);
        return () => inst.remove();
    }, []);
    return <div className="dh-field" ref={ref} />;
}
