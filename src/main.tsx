import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import EditPage from '@/pages/EditPage';
import ErrorPage from '@/pages/ErrorPage';
import NewProjectPage from '@/pages/NewProjectPage';
import RecordPage from '@/pages/RecordPage';
import RootPage from '@/pages/RootPage';
import ScanPage from '@/pages/ScanPage';
import SettingsPage from '@/pages/SettingsPage';
import TestPage from '@/pages/TestPage';
import ViewPage from '@/pages/ViewPage';
import '@/progressive/ServiceWorkerInstall';

import './index.css';
import Providers from './providers';
import { PACKAGE_NAME } from './values/PackageJSON';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/settings',
      element: <SettingsPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/rec',
      element: <RecordPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/edit',
      element: <EditPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/view',
      element: <ViewPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/test',
      element: <TestPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/scan',
      element: <ScanPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/new',
      element: <NewProjectPage />,
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
