import { observer } from 'mobx-react';
import * as React from 'react';
import './SpaceSector.css';
import { NavigateFunction, useNavigate } from 'react-router';

//import { ReactComponent as Crew } from '../assets/icons/crew.svg';
//import { ReactComponent as Planet } from '../assets/icons/planet.svg';
//import { ReactComponent as Satellite } from '../assets/icons/satellite.svg';

type SpaceSectorActiveProps = SpaceSectorActivePropsInternal & SpaceSectorSharedProps;
type SpaceSectorInactiveProps = SpaceSectorInactivePropsInternal & SpaceSectorSharedProps;

interface SpaceSectorSharedProps {
  sectorKey: number;
}

interface SpaceSectorActivePropsInternal {
  sectorID: string;
  active: true;
  onClick: (nav: NavigateFunction, sectorID: string) => void;
}

interface SpaceSectorInactivePropsInternal {
  active: false;
}

type SpaceSectorActiveInternalProps = SpaceSectorActiveProps &
  SpaceSectorSharedProps & {
    nav: NavigateFunction;
  };

export function SpaceSector(props: SpaceSectorInactiveProps): React.JSX.Element;
export function SpaceSector(props: SpaceSectorActiveProps): React.JSX.Element;
export function SpaceSector(
  props: SpaceSectorActiveProps | SpaceSectorInactiveProps,
): React.JSX.Element {
  if (props.active) {
    const nav: NavigateFunction = useNavigate();
    return (
      <div key={props.sectorKey}>
        <SpaceSectorActiveInternal
          nav={nav}
          sectorID={props.sectorID}
          sectorKey={props.sectorKey}
          active={props.active}
          onClick={props.onClick}
        />
      </div>
    );
  } else {
    return <div key={props.sectorKey} className="sector inactive-sector" />;
  }
}

@observer
class SpaceSectorActiveInternal extends React.Component<SpaceSectorActiveInternalProps> {
  render() {
    const {
      active,
      sectorKey,
      onClick,
      sectorID,
      nav,
    }: Partial<SpaceSectorActiveInternalProps> = this.props;

    return (
      <div
        key={sectorKey}
        className={'sector ' + (active ? 'active-sector' : 'inactive-sector')}
        onClick={() => onClick(nav, sectorID)}
      >
        {sectorID}
      </div>
    );
  }
}
