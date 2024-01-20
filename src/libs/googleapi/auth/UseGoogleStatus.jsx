import { useGoogleToken } from './UseGoogleToken';

export function useGoogleStatus() {
  const token = useGoogleToken();
  const isLoggedIn = Boolean(token);
  return isLoggedIn;
}
