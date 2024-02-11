import FieldSelect from '@/fields/FieldSelect';

export default function SettingsVideoResolutionField() {
  return (
    <FieldSelect title="Video Resolution:" id="video-resolution">
      <option value="4K">4K</option>
      <option value="HD">HD</option>
    </FieldSelect>
  );
}
