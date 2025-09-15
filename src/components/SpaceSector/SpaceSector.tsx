import { observer } from 'mobx-react';
import * as React from 'react';
import './SpaceSector.css';
import { NavigateFunction, useNavigate } from 'react-router';

//import { ReactComponent as Crew } from '../assets/icons/crew.svg';
//import { ReactComponent as Planet } from '../assets/icons/planet.svg';
//import { ReactComponent as Satellite } from '../assets/icons/satellite.svg';

interface SpaceSectorProps {
  locationKey: number;
  active: boolean;
}

interface SpaceSectorPropsInternal {
  sectorKey: number;
  active: boolean;
  nav: NavigateFunction;
}

//interface ActiveSpaceSectorProps extends SpaceSectorProps {
//  active: true;
//}
//
//interface InActiveSpaceSectorProps extends SpaceSectorProps {
//  active: false;
//}

@observer
export class SpaceSectorInternal extends React.Component<SpaceSectorPropsInternal> {

  public GoToSector(target: number) {
    console.log("open sector " + target);

    this.props.nav('/' + target, {replace: true});
  }

  render() {
    const { active, sectorKey }: Partial<SpaceSectorPropsInternal> = this.props;

    return (
      active ?
       <div key={sectorKey} className="sector active-sector" onClick={() => this.GoToSector(sectorKey)}>
        
      </div> : 
      <div key={sectorKey} className="sector inactive-sector">

      </div>
    );
  }
}


export function SpaceSector(props: SpaceSectorProps): React.JSX.Element {
  const nav = useNavigate();


  return <div key={props.locationKey}>
    <SpaceSectorInternal sectorKey={props.locationKey} active={props.active} nav={nav}>

    </SpaceSectorInternal>
  </div>
}

