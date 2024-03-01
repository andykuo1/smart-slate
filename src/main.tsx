import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import AsyncTestPage from '@/pages/AsyncTestPage';
import AsyncViewPage from '@/pages/AsyncViewPage';
import ClapperPage from '@/pages/ClapperPage';
import EditPage from '@/pages/EditPage';
import EditPageV2 from '@/pages/EditPageV2';
import ErrorPage from '@/pages/ErrorPage';
import NewProjectPage from '@/pages/NewProjectPage';
import PreviewPage from '@/pages/PreviewPage';
import RecordPage from '@/pages/RecordPage';
import RenamePage from '@/pages/RenamePage';
import RootPage from '@/pages/RootPage';
import ScannerPage from '@/pages/ScannerPage';
import SettingsPage from '@/pages/SettingsPage';
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
      path: '/edit2',
      element: <EditPageV2 />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/view',
      element: (
        <Suspense>
          <AsyncViewPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: '/test',
      element: (
        <Suspense>
          <AsyncTestPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: '/scan',
      element: <ScannerPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/new',
      element: <NewProjectPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/pre',
      element: <PreviewPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/rename',
      element: <RenamePage />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/clap',
      element: <ClapperPage />,
      errorElement: <ErrorPage />,
    },
  ],
  { basename: `/${PACKAGE_NAME}/` },
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
);
