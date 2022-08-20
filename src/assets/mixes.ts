import { isObject } from 'mobx/dist/internal';

import one from './audio/PLNT001.json';
import two from './audio/PLNT002.json';
import three from './audio/PLNT003.json';

export interface MixData {
  id: string;
  type: MixType;

  height: number;
  width: number;
  filename: string;
}

export enum MixType {
  Planet = 'PLNT',
  Crew = 'CRW',
  Satellite = 'STLT',
}

export interface Mix {
  data: MixData;
  audio: any;
}

export const mixes: Mix[] = [
  {
    data: one,
    audio: './audio/PLNT002_192k.mp3',
  },
  {
    data: two,
    audio: './audio/PLNT003_192k.mp3',
  },
  {
    data: three,
    audio: './audio/PLNT004_192k.mp3',
  },
];
