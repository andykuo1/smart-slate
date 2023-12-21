import { MenuItem } from '@ariakit/react';

import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import {
  usePreferMutedWhileRecording,
  useSetPreferMutedWhileRecording,
} from '@/stores/UserStoreContext';
import MenuStyle from '@/styles/Menu.module.css';

export default function MutedRecordingMenuItem() {
  const preferMutedWhileRecording = usePreferMutedWhileRecording();
  const setPreferMutedWhileRecording = useSetPreferMutedWhileRecording();

  return (
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      hideOnClick={false}
      onClick={() => setPreferMutedWhileRecording(!preferMutedWhileRecording)}>
      {!preferMutedWhileRecording ? (
        <ToggleOn className="h-full" />
      ) : (
        <ToggleOff className="h-full" />
      )}
      Enable Live Audio
    </MenuItem>
  );
}
