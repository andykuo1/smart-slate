import { useRef } from 'react';

import {
  useDraggableCursor,
  useDraggableTarget,
  useIsAnyDragging,
} from '@/stores/draggable';

import ShotThumbnail from './ShotThumbnail';
import { useShotEntryOnDragUpdate } from './UseShotEntryDraggable';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function ShotEntryDragged({ documentId, sceneId }) {
  const targetRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const draggedShotId = useDraggableTarget();
  const isAnyDragging = useIsAnyDragging();
  const onDragUpdate = useShotEntryOnDragUpdate(targetRef);
  useDraggableCursor(onDragUpdate);
  return (
    <div
      className={
        'absolute left-0 top-0 z-50 flex' +
        ' ' +
        'pointer-events-none opacity-30' +
        ' ' +
        (!isAnyDragging && 'hidden')
      }
      ref={targetRef}>
      <ShotThumbnail
        documentId={documentId}
        sceneId={sceneId}
        shotId={draggedShotId}
        editable={false}
      />
    </div>
  );
}
