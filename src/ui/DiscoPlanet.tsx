import { observer } from 'mobx-react';
import type React from 'react';

import { useStore } from '../stores/RootStore';
import Planet from './Planet';

/**
 * The "now playing" planet — a square panel pinned top-center that shows the
 * currently loaded mix's world. Mirrors the specimen plate's planet, but tracks
 * `selectedId` (what's playing) rather than `focusedId` (what's open), so it
 * keeps showing the track you're listening to even while you browse other worlds.
 */
const DiscoPlanet = observer((): React.JSX.Element => {
    const store = useStore();
    const world = store.selectedId ? store.worldById(store.selectedId) : undefined;

    return (
        <div
            className={`disco${world ? ' show' : ''}`}
            style={
                world
                    ? ({ ['--c' as string]: world.color } as React.CSSProperties)
                    : undefined
            }
        >
            {world ? <Planet key={world.id} world={world} spinning={store.isPlaying} /> : null}
        </div>
    );
});

export default DiscoPlanet;
