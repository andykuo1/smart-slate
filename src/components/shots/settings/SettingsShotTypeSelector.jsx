import { useRef } from 'react';

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
  const selectRef = useRef(/** @type {HTMLSelectElement|null} */ (null));

  const [shotType, onShotTypeChange] = useShotTypeChange(documentId, shotId);

  return (
    <select
      ref={selectRef}
      className={'text-center bg-transparent rounded py-1' + ' ' + className}
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
    </select>
  );
}
