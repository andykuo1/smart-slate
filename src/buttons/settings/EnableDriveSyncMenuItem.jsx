import { MenuItem } from '@ariakit/react';
import { useCallback, useEffect, useState } from 'react';

import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';
import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import { useInterval } from '@/libs/UseInterval';
import { useGAPITokenHandler } from '@/libs/googleapi';
import { useSettingsStore } from '@/stores/settings';
import MenuStyle from '@/styles/Menu.module.css';

export default function EnableThumbnailWhileRecording() {
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
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      hideOnClick={false}
      onClick={() => setEnabled(!enabled)}
      disabled={!loggedIn}>
      {enabled ? (
        <ToggleOn className="h-full" />
      ) : (
        <ToggleOff className="h-full" />
      )}
      Enable
      <AddToDriveIcon className="w-6 h-6 fill-current" /> Drive Sync
    </MenuItem>
  );
}
