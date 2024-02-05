import { useNavigate } from 'react-router-dom';

import QRCode2Icon from '@material-symbols/svg-400/rounded/qr_code_2.svg';

import SettingsAspectRatioField from '@/components/settings/SettingsAspectRatioField';
import SettingsAutoSaveLastTimeField from '@/components/settings/SettingsAutoSaveLastTimeField';
import SettingsAutoSaveToField from '@/components/settings/SettingsAutoSaveToField';
import SettingsEnableGoogleDriveSyncToggle from '@/components/settings/SettingsEnableGoogleDriveSyncToggle';
import SettingsEnableRecorderLiveAudioToggle from '@/components/settings/SettingsEnableRecorderLiveAudioToggle';
import SettingsEnableRecorderReferenceToggle from '@/components/settings/SettingsEnableRecorderReferenceToggle';
import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import SettingsFieldGroupDiscloseable from '@/components/settings/SettingsFieldGroupDiscloseable';
import SettingsNerdInfoButton from '@/components/settings/SettingsNerdInfoButton';
import SettingsPreferNativeRecorderToggle from '@/components/settings/SettingsPreferNativeRecorderToggle';
import SettingsPreferPersistedMediaStreamToggle from '@/components/settings/SettingsPreferPersistedMediaStreamToggle';
import SettingsProjectDeleteButton from '@/components/settings/SettingsProjectDeleteButton';
import SettingsProjectExportJSONButton from '@/components/settings/SettingsProjectExportJSONButton';
import SettingsProjectExportZIPButton from '@/components/settings/SettingsProjectExportZIPButton';
import SettingsProjectIdField from '@/components/settings/SettingsProjectIdField';
import SettingsProjectInstallField from '@/components/settings/SettingsProjectInstallField';
import SettingsProjectNameField from '@/components/settings/SettingsProjectNameField';
import SettingsShareFilesButton from '@/components/settings/SettingsShareFilesButton';
import SettingsVideoCacheClearButton from '@/components/settings/SettingsVideoCacheClearButton';
import SettingsVideoResolutionField from '@/components/settings/SettingsVideoResolutionField';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';

export default function ProjectSettingsDrawer() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2">
      <SettingsProjectNameField />
      <SettingsProjectIdField />
      <SettingsAutoSaveToField />
      <SettingsAutoSaveLastTimeField />
      <SettingsProjectInstallField />
      <SettingsFieldButton Icon={QRCode2Icon} onClick={() => navigate('/scan')}>
        Have QR codes?
      </SettingsFieldButton>
      <br />
      <SettingsFieldGroupDiscloseable title="Data Settings">
        <GoogleConnectButton />
        <div className="h-0" />
        <SettingsEnableGoogleDriveSyncToggle />
        <SettingsShareFilesButton />
        <SettingsProjectExportZIPButton />
        <SettingsProjectExportJSONButton />
      </SettingsFieldGroupDiscloseable>
      <SettingsFieldGroupDiscloseable title="Rec & Slate Settings">
        <SettingsAspectRatioField />
        <SettingsVideoResolutionField />
        <div className="h-0" />
        <SettingsEnableRecorderReferenceToggle />
        <div className="h-0" />
        <SettingsPreferNativeRecorderToggle />
        <SettingsPreferPersistedMediaStreamToggle />
        <SettingsEnableRecorderLiveAudioToggle />
        <div className="h-0" />
        <SettingsNerdInfoButton />
      </SettingsFieldGroupDiscloseable>
      <SettingsFieldGroupDiscloseable title="Dangerous Stuff">
        <SettingsVideoCacheClearButton />
        <SettingsProjectDeleteButton />
      </SettingsFieldGroupDiscloseable>
    </div>
  );
}
