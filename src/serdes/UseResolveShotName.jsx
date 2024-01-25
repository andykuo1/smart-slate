import { useCallback } from 'react';

import { formatShotNameByNumber } from '@/components/takes/TakeNameFormat';
import { getShotById } from '@/stores/document';
import { findShotNumber, getSceneNumber } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';

export function useResolveShotName() {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setShotName = useDocumentStore((ctx) => ctx.setShotName);
  const resolveShotName = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} shotId
     * @param {boolean} readonly
     * @param {object} [opts]
     * @param {boolean} [opts.undecorated]
     */
    function _resolveShotName(
      documentId,
      sceneId,
      shotId,
      readonly,
      opts = {},
    ) {
      const store = UNSAFE_getStore();
      const shot = getShotById(store, documentId, shotId);
      let result = shot?.shotName;
      if (result) {
        return result;
      }
      let sceneNumber = getSceneNumber(store, documentId, sceneId);
      let shotNumber = findShotNumber(store, documentId, sceneId, shotId);
      result = formatShotNameByNumber(sceneNumber, shotNumber, true);
      if (!readonly && shotId) {
        setShotName(documentId, shotId, result);
        return result;
      }

      // NOTE: Since this is a temporary name string, give it some "()" for decoration :)
      if (!opts?.undecorated) {
        return `(${result})`;
      }
      return result;
    },
    [UNSAFE_getStore, setShotName],
  );
  return resolveShotName;
}
