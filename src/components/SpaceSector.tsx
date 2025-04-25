import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

//import { ReactComponent as Crew } from '../assets/icons/crew.svg';
//import { ReactComponent as Planet } from '../assets/icons/planet.svg';
//import { ReactComponent as Satellite } from '../assets/icons/satellite.svg';
import { MixData, MixType } from '../assets/mixes';

interface SpaceSectorProps {
  //mixData: MixData;
  onClick: () => void;
  selected: boolean;
  index: number;
  disabled: boolean;
}

@observer
export class SpaceSector extends React.Component<SpaceSectorProps> {
  render() {
    const {
      selected,
      index,
      onClick
    }: Partial<SpaceSectorProps> = this.props;

    //const iconMap: Map<MixType, JSX.Element> = new Map([
    //  [MixType.Planet, <Planet key="p-icon" />],
    //  [MixType.Crew, <Crew key="c-icon" />],
    //  [MixType.Satellite, <Satellite key="s-icon" />],
    //]);

    return (
      <div
        tabIndex={this.props.index}
        onClick={onClick}
        onKeyUp={onClick}
        className={this.props.disabled ?
          "bg-slate-100/30 align-middle" :
          "text-center content-center text-red-950 align-middle bg-slate-100/50 hover:bg-sky-400"}
      >
        {selected}
        MIX-{index}
        {/*iconMap.get(mixData.type)*/}
      </div>
    );
  }
}
