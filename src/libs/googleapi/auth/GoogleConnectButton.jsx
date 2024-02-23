import {
  googleLogout,
  hasGrantedAllScopesGoogle,
  useGoogleLogin,
} from '@react-oauth/google';
import { useEffect, useState } from 'react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';
import LogoutIcon from '@material-symbols/svg-400/rounded/logout.svg';

import AnimatedEllipsis from '@/libs/AnimatedEllipsis';
import {
  GAPI_DRIVE_APPDATA_SCOPE,
  GAPI_DRIVE_FILE_SCOPE,
} from '@/libs/googleapi';
import { useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export default function GoogleConnectButton({ className, children }) {
  const [status, setStatus] = useState('disconnected');
  const token = useUserStore((ctx) => ctx.googleContext.token);
  const setGoogleContextTokenResponse = useUserStore(
    (ctx) => ctx.setGoogleContextTokenResponse,
  );

  /**
   * @param {any} [e]
   */
  function onAuthorizeError(e) {
    console.error('[GoogleConnectButton] Failed authorization!', e);
    setStatus('error');
  }

  /**
   * @param {import('@react-oauth/google').TokenResponse} response
   */
  function onAuthorizeSuccess(response) {
    console.log('[GoogleConnectButton] Successful authorization!');
    setGoogleContextTokenResponse(response);
    setStatus('connected');
  }

  const scope = [GAPI_DRIVE_FILE_SCOPE, GAPI_DRIVE_APPDATA_SCOPE].join(' ');
  const authorize = useGoogleLogin({
    scope,
    onSuccess: onAuthorizeSuccess,
    onError: onAuthorizeError,
    onNonOAuthError: onAuthorizeError,
  });

  useEffect(() => {
    const [firstScope, ...restScopes] = scope.split(' ');
    if (token) {
      if (!hasGrantedAllScopesGoogle(token, firstScope, ...restScopes)) {
        // Token lost some scopes! Try reconnecting.
        setStatus('partial');
      } else {
        setStatus('connected');
      }
    } else {
      setStatus('disconnected');
    }
  }, [scope, token, authorize, setStatus]);

  function onClick() {
    if (token) {
      googleLogout();
      setGoogleContextTokenResponse(null);
      setStatus('disconnected');
    } else {
      authorize();
      setStatus('connecting');
    }
  }

  return (
    <button
      className={
        'flex-1 rounded border p-2 text-black shadow hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black' +
        ' ' +
        className
      }
      onClick={onClick}>
      <GoogleConnectStatus status={status} />
      {children}
    </button>
  );
}

/**
 * @param {object} props
 * @param {string} props.status
 */
function GoogleConnectStatus({ status }) {
  switch (status) {
    case 'connecting':
      return <AnimatedEllipsis>Connecting</AnimatedEllipsis>;
    case 'connected':
      return (
        <>
          <LogoutIcon className="mr-2 inline-block h-6 w-6 fill-current" />
          Disconnect from Google Drive
        </>
      );
    case 'disconnected':
      return (
        <>
          <AddToDriveIcon className="mr-2 inline-block h-6 w-6 fill-current" />
          Connect to Google Drive
        </>
      );
    case 'partial':
    case 'error':
      return (
        <>
          <AddToDriveIcon className="mr-2 inline-block h-6 w-6 fill-current" />
          Error! Please reconnect
        </>
      );
    default:
      return (
        <>
          <AddToDriveIcon className="mr-2 inline-block h-6 w-6 fill-current" />
          Reconnect to Google Drive
        </>
      );
  }
}
