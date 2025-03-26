/// <reference types="vite-plugin-svgr/client" />
import * as React from 'react';

import Star from '../assets/icons/star.svg';

interface SpaceStarProps {
  position: { x: number; y: number };
  size: number;
}

export function SpaceStar(props: SpaceStarProps): JSX.Element {
  const { size, position } = props;
  return (
    <div
      key={`star-${position.x}${position.y}`}
      style={{ top: position.x, right: position.y, position: 'absolute' }}
    >
      <Star
        className={'text-gray-700'}
        stroke={'#222222'}
        style={{
          height: size,
          width: size,
        }}
      />
    </div>
  );
}
