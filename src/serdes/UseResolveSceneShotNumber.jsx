import { useCallback } from 'react';

import { formatSceneShotNumber } from '@/components/takes/TakeNameFormat';
import { useDocumentStore } from '@/stores/document/use';

import { useResolveSceneNumber } from './UseResolveSceneNumber';
import { useResolveShotNumber } from './UseResolveShotNumber';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
export function useSceneShotNumber(documentId, sceneId, shotId) {
  const resolve = useResolveSceneShotNumber();
  return useDocumentStore((ctx) => resolve(documentId, sceneId, shotId, true));
}

export function useResolveSceneShotNumber() {
  const resolveShotNumber = useResolveShotNumber();
  const resolveSceneNumber = useResolveSceneNumber();
  const resolveSceneShotNumber = useCallback(
    /**
     * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
     * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
     * @param {import('@/stores/document/DocumentStore').ShotId} [shotId]
     * @param {boolean} [readonly]
     */
    function _resolveSceneShotNumber(
      documentId,
      sceneId,
      shotId,
      readonly = false,
    ) {
      const sceneNumber = resolveSceneNumber(documentId, sceneId, readonly);
      const shotNumber = resolveShotNumber(
        documentId,
        sceneId,
        shotId,
        readonly,
      );
      return formatSceneShotNumber(sceneNumber, shotNumber, true);
    },
    [resolveSceneNumber, resolveShotNumber],
  );
  return resolveSceneShotNumber;
}
