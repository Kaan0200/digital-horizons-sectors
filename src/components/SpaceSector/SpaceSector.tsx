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
    ref: React.RefObject<HTMLDivElement | null>;
}

interface SpaceSectorInactivePropsInternal {
    active: false;
}

export const SpaceSector = observer(
    (props: SpaceSectorActiveProps | SpaceSectorInactiveProps) => {
        if (props.active) {
            const nav: NavigateFunction = useNavigate();
            const { sectorKey, onClick, sectorID, ref }: Partial<SpaceSectorActiveProps> =
                props;
            return (
                <div key={props.sectorKey}>
                    <div
                        ref={ref}
                        key={sectorKey}
                        className={'sector active-sector'}
                        onClick={() => onClick(nav, sectorID.toString())}
                    >
                        {sectorID}
                    </div>
                </div>
            );
        } else {
            return <div key={props.sectorKey} className="sector inactive-sector" />;
        }
    },
);

export default SpaceSector;
