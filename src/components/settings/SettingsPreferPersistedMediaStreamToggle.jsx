import { useSettingsStore } from '@/stores/settings';

import SettingsFieldToggle from './SettingsFieldToggle';

export default function SettingsPreferNativeRecorderToggle() {
  const enabled = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const setEnabled = useSettingsStore(
    (ctx) => ctx.setPreferPersistedMediaStream,
  );

  return (
    <SettingsFieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Force always-on stream
    </SettingsFieldToggle>
  );
}
