import { hasGrantedAllScopesGoogle } from '@react-oauth/google';
import { useCallback, useContext } from 'react';

import { hasGoogleAPI } from './GoogleAPI';
import { GoogleAPIContext } from './GoogleAPIContext';

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
      // @ts-expect-error spread operator is correct, but type disagrees :(
      if (!hasGrantedAllScopesGoogle(token, ...scopes)) {
        console.log('Checked GAPI access...no granted scopes');
        return false;
      }
      callback(token);
      return true;
    },
    [tokenRef, scopes],
  );
  return tokenHandler;
}
