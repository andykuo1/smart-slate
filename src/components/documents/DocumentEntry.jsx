import { useRef } from 'react';

import {
  useDraggableContainer,
  useDraggableContainerAutoScroll,
} from '@/stores/draggable';

import SceneList from '../scenes/SceneList';
import { useShotEntryOnDragComplete } from '../shots/UseShotEntryDraggable';
import DocumentTitle from './DocumentTitle';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentEntry({ documentId }) {
  const containerRef = useRef(null);
  const onDragComplete = useShotEntryOnDragComplete(documentId);
  useDraggableContainer(onDragComplete);
  useDraggableContainerAutoScroll(containerRef);
  return (
    <article
      ref={containerRef}
      className="w-full h-full overflow-x-hidden overflow-y-auto flex flex-col">
      <DocumentTitle className="pt-20" documentId={documentId} />
      <SceneList documentId={documentId} />
    </article>
  );
}
