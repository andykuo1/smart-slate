import { MenuItem } from '@ariakit/react';

import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import { useSettingsStore } from '@/stores/settings';
import MenuStyle from '@/styles/Menu.module.css';

export default function PreferPersistedMediaStreamMenuItem() {
  const enabled = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const setEnabled = useSettingsStore(
    (ctx) => ctx.setPreferPersistedMediaStream,
  );

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
      Prefer Persisted Media Stream
    </MenuItem>
  );
}
