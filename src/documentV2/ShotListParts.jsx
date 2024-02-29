import { useCallback, useEffect, useRef, useState } from 'react';

import {
  findSceneWithBlockId,
  isBlockInSameScene,
  useShotIds,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import {
  findDraggableElementById,
  useAsDraggableCursor,
  useAsDraggableElement,
  useDraggableContainerId,
  useDraggableElementId,
  useIsDragging,
  useIsDraggingAny,
  useIsDraggingOver,
  useIsDraggingPotentially,
  useUNSAFE_getDraggableStore,
} from '@/stores/draggableV3';
import { useSetUserCursor, useUserStore } from '@/stores/user';
import { getDocumentEditorBlockViewOptions } from '@/stores/user/EditorAccessor';

import ShotInBlockNew from '../documentV2/ShotInBlockNew';
import ShotInLineNew from '../documentV2/ShotInLineNew';
import { Shot } from './ShotParts';
import { useAddShot } from './UseAddShot';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {Array<import('@/stores/document/DocumentStore').BlockId>} props.blockIds
 */
export default function ShotListParts({
  className,
  documentId,
  sceneId,
  blockIds,
}) {
  const lastBlockId = blockIds.at(-1);
  const shotListType = useUserStore(
    (ctx) =>
      getDocumentEditorBlockViewOptions(ctx, lastBlockId || '')?.shotListType,
  );
  return (
    <ul
      className={
        'grid' +
        ' ' +
        (shotListType === 'grid'
          ? 'grid-cols-[repeat(auto-fill,minmax(min(2.5in,100%),1fr))]'
          : 'grid-cols-1') +
        ' ' +
        className
      }>
      {blockIds.map((blockId) => (
        <ShotListItemsPerBlock
          key={blockId}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotListType={shotListType}
        />
      ))}
      <NewShot
        className={shotListType === 'grid' ? '' : 'mr-auto'}
        documentId={documentId}
        sceneId={sceneId}
        blockId={lastBlockId || ''}
        type={shotListType === 'grid' ? 'block' : 'line'}
      />
    </ul>
  );
}

export const NEW_ELEMENT_ID = '__NEW__';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} props.shotListType
 */
function ShotListItemsPerBlock({ documentId, sceneId, blockId, shotListType }) {
  const shotIds = useShotIds(documentId, blockId);
  return shotIds.map((shotId) => (
    <DraggableShot
      key={shotId}
      documentId={documentId}
      sceneId={sceneId}
      blockId={blockId}
      shotId={shotId}
      details={shotListType !== 'grid'}
      direction={shotListType !== 'grid' ? 'vertical' : 'horizontal'}
      border={'faded'}
    />
  ));
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {'cell'|'line'|'block'} props.type
 */
function NewShot({ className, documentId, sceneId, blockId, type }) {
  const [render, click] = useAddShot(documentId, sceneId, blockId);
  const elementRef = useRef(/** @type {HTMLFieldSetElement|null} */ (null));
  // NOTE: To be able to drag something to the end of the list.
  useAsDraggableElement(
    elementRef,
    elementRef,
    blockId,
    // NOTE: Refer to the <DraggableShot/> for the other piece of this...
    NEW_ELEMENT_ID,
    '',
    false,
    true,
  );

  if (type === 'cell') {
    // TODO: Gotta add this.
    return null;
  } else if (type === 'block') {
    return (
      <ShotInBlockNew
        containerRef={elementRef}
        className={
          'opacity-30 hover:cursor-pointer hover:opacity-100' + ' ' + className
        }
        onClick={click}>
        {render()}
      </ShotInBlockNew>
    );
  } else {
    return (
      <ShotInLineNew
        containerRef={elementRef}
        className={
          'flex aspect-video w-[1.8in] flex-row' +
          ' ' +
          'opacity-30 hover:cursor-pointer hover:opacity-100' +
          ' ' +
          className
        }
        onClick={click}>
        {render()}
      </ShotInLineNew>
    );
  }
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} props.details
 * @param {'horizontal'|'vertical'} props.direction
 * @param {import('@/stores/user/EditorStore').BlockViewShotBorderType} props.border
 */
export function DraggableShot({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  details,
  direction,
  border,
}) {
  const elementRef = useRef(/** @type {HTMLLIElement|null} */ (null));
  const handleRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const UNSAFE_getDocumentStore = useDocumentStore(
    (ctx) => ctx.UNSAFE_getStore,
  );
  const UNSAFE_getDraggableStore = useUNSAFE_getDraggableStore();
  const isCursorTypeMoveable = useUserStore(
    (ctx) => ctx.editor?.documentEditor?.cursorType === 'edit',
  );
  const isActive = useUserStore((ctx) => ctx?.cursor?.shotId === shotId);
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
      handleClassName={
        (draggingThis
          ? 'pointer-events-none opacity-10'
          : draggingPotentiallyThis
            ? '-translate-y-1 shadow-xl'
            : 'hover:brightness-110 hover:grayscale') +
        ' ' +
        (draggingOverThis ? 'outline-dashed outline-4 outline-gray-300' : '') +
        ' ' +
        (isCursorTypeMoveable ? 'cursor-grab' : 'select-none')
      }
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
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export function DraggedShot({ documentId }) {
  const [style, setStyle] = useState({});
  const draggingAny = useIsDraggingAny();

  const onDraggableCursor = useCallback(
    /** @type {import('@/stores/draggableV3').DraggableCursorCallback} */
    function _onDraggableCursor(
      containerId,
      elementId,
      overContainerId,
      overElementId,
      clientX,
      clientY,
    ) {
      setStyle({
        top: `${clientY}px`,
        left: `${clientX}px`,
      });
    },
    [setStyle],
  );
  useAsDraggableCursor(onDraggableCursor);
  const elementId = useDraggableElementId();
  const containerId = useDraggableContainerId();
  const sceneId = useDocumentStore(
    (ctx) => findSceneWithBlockId(ctx, documentId, containerId)?.sceneId,
  );
  const shotListType = useUserStore(
    (ctx) =>
      getDocumentEditorBlockViewOptions(ctx, containerId)?.shotListType || '',
  );

  if (!draggingAny) {
    return null;
  }
  return (
    <div
      style={style}
      className="pointer-events-none absolute left-0 top-0 z-50 w-[1.5in] -translate-x-[50%] -translate-y-[50%] -rotate-12 font-mono">
      <Shot
        className="flex flex-col items-center"
        handleClassName="shadow-xl"
        documentId={documentId}
        sceneId={sceneId || ''}
        shotId={elementId}
        type={shotListType === 'grid' ? 'block' : 'line'}
        active={true}
        editable={false}
      />
    </div>
  );
}
