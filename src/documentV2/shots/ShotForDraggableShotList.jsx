import { useCallback, useEffect, useRef } from 'react';

import { isBlockInSameScene } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useIsDragging, useIsDraggingOver } from '@/stores/draggable';
import {
  findDraggableElementById,
  useAsDraggableElement,
  useIsDraggingPotentially,
  useUNSAFE_getDraggableStore,
} from '@/stores/draggableV3';
import { useSetUserCursor, useUserStore } from '@/stores/user';

import { NEW_ELEMENT_ID } from '../ShotListParts';
import { Shot } from './parts/ShotParts';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} props.details
 * @param {'horizontal'|'vertical'} props.direction
 */
export default function ShotForDraggableShotList({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  details,
  direction,
}) {
  const isActive = useUserStore((ctx) => ctx?.cursor?.shotId === shotId);
  const { elementRef, handleRef, handleClassName } = useShotDraggableHandler(
    documentId,
    sceneId,
    blockId,
    shotId,
    direction,
  );

  const setShotEditorShotId = useUserStore((ctx) => ctx.setShotEditorShotId);
  const setUserCursor = useSetUserCursor();

  const onClick = useCallback(
    function _onClick() {
      if (isActive) {
        setShotEditorShotId(shotId);
      } else {
        setUserCursor(documentId, sceneId, shotId, '');
      }
    },
    [isActive, documentId, sceneId, shotId, setUserCursor, setShotEditorShotId],
  );

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) {
      return;
    }
    handle.addEventListener('click', onClick);
    return () => {
      handle.removeEventListener('click', onClick);
    };
  }, [handleRef, onClick]);

  return (
    <Shot
      className={
        // NOTE: To disable default touch behavior
        'touch-none' + ' ' + className
      }
      handleClassName={handleClassName}
      containerRef={elementRef}
      handleRef={handleRef}
      documentId={documentId}
      sceneId={sceneId}
      shotId={shotId}
      type={details ? 'line' : 'block'}
      active={isActive}
      editable={true}
    />
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 * @param {'horizontal'|'vertical'} direction
 */
function useShotDraggableHandler(
  documentId,
  sceneId,
  blockId,
  shotId,
  direction,
) {
  const elementRef = useRef(/** @type {HTMLLIElement|null} */ (null));
  const handleRef = useRef(/** @type {HTMLDivElement|null} */ (null));

  const UNSAFE_getDocumentStore = useDocumentStore(
    (ctx) => ctx.UNSAFE_getStore,
  );
  const UNSAFE_getDraggableStore = useUNSAFE_getDraggableStore();

  const isCursorTypeMoveable = useUserStore(
    (ctx) => ctx.editor?.documentEditor?.cursorType === 'edit',
  );
  const moveShot = useDocumentStore((ctx) => ctx.moveShot);
  const onDraggableComplete = useCallback(
    /** @type {import('@/stores/draggableV3/Store').DraggableCompleteCallback} */
    function _onDraggableComplete(
      containerId,
      elementId,
      overContainerId,
      overElementId,
      clientX,
      clientY,
    ) {
      const thisElement = elementRef.current;
      if (!thisElement) {
        return;
      }
      const overElement = findDraggableElementById(overElementId);
      if (!overElement) {
        return;
      }
      // NOTE: Specifically for dragging over the NEW button...
      if (overElementId === NEW_ELEMENT_ID) {
        // ...have it output to the end.
        overElementId = '';
      }
      const overRect = overElement.getBoundingClientRect();
      // Figure out if it is BEFORE or AFTER insert order.
      const before =
        direction === 'vertical'
          ? clientY <= overRect.y + overRect.height / 2
          : clientX <= overRect.x + overRect.width / 2;
      moveShot(
        documentId,
        containerId,
        elementId,
        overContainerId,
        overElementId,
        before,
      );
    },
    [documentId, direction, elementRef, moveShot],
  );

  const onPutDown = useCallback(
    /** @type {import('@/stores/draggableV3').DraggableElementPutDownCallback} */
    function _onPutDown(containerId) {
      const documentStore = UNSAFE_getDocumentStore();
      const draggableStore = UNSAFE_getDraggableStore();
      if (
        !isBlockInSameScene(
          documentStore,
          documentId,
          draggableStore.containerId,
          containerId,
        )
      ) {
        return false;
      }
      return true;
    },
    [documentId, UNSAFE_getDocumentStore, UNSAFE_getDraggableStore],
  );

  useAsDraggableElement(
    elementRef,
    handleRef,
    blockId,
    shotId,
    '',
    isCursorTypeMoveable,
    onPutDown,
    onDraggableComplete,
  );

  const draggingThis = useIsDragging(shotId);
  const draggingOverThis = useIsDraggingOver(shotId);
  const draggingPotentiallyThis = useIsDraggingPotentially(shotId);

  return {
    elementRef,
    handleRef,
    handleClassName:
      (draggingThis
        ? 'pointer-events-none opacity-10'
        : draggingPotentiallyThis
          ? '-translate-y-1 shadow-xl'
          : 'hover:brightness-110 hover:grayscale') +
      ' ' +
      (draggingOverThis ? 'outline-dashed outline-4 outline-gray-300' : '') +
      ' ' +
      (isCursorTypeMoveable ? 'cursor-grab' : 'select-none'),
  };
}
