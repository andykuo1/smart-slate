import FieldToggle from '@/fields/FieldToggle';
import { useSettingsStore } from '@/stores/settings';

export default function SettingsPreferNativeRecorderToggle() {
  const enabled = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const setEnabled = useSettingsStore(
    (ctx) => ctx.setPreferPersistedMediaStream,
  );

  return (
    <FieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Force always-on stream
    </FieldToggle>
  );
}
