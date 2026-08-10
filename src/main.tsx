import './index.css';

import React from 'react';
import { createRoot, Root } from 'react-dom/client';

import App from './App';
import { RootStore, RootStoreContext } from './stores/RootStore';

const container = document.getElementById('root');
const root: Root = createRoot(container!);

// Full Screen PWA
root.render(
    <React.StrictMode>
        <RootStoreContext.Provider value={new RootStore()}>
            <App />
        </RootStoreContext.Provider>
    </React.StrictMode>,
);
