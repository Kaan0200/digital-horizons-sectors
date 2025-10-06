import './index.css';

import React, { createContext, useContext } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './App';
import SectorDetail from './pages/SectorDetail';
import { makeAutoObservable } from 'mobx';
import { Mixes } from './assets/mixes';

export class RootStore {
  isPlaying: boolean;
  selectedId: string;
  currentAudio: HTMLAudioElement;

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
      if (match && this.currentAudio.src !== match.url) {
        this.currentAudio = new Audio(match.url);
        this.currentAudio.play();
        this.selectedId = newID;
        this.isPlaying = true;
      } else {
        this.currentAudio.pause();
        this.isPlaying = false;
      }
    }
    //treat like a toggle
    else {
      if (this.isPlaying) {
        this.currentAudio.pause();
        this.isPlaying = false;
      } else {
        this.currentAudio.play();
        this.isPlaying = true;
      }
    }
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

const container = document.getElementById('root');
const root: Root = createRoot(container!);

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/:id',
        Component: SectorDetail,
      },
    ],
    //loader: loadRootData,
  },
]);

root.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={new RootStore()}>
      <RouterProvider router={router} />
    </RootStoreContext.Provider>
  </React.StrictMode>,
);
