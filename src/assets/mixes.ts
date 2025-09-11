import data_one from './audio/PLNT001.json';
import data_two from './audio/PLNT002.json';
import mix_one from './audio/PLNT002_192k.mp3';
import data_three from './audio/PLNT003.json';
import mix_two from './audio/PLNT003_192k.mp3';
import mix_three from './audio/PLNT004_192k.mp3';

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
  audio: unknown; // mp3???
}

export const mixes: Mix[] = [
  {
    data: data_one as MixData,
    audio: mix_one,
  },
  {
    data: data_two as MixData,
    audio: mix_two,
  },
  {
    data: data_three as MixData,
    audio: mix_three,
  },
];
