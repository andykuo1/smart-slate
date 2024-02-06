import { FullscreenProvider } from '@/libs/fullscreen';
import {
  GAPI_API_KEY,
  GAPI_CLIENT_ID,
  GoogleAPIProvider,
} from '@/libs/googleapi';
import GoogleDriveSyncProvider from '@/libs/googleapi/sync/GoogleDriveSyncProvider';
import { InputCaptureProvider } from '@/libs/inputcapture';
import RecorderContextProvider from '@/recorder/RecorderContextProvider';
import { VideoCacheProvider } from '@/recorder/cache';
import { SlugContextProvider } from '@/slugs';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function Providers({ children }) {
  return (
    <SlugContextProvider>
      <GoogleAPIProvider apiKey={GAPI_API_KEY} clientId={GAPI_CLIENT_ID}>
        <GoogleDriveSyncProvider>
          <VideoCacheProvider>
            <FullscreenProvider>
              <InputCaptureProvider>
                <RecorderContextProvider>{children}</RecorderContextProvider>
              </InputCaptureProvider>
            </FullscreenProvider>
          </VideoCacheProvider>
        </GoogleDriveSyncProvider>
      </GoogleAPIProvider>
    </SlugContextProvider>
  );
}
