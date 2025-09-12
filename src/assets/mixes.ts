import data_two from './audio/PLNT002.json';
import data_three from './audio/PLNT003.json';
import data_four from './audio/PLNT004.json';

export interface MixData {
  id: string;
  type: MixType;

  height: number;
  width: number;

  /** Azure Resource URL for the MP3 Audio */
  url: string;
}

export enum MixType {
  Planet = 'PLNT',
  Crew = 'CRW',
  Satellite = 'STLT',
}

export interface Mix {
  data: MixData;
  audio: unknown; // mp3???
}

export const mixes: Mix[] = [
  {
    data: data_two as MixData,
    audio: '',
  },
  {
    data: data_three as MixData,
    audio: '',
  },
  {
    data: data_four as MixData,
    audio: '',
  },
];
