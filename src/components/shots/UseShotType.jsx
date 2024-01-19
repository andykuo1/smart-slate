import { useCallback } from 'react';

import { useSetShotType, useShotType } from '@/stores/document';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @returns {[string, import('react').ChangeEventHandler<any>]}
 */
export function useShotTypeChange(documentId, shotId) {
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType();

  const onShotTypeChange = useCallback(
    /** @type {import('react').ChangeEventHandler<any>} */
    function _onShotTypeChange(e) {
      const target = /** @type {{ value: string }} */ (
        /** @type {unknown} */ (e.target)
      );
      const value = target.value;
      setShotType(documentId, shotId, value);
    },
    [documentId, shotId, setShotType],
  );

  return [shotType, onShotTypeChange];
}
