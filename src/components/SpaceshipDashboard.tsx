/// <reference types="vite-plugin-svgr/client" />
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import { ReactComponent as Eject } from '../assets/icon/eject.svg';
import { ReactComponent as Select } from '../assets/icons/select.svg';
import { ReactComponent as Play } from '../assets/icons/start.svg';
import { ReactComponent as Stop } from '../assets/icons/stop.svg';
import { MixData } from '../assets/mixes';
import { ConsoleTyper } from './ConsoleTyper';

interface SpaceshipDashboardProps {
  mixData: MixData | null;
  filename: any | null;
}

enum PlayerStatus {
  Playing,
  Paused,
  Empty,
}

const EMPTY_MESSAGE: string = 'Select a destination, Captain';

@observer
export class SpaceshipDashboard extends React.Component<SpaceshipDashboardProps> {
  @observable public status: PlayerStatus = PlayerStatus.Empty;

  constructor(props: SpaceshipDashboardProps) {
    super(props);
    makeObservable(this);
  }

  render(): JSX.Element {
    return (
      <div className="flex m-8">
        {this.props.mixData?.filename?.toString()}
        {this.props.filename && (
          <audio controls>
            <source src={this.props.filename} type="audio/mpeg" />
            <track kind="captions" label="audio-player-dashboard" />
          </audio>
        )}
        <div className="mr-4" style={{ width: '64px' }}>
          {this.status === PlayerStatus.Empty ?? (
            <>
              <Select />
            </>
          )}
          {this.status === PlayerStatus.Playing ?? (
            <button onClick={() => (this.status = PlayerStatus.Paused)}>
              <Play />
            </button>
          )}
          {this.status === PlayerStatus.Paused ?? (
            <button onClick={() => (this.status = PlayerStatus.Playing)}>
              <Stop />
            </button>
          )}
        </div>
        <ConsoleTyper
          speed={80}
          flicks={10}
          message={
            this.status === PlayerStatus.Empty
              ? EMPTY_MESSAGE
              : this.props.mixData?.id ?? 'unknown'
          }
        />
      </div>
    );
  }
}
