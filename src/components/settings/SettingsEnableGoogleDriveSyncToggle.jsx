import { useCallback, useEffect, useState } from 'react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';

import { useInterval } from '@/libs/UseInterval';
import { useGAPITokenHandler } from '@/libs/googleapi';
import { useSettingsStore } from '@/stores/settings';

import SettingsFieldToggle from './SettingsFieldToggle';

export default function SettingsEnableGoogleDriveSyncToggle() {
  const [loggedIn, setLoggedIn] = useState(false);
  const enabled = useSettingsStore((ctx) => ctx.user.enableDriveSync);
  const setEnabled = useSettingsStore((ctx) => ctx.setEnableDriveSync);
  const handleToken = useGAPITokenHandler();

  const onInterval = useCallback(() => {
    if (!handleToken(() => setLoggedIn(true))) {
      setLoggedIn(false);
    }
  }, [handleToken, setLoggedIn]);
  useInterval(onInterval, 5_000);
  useEffect(onInterval, [onInterval]);

  return (
    <SettingsFieldToggle
      className={'flex flex-row fill-current'}
      value={enabled}
      onClick={() => setEnabled(!enabled)}
      disabled={!loggedIn}>
      <span>Enable</span>
      <AddToDriveIcon className="inline-block w-6 h-6 fill-current mx-1" />
      <span>Drive sync</span>
    </SettingsFieldToggle>
  );
}
