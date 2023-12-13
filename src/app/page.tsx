'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import Workspace from '@/components/workspace/Workspace';
import { GoogleAPIProvider } from '@/lib/googleapi/GoogleAPIContext';
import { GAPI_API_KEY, GAPI_CLIENT_ID } from '@/lib/googleapi/Keys';
import { GAPI_DRIVE_FILE_SCOPE } from '@/lib/googleapi/UploadFile';

export default function Home() {
  return (
    <ErrorBoundary>
      <GoogleAPIProvider
        apiKey={GAPI_API_KEY}
        clientId={GAPI_CLIENT_ID}
        scopes={[GAPI_DRIVE_FILE_SCOPE]}>
        <main className="relative w-screen h-screen text-black bg-white overflow-hidden">
          <Workspace />
        </main>
      </GoogleAPIProvider>
    </ErrorBoundary>
  );
}
