import './index.css';

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './App';
import SectorDetail from './pages/SectorDetail';
import { RootStore, RootStoreContext } from './stores/RootStore';
import { WelcomeSplash } from './pages/WelcomeSplash';

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
      {
        path: '/welcome',
        Component: WelcomeSplash,
      }
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
