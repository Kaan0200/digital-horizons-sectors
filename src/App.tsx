import { observer } from 'mobx-react';

import { Mix, mixes } from './assets/mixes';
import { SpaceSector } from './components/SpaceSector/SpaceSector';
import SpaceView from './components/SpaceView';
import React, { Ref } from 'react';
import { observable } from 'mobx';
import Starfield from './components/Starfield';
import ControlsPanel from './components/ControlsPanel';
import { NavigateFunction, Outlet } from 'react-router';

const SQUARES: number = 1400;

@observer
export default class App extends React.Component {
  // Application Stable State
  mixesById: Map<string, { location: number; jsx: React.JSX.Element }> = new Map();
  mixesByIndex: Map<number, { id: string; jsx: React.JSX.Element }> = new Map();

  // UI / Interface State
  sectorsRef: Ref<HTMLDivElement>;

  @observable isScrolling: boolean;
  @observable scrollX: number = 0;
  @observable clientX: number = 0;
  @observable scrollY: number = 0;
  @observable clientY: number = 0;

  // Music Player State
  @observable selectedMix = null;

  constructor(props: React.PropsWithChildren) {
    super(props);

    // variable initialization
    this.isScrolling = false;
    this.sectorsRef = React.createRef();

    // build out the mix locations
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
    for (let i = 0; i < SQUARES; i++) {
      if (this.mixesByIndex.has(i)) {
        gridSquares.push(
          <SpaceSector
            active
            sectorKey={i}
            sectorID={this.mixesByIndex.get(i)?.id ?? ''}
            onClick={this.GoToSector}
          />,
        );
      } else {
        gridSquares.push(<SpaceSector active={false} sectorKey={i} />);
      }
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
        <ControlsPanel />

        <Outlet />
      </div>
    );
  }
}
