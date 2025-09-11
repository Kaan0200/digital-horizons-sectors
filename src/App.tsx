import { observer } from 'mobx-react';

import { Mix, mixes } from './assets/mixes';
import { SpaceSector } from './components/SpaceSector';
import SpaceView from './components/SpaceView';
import React from 'react';

const SQUARES: number = 1400;

@observer
export default class App extends React.Component {
  constructor(props: React.PropsWithChildren) {
    super(props);

  }



  render() {
    // generate an index number for each set
    const setPlacements: Array<{mix: Mix, location: number}> = [];
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
      <div className="text-white opacity-90 bg-gradient-to-tr from-zinc-900 via-purple-700 to-sky-500">
        <SpaceView>

          { gridSquares }
          
        </SpaceView>
      </div >
      
    );
  }
}
