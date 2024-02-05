import { useState } from 'react';
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
import SettingsProjectStartButton from '@/components/settings/SettingsProjectStartButton';
import SettingsReturnHomeField from '@/components/settings/SettingsReturnHomeField';
import SettingsShareFilesButton from '@/components/settings/SettingsShareFilesButton';
import SettingsVideoCacheClearButton from '@/components/settings/SettingsVideoCacheClearButton';
import SettingsVideoResolutionField from '@/components/settings/SettingsVideoResolutionField';
import SettingsDocumentNavButton from '@/drawer/SettingsDocumentNavButton';
import DrawerButton from '@/drawer/layout/DrawerButton';
import DrawerToolbarLayout from '@/drawer/layout/DrawerToolbarLayout';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';

import PageLayout from './PageLayout';

export default function SettingsPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <PageLayout className="overflow-y-auto bg-white">
      <fieldset className="mx-auto flex flex-col gap-2">
        <legend className="py-4">
          <h3 className="text-xl">Configure your project</h3>
          <p className="text-xs opacity-30">
            Change to whatever floats your boat :)
          </p>
        </legend>
        <SettingsProjectNameField />
        <SettingsProjectIdField />
        <SettingsAutoSaveToField />
        <SettingsAutoSaveLastTimeField />
        <br />
        <SettingsProjectStartButton />
        <SettingsReturnHomeField />
        <SettingsProjectInstallField />
        <br />
        <SettingsFieldGroupDiscloseable title="More Settings">
          <GoogleConnectButton />
          <SettingsFieldButton
            Icon={QRCode2Icon}
            onClick={() => navigate('/scan')}>
            Have QR codes?
          </SettingsFieldButton>
          <br />
          <SettingsFieldGroupDiscloseable title="Data Settings">
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
        </SettingsFieldGroupDiscloseable>
      </fieldset>
      <DrawerToolbarLayout open={open} toolbar={<SettingsDocumentNavButton />}>
        <DrawerButton
          inverted={false}
          onClick={() => setOpen((prev) => !prev)}
        />
      </DrawerToolbarLayout>
    </PageLayout>
  );
}
