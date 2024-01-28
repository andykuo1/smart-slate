import AddToDriveIcon from '@material-symbols/svg-400/rounded/add_to_drive.svg';

import { useGoogleStatus } from '@/libs/googleapi/auth/UseGoogleStatus';
import { useSettingsStore } from '@/stores/settings';

import SettingsFieldToggle from './SettingsFieldToggle';

export default function SettingsEnableGoogleDriveSyncToggle() {
  const enabled = useSettingsStore((ctx) => ctx.user.enableDriveSync);
  const setEnabled = useSettingsStore((ctx) => ctx.setEnableDriveSync);
  const googleStatus = useGoogleStatus();

  return (
    <SettingsFieldToggle
      className={'flex flex-row fill-current'}
      value={enabled}
      onClick={() => setEnabled(!enabled)}
      disabled={!googleStatus}>
      <span>Enable</span>
      <AddToDriveIcon className="inline-block w-6 h-6 fill-current mx-1" />
      <span>video sync</span>
    </SettingsFieldToggle>
  );
}
