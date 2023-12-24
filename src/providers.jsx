import { FullscreenProvider } from '@/lib/fullscreen';
import {
  GAPI_API_KEY,
  GAPI_CLIENT_ID,
  GAPI_DRIVE_FILE_SCOPE,
  GoogleAPIProvider,
} from '@/lib/googleapi';

import { InputCaptureProvider } from './lib/inputcapture';
import { MediaRecorderProvider } from './recorder';
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
        <InputCaptureProvider>
          <MediaRecorderProvider>
            <FullscreenProvider>{children}</FullscreenProvider>
          </MediaRecorderProvider>
        </InputCaptureProvider>
      </VideoCacheProvider>
    </GoogleAPIProvider>
  );
}
