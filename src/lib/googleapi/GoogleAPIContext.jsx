import {
  GoogleOAuthProvider,
  googleLogout,
  useGoogleLogin,
} from '@react-oauth/google';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';

import {
  getGoogleAPI,
  initializeGoogleAPI,
  initializeGoogleAPIClient,
} from './GoogleAPI';

export const GoogleAPIContext = createContext(
  /** @type {ReturnType<createGoogleAPI>|null} */ (null),
);

/**
 * @param {Array<string>} scopes
 * @param {() => void} login
 * @param {() => void} logout
 * @param {import('react').RefObject<import('@react-oauth/google').TokenResponse|null>} tokenRef
 * @param {boolean} gapiLoaded
 * @param {boolean} gsiLoaded
 */
function createGoogleAPI(
  scopes,
  login,
  logout,
  tokenRef,
  gapiLoaded,
  gsiLoaded,
) {
  return {
    scopes,
    login,
    logout,
    tokenRef,
    status: Boolean(gapiLoaded && gsiLoaded),
  };
}

/**
 * @param {object} props
 * @param {string} props.apiKey
 * @param {string} props.clientId
 * @param {Array<string>} props.scopes
 * @param {import('react').ReactNode} props.children
 */
export function GoogleAPIProvider({ apiKey, clientId, scopes, children }) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleAPILoginProvider apiKey={apiKey} scopes={scopes}>
        {children}
      </GoogleAPILoginProvider>
    </GoogleOAuthProvider>
  );
}

/**
 * @param {object} props
 * @param {string} props.apiKey
 * @param {Array<string>} props.scopes
 * @param {import('react').ReactNode} props.children
 */
function GoogleAPILoginProvider({ apiKey, scopes, children }) {
  const [gapiLoaded, setGAPILoaded] = useState(false);
  const [gsiLoaded, setGSILoaded] = useState(false);
  const tokenRef = useRef(
    /** @type {import('@react-oauth/google').TokenResponse|null} */ (null),
  );

  const login = useGoogleLogin({
    scope: scopes.join(' '),
    onSuccess(tokenResponse) {
      tokenRef.current = tokenResponse;
      setGSILoaded(true);
    },
    onError(errorResponse) {
      tokenRef.current = null;
      console.error(errorResponse);
    },
  });

  const logout = useCallback(() => {
    googleLogout();
    tokenRef.current = null;
  }, [tokenRef]);

  useEffect(() => {
    (async () => {
      await initializeGoogleAPI();
      await initializeGoogleAPIClient(getGoogleAPI(), {
        apiKey,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
        ],
      });
      setGAPILoaded(true);
    })();
  }, [apiKey]);

  const value = createGoogleAPI(
    scopes,
    login,
    logout,
    tokenRef,
    gapiLoaded,
    gsiLoaded,
  );
  return (
    <GoogleAPIContext.Provider value={value}>
      {children}
    </GoogleAPIContext.Provider>
  );
}
