import { GoogleOAuthProvider } from '@react-oauth/google';
import { createContext, useEffect } from 'react';

import {
  getGoogleAPI,
  initializeGoogleAPI,
  initializeGoogleAPIClient,
} from './GoogleAPI';

export const GoogleAPIContext = createContext(
  /** @type {ReturnType<createGoogleAPI>|null} */ (null),
);

function createGoogleAPI() {
  return {
    /* For the future :) */
  };
}

/**
 * @param {object} props
 * @param {string} props.apiKey
 * @param {string} props.clientId
 * @param {import('react').ReactNode} props.children
 */
export function GoogleAPIProvider({ apiKey, clientId, children }) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleInitProvider apiKey={apiKey}>{children}</GoogleInitProvider>
    </GoogleOAuthProvider>
  );
}

/**
 * @param {object} props
 * @param {string} props.apiKey
 * @param {import('react').ReactNode} props.children
 */
function GoogleInitProvider({ apiKey, children }) {
  useEffect(() => {
    (async () => {
      await initializeGoogleAPI();
      await initializeGoogleAPIClient(getGoogleAPI(), {
        apiKey,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
        ],
      });
    })();
  }, [apiKey]);

  const value = createGoogleAPI();
  return (
    <GoogleAPIContext.Provider value={value}>
      {children}
    </GoogleAPIContext.Provider>
  );
}
