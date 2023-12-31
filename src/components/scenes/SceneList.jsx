import { useRef } from 'react';

import { useSceneIds } from '@/stores/document';
import { useDraggableContainerAutoScroll } from '@/stores/draggable';

import DocumentTitle from '../shotlist/DocumentTitle';
import NewSceneEntry from './NewSceneEntry';
import SceneEntry from './SceneEntry';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const containerRef = useRef(null);
  const sceneIds = useSceneIds(documentId);
  useDraggableContainerAutoScroll(containerRef);
  return (
    <article
      className="w-full h-full overflow-x-hidden overflow-y-auto py-20"
      ref={containerRef}>
      <DocumentTitle documentId={documentId} />
      {sceneIds.map((sceneId) => (
        <SceneEntry key={sceneId} documentId={documentId} sceneId={sceneId} />
      ))}
      <NewSceneEntry documentId={documentId} />
    </article>
  );
}
