import NavBarLayout from '@/components/NavBarLayout';
import SettingsAspectRatioField from '@/components/settings/SettingsAspectRatioField';
import SettingsAutoSaveToField from '@/components/settings/SettingsAutoSaveToField';
import SettingsProjectIdField from '@/components/settings/SettingsProjectIdField';
import SettingsProjectNameField from '@/components/settings/SettingsProjectNameField';
import SettingsReturnHomeField from '@/components/settings/SettingsReturnHomeField';
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
        </fieldset>
      </NavBarLayout>
    </main>
  );
}
