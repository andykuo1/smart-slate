import { useSettingsStore } from '@/stores/settings';

import SettingsFieldToggle from './SettingsFieldToggle';

export default function SettingsEnableRecorderReferenceToggle() {
  const enabled = useSettingsStore(
    (ctx) => ctx.user.enableThumbnailWhileRecording,
  );
  const setEnabled = useSettingsStore(
    (ctx) => ctx.setEnableThumbnailWhileRecording,
  );

  return (
    <SettingsFieldToggle value={enabled} onClick={() => setEnabled(!enabled)}>
      Show reference image
    </SettingsFieldToggle>
  );
}
