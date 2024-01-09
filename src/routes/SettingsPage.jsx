import NavBarLayout from '@/components/NavBarLayout';
import SettingsAspectRatioField from '@/components/settings/SettingsAspectRatioField';
import SettingsAutoSaveToField from '@/components/settings/SettingsAutoSaveToField';
import SettingsEnableGoogleDriveSyncToggle from '@/components/settings/SettingsEnableGoogleDriveSyncToggle';
import SettingsEnableRecorderLiveAudioToggle from '@/components/settings/SettingsEnableRecorderLiveAudioToggle';
import SettingsEnableRecorderReferenceToggle from '@/components/settings/SettingsEnableRecorderReferenceToggle';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import SettingsNerdInfoButton from '@/components/settings/SettingsNerdInfoButton';
import SettingsPreferNativeRecorderToggle from '@/components/settings/SettingsPreferNativeRecorderToggle';
import SettingsPreferPersistedMediaStreamToggle from '@/components/settings/SettingsPreferPersistedMediaStreamToggle';
import SettingsProjectDeleteButton from '@/components/settings/SettingsProjectDeleteButton';
import SettingsProjectIdField from '@/components/settings/SettingsProjectIdField';
import SettingsProjectNameField from '@/components/settings/SettingsProjectNameField';
import SettingsReturnHomeField from '@/components/settings/SettingsReturnHomeField';
import SettingsShareFilesButton from '@/components/settings/SettingsShareFilesButton';
import SettingsVideoCacheClearButton from '@/components/settings/SettingsVideoCacheClearButton';
import SettingsVideoResolutionField from '@/components/settings/SettingsVideoResolutionField';

export default function SettingsPage() {
  return (
    <main className="w-full h-full flex flex-col">
      <NavBarLayout>
        <fieldset className="flex-1">
          <legend className="py-4">
            <h3 className="text-xl">Configure your project</h3>
            <p className="text-xs opacity-30">
              Change to whatever floats your boat :)
            </p>
          </legend>
          <br />
          <SettingsProjectNameField />
          <SettingsProjectIdField />
          <br />
          <SettingsAspectRatioField />
          <SettingsVideoResolutionField />
          <br />
          <SettingsAutoSaveToField />
          <br />
          <SettingsReturnHomeField />
          <br />
          <SettingsFieldGroup title="Data Settings">
            <SettingsEnableGoogleDriveSyncToggle />
            <SettingsShareFilesButton />
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
          <SettingsFieldGroup title="Dangerous Stuff">
            <SettingsVideoCacheClearButton />
            <SettingsProjectDeleteButton />
          </SettingsFieldGroup>
          <br />
        </fieldset>
      </NavBarLayout>
    </main>
  );
}
