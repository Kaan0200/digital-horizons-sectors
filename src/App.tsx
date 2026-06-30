import { observer } from 'mobx-react';
import type React from 'react';
import { useEffect } from 'react';

import './almanac.css';

import Catalogue from './ui/Catalogue';
import { warpTo } from './engine/camera';
import Hud from './ui/Hud';
import Multiplayer from './ui/Multiplayer';
import PlayerBar from './ui/PlayerBar';
import ShipCursor from './ui/ShipCursor';
import Splash from './ui/Splash';
import SpecimenPlate from './ui/SpecimenPlate';
import StarMap from './ui/StarMap';
import { World } from './engine/worlds';
import { useStore } from './stores/RootStore';
import DiscoPlanet from './ui/DiscoPlanet';

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
        <div className="dh-app" data-testid="app">
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
            <SpecimenPlate />
            <DiscoPlanet />
            <Catalogue />
            <PlayerBar />
            <ShipCursor />
            <Splash />
        </div>
    );
});

export default App;
