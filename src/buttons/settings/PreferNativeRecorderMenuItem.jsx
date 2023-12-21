import { MenuItem } from '@ariakit/react';

import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import {
  usePreferNativeRecorder,
  useSetPreferNativeRecorder,
} from '@/stores/UserStoreContext';
import MenuStyle from '@/styles/Menu.module.css';

export default function PreferNativeRecorderMenuItem() {
  const preferNativeRecorder = usePreferNativeRecorder();
  const setPreferNativeRecorder = useSetPreferNativeRecorder();

  return (
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      hideOnClick={false}
      onClick={() => setPreferNativeRecorder(!preferNativeRecorder)}>
      {preferNativeRecorder ? (
        <ToggleOn className="h-full" />
      ) : (
        <ToggleOff className="h-full" />
      )}
      Prefer Native Recorder
    </MenuItem>
  );
}
