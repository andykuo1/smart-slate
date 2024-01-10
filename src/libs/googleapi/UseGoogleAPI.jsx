import { hasGrantedAllScopesGoogle } from '@react-oauth/google';
import { useCallback, useContext } from 'react';

import { hasGoogleAPI } from './GoogleAPI';
import { getGoogleAPICachedTokenResponse } from './GoogleAPICachedTokenResponse';
import { GoogleAPIContext } from './GoogleAPIContext';

function useGoogleAPI() {
  const result = useContext(GoogleAPIContext);
  if (!result) {
    throw new Error('Missing GoogleAPIProvider.');
  }
  return result;
}

export function useGAPILoginCallbacks() {
  const { onLoginSuccess, onLoginError } = useGoogleAPI();
  return {
    onSuccess: onLoginSuccess,
    onError: onLoginError,
  };
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
  const { scopes } = useGoogleAPI();
  const tokenHandler = useCallback(
    /** @param {(token: import('@react-oauth/google').TokenResponse) => void} callback */
    function _tokenHandler(callback) {
      let token = getGoogleAPICachedTokenResponse();
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
    [scopes],
  );
  return tokenHandler;
}
