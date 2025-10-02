import { observer } from 'mobx-react';

import { Mix, MixData } from './assets/mixes';
import { SpaceSector } from './components/SpaceSector/SpaceSector';
import SpaceView from './components/SpaceView';
import React, { Ref } from 'react';
import { observable } from 'mobx';
import Starfield from './components/Starfield';
import { NavigateFunction, Outlet } from 'react-router';
import { NeuButton } from './components/NueButton';
import { LucidePlay, LucideVolume, LucideRocket, LucidePause } from 'lucide-react';

const SQUARES: number = 1400;

@observer
export default class App extends React.Component {


  // UI / Interface State
  @observable trackSectors: number[] = [];
  @observable sectorsRef: Ref<HTMLDivElement>;

  @observable isScrolling: boolean;
  @observable scrollX: number = 0;
  @observable clientX: number = 0;
  @observable scrollY: number = 0;
  @observable clientY: number = 0;

  // Music Player State
  /**
   * The current mix. Nullable, similar to a physical player
   * that loads and unloads media.
   */
  get selectedMix() { return this._selectedMix }
  set selectedMix(value: Mix | null) { this._selectedMix = value }
  private _selectedMix: Mix | null = null;

  /**
   * 
   */
  @observable isPlaying: boolean = false;

  constructor(props: React.PropsWithChildren) {
    super(props);

    // variable initialization
    this.isScrolling = false;
    this.sectorsRef = React.createRef();

    // build out the mix locations
    MixData.forEach(() => {
      const locationIndex: number = Math.trunc(1400 * Math.random());
      this.trackSectors.push(locationIndex);
    })
  }

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

  render() {
    // create the grid squares, with the randomly inserted mixes
    const gridSquares = [];

    let dataIndex: number = 0

    for (let i = 0; i < SQUARES; i++) {
      
      if (this.trackSectors.includes(i)) {
        const data = MixData[i];
        gridSquares.push(
          <SpaceSector
            active
            sectorKey={i}
            sectorID={data?.id}
            onClick={this.GoToSector}
          />,
        );
      } else {
        gridSquares.push(<SpaceSector active={false} sectorKey={i} />);
      }

      dataIndex = dataIndex + 1;
    }

    return (
      /** */
      <div className="text-white opacity-90 bg-gradient-to-tr from-indigo-950 via-stone-900 to-slate-800">
        <Starfield />
        <SpaceView ref={this.sectorsRef}>{gridSquares}</SpaceView>
        <div className="fixed justify-evenly w-full top-0 flex flex-row z-20 py-2">
          <div className="text-center bg-mint text-black p-4 rounded-md shadow-[3px_3px_0px_black]">
            Now Playing Now Playing Now Playing
          </div>
        </div>
        <div className="fixed justify-evenly h-full left-0 top-0 flex flex-col z-40">
          <div>
            <NeuButton rectangle>
              <div onClick={() => this.isPlaying = !this.isPlaying}>
                {this.isPlaying ? <LucidePause /> : <LucidePlay />}
              </div>
            </NeuButton>
            <NeuButton rectangle><LucideVolume /></NeuButton>
            <NeuButton>Next</NeuButton>
          </div>
          <div>
            <NeuButton rectangle><LucideRocket /></NeuButton>
          </div>
        </div>

        <Outlet />
      </div>
    );
  }
}
