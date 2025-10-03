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

export const Mixes: Array<MixData> = [
  {
    id: 'CRW001',
    type: MixType.Crew,

    name: 'Temp Tim',
    desc: 'Track Dedicated to a mr. Temp Tim',
    tags: [],
    url: 'https://badurl.badurl',
  },
  {
    id: 'PLNT002',
    type: MixType.Planet,
    name: 'Techno Zone',
    desc: 'A voyage through pounding beats.',
    tags: [],
    url: 'https://dhaudio.blob.core.windows.net/dh-audio-store/PLNT002_192k.mp3',
  },
  {
    id: 'PLNT003',
    type: MixType.Planet,
    name: 'Mystery Space',
    desc: 'A voyage through a dark and swirling space.',
    tags: [],
    url: 'https://dhaudio.blob.core.windows.net/dh-audio-store/PLNT003_192k.mp3',
  },
  {
    id: 'PLNT001',
    type: MixType.Planet,

    name: 'Mystery Space',
    desc: 'A voyage through a dark and swirling space.',
    tags: [],
    url: 'https://dhaudio.blob.core.windows.net/dh-audio-store/PLNT004_192k.mp3',
  },
];
