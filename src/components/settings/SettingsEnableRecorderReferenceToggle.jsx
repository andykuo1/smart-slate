import FieldToggle from '@/fields/FieldToggle';
import { useSettingsStore } from '@/stores/settings';

export default function SettingsEnableRecorderReferenceToggle() {
  const enabled = useSettingsStore(
    (ctx) => ctx.user.enableThumbnailWhileRecording,
  );
  const setEnabled = useSettingsStore(
    (ctx) => ctx.setEnableThumbnailWhileRecording,
  );

  return (
    <FieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Show reference image
    </FieldToggle>
  );
}
