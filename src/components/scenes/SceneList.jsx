import { Fragment } from 'react';

import { useSceneIds } from '@/stores/document/use';
import { useUserStore } from '@/stores/user';

import BlockList from '../blocks/BlockList';
import SceneEntryFocused from './SceneEntryFocused';
import SceneEntryLayout from './SceneEntryLayout';
import SceneEntryNew from './SceneEntryNew';
import SceneHeader from './SceneHeader';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  const activeSceneId = useUserStore((ctx) => ctx.cursor?.sceneId);
  return (
    <>
      <PerScene sceneIds={sceneIds}>
        {(sceneId) => (
          <SceneEntryLayout>
            <SceneHeader documentId={documentId} sceneId={sceneId} />
            <BlockList documentId={documentId} sceneId={sceneId} />
          </SceneEntryLayout>
        )}
      </PerScene>
      <SceneEntryNew className="pb-20" documentId={documentId} />
      {activeSceneId && (
        <SceneEntryFocused documentId={documentId}>
          <SceneHeader documentId={documentId} sceneId={activeSceneId} />
          <BlockList documentId={documentId} sceneId={activeSceneId} />
        </SceneEntryFocused>
      )}
    </>
  );
}

/**
 * @param {object} props
 * @param {Array<import('@/stores/document/DocumentStore').SceneId>} props.sceneIds
 * @param {(
 * blockId: import('@/stores/document/DocumentStore').SceneId,
 * index: number,
 * array: Array<import('@/stores/document/DocumentStore').SceneId>
 * ) => import('react').ReactNode} props.children
 */
function PerScene({ sceneIds, children }) {
  return (
    <>
      {sceneIds.map((sceneId, index, array) => (
        <Fragment key={`scene-${sceneId}`}>
          {children(sceneId, index, array)}
        </Fragment>
      ))}
    </>
  );
}
