import './index.css';

import React, { createContext, useContext } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './App';
import SectorDetail from './components/SectorDetail';
import { makeAutoObservable } from 'mobx';

export class RootStore {
  isPlaying: boolean;
  selectedId: string;

  constructor() {
    makeAutoObservable(this);
    this.isPlaying = false;
    this.selectedId = '';
  }
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
