/**
 * Interface representing a mix and it's metadata
 *
 * ! This information is intended static throughout the lifecycle of the application
 */
export interface MixData {
    /**
     * ID indicating type and number, manually made
     */
    readonly id: MixID;
    /**
     * Enum representing what type of mix this is
     */
    readonly type: MixType;
    /**
     * Human-friendly name or title of the mix
     */
    readonly name: string;
    /**
     * Human-friendly description of the mix
     */
    readonly desc: string;

    /**
     * Genres and keywords used to describe the mix
     * @todo - need to implement
     */
    readonly tags: string[];

    /** Azure Resource URL for the MP3 Audio */
    readonly url: string;
}

/**
 * Enum representing the artistic purpose of this mix
 */
export enum MixType {
    /**
     * << P L A N E T  >>
     *
     * These are general mixes, each planet representing a
     * specific theme or vibe, emotion or genre related usually.
     */
    Planet = 'PLNT',
    /**
     * << C R E W >>
     *
     * These are mixes associated with specific people, maybe
     * guest mixes, or maybe dedications
     */
    Crew = 'CRW',
    /**
     * << S A T E L I T E >>
     *
     * These are special themed mixes for specific events
     * or specific highlighted mixes or are more specific than
     * for the general mixes.
     */
    Satellite = 'STLT',
}

/**
 * Typescript String-Type to keep the IDs for the mixes locked down for
 * compiler reasons
 */
export type MixID = 'CRW001' | 'PLNT002' | 'PLNT003' | 'PLNT001' | 'STRDST05';

/**
 * The static TS data that is all of the track meta data in the application,
 * This is not editable and is fixed and available as static information
 * though out the application.
 *
 * 👇👇 Modify here with new mixes 👇👇
 */
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
        tags: ['techno', 'dark'],
        url: 'https://dhaudio.blob.core.windows.net/dh-audio-store/PLNT002_192k.mp3',
    },
    {
        id: 'PLNT003',
        type: MixType.Planet,
        name: 'Progressive Space',
        desc: 'A voyage through a dark and swirling space.',
        tags: ['dark'],
        url: 'https://dhaudio.blob.core.windows.net/dh-audio-store/PLNT003_192k.mp3',
    },
    {
        id: 'PLNT001',
        type: MixType.Planet,

        name: 'Mystery Space',
        desc: 'A voyage through a dark and swirling space.',
        tags: ['dark', 'vocals', 'deep'],
        url: 'https://dhaudio.blob.core.windows.net/dh-audio-store/PLNT004_192k.mp3',
    },
    {
        id: 'STRDST05',
        type: MixType.Planet,

        name: 'Retrograde',
        desc: 'A throwback themed mix filled with bass, tech, and breaks.',
        tags: ['house', 'tech'],
        url: 'https://dhaudio.blob.core.windows.net/dh-audio-store/STRDST05-Retro Grade_320.mp3',
    },
];
