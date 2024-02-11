import { useRef } from 'react';

import {
  useDraggableContainer,
  useDraggableContainerAutoScroll,
} from '@/stores/draggable';

import { useShotEntryOnDragComplete } from '../shots/UseShotEntryDraggable';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('react').ReactNode} props.children
 */
export default function DocumentLayout({ className, documentId, children }) {
  const containerRef = useRef(null);
  const onDragComplete = useShotEntryOnDragComplete(documentId);
  useDraggableContainer(onDragComplete);
  useDraggableContainerAutoScroll(containerRef);
  return (
    <article
      ref={containerRef}
      className={
        'mx-auto flex h-full w-full flex-col overflow-y-auto overflow-x-hidden' +
        ' ' +
        className
      }>
      {children}
    </article>
  );
}
