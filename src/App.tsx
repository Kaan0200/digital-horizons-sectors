import { observer } from 'mobx-react';

import { Mix, mixes } from './assets/mixes';
import { SpaceSector } from './components/SpaceSector/SpaceSector';
import SpaceView from './components/SpaceView';
import React from 'react';
import { observable } from 'mobx';
import Starfield from './components/Starfield';
import ControlsPanel from './components/ControlsPanel';
import { Outlet } from 'react-router';

const SQUARES: number = 1400;

@observer
export default class App extends React.Component {
  @observable isScrolling: boolean;
  @observable scrollX: number = 0;
  @observable clientX: number = 0;
  @observable scrollY: number = 0;
  @observable clientY: number = 0;

  constructor(props: React.PropsWithChildren) {
    super(props);

    this.isScrolling = false;
  }


  componentDidMount() {
    const doc = document.documentElement;
    doc.scrollTo({
      "behavior": "smooth",
      left: doc.clientWidth / 2,
      top: doc.clientHeight / 2

    })

    doc.onmousedown = e => {
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

  render() {
    // generate an index number for each set
    const setPlacements: Array<{ mix: Mix, location: number }> = [];
    mixes.forEach((mix) => {
      setPlacements.push({
        mix: mix,
        location: Math.trunc(1400 * Math.random())
      });
    })

    // create the grid squares, with the randomly inserted mixes
    const gridSquares = [];
    for (let i = 0; i < SQUARES; i++) {

      if (setPlacements.filter((set) => set.location === i).length !== 0) {
        gridSquares.push(
          <SpaceSector active locationKey={i}></SpaceSector>
        )
      } else {
        gridSquares.push(
          <SpaceSector active={false} locationKey={i}></SpaceSector>
        );
      }
    }


    return (
      /** */
      <div className="text-white opacity-90 bg-gradient-to-tr from-zinc-800 via-violet-800 to-slate-900">
        <Starfield />
        <SpaceView>

          {gridSquares}

        </SpaceView>
        <div className="w-100 h-16 fixed top-0 left-[25%] z-20">
          <div className="text-center bg-orange-800 ">Now Playing Now Playing Now Playing</div>
        </div>
        <ControlsPanel />

        <Outlet />
      </div >

    );
  }
}

