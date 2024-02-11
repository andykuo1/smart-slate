import FieldToggle from '@/fields/FieldToggle';
import { useSettingsStore } from '@/stores/settings';

export default function SettingsPreferFullscreenRecorderToggle() {
  const enabled = useSettingsStore((ctx) => ctx.user.preferFullscreenRecorder);
  const setEnabled = useSettingsStore((ctx) => ctx.setPreferFullscreenRecorder);

  return (
    <FieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Fullscreen mode
    </FieldToggle>
  );
}
