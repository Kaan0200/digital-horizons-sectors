import { Mix, mixes } from './assets/mixes';
import { SpaceSector } from './components/SpaceSector/SpaceSector';
import SpaceView from './components/SpaceView';
import React, { Ref } from 'react';
import { action, makeObservable, observable, runInAction } from 'mobx';
import Starfield from './components/Starfield';
import { NavigateFunction, Outlet } from 'react-router';
import { NeuButton } from './components/NueButton';
import { LucidePlay, LucideVolume2, LucideRocket, LucidePause } from 'lucide-react';

const SQUARES: number = 1400;

export default class App extends React.Component {
  // Application Stable State
  private mixesById: Map<string, { location: number; jsx: React.JSX.Element }> = new Map<
    string,
    { location: number; jsx: React.JSX.Element }
  >();
  private mixesByIndex: Map<number, { id: string; jsx: React.JSX.Element }> = new Map<
    number,
    { id: string; jsx: React.JSX.Element }
  >();

  // UI / Interface State
  sectorsRef: Ref<HTMLDivElement>;

  isScrolling: boolean;
  scrollX: number = 0;
  clientX: number = 0;
  scrollY: number = 0;
  clientY: number = 0;

  /** =======================
   * Music Player State
   * ========================*/
  /**
   * The current mix. Nullable, similar to a physical music-player
   * that loads and unloads media, with backing-property to deal with
   * any additional logic when triggering loads/unloads.
   */

  LoadMix(value: Mix | null) {
    this._selectedMix = value;
  }
  private _selectedMix: Mix | null = null;

  /**
   *
   */
  isPlaying: boolean;

  /** =======================
   * Functions
   * ========================*/
  constructor(props: React.PropsWithChildren) {
    super(props);
    makeObservable(this, {
      isPlaying: observable,
      LoadMix: action,
      isScrolling: observable,
    });

    // variable initialization
    this.isPlaying = false;
    this.isScrolling = false;
    this.sectorsRef = React.createRef();

    mixes.forEach((mix: Mix) => {
      const locationIndex: number = Math.trunc(1400 * Math.random());
      const element = (
        <SpaceSector
          active
          sectorKey={locationIndex}
          sectorID={mix.data.id}
          onClick={this.GoToSector}
        />
      );

      this.mixesById.set(mix.data.id, {
        location: locationIndex,
        jsx: element,
      });
      this.mixesByIndex.set(locationIndex, {
        id: mix.data.id,
        jsx: element,
      });
    });
  }

  public componentDidMount() {
    // build out the mix locations

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

  TogglePlay() {
    runInAction(() => {
      this.isPlaying = !this.isPlaying;
    });
  }

  GoToSector(nav: NavigateFunction, sectorIdx: string) {
    console.log('going...');
    console.log(this.mixesById);

    nav('/' + sectorIdx, {
      replace: true,
      state: {
        id: this.mixesById.get(sectorIdx),
      },
    });
  }

  /** ============Render==============
   *
   */
  render() {
    // create the grid squares, with the randomly inserted mixes
    const gridSquares: React.JSX.Element[] = [];
    for (let i = 0; i < SQUARES; i++) {
      if (this.mixesByIndex.has(i)) {
        gridSquares.push(
          <SpaceSector
            active
            sectorKey={i}
            key={i}
            sectorID={this.mixesByIndex.get(i)?.id ?? ''}
            onClick={this.GoToSector}
          />,
        );
      } else {
        gridSquares.push(<SpaceSector active={false} sectorKey={i} key={i} />);
      }
    }

    return (
      <>
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
              <NeuButton rectangle onClick={() => this.TogglePlay()}>
                {this.isPlaying ? <LucidePause /> : <LucidePlay />}
              </NeuButton>
              <NeuButton rectangle onClick={() => {}}>
                <LucideVolume2 />
              </NeuButton>
            </div>
            <div>
              <NeuButton rectangle onClick={() => {}}>
                <span className="text-xl">More</span>
                <LucideRocket />
              </NeuButton>
            </div>
          </div>

          <Outlet />
        </div>
      </>
    );
  }
}
