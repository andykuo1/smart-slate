import { FullscreenProvider } from '@/lib/fullscreen';
import {
  GAPI_API_KEY,
  GAPI_CLIENT_ID,
  GAPI_DRIVE_FILE_SCOPE,
  GoogleAPIProvider,
} from '@/lib/googleapi';

import { InputCaptureProvider } from './lib/inputcapture';

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
      <InputCaptureProvider>
        <FullscreenProvider>{children}</FullscreenProvider>
      </InputCaptureProvider>
    </GoogleAPIProvider>
  );
}
