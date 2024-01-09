import { useSettingsStore } from '@/stores/settings';

import SettingsFieldToggle from './SettingsFieldToggle';

export default function SettingsPreferNativeRecorderToggle() {
  const enabled = useSettingsStore((ctx) => ctx.user.preferNativeRecorder);
  const setEnabled = useSettingsStore((ctx) => ctx.setPreferNativeRecorder);

  return (
    <SettingsFieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Force native-only
    </SettingsFieldToggle>
  );
}
