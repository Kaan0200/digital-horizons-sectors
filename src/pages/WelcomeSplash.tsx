import React from 'react';
import Cover from '../components/Cover';

export function WelcomeSplash(): React.JSX.Element {

  return (<>
    <Cover />
    <div
      id="sector-page"
      className="fixed flex justify-evenly items-center h-full w-full top-0 left-0 z-30"
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="text-center">
        Welcome to Digital Horizons!
      </div>
    </div></>
  );
}
