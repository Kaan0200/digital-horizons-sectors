import { observer } from 'mobx-react';
import type React from 'react';

import { useStore } from '../stores/RootStore';
import { warpTo } from '../engine/camera';

/** Slide-in catalogue of every world; selecting one warps + tunes in. */
const Catalogue = observer((): React.JSX.Element => {
    const store = useStore();

    const choose = (id: string, x: number, y: number) => {
        store.focus(id);
        warpTo(x, y);
        store.play(id);
        store.closeDrawer();
    };

    return (
        <>
            <div
                className={`scrim${store.drawerOpen ? ' show' : ''}`}
                onClick={() => store.closeDrawer()}
            />
            <aside className={`drawer${store.drawerOpen ? ' open' : ''}`}>
                <div className="dhead">
                    <h2>The Catalogue</h2>
                    <button className="gbtn x" onClick={() => store.closeDrawer()}>
                        ✕
                    </button>
                </div>
                <div className="list">
                    {store.worlds.map((w) => {
                        const playing = store.selectedId === w.id && store.isPlaying;
                        return (
                            <button
                                key={w.id}
                                className={`item${store.focusedId === w.id ? ' active' : ''}${playing ? ' playing' : ''}`}
                                style={
                                    { ['--c' as string]: w.color } as React.CSSProperties
                                }
                                onClick={() => choose(w.id, w.x, w.y)}
                            >
                                <div className="dot w-10 h-10" />
                                <div className="info min-w-0 flex flex-col">
                                    <div className="n">{w.name}</div>
                                    <div className="s">
                                        <b>{w.cat}</b> · {w.genre}
                                    </div>
                                </div>
                                <div className="eq">
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>
        </>
    );
});

export default Catalogue;
