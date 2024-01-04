import { FullscreenProvider } from '@/libs/fullscreen';
import {
  GAPI_API_KEY,
  GAPI_CLIENT_ID,
  GAPI_DRIVE_FILE_SCOPE,
  GoogleAPIProvider,
} from '@/libs/googleapi';

import RecorderContextProvider from './recorder/RecorderContextProvider';
import { VideoCacheProvider } from './recorder/cache';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function Providers({ children }) {
  return (
    <GoogleAPIProvider
      apiKey={GAPI_API_KEY}
      clientId={GAPI_CLIENT_ID}
      scopes={[GAPI_DRIVE_FILE_SCOPE]}>
      <VideoCacheProvider>
        <FullscreenProvider>
          <RecorderContextProvider>{children}</RecorderContextProvider>
        </FullscreenProvider>
      </VideoCacheProvider>
    </GoogleAPIProvider>
  );
}
