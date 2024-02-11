import FieldToggle from '@/fields/FieldToggle';
import { useSettingsStore } from '@/stores/settings';

export default function SettingsEnableRecorderLiveAudioToggle() {
  const enabled = useSettingsStore((ctx) => ctx.user.preferMutedWhileRecording);
  const setEnabled = useSettingsStore(
    (ctx) => ctx.setPreferMutedWhileRecording,
  );

  return (
    <FieldToggle value={!enabled} onClick={() => setEnabled(!enabled)}>
      Play audio while live
    </FieldToggle>
  );
}
