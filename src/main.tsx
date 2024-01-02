import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import '@/progressive/ServiceWorkerInstall';

import './index.css';
import Providers from './providers';
import CameraPage from './routes/CameraPage';
import EditPage from './routes/EditPage';
import ErrorPage from './routes/ErrorPage';
import RootPage from './routes/RootPage';
import TestPage from './routes/TestPage';
import { PACKAGE_NAME } from './values/PackageJSON';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/rec',
      element: <CameraPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/edit',
      element: <EditPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/test',
      element: <TestPage />,
      errorElement: <ErrorPage />,
    },
  ],
  { basename: `/${PACKAGE_NAME}` },
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
);
