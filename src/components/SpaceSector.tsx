import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ReactElement as Crew } from '../assets/icons/crew.svg?react';
import { ReactElement as Planet } from '../assets/icons/planet.svg?react';
import { ReactElement as Satellite } from '../assets/icons/satellite.svg?react';
import { MixData, MixType } from '../assets/mixes';

interface SpaceSectorProps {
  mixData: MixData;
  onClick: () => void;
  selected: boolean;
  index: number;
}

@observer
export class SpaceSector extends React.Component<SpaceSectorProps> {
  render() {
    const { mixData, selected, onClick } = this.props;

    const iconMap: Map<MixType, JSX.Element> = new Map([
      [MixType.Planet, <Planet key="p-icon" />],
      [MixType.Crew, <Crew key="c-icon" />],
      [MixType.Satellite, <Satellite key="s-icon" />],
    ]);

    return (
      <div
        className="rounded-lg border-solid border-2 border-transparent hover:border-dashed hover:border-yellow-400 h-32 w-h32 cursor-pointer"
        style={{
          width: `${mixData.width * 8}em`,
          height: `${mixData.height * 8}em`,
          color: selected ? 'gold' : '',
        }}
        role="button"
        tabIndex={this.props.index}
        onClick={onClick}
        onKeyUp={onClick}
      >
        <div className="flex justify-center h-full items-center">
          {selected}
          {iconMap.get(mixData.type)}
          {mixData.id}
        </div>
      </div>
    );
  }
}
