import ProjectSettingsDrawer from './ProjectSettingsDrawer';

export default function SettingsDrawer() {
  return (
    <fieldset className="px-4 flex flex-col gap-2">
      <legend className="py-4">
        <h3 className="text-xl">Configure your project</h3>
        <p className="text-xs opacity-30">
          Change to whatever floats your boat :)
        </p>
      </legend>
      <ProjectSettingsDrawer />
    </fieldset>
  );
}