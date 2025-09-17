import { Context, createContext } from 'react';

/**
 * This is a react context for the media-player state
 * so that pages can cause changes on the base level of the
 * application
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PlayerContext: Context<any> = createContext({
  selectedMix: null,
});
