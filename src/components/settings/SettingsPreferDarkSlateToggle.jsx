import FieldToggle from '@/fields/FieldToggle';
import { useSettingsStore } from '@/stores/settings';

export default function SettingsPreferFullscreenRecorderToggle() {
  const enabled = useSettingsStore((ctx) => ctx.user.preferDarkSlate);
  const setEnabled = useSettingsStore((ctx) => ctx.setPreferDarkSlate);

  return (
    <FieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Blackboard slate
    </FieldToggle>
  );
}
