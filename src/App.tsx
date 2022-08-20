import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { AudioHTMLAttributes, useState } from 'react';

import { Mix, mixes } from './assets/mixes';
import { GalaxyMap } from './components/GalaxyMap';
import { SpaceSector } from './components/SpaceSector';
import { SpaceshipDashboard } from './components/SpaceshipDashboard';

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
      <div className="flex flex-col h-screen bg-zinc-900 text-white">
        <div className="flex flex-1 overflow-y-scroll">
          <GalaxyMap stars={40}>
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
          </GalaxyMap>
        </div>
        <div
          className="block bottom-0 bg-slate-700 z-10"
          style={{
            height: '8em',
          }}
        >
          <div className="h-4 bg-gray-900"></div>
          <SpaceshipDashboard
            audioRef={this._playerRef}
            mixData={this.selectedMixIdx === -1 ? null : mixes[this.selectedMixIdx].data}
            file={this.selectedMixIdx === -1 ? null : this.currentAudio}
          />
        </div>
      </div>
    );
  }
}
