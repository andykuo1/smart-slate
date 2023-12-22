import { MenuItem } from '@ariakit/react';

import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import { useSettingsStore } from '@/stores/SettingsStoreContext';
import MenuStyle from '@/styles/Menu.module.css';

export default function PreferNativeRecorderMenuItem() {
  const enabled = useSettingsStore((ctx) => ctx.user.preferNativeRecorder);
  const setEnabled = useSettingsStore((ctx) => ctx.setPreferNativeRecorder);

  return (
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      hideOnClick={false}
      onClick={() => setEnabled(!enabled)}>
      {enabled ? (
        <ToggleOn className="h-full" />
      ) : (
        <ToggleOff className="h-full" />
      )}
      Prefer Native Recorder
    </MenuItem>
  );
}
