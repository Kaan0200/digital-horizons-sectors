import { Mixes, MixID } from './assets/mixes';
import { SpaceSector } from './components/SpaceSector/SpaceSector';
import SpaceView from './components/SpaceView';
import React, { Ref, useEffect } from 'react';
import { action, makeObservable, observable } from 'mobx';
import Starfield from './components/Starfield';
import { NavigateFunction, Outlet, useNavigate } from 'react-router';
import { LucideVolume } from 'lucide-react';
import NowPlayingBanner from './components/NowPlayingBanner';
import {
    NeuButton,
    PlayButton,
    ReturnButton,
    SectorsListButton,
    UnloadButton,
} from './components/Buttons';
import { RootStoreContext } from './stores/RootStore';
import SpaceshipCursor from './components/SpaceshipCusor';
import MultiplayerSpaceships from './components/MultiplayerSpaceships';

const SQUARES: number = 1400;

export default function App(): React.JSX.Element {
    const useNav = useNavigate();

    // Welcome screen re-routing based on cookie
    useEffect(() => {
        const currCookie = document.cookie;
        if (currCookie !== 'visited=true') {
            useNav('/welcome');
        }
    }, []);

    return <AppInternal />;
}

class AppInternal extends React.Component {
    static contextType = RootStoreContext;

    // UI / Interface State
    /**
     * Maps the Ordered IDX to it's HTML Array IDX
     */
    trackSectors: number[] = [];
    /** Ref for the sector element */
    sectorsRef: Ref<HTMLDivElement>;
    /**
     * Refs for the Ordered IDX of sectors
     */
    trackSectorsRefs: Array<React.RefObject<HTMLDivElement | null>> = [];

    isScrolling: boolean;
    scrollX: number = 0;
    clientX: number = 0;
    scrollY: number = 0;
    clientY: number = 0;

    /**
     * ID of the currently loaded Track
     */
    selectedMix: string = '';

    /**
     * Bool for if the current track is playing or not
     */
    isPlaying: boolean = false;

    constructor(props: React.PropsWithChildren) {
        super(props);
        makeObservable(this, {
            trackSectors: observable,
            trackSectorsRefs: observable,
            isScrolling: observable,
            scrollX: observable,
            clientX: observable,
            scrollY: observable,
            clientY: observable,
            componentDidMount: action,
            GoToSector: action,
        });

        // variable initialization
        this.isScrolling = false;
        this.sectorsRef = React.createRef();

        // build out the mix locations
        Mixes.forEach(() => {
            const locationIndex: number = Math.trunc(1400 * Math.random());
            this.trackSectorsRefs.push(React.createRef());
            this.trackSectors.push(locationIndex);
        });
    }

    /**
     * [React Built-In Class Func]
     * Runs when the component is put on screen, close to final UI
     */
    public componentDidMount() {
        if (location.pathname === '/') {
            const doc = document.documentElement;
            doc.scrollTo({
                behavior: 'smooth',
                left: doc.clientWidth / 2,
                top: doc.clientHeight / 2,
            });

            doc.onmousedown = (e) => {
                this.isScrolling = true;
                this.clientX = e.clientX;
                this.clientY = e.clientY;
            };

            doc.onmouseup = () => {
                this.isScrolling = false;
            };

            doc.onmousemove = (event: MouseEvent) => {
                if (this.isScrolling) {
                    doc.scrollLeft = scrollX + event.clientX - this.clientX;
                    this.scrollX = scrollX + event.clientX - this.clientX;
                    this.clientX = event.clientX;

                    doc.scrollTop = scrollY + event.clientY - this.clientY;
                    this.scrollY = scrollY + event.clientY - this.clientY;
                    this.clientY = event.clientY;
                }
            };
        }
    }

    public MoveViewToSector(nav: NavigateFunction, targetId: MixID) {
        console.log(targetId);
        nav('/' + targetId, { replace: true });
        const mixIdx = Mixes.findIndex((mix) => mix.id === targetId);
        const refLink = this.trackSectorsRefs[mixIdx];

        if (refLink.current) {
            refLink.current.focus();
        } else {
            console.warn('ref not populated...');
        }
    }

    GoToSector(nav: NavigateFunction, sectorID: string) {
        nav('/' + sectorID, { replace: true });
    }

    /**
     * [React Built-In Class Func]
     * Draws the component, called every time there is a rerender
     */
    render() {
        // create the grid squares, with the randomly inserted mixes
        const gridSquares = [];
        //const { isPlaying, selectedId } = this.context as RootStore;

        let dataIndex: number = 0;

        for (let i = 0; i < SQUARES; i++) {
            if (this.trackSectors.includes(i)) {
                // change from index in the total list of DIVs to the List of mixes
                const mixIdx = this.trackSectors.indexOf(i);
                const { id } = Mixes[mixIdx];
                const refLink = this.trackSectorsRefs[mixIdx];

                gridSquares.push(
                    <SpaceSector
                        key={i}
                        active
                        sectorKey={i}
                        sectorID={id}
                        onClick={this.GoToSector}
                        ref={refLink}
                    />,
                );
            } else {
                gridSquares.push(<SpaceSector active={false} sectorKey={i} key={i} />);
            }

            dataIndex = dataIndex + 1;
        }

        return (
            /** */
            <div className="text-white opacity-90 bg-gradient-to-tr from-indigo-950 via-stone-900 to-slate-800">
                <Starfield />
                <SpaceshipCursor />
                <MultiplayerSpaceships />
                <SpaceView ref={this.sectorsRef}>{gridSquares}</SpaceView>
                <NowPlayingBanner />
                <div className="fixed justify-evenly h-full left-0 top-0 flex flex-col z-40">
                    <div>
                        <UnloadButton />
                        <PlayButton />
                        <NeuButton rectangle>
                            <LucideVolume />
                        </NeuButton>
                        <ReturnButton onClick={this.MoveViewToSector} />
                        <SectorsListButton onClick={this.MoveViewToSector} />
                    </div>
                </div>
                <Outlet />
            </div>
        );
    }
}
