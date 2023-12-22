import { MenuItem } from '@ariakit/react';

import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import { useSettingsStore } from '@/stores/SettingsStoreContext';
import MenuStyle from '@/styles/Menu.module.css';

export default function EnableThumbnailWhileRecording() {
  const enableThumbnailWhileRecording = useSettingsStore(
    (ctx) => ctx.user.enableThumbnailWhileRecording,
  );
  const setEnableThumbnailWhileRecording = useSettingsStore(
    (ctx) => ctx.setEnableThumbnailWhileRecording,
  );

  return (
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      hideOnClick={false}
      onClick={() =>
        setEnableThumbnailWhileRecording(!enableThumbnailWhileRecording)
      }>
      {enableThumbnailWhileRecording ? (
        <ToggleOn className="h-full" />
      ) : (
        <ToggleOff className="h-full" />
      )}
      Enable Thumbnail Reference
    </MenuItem>
  );
}
