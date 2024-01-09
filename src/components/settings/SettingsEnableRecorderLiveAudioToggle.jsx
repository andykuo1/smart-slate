import { useSettingsStore } from '@/stores/settings';

import SettingsFieldToggle from './SettingsFieldToggle';

export default function SettingsEnableRecorderLiveAudioToggle() {
  const enabled = useSettingsStore((ctx) => ctx.user.preferMutedWhileRecording);
  const setEnabled = useSettingsStore(
    (ctx) => ctx.setPreferMutedWhileRecording,
  );

  return (
    <SettingsFieldToggle value={!enabled} onClick={() => setEnabled(!enabled)}>
      Play audio while live
    </SettingsFieldToggle>
  );
}
