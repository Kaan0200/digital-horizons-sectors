import { observer } from 'mobx-react';
import type React from 'react';

import { useStore } from '../stores/RootStore';

/** The catalogue "specimen plate" for the focused world. */
const SpecimenPlate = observer((): React.JSX.Element => {
    const store = useStore();
    const world = store.focusedId ? store.worldById(store.focusedId) : undefined;

    return (
        <div
            className={`detail${world ? ' show' : ''}`}
            style={
                world
                    ? ({ ['--c' as string]: world.color } as React.CSSProperties)
                    : undefined
            }
        >
            <button className="dClose" title="Close" onClick={() => store.closeFocus()}>
                ✕
            </button>
            {world && (
                <>
                    <div className="dBody">
                        <div className="genre">{world.genre}</div>
                        <h2>{world.name}</h2>
                        <div className="catline">
                            {world.cat}
                            <span className="sep">/</span>
                            mag {world.mag}
                        </div>
                        <div className="catline">{world.genre}</div>
                        <p className="desc">{world.desc}</p>
                        <div className="tlHead">Transit Log</div>
                        {world.tracks.length ? (
                            <ol className="tracklist">
                                {world.tracks.map((tr, k) => (
                                    <li key={k}>
                                        <span className="tt">{tr.t}</span>
                                        <span className="tn">{tr.n}</span>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <div className="tracklist">
                                <div className="empty">Transit log not yet charted.</div>
                            </div>
                        )}
                        <button className="tune" onClick={() => store.play(world.id)}>
                            Tune In
                        </button>
                    </div>
                </>
            )}
        </div>
    );
});

export default SpecimenPlate;
