import SettingsSelectField from './SettingsSelectField';

export default function SettingsAutoSaveToField() {
  return (
    <SettingsSelectField title="Auto-save to:" id="save-to">
      <option value="local">
        {'<'}This local device{'>'}
      </option>
      <option value="gdrive">Google Drive</option>
    </SettingsSelectField>
  );
}
