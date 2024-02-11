import FieldSelect from '@/fields/FieldSelect';

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

  const selectId = 'shotType-' + shotId;
  return (
    <FieldSelect
      className={'flex flex-row' + ' ' + className}
      title=""
      id={selectId}
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
    </FieldSelect>
  );
}
