import { useCallback, useRef } from 'react';

import { useDraggableCursor, useDraggableTarget } from '@/libs/draggable';

import ShotThumbnail from './ShotThumbnail';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotEntryDragged({ documentId, sceneId, blockId }) {
  const targetRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const draggedShotId = useDraggableTarget();
  /** @type {import('@/libs/draggable').OnDragUpdateCallback} */
  const onDragUpdate = useCallback(function _onDragUpdate(
    targetId,
    overId,
    x,
    y,
  ) {
    let target = targetRef.current;
    if (!target) {
      return;
    }
    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
    target.style.translate = '-25% -50%';
  }, []);
  useDraggableCursor(onDragUpdate);
  return (
    <div
      className={
        'absolute top-0 left-0 z-50 flex' +
        ' ' +
        'pointer-events-none opacity-30' +
        ' ' +
        (!draggedShotId && 'hidden')
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
