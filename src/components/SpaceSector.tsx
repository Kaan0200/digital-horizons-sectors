import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

//import { ReactComponent as Crew } from '../assets/icons/crew.svg';
//import { ReactComponent as Planet } from '../assets/icons/planet.svg';
//import { ReactComponent as Satellite } from '../assets/icons/satellite.svg';
import { MixData, MixType } from '../assets/mixes';

interface SpaceSectorProps {
  locationKey: number;
  active: boolean;
}

interface ActiveSpaceSectorProps extends SpaceSectorProps {
  active: true;
}

interface InActiveSpaceSectorProps extends SpaceSectorProps {
  active: false;
}

@observer
export class SpaceSector extends React.Component<SpaceSectorProps> {
  render() {
    const { active, locationKey }: Partial<SpaceSectorProps> = this.props;

    return (
      active ?
       <div key={locationKey} style={{
            width: "120px",
            height: "120px",
            border: "1px cyan dashed"
          }}>
          </div> :
          <div key={locationKey} style={{
            width: "120px",
            height: "120px",
            border: "1px black dashed"
          }}>

        </div>
    );
  }
}

