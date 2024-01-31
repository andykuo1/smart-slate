import { Fragment } from 'react';

import { useSceneIds } from '@/stores/document/use';
import { useCurrentCursor } from '@/stores/user';

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
  const { sceneId } = useCurrentCursor();
  return (
    <>
      {sceneIds.map((sceneId) => (
        <Fragment key={`scene-${sceneId}`}>
          <SceneEntryLayout>
            <SceneHeader documentId={documentId} sceneId={sceneId} />
            <BlockList documentId={documentId} sceneId={sceneId} />
          </SceneEntryLayout>
        </Fragment>
      ))}
      <SceneEntryNew className="pb-20" documentId={documentId} />
      {sceneId && (
        <SceneEntryFocused>
          <SceneHeader documentId={documentId} sceneId={sceneId} />
          <BlockList documentId={documentId} sceneId={sceneId} />
        </SceneEntryFocused>
      )}
    </>
  );
}
