import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { AudioHTMLAttributes, useState } from 'react';

import { Mix, mixes } from './assets/mixes';
import { GalaxyMap } from './components/GalaxyMap';
import { SpaceSector } from './components/SpaceSector';
import { SpaceshipDashboard } from './components/SpaceshipDashboard';
import ViewBox from './components/ViewBox';
import SpaceView from './components/SpaceView';

const SQUARES: number = 1400;

@observer
export default class App extends React.Component {
  constructor(props: any) {
    super(props);

  }

  render() {
    // generate an index number for each set
    let setPlacements: Array<{mix: Mix, location: number}> = [];
    mixes.forEach((mix) => {
      setPlacements.push({
        mix: mix,
        location: Math.trunc(1400 * Math.random())
      });
    })

    // create the grid squares, with the randomly inserted mixes
    let gridSquares = [];
    for (let i = 0; i < SQUARES; i++) {

      if (setPlacements.filter((set) => set.location === i).length !== 0) {
        gridSquares.push(
          <div key={i} style={{
            width: "120px",
            height: "120px",
            border: "1px cyan dashed"
          }}>
          </div>
        )
      } else {
        gridSquares.push(
          <div key={i} style={{
            width: "120px",
            height: "120px",
            border: "1px black dashed"
          }}>

        </div>);
      }
    }


    return (
      /** */
      <div className="text-white opacity-90 bg-gradient-to-tr from-zinc-900 via-purple-700 to-sky-500">
        <SpaceView>

          { gridSquares }
          
        </SpaceView>
      </div >
    );
  }

}
