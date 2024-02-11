import FieldToggle from '@/fields/FieldToggle';
import { useSettingsStore } from '@/stores/settings';

export default function SettingsPreferNativeRecorderToggle() {
  const enabled = useSettingsStore((ctx) => ctx.user.preferNativeRecorder);
  const setEnabled = useSettingsStore((ctx) => ctx.setPreferNativeRecorder);

  return (
    <FieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Force native-only
    </FieldToggle>
  );
}
