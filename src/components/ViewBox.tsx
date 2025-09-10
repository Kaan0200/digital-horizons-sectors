
interface ViewBoxProps {

}

export default function ViewBox(props: ViewBoxProps): JSX.Element {
    const { height, width } = useWindowDimensions();
    let outerRef: RefObject<HTMLDivElement | null> = React.createRef();

    return (
      <div
        ref={outerRef}
        onScrollEnd={(e) => {
          console.log("hit end.");
          console.log(e.detail)
        }}
        style={{
          width: width + 40 + 'px',
          height: height + 40 + 'px',
          overflow: 'scroll'
        }}>

        </div>
    )
}

import React, { RefObject } from 'react';
import { useState, useEffect } from 'react';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}