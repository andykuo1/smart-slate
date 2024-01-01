import { Fragment, useRef } from 'react';

import { useSceneIds } from '@/stores/document';
import { useDraggableContainerAutoScroll } from '@/stores/draggable';
import { useCurrentCursor } from '@/stores/user';

import DocumentTitle from '../documents/DocumentTitle';
import SceneEntry from './SceneEntry';
import SceneEntryNew from './SceneEntryNew';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const containerRef = useRef(null);
  const sceneIds = useSceneIds(documentId);
  useDraggableContainerAutoScroll(containerRef);

  const userCursor = useCurrentCursor();
  const activeSceneId = userCursor.sceneId;
  const hasActiveScene = Boolean(activeSceneId);

  return (
    <article
      className="w-full h-full overflow-x-hidden overflow-y-auto py-20"
      ref={containerRef}>
      <DocumentTitle documentId={documentId} />
      {sceneIds.map(
        (sceneId) =>
          (!hasActiveScene || sceneId === activeSceneId) && (
            <Fragment key={`scene-${sceneId}`}>
              <SceneEntry
                key={sceneId}
                documentId={documentId}
                sceneId={sceneId}
              />
            </Fragment>
          ),
      )}
      <SceneEntryNew documentId={documentId} />
    </article>
  );
}
