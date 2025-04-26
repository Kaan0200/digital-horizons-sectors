import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { AudioHTMLAttributes, useEffect, useState } from 'react';

import { Mix, mixes } from './assets/mixes';
import { GalaxyMap } from './components/GalaxyMap';
import { SpaceSector } from './components/SpaceSector';
import { SpaceshipDashboard } from './components/SpaceshipDashboard';
import Starfield from './components/Starfield';
import { Outlet, useNavigate } from 'react-router';

const TILE_SIZE: number = 80;

@observer
export default class App extends React.Component {
  @observable public selectedMixIdx: number = -1;
  @observable private _playerRef: React.RefObject<HTMLAudioElement>;

  constructor(props: any) {
    super(props);
    makeObservable(this);
    this._playerRef = React.createRef();
  }

  @computed get currentAudio(): any {
    return mixes[this.selectedMixIdx].audio;
  }

  @action playMix(mixIdx: number) {
    this.selectedMixIdx = mixIdx;
    this._playerRef.current?.load();
  }



  render() {
    let renderAgg = [];

    for (let i = 0; i < TILE_SIZE; i++) {
      renderAgg.push(
        <SpaceSector
          targetId={i.toString()}
          selected={false}
          key={`${i}-sector`}
          index={i}
          disabled={i >= mixes.length}
        />)
    }

    return (
      /** */
      <div className="main flex h-lvh w-lvw text-white opacity-90 bg-neutral-950">
        <div className="rhombox backdrop-blur-lg">

          <>{renderAgg}</>






          {/*    <GalaxyMap stars={40}>
            <div className="flex flex-row flex-wrap">
        {mixes.map((mix: Mix, index: number) => {
          return (
            <SpaceSector
              key={`${index}-sector`}
              mixData={mix.data}
              onClick={() => this.playMix(index)}
              selected={index === this.selectedMixIdx}
              index={index}
            />
          );
        })}
      </div>
          </GalaxyMap > */
          }
        </div>
        <Starfield speedFactor={0.01} />
        <Outlet />
      </div >
      
    );
  }
}
