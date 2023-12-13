import {
  GoogleOAuthProvider,
  googleLogout,
  hasGrantedAllScopesGoogle,
  useGoogleLogin,
} from '@react-oauth/google';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getGoogleAPI,
  hasGoogleAPI,
  initializeGoogleAPI,
  initializeGoogleAPIClient,
} from './GoogleAPI';

const GoogleAPIContext = createContext(
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
  }, [tokenRef, googleLogout]);

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

function useGoogleAPI() {
  const result = useContext(GoogleAPIContext);
  if (!result) {
    throw new Error('Missing GoogleAPIProvider.');
  }
  return result;
}

export function useGAPILogin() {
  const { login } = useGoogleAPI();
  return login;
}

export function useGAPILogout() {
  const { logout } = useGoogleAPI();
  return logout;
}

export function useGAPITokenHandler() {
  const { scopes, tokenRef } = useGoogleAPI();
  const tokenHandler = useCallback(
    /** @param {(token: import('@react-oauth/google').TokenResponse) => void} callback */
    function _tokenHandler(callback) {
      let token = tokenRef.current;
      if (!token || scopes.length <= 0) {
        console.log('Checked GAPI access...no token or scopes');
        return false;
      }
      if (!hasGoogleAPI()) {
        console.log('Checked GAPI access...no GAPI');
        return false;
      }
      // @ts-ignore
      if (!hasGrantedAllScopesGoogle(token, ...scopes)) {
        console.log('Checked GAPI access...no granted scopes');
        return false;
      }
      callback(token);
      return true;
    },
    [tokenRef, scopes, hasGrantedAllScopesGoogle],
  );
  return tokenHandler;
}
