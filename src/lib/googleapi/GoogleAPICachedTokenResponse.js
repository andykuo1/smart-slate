const GAPI_TOKEN_RESPONSE = 'gapiTokenResponse';

/**
 * @param {import('@react-oauth/google').TokenResponse|null} tokenResponse
 */
export function setGoogleAPICachedTokenResponse(tokenResponse) {
  if (!tokenResponse) {
    sessionStorage.removeItem(GAPI_TOKEN_RESPONSE);
  } else {
    let result = JSON.stringify(tokenResponse);
    sessionStorage.setItem(GAPI_TOKEN_RESPONSE, result);
  }
}

/** @returns {import('@react-oauth/google').TokenResponse|null} */
export function getGoogleAPICachedTokenResponse() {
  let result = sessionStorage.getItem(GAPI_TOKEN_RESPONSE);
  if (!result) {
    return null;
  } else {
    try {
      return JSON.parse(result);
    } catch (e) {
      return null;
    }
  }
}

export async function fetchGoogleAPICachedTokenResponse() {
  return getGoogleAPICachedTokenResponse();
}
