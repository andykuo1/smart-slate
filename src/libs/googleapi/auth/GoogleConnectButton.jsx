import {
  googleLogout,
  hasGrantedAllScopesGoogle,
  useGoogleLogin,
} from '@react-oauth/google';
import { useCallback, useEffect, useState } from 'react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';
import LogoutIcon from '@material-symbols/svg-400/rounded/logout.svg';

import { useInterval } from '@/libs/UseInterval';
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
        'flex-1 border p-2 rounded text-black hover:bg-black hover:text-white shadow' +
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
          <LogoutIcon className="inline-block w-6 h-6 mr-2 fill-current" />
          Disconnect from Google Drive
        </>
      );
    case 'disconnected':
      return (
        <>
          <AddToDriveIcon className="inline-block w-6 h-6 mr-2 fill-current" />
          Connect to Google Drive
        </>
      );
    case 'partial':
    case 'error':
      return (
        <>
          <AddToDriveIcon className="inline-block w-6 h-6 mr-2 fill-current" />
          Error! Please reconnect
        </>
      );
    default:
      return (
        <>
          <AddToDriveIcon className="inline-block w-6 h-6 mr-2 fill-current" />
          Reconnect to Google Drive
        </>
      );
  }
}

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
function AnimatedEllipsis({ children }) {
  const [ellipsis, setEllipsis] = useState('....');
  const onInterval = useCallback(
    function onInterval() {
      setEllipsis((prev) => (prev.length >= 4 ? '.' : prev + '.'));
    },
    [setEllipsis],
  );
  useInterval(onInterval, 500);
  return (
    <pre className="inline-block">
      {children}
      {ellipsis.padEnd(4, ' ')}
    </pre>
  );
}
