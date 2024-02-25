import { useCallback } from 'react';

import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @returns {[() => import('react').ReactNode, import('react').MouseEventHandler<any>]}
 */
export function useAddShot(documentId, sceneId, blockId) {
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  const render = useCallback(function _render() {
    return null;
  }, []);

  const click = useCallback(
    function _click() {
      let shot = createShot();
      addShot(documentId, sceneId, blockId, shot);
    },
    [documentId, sceneId, blockId, addShot],
  );

  return [render, click];
}
