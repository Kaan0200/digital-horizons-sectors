import type React from 'react';
import { useState } from 'react';

/**
 * First-run splash. A full-screen observatory title card that sits above the
 * chart until the visitor enters. Dismissal fades the panel out, then unmounts
 * it so it never intercepts input again this session.
 */
const Splash = (): React.JSX.Element | null => {
    // 'in' → visible, 'out' → fading, null → gone
    const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');

    if (phase === 'gone') return null;

    const enter = () => {
        setPhase('out');
        window.setTimeout(() => setPhase('gone'), 700);
    };

    return (
        <div
            className={`splash${phase === 'out' ? ' leaving' : ''}`}
            data-testid="splash"
        >
            <div className="splash-inner">
                <div className="splash-mark" />
                <div className="splash-kicker">Cosmic Radio</div>
                <h1 className="splash-title">
                    Digital
                    <br />
                    Horizons
                </h1>
                <p className="splash-blurb">
                    A curated list of planets, each a world of sound. Explore the chart,
                    find a planet, and explore the tunes within.
                </p>
                <button
                    className="splash-enter"
                    data-testid="splash-enter"
                    onClick={enter}
                >
                    Enter the Almanac
                </button>
            </div>
            <div className="splash-foot">Est. MMXXV · Golden Snake Services</div>
        </div>
    );
};

export default Splash;
