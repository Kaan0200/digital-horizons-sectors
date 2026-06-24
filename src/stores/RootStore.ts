import { createContext, useContext } from 'react';

import { makeAutoObservable, runInAction } from 'mobx';
import { Peer } from '../almanac/presence';
import { buildConstellation, buildWorlds, World } from '../almanac/worlds';
import { loadCatalog as fetchCatalog } from '../content/catalog';
import { UserStore } from './UserStore';

export class RootStore {
    userStore: UserStore = new UserStore(this);

    isPlaying: boolean;
    selectedId: string;
    currentAudio: HTMLAudioElement | undefined;

    // --- catalog (async seam — bundled now, fetched from dhaudio later) ---
    worlds: World[] = [];
    edges: Array<[number, number]> = [];
    catalogReady = false;

    // --- multiplayer presence (other listeners) ---
    peers: Peer[] = [];

    // --- chart UI state (Night Almanac) ---
    /** Mix whose specimen plate is currently open ('' = none). */
    focusedId = '';
    /** Whether the catalogue drawer is open. */
    drawerOpen = false;

    constructor() {
        makeAutoObservable(this);
        this.isPlaying = false;
        this.selectedId = '';
        this.currentAudio = new Audio();
    }

    /** Load the catalog and build the chart worlds. Idempotent. */
    loadCatalog = async () => {
        if (this.catalogReady) return;
        const mixes = await fetchCatalog();
        const worlds = buildWorlds(mixes);
        const edges = buildConstellation(worlds);
        runInAction(() => {
            this.worlds = worlds;
            this.edges = edges;
            this.catalogReady = true;
        });
    };

    worldById = (id: string): World | undefined => this.worlds.find((w) => w.id === id);

    /** Replace the live peer roster (called by the presence layer). */
    setPeers = (peers: Peer[]) => {
        this.peers = peers;
    };

    /** Count of *other* listeners tuned to each mix id. */
    get listenerCounts(): Record<string, number> {
        const counts: Record<string, number> = {};
        for (const p of this.peers) if (p.listeningTo) counts[p.listeningTo] = (counts[p.listeningTo] ?? 0) + 1;
        return counts;
    }

    /** Open a world's specimen plate (without necessarily playing it). */
    focus = (id: string) => {
        this.focusedId = id;
    };
    closeFocus = () => {
        this.focusedId = '';
    };
    openDrawer = () => {
        this.drawerOpen = true;
    };
    closeDrawer = () => {
        this.drawerOpen = false;
    };

    // Start playback and keep isPlaying in sync with the real result.
    // play() returns a promise that rejects on autoplay blocks, load
    // failures, or being interrupted by a pause() — so it must be caught.
    private safePlay = () => {
        this.currentAudio
            ?.play()
            .then(() => runInAction(() => (this.isPlaying = true)))
            .catch(() => runInAction(() => (this.isPlaying = false)));
    };

    play = (newID?: string) => {
        // play any new mixIDs
        if (newID) {
            const match = this.worldById(newID);
            // check if new mix, otherwise pause
            if (match && this.currentAudio?.src !== match.url) {
                this.currentAudio?.pause();
                this.currentAudio = new Audio(match.url);
                this.selectedId = newID;
                this.safePlay();
            } else {
                // same track already loaded -> toggle play/pause
                if (this.currentAudio?.paused) {
                    this.safePlay();
                } else {
                    this.currentAudio?.pause();
                    this.isPlaying = false;
                }
            }
        }
        //treat like a toggle
        else {
            if (this.isPlaying) {
                this.currentAudio?.pause();
                this.isPlaying = false;
            } else {
                this.safePlay();
            }
        }
    };

    stop = () => {
        this.currentAudio?.pause();
        this.currentAudio = undefined;
        this.isPlaying = false;
        this.selectedId = '';
    };
}

export const RootStoreContext = createContext<RootStore | null>(null);

export const useStore = () => {
    const context = useContext(RootStoreContext);
    if (context === null) {
        throw new Error('🔴 Missing wrapper your root component with RootStoreProvider');
    }
    return context;
};
