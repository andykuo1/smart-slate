import { Fragment, useRef } from 'react';

import { useSceneIds } from '@/stores/document';
import {
  useDraggableContainer,
  useDraggableContainerAutoScroll,
} from '@/stores/draggable';
import { useCurrentCursor } from '@/stores/user';

import DocumentTitle from '../documents/DocumentTitle';
import { useShotEntryOnDragComplete } from '../shots/UseShotEntryDraggable';
import SceneEntry from './SceneEntry';
import SceneEntryNew from './SceneEntryNew';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const containerRef = useRef(null);
  const sceneIds = useSceneIds(documentId);
  const onDragComplete = useShotEntryOnDragComplete(documentId);
  useDraggableContainer(onDragComplete);
  useDraggableContainerAutoScroll(containerRef);

  const userCursor = useCurrentCursor();
  const activeSceneId = userCursor.sceneId;
  const hasActiveScene = Boolean(activeSceneId);

  return (
    <article
      className="w-full h-full overflow-x-hidden overflow-y-auto flex flex-col"
      ref={containerRef}>
      <DocumentTitle
        className={'pt-20' + ' ' + (!hasActiveScene ? 'visible' : 'invisible')}
        documentId={documentId}
      />
      {sceneIds.map((sceneId) => (
        <Fragment key={`scene-${sceneId}`}>
          <SceneEntry
            className={
              hasActiveScene && activeSceneId !== sceneId
                ? 'invisible'
                : 'visible'
            }
            documentId={documentId}
            sceneId={sceneId}
          />
        </Fragment>
      ))}
      <SceneEntryNew className="pb-20" documentId={documentId} />
    </article>
  );
}
