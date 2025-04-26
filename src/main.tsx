import './index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './App';
import SectorDetail from './components/SectorDetail';


const container = document.getElementById('root');
const root = createRoot(container!);

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/:id", Component: SectorDetail
      }
    ]
    //loader: loadRootData,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
