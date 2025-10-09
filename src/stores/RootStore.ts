import { createContext, useContext } from 'react';

import { makeAutoObservable } from 'mobx';
import { Mixes } from '../assets/mixes';
import { UserStore } from './UserStore';

export class RootStore {
  userStore: UserStore = new UserStore(this);

  isPlaying: boolean;
  selectedId: string;
  currentAudio: HTMLAudioElement | undefined;

  constructor() {
    makeAutoObservable(this);
    this.isPlaying = false;
    this.selectedId = '';
    this.currentAudio = new Audio();
  }

  play = (newID?: string) => {
    // play any new mixIDs
    if (newID) {
      const match = Mixes.find((mix) => mix.id === newID);
      // check if new mix, otherwise pause
      if (match && this.currentAudio?.src !== match.url) {
        this.currentAudio = new Audio(match.url);
        this.currentAudio.play();
        this.selectedId = newID;
        this.isPlaying = true;
      } else {
        this.currentAudio?.pause();
        this.isPlaying = false;
      }
    }
    //treat like a toggle
    else {
      if (this.isPlaying) {
        this.currentAudio?.pause();
        this.isPlaying = false;
      } else {
        this.currentAudio?.play();
        this.isPlaying = true;
      }
    }
  };

  stop = () => {
    this.currentAudio?.pause();
    this.currentAudio = undefined;
    this.isPlaying = false;
    this.selectedId = '';
  };
}

export const RootStoreContext = createContext<RootStore | null>(null);

export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (context === null) {
    throw new Error('🔴 Missing wrapper your root component with RootStoreProvider');
  }
  return context;
};
