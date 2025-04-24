import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { AudioHTMLAttributes, useState } from 'react';

import { Mix, mixes } from './assets/mixes';
import { GalaxyMap } from './components/GalaxyMap';
import { SpaceSector } from './components/SpaceSector';
import { SpaceshipDashboard } from './components/SpaceshipDashboard';

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
    return (
      /** */
      <div className="main flex h-lvh w-lvw text-white opacity-90 bg-gradient-to-tr from-zinc-900 via-purple-700 to-sky-500">
        <div className="rhombox backdrop-blur-lg">
          {mixes.map((mix: Mix, index: Number) => <>
            <div  >
              OO1
            </div>
            <div  >
              Testie
            </div>
          </>
          )}





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
      </div >
    );
  }
}
