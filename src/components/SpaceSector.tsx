import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

//import { ReactComponent as Crew } from '../assets/icons/crew.svg';
//import { ReactComponent as Planet } from '../assets/icons/planet.svg';
//import { ReactComponent as Satellite } from '../assets/icons/satellite.svg';
import { MixData, MixType } from '../assets/mixes';
import { useNavigate } from 'react-router';

interface SpaceSectorProps {
  //mixData: MixData;
  targetId: string;
  selected: boolean;
  index: number;
  disabled: boolean;
}


export function SpaceSector(props: SpaceSectorProps): React.JSX.Element {
    const {
      selected,
      index,
      targetId
    }: Partial<SpaceSectorProps> = props;

    //const iconMap: Map<MixType, JSX.Element> = new Map([
    //  [MixType.Planet, <Planet key="p-icon" />],
    //  [MixType.Crew, <Crew key="c-icon" />],
    //  [MixType.Satellite, <Satellite key="s-icon" />],
  //]);

        let nav = useNavigate();
            


    return <div
        tabIndex={props.index}
        onClick={() => props.disabled ? undefined : nav("/" + targetId)}
        onKeyUp={() => props.disabled ? undefined : nav("/" + targetId)}
        className={props.disabled ?
          "bg-slate-100/10 align-middle" :
          "text-center content-center text-white align-middle border-dashed border-red-200 hover:bg-sky-400"}
      >
        {selected}
        MIX-{index}
        {/*iconMap.get(mixData.type)*/}
      </div>
    
  }

