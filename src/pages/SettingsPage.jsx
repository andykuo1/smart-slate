import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { useNavigate } from 'react-router-dom';

import ExpandMoreIcon from '@material-symbols/svg-400/rounded/expand_more.svg';
import QRCode2Icon from '@material-symbols/svg-400/rounded/qr_code_2.svg';

import NavBarLayout from '@/app/NavBarLayout';
import SettingsAspectRatioField from '@/components/settings/SettingsAspectRatioField';
import SettingsAutoSaveToField from '@/components/settings/SettingsAutoSaveToField';
import SettingsEnableGoogleDriveSyncToggle from '@/components/settings/SettingsEnableGoogleDriveSyncToggle';
import SettingsEnableRecorderLiveAudioToggle from '@/components/settings/SettingsEnableRecorderLiveAudioToggle';
import SettingsEnableRecorderReferenceToggle from '@/components/settings/SettingsEnableRecorderReferenceToggle';
import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
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

import PageLayout from './PageLayout';

export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <NavBarLayout>
        <fieldset className="flex-1">
          <legend className="py-4">
            <h3 className="text-xl">Configure your project</h3>
            <p className="text-xs opacity-30">
              Change to whatever floats your boat :)
            </p>
          </legend>
          <SettingsProjectNameField />
          <SettingsProjectIdField />
          <SettingsAutoSaveToField />
          <SettingsProjectInstallField />
          <SettingsProjectStartButton />
          <SettingsReturnHomeField />
          <fieldset>
            <legend className="w-full py-4">
              <h4 className="text-center border-b-2 border-black">
                More Settings
              </h4>
            </legend>
            <SettingsAspectRatioField />
            <SettingsVideoResolutionField />
            <br />
            <SettingsFieldGroup title="Data Settings">
              <SettingsEnableGoogleDriveSyncToggle />
              <SettingsShareFilesButton />
              <SettingsProjectExportZIPButton />
              <SettingsProjectExportJSONButton />
              <SettingsFieldButton
                Icon={QRCode2Icon}
                onClick={() => navigate('/scan')}>
                Have QR codes?
              </SettingsFieldButton>
            </SettingsFieldGroup>
            <br />
            <SettingsFieldGroup title="Recorder Settings">
              <SettingsPreferNativeRecorderToggle />
              <SettingsPreferPersistedMediaStreamToggle />
              <SettingsEnableRecorderReferenceToggle />
              <SettingsEnableRecorderLiveAudioToggle />
            </SettingsFieldGroup>
            <br />
            <SettingsNerdInfoButton />
            <br />
          </fieldset>
          <DisclosureProvider>
            <Disclosure className="w-full flex items-center border-b-2 border-black">
              <span className="flex-1">Dangerous Stuff</span>
              <ExpandMoreIcon className="w-6 h-6 fill-current" />
            </Disclosure>
            <DisclosureContent className="py-4">
              <SettingsVideoCacheClearButton />
              <SettingsProjectDeleteButton />
            </DisclosureContent>
          </DisclosureProvider>
          <br />
        </fieldset>
      </NavBarLayout>
    </PageLayout>
  );
}
