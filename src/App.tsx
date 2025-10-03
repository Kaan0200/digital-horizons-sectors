import { Mixes } from './assets/mixes';
import { SpaceSector } from './components/SpaceSector/SpaceSector';
import SpaceView from './components/SpaceView';
import React, { Ref } from 'react';
import { action, makeObservable, observable } from 'mobx';
import Starfield from './components/Starfield';
import { NavigateFunction, Outlet } from 'react-router';
import { LucideVolume, LucideRocket } from 'lucide-react';
import { RootStoreContext } from './main';
import NowPlayingBanner from './components/NowPlayingBanner';
import {
  NeuButton,
  PlayButton,
  ReturnButton,
  SectorsListButton,
  UnloadButton,
} from './components/Buttons/Buttons';

const SQUARES: number = 1400;

export default class App extends React.Component {
  contextType = RootStoreContext;

  // UI / Interface State
  trackSectors: number[] = [];
  sectorsRef: Ref<HTMLDivElement>;

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

        gridSquares.push(
          <SpaceSector
            key={i}
            active
            sectorKey={i}
            sectorID={id}
            onClick={this.GoToSector}
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
        <SpaceView ref={this.sectorsRef}>{gridSquares}</SpaceView>
        <NowPlayingBanner />
        <div className="fixed justify-evenly h-full left-0 top-0 flex flex-col z-40">
          <div>
            <UnloadButton />
            <PlayButton />
            <NeuButton rectangle>
              <LucideVolume />
            </NeuButton>
            <ReturnButton />
            <SectorsListButton />
          </div>
        </div>
        <Outlet />
      </div>
    );
  }
}
