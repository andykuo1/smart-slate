import { useNavigate } from 'react-router-dom';

import QRCode2Icon from '@material-symbols/svg-400/rounded/qr_code_2.svg';

import SettingsAspectRatioField from '@/components/settings/SettingsAspectRatioField';
import SettingsAutoSaveLastTimeField from '@/components/settings/SettingsAutoSaveLastTimeField';
import SettingsAutoSaveToField from '@/components/settings/SettingsAutoSaveToField';
import SettingsCameraNameField from '@/components/settings/SettingsCameraNameField';
import SettingsDirectorNameField from '@/components/settings/SettingsDirectorNameField';
import SettingsEnableGoogleDriveSyncToggle from '@/components/settings/SettingsEnableGoogleDriveSyncToggle';
import SettingsEnableRecorderLiveAudioToggle from '@/components/settings/SettingsEnableRecorderLiveAudioToggle';
import SettingsEnableRecorderReferenceToggle from '@/components/settings/SettingsEnableRecorderReferenceToggle';
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
import SettingsReturnHomeField from '@/components/settings/SettingsReturnHomeField';
import SettingsShareFilesButton from '@/components/settings/SettingsShareFilesButton';
import SettingsVideoCacheClearButton from '@/components/settings/SettingsVideoCacheClearButton';
import SettingsVideoResolutionField from '@/components/settings/SettingsVideoResolutionField';
import FieldButton from '@/fields/FieldButton';
import FieldGroupDiscloseable from '@/fields/FieldGroupDiscloseable';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';
import NavBar from '@/navbar/NavBar';

import PageLayout from './PageLayout';

export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    <PageLayout className="bg-white text-black dark:bg-slate-900 dark:text-white">
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
            <FieldButton Icon={QRCode2Icon} onClick={() => navigate('/scan')}>
              Have QR codes?
            </FieldButton>
            <SettingsReturnHomeField />
            <br />
            <FieldGroupDiscloseable title="Project Settings">
              <SettingsProjectNameField />
              <SettingsProjectIdField />
            </FieldGroupDiscloseable>
            <br />
            <FieldGroupDiscloseable title="Credit Settings">
              <SettingsDirectorNameField />
              <SettingsCameraNameField />
            </FieldGroupDiscloseable>
            <br />
            <FieldGroupDiscloseable title="Data Settings">
              <GoogleConnectButton />
              <div className="h-0" />
              <SettingsAutoSaveToField />
              <SettingsAutoSaveLastTimeField />
              <div className="h-0" />
              <SettingsEnableGoogleDriveSyncToggle />
              <SettingsShareFilesButton />
              <SettingsProjectExportZIPButton />
              <SettingsProjectExportJSONButton />
            </FieldGroupDiscloseable>
            <br />
            <FieldGroupDiscloseable title="Rec & Slate Settings">
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
            </FieldGroupDiscloseable>
            <br />
            <FieldGroupDiscloseable title="Dangerous Stuff">
              <SettingsVideoCacheClearButton />
              <SettingsProjectDeleteButton />
            </FieldGroupDiscloseable>
            <br />
          </div>
        </fieldset>
      </NavBar>
    </PageLayout>
  );
}
