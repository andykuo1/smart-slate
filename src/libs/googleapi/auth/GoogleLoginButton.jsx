import { GoogleLogin } from '@react-oauth/google';

import { useUserStore } from '@/stores/user';

export default function GoogleLoginButton() {
  const setGoogleContextCredentialResponse = useUserStore(
    (ctx) => ctx.setGoogleContextCredentialResponse,
  );

  function onCredentialError() {
    console.error('[GoogleLoginButton] Failed authentication!');
  }

  /** @param {import('@react-oauth/google').CredentialResponse} response */
  function onCredentialSuccess(response) {
    setGoogleContextCredentialResponse(response);
  }

  return (
    <GoogleLogin onSuccess={onCredentialSuccess} onError={onCredentialError} />
  );
}
