import SettingsFieldSelect from '@/components/settings/SettingsFieldSelect';

import { useShotTypeChange } from '../UseShotType';

const SHOT_TYPES = ['WS', 'MS', 'CU', '--'];

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function SettingsShotTypeSelector({
  className,
  documentId,
  shotId,
}) {
  const [shotType, onShotTypeChange] = useShotTypeChange(documentId, shotId);

  return (
    <SettingsFieldSelect
      className={'flex flex-row' + ' ' + className}
      title=""
      id="shot-type"
      value={shotType}
      onChange={onShotTypeChange}>
      {SHOT_TYPES.map((shotType) => (
        <option
          key={shotType}
          title={shotType}
          value={shotType === '--' ? '' : shotType}>
          {shotType}
        </option>
      ))}
    </SettingsFieldSelect>
  );
}
