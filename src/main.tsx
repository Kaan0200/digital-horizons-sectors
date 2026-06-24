import './index.css';

import React from 'react';
import { createRoot, Root } from 'react-dom/client';

import App from './App';
import { RootStore, RootStoreContext } from './stores/RootStore';

const container = document.getElementById('root');
const root: Root = createRoot(container!);

// The Night Almanac is a single full-screen chart; the specimen plate is an
// overlay rather than a route, so no router is needed for the base experience.
// (Previous routed entry preserved in main.old.tsx.)
root.render(
  <React.StrictMode>
    <RootStoreContext.Provider value={new RootStore()}>
      <App />
    </RootStoreContext.Provider>
  </React.StrictMode>,
);
