import SettingsFieldSelect from './SettingsFieldSelect';

export default function SettingsVideoResolutionField() {
  return (
    <SettingsFieldSelect title="Video Resolution:" id="video-resolution">
      <option value="4K">4K</option>
      <option value="HD">HD</option>
    </SettingsFieldSelect>
  );
}
