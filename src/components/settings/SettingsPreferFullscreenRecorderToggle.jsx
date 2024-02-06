import { useSettingsStore } from '@/stores/settings';

import SettingsFieldToggle from './SettingsFieldToggle';

export default function SettingsPreferFullscreenRecorderToggle() {
  const enabled = useSettingsStore((ctx) => ctx.user.preferFullscreenRecorder);
  const setEnabled = useSettingsStore((ctx) => ctx.setPreferFullscreenRecorder);

  return (
    <SettingsFieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Fullscreen mode
    </SettingsFieldToggle>
  );
}
