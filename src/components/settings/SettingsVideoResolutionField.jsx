import SettingsSelectField from './SettingsSelectField';

export default function SettingsVideoResolutionField() {
  return (
    <SettingsSelectField title="Video Resolution:" id="video-resolution">
      <option value="4K">4K</option>
      <option value="HD">HD</option>
    </SettingsSelectField>
  );
}
