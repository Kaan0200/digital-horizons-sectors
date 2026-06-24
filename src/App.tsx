import { observer } from 'mobx-react';
import type React from 'react';
import { useEffect } from 'react';

import './almanac/almanac.css';

import Catalogue from './almanac/Catalogue';
import { warpTo } from './almanac/camera';
import Hud from './almanac/Hud';
import Multiplayer from './almanac/Multiplayer';
import PlayerBar from './almanac/PlayerBar';
import ShipCursor from './almanac/ShipCursor';
import SpecimenPlate from './almanac/SpecimenPlate';
import StarMap from './almanac/StarMap';
import { World } from './almanac/worlds';
import { useStore } from './stores/RootStore';
import DiscoPlanet from './almanac/DiscoPlanet';

/**
 * Night Almanac shell. The chart is the base layer; the HUD, specimen plate,
 * catalogue drawer, and player float above it. Selection/play state lives in
 * RootStore; the camera lives in the shared camera module.
 *
 * The catalog loads asynchronously (bundled today, fetched from dhaudio later).
 * The chart shell renders immediately; worlds hydrate in when it resolves.
 */
const App = observer((): React.JSX.Element => {
    const store = useStore();

    useEffect(() => {
        void store.loadCatalog();
    }, [store]);

    const onSelect = (w: World) => {
        store.focus(w.id);
        warpTo(w.x, w.y);
    };

    return (
        <div className="dh-app">
            <StarMap
                worlds={store.worlds}
                edges={store.edges}
                onSelect={onSelect}
                activeId={store.focusedId}
                playingId={store.isPlaying ? store.selectedId : ''}
                listeners={store.listenerCounts}
            />
            <Multiplayer />
            <Hud />
            <SpecimenPlate />I
            <DiscoPlanet />
            <Catalogue />
            <PlayerBar />
            <ShipCursor />
        </div>
    );
});

export default App;
