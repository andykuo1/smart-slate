import { useRef } from 'react';

import {
  useDraggableContainer,
  useDraggableContainerAutoScroll,
} from '@/stores/draggable';
import { useUserStore } from '@/stores/user';

import { useShotEntryOnDragComplete } from '../shots/UseShotEntryDraggable';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('react').ReactNode} props.children
 */
export default function DocumentLayout({ documentId, children }) {
  const containerRef = useRef(null);
  const onDragComplete = useShotEntryOnDragComplete(documentId);
  useDraggableContainer(onDragComplete);
  useDraggableContainerAutoScroll(containerRef);
  const inlineMode = useUserStore((ctx) => ctx.editMode === 'inline');
  return (
    <article
      ref={containerRef}
      className={
        'w-full h-full mx-auto overflow-x-hidden overflow-y-auto flex flex-col' +
        ' ' +
        (inlineMode ? 'md:w-[50%]' : '')
      }>
      {children}
    </article>
  );
}
