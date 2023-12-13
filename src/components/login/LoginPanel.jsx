import { useGoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useCallback, useEffect, useState } from 'react';

import {
  GAPI_CLIENT_ID,
  getGoogleAPI,
  initializeGoogleAPI,
  initializeGoogleAPIClient,
} from './GoogleAPI';
import { uploadFile } from './UploadFile';

const SCOPES = [
  //'https://www.googleapis.com/auth/docs',
  //'https://www.googleapis.com/auth/drive',
  //'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
];

export default function LoginPanel() {
  return (
    <GoogleOAuthProvider clientId={GAPI_CLIENT_ID}>
      <Workspace />
    </GoogleOAuthProvider>
  );
}

function Workspace() {
  const [tokenResponse, setTokenResponse] = useState(
    /** @type {import('@react-oauth/google').TokenResponse|null} */ (null),
  );
  const [gapiLoaded, setGAPILoaded] = useState(false);
  const [gisLoaded, setGISLoaded] = useState(false);
  const [file, setFile] = useState(/** @type {Blob|null} */ (null));

  useEffect(() => {
    (async () => {
      await initializeGoogleAPI();
      await initializeGoogleAPIClient(getGoogleAPI());
      setGAPILoaded(true);
    })();
  }, []);

  function onClick() {
    if (!file) {
      console.error('NO FILE');
      return;
    }
    let token = /** @type {string} */ (tokenResponse?.access_token);
    uploadFile(token, 'someVideoFile', 'video/mp4', file)
      .then(() => console.log('WOOT!'))
      .catch(console.error);
  }

  function onTextClick() {
    let token = /** @type {string} */ (tokenResponse?.access_token);
    let file = new Blob(['cool text here'], { type: 'text/plain' });
    uploadFile(token, 'someTextFile', 'text/plain', file)
      .then(() => console.log('WOOT-BO!'))
      .catch(console.error);
    /*
    uploadTextFile(token, 'This is some text :D')
      .then(() => console.log('WOOTDSAF!'))
      .catch(console.error);
      */
  }

  useEffect(() => {
    console.log('TRY AGAIN', gapiLoaded, gisLoaded);
    if (gapiLoaded && gisLoaded) {
      console.log('SUCCESS! - ', tokenResponse);
    }
  }, [tokenResponse, gapiLoaded, gisLoaded]);

  const login = useGoogleLogin({
    scope: SCOPES.join(' '),
    onSuccess(tokenResponse) {
      setTokenResponse(tokenResponse);
      setGISLoaded(true);
    },
  });

  const onChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function onChange(e) {
      const el = /** @type {HTMLInputElement} */ (e.target);
      const file = el.files?.[0];
      if (!file) {
        return;
      }
      el.value = '';
      setFile(file);
    },
    [setFile],
  );

  return (
    <div>
      <p>GOOGLE</p>
      <input
        type="file"
        accept="video/*"
        capture="environment"
        onChange={onChange}
      />
      <button onClick={() => login()}>LOGIN</button>
      <button onClick={onClick}>UPLOAD</button>
      <button onClick={onTextClick}>TEXT</button>
    </div>
  );
}
