import * as React from 'react';

import { SpaceStar } from './SpaceStar';

export interface MapProps {
  stars: number;
  children: JSX.Element;
}

export class GalaxyMap extends React.Component<MapProps> {
  private _MapSize: number = 2000;
  private _IconCeiling: number = 32;
  private _IconFloor: number = 12;

  private _stars: JSX.Element[];

  constructor(props: any) {
    super(props);

    this._stars = this.drawStars(props.stars);
  }

  drawStars(count: number): JSX.Element[] {
    let starAgg: JSX.Element[] = new Array<JSX.Element>();
    for (let i = 0; i < count; i++) {
      // randomize position, star size
      const randomX = Math.random() * this._MapSize;
      const randomY = Math.random() * this._MapSize;
      let randomSize: number = Math.random() * this._IconCeiling;
      randomSize = randomSize < this._IconFloor ? this._IconFloor : randomSize;

      starAgg[i] = (
        <SpaceStar
          key={`${randomX}-${i}`}
          size={randomSize}
          position={{ x: randomX, y: randomY }}
        />
      );
    }
    return starAgg;
  }

  render() {
    return (
      <div
        className="w-full overflow-hidden"
        style={{
          height: this._MapSize,
          position: 'relative',
        }}
      >
        {this._stars}
        {this.props.children}
      </div>
    );
  }
}
