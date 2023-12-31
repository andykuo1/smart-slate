// https://github.com/google/google-api-javascript-client/issues/304
export const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];
export const GAPI_SCRIPT_ID = 'gapiScript';

/** @typedef {gapi} GAPI */
/** @typedef {Parameters<gapi.client.init>} GAPIClientInitParams */
/** @typedef {GAPIClientInitParams[0]} GAPIClientInitArgs */

/**
 * @returns {Promise<GAPI>}
 */
export async function initializeGoogleAPI() {
  if (!window || !document) {
    return Promise.reject(
      new Error(
        'Cannot initialize GoogleAPI on non-browser environment - ' +
          'window or document are not defined.',
      ),
    );
  }
  if (typeof window.gapi !== 'undefined') {
    // Already loaded/loading by another call.
    return Promise.resolve(getGoogleAPI());
  }
  return new Promise((resolve, reject) => {
    let script = document.querySelector(`#${GAPI_SCRIPT_ID}`);
    let isScriptAppended = true;
    if (!script) {
      console.log('Initializing GoogleAPI script...');
      script = document.createElement('script');
      script.id = GAPI_SCRIPT_ID;
      script.toggleAttribute('async', true);
      script.toggleAttribute('defer', true);
      script.setAttribute('src', 'https://apis.google.com/js/api.js');
      isScriptAppended = false;
    }
    script.addEventListener('load', () => resolve(getGoogleAPI()));
    script.addEventListener('error', reject);

    // Append only after event listeners are attached.
    if (!isScriptAppended) {
      document.body.appendChild(script);
    }
  });
}

/**
 * @param {GAPI} gapi
 * @param {GAPIClientInitArgs} args
 * @returns {Promise<gapi.client>}
 */
export async function initializeGoogleAPIClient(gapi, args) {
  return new Promise((resolve, reject) => {
    gapi.load('client', () =>
      gapi.client
        .init(args)
        .then(() => resolve(gapi.client))
        .catch(reject),
    );
  });
}

/** @returns {GAPI} */
export function getGoogleAPI() {
  return window.gapi;
}

export function hasGoogleAPI() {
  return typeof window !== 'undefined' && typeof window.gapi !== 'undefined';
}
