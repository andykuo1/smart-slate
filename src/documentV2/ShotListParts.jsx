import { useCallback, useEffect, useRef, useState } from 'react';

import { SHOT_TYPE_NEW_SHOT } from '@/components/shots/options/ShotTypeIcon';
import { isBlockInSameScene, useShotIds } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import {
  findDraggableElementById,
  useAsDraggableCursor,
  useAsDraggableElement,
  useDraggableElementId,
  useIsDragging,
  useIsDraggingAny,
  useIsDraggingOver,
  useIsDraggingPotentially,
  useUNSAFE_getDraggableStore,
} from '@/stores/draggableV3';
import { useSetUserCursor, useUserStore } from '@/stores/user';
import BarberpoleStyle from '@/styles/Barberpole.module.css';

import { FadedBorder, Shot, ShotPartDetail, ShotThumbnail } from './ShotParts';
import { useAddShot } from './UseAddShot';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {Array<import('@/stores/document/DocumentStore').BlockId>} props.blockIds
 * @param {boolean} props.grid
 */
export default function ShotListParts({
  className,
  documentId,
  sceneId,
  blockIds,
  grid,
}) {
  const lastBlockId = blockIds.at(-1);
  return (
    <ul
      className={
        'grid' +
        ' ' +
        (grid
          ? 'grid-cols-[repeat(auto-fill,minmax(min(1.8in,100%),1fr))]'
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
          grid={grid}
        />
      ))}
      <NewShot
        documentId={documentId}
        sceneId={sceneId}
        blockId={lastBlockId || ''}
      />
    </ul>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} props.grid
 */
function ShotListItemsPerBlock({ documentId, sceneId, blockId, grid }) {
  const shotIds = useShotIds(documentId, blockId);
  return shotIds.map((shotId) => (
    <DraggableShot
      key={shotId}
      documentId={documentId}
      sceneId={sceneId}
      blockId={blockId}
      shotId={shotId}
      details={!grid}
      direction={grid ? 'horizontal' : 'vertical'}
    />
  ));
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
function NewShot({ documentId, sceneId, blockId }) {
  const [render, click] = useAddShot(documentId, sceneId, blockId);
  return (
    <li
      className="mx-auto aspect-video w-[1.8in] opacity-30 hover:cursor-pointer hover:opacity-100"
      onClick={click}>
      <ShotThumbnail
        className="bg-transparent text-gray-400"
        outlineClassName="outline-dashed"
        documentId=""
        shotId=""
        shotType={SHOT_TYPE_NEW_SHOT}
      />
      {render()}
    </li>
  );
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
 */
export function DraggableShot({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  details,
  direction,
}) {
  const elementRef = useRef(/** @type {HTMLLIElement|null} */ (null));
  const handleRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const UNSAFE_getDocumentStore = useDocumentStore(
    (ctx) => ctx.UNSAFE_getStore,
  );
  const UNSAFE_getDraggableStore = useUNSAFE_getDraggableStore();
  const isCursorMoveType = useUserStore(
    (ctx) => ctx.editor?.documentEditor?.cursorType === 'move',
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
    isCursorMoveType,
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
        'touch-none' +
        ' ' +
        'flex flex-col items-center' +
        ' ' +
        (details ? 'sm:flex-row' : '') +
        ' ' +
        className
      }
      handleClassName={
        'p-1 rounded-2xl' +
        ' ' +
        (draggingThis
          ? 'pointer-events-none opacity-10'
          : draggingPotentiallyThis
            ? '-translate-y-1 shadow-xl'
            : 'hover:brightness-110 hover:grayscale') +
        ' ' +
        (draggingOverThis ? 'outline-dashed outline-4 outline-gray-300' : '') +
        ' ' +
        (isActive ? 'bg-white' + ' ' + BarberpoleStyle.barberpole : '') +
        ' ' +
        (isCursorMoveType ? 'cursor-grab' : 'select-none')
      }
      containerRef={elementRef}
      handleRef={handleRef}
      documentId={documentId}
      shotId={shotId}
      small={false}
      slotThumbnail={
        <FadedBorder
          className={
            'shadow-white' +
            ' ' +
            (isActive ? 'shadow-black' : 'group-hover:shadow-gray-100')
          }
        />
      }>
      {details && (
        <ShotPartDetail documentId={documentId} shotId={shotId} small={false} />
      )}
    </Shot>
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

  if (!draggingAny) {
    return null;
  }
  return (
    <div
      style={style}
      className="pointer-events-none absolute left-0 top-0 z-50 w-[1.5in] -translate-x-[50%] -translate-y-[50%] -rotate-12 font-mono">
      <Shot
        className="flex flex-col items-center"
        handleClassName={
          'shadow-xl rounded-2xl p-1 bg-white' +
          ' ' +
          BarberpoleStyle.barberpole
        }
        documentId={documentId}
        shotId={elementId}
        small={true}
      />
    </div>
  );
}
