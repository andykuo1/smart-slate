import { useCallback, useEffect, useState } from 'react';

import ProfileIcon from '@material-symbols/svg-400/rounded/account_circle.svg';

import FancyButton from '@/libs/FancyButton';
import { useInterval } from '@/libs/UseInterval';
import {
  useGAPILogin,
  useGAPILogout,
  useGAPITokenHandler,
} from '@/libs/googleapi';

export default function ProfileButton() {
  const [loggedIn, setLoggedIn] = useState('');
  const login = useGAPILogin();
  const logout = useGAPILogout();
  const handleToken = useGAPITokenHandler();
  const onProfileClick = useCallback(
    function onProfileClick() {
      if (!handleToken(() => setLoggedIn('logged in'))) {
        login();
        setLoggedIn('pending');
      } else {
        logout();
        setLoggedIn('pending');
      }
    },
    [handleToken, login, logout, setLoggedIn],
  );

  const onInterval = useCallback(() => {
    if (!handleToken(() => setLoggedIn('logged in'))) {
      setLoggedIn('logged out');
    }
  }, [handleToken, setLoggedIn]);
  useInterval(onInterval, 3_000);
  useEffect(onInterval, [onInterval]);

  return (
    <FancyButton
      title={'Profile' + ' ' + (loggedIn ? `[${loggedIn}]` : '')}
      className="absolute top-2 left-2 mx-1 px-12"
      onClick={onProfileClick}>
      <ProfileIcon className="inline w-6 fill-current" />
    </FancyButton>
  );
}
