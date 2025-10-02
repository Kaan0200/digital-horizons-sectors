import mixData from './mixes.json';

export interface MixData {
  id: string;
  type: MixType;
  name: string;
  desc: string;

  /**
   * Genres and keywords used to describe the mix
   */
  tags: string[];


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

export const MixData: Array<MixData> = mixData.mixes as Array<MixData>;
