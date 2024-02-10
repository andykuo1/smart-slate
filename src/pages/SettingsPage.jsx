import { useNavigate } from 'react-router-dom';

import QRCode2Icon from '@material-symbols/svg-400/rounded/qr_code_2.svg';

import NavBar from '@/app/NavBar';
import SettingsAspectRatioField from '@/components/settings/SettingsAspectRatioField';
import SettingsAutoSaveLastTimeField from '@/components/settings/SettingsAutoSaveLastTimeField';
import SettingsAutoSaveToField from '@/components/settings/SettingsAutoSaveToField';
import SettingsCameraNameField from '@/components/settings/SettingsCameraNameField';
import SettingsDirectorNameField from '@/components/settings/SettingsDirectorNameField';
import SettingsEnableGoogleDriveSyncToggle from '@/components/settings/SettingsEnableGoogleDriveSyncToggle';
import SettingsEnableRecorderLiveAudioToggle from '@/components/settings/SettingsEnableRecorderLiveAudioToggle';
import SettingsEnableRecorderReferenceToggle from '@/components/settings/SettingsEnableRecorderReferenceToggle';
import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import SettingsFieldGroupDiscloseable from '@/components/settings/SettingsFieldGroupDiscloseable';
import SettingsNerdInfoButton from '@/components/settings/SettingsNerdInfoButton';
import SettingsPreferFullscreenRecorderToggle from '@/components/settings/SettingsPreferFullscreenRecorderToggle';
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

import PageLayout from './PageLayout';

export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    <PageLayout className="bg-white text-black">
      <NavBar>
        <fieldset className="mx-auto flex flex-col gap-2">
          <legend className="py-4">
            <h3 className="text-xl">Configure your project</h3>
            <p className="text-xs opacity-30">
              Change to whatever floats your boat :)
            </p>
          </legend>
          <div className="flex flex-col gap-2">
            <SettingsProjectInstallField />
            <SettingsFieldButton
              Icon={QRCode2Icon}
              onClick={() => navigate('/scan')}>
              Have QR codes?
            </SettingsFieldButton>
            <br />
            <SettingsFieldGroupDiscloseable title="Project Settings">
              <SettingsProjectNameField />
              <SettingsProjectIdField />
            </SettingsFieldGroupDiscloseable>
            <br />
            <SettingsFieldGroupDiscloseable title="Credit Settings">
              <SettingsDirectorNameField />
              <SettingsCameraNameField />
            </SettingsFieldGroupDiscloseable>
            <br />
            <SettingsFieldGroupDiscloseable title="Data Settings">
              <GoogleConnectButton />
              <div className="h-0" />
              <SettingsAutoSaveToField />
              <SettingsAutoSaveLastTimeField />
              <div className="h-0" />
              <SettingsEnableGoogleDriveSyncToggle />
              <SettingsShareFilesButton />
              <SettingsProjectExportZIPButton />
              <SettingsProjectExportJSONButton />
            </SettingsFieldGroupDiscloseable>
            <br />
            <SettingsFieldGroupDiscloseable title="Rec & Slate Settings">
              <SettingsAspectRatioField />
              <SettingsVideoResolutionField />
              <div className="h-0" />
              <SettingsEnableRecorderReferenceToggle />
              <div className="h-0" />
              <SettingsPreferFullscreenRecorderToggle />
              <SettingsPreferNativeRecorderToggle />
              <SettingsPreferPersistedMediaStreamToggle />
              <SettingsEnableRecorderLiveAudioToggle />
              <div className="h-0" />
              <SettingsNerdInfoButton />
            </SettingsFieldGroupDiscloseable>
            <br />
            <SettingsFieldGroupDiscloseable title="Dangerous Stuff">
              <SettingsVideoCacheClearButton />
              <SettingsProjectDeleteButton />
            </SettingsFieldGroupDiscloseable>
            <br />
          </div>
        </fieldset>
      </NavBar>
    </PageLayout>
  );
}
