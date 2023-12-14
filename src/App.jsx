import ErrorBoundary from '@/components/ErrorBoundary';
import Workspace from '@/components/workspace/Workspace';
import { FullscreenProvider } from '@/lib/fullscreen';
import {
  GAPI_API_KEY,
  GAPI_CLIENT_ID,
  GAPI_DRIVE_FILE_SCOPE,
  GoogleAPIProvider,
} from '@/lib/googleapi';

export default function App() {
  return (
    <ErrorBoundary>
      <GoogleAPIProvider
        apiKey={GAPI_API_KEY}
        clientId={GAPI_CLIENT_ID}
        scopes={[GAPI_DRIVE_FILE_SCOPE]}>
        <FullscreenProvider>
          <main className="relative w-screen h-screen text-black bg-transparent overflow-hidden">
            <Workspace />
          </main>
        </FullscreenProvider>
      </GoogleAPIProvider>
    </ErrorBoundary>
  );
}
