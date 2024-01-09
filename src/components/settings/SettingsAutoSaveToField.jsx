import SettingsFieldSelect from './SettingsFieldSelect';

export default function SettingsAutoSaveToField() {
  return (
    <SettingsFieldSelect title="Auto-save to:" id="save-to">
      <option value="local">
        {'<'}This local device{'>'}
      </option>
      <option value="gdrive">Google Drive</option>
    </SettingsFieldSelect>
  );
}
