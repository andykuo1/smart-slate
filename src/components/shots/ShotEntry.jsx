import { useRef } from 'react';

import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';
import StatOneIcon from '@material-symbols/svg-400/rounded/stat_1.svg';
import StatMinusOneIcon from '@material-symbols/svg-400/rounded/stat_minus_1.svg';

import {
  getShotById,
  getShotIdsInOrder,
  useSceneNumber,
  useShotNumber,
} from '@/stores/document';
import { useDocumentStore, useSceneShotCount } from '@/stores/document/use';
import { useDraggable, useIsDragging } from '@/stores/draggable';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';
import BarberpoleStyle from '@/styles/Barberpole.module.css';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

import BoxDrawingCharacter from '../documents/BoxDrawingCharacter';
import ShotNumber from './ShotNumber';
import ShotThumbnail from './ShotThumbnail';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 */
export function ShotEntry({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  children,
  editable,
  collapsed,
}) {
  const containerRef = useRef(/** @type {HTMLLIElement|null} */ (null));
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const shotCount = useSceneShotCount(documentId, sceneId);
  const currentCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    currentCursor.shotId === shotId;
  const isFirst = shotNumber <= 1;
  const isLast = shotNumber >= shotCount;
  const isDragging = useIsDragging(shotId);
  const { elementProps, handleProps } = useDraggable(blockId, shotId);
  const moveShot = useDocumentStore((ctx) => ctx.moveShot);
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);

  const shotHash = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.shotHash,
  );
  const shotDescription = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.description,
  );

  function onDownClick() {
    const store = UNSAFE_getStore();
    const shotIds = getShotIdsInOrder(store, documentId, blockId);
    const i = shotIds.indexOf(shotId);
    if (i < 0 || i >= shotIds.length) {
      return;
    }
    const nextShotId = shotIds.at(i + 1);
    if (!nextShotId) {
      return;
    }
    moveShot(documentId, blockId, shotId, nextShotId);
  }

  function onUpClick() {
    const store = UNSAFE_getStore();
    const shotIds = getShotIdsInOrder(store, documentId, blockId);
    const i = shotIds.indexOf(shotId);
    if (i <= 0 || i >= shotIds.length) {
      return;
    }
    const prevShotId = shotIds.at(i - 1);
    if (!prevShotId) {
      return;
    }
    moveShot(documentId, blockId, shotId, prevShotId, true);
  }

  function onShotFocusClick() {
    if (isActive) {
      setUserCursor(documentId, '', '');
    } else {
      setUserCursor(documentId, sceneId, shotId);
    }
    // Debounce to wait for layout changes...
    setTimeout(
      () =>
        containerRef.current?.scrollIntoView({
          block: 'center',
          behavior: 'instant',
        }),
      0,
    );
  }

  return (
    <li
      ref={containerRef}
      className={
        'relative flex flex-col items-center mx-auto' +
        ' ' +
        (isDragging ? 'opacity-30' : '') +
        ' ' +
        className
      }
      {...elementProps}>
      <div
        className={
          'flex flex-row items-center w-full h-[6rem] z-10 border-b border-gray-300 shadow' +
          ' ' +
          (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
        }>
        {!collapsed && (
          <ShotNumber
            sceneNumber={sceneNumber}
            shotNumber={shotNumber}
            onClick={onShotFocusClick}
          />
        )}
        <div className="flex flex-col items-center">
          <button
            onClick={onUpClick}
            disabled={!editable || isFirst}
            className="disabled:opacity-30">
            <StatOneIcon className="w-6 h-6 fill-current" />
          </button>
          <BoxDrawingCharacter
            className={!editable ? 'opacity-30' : 'cursor-grab'}
            depth={0}
            start={false}
            end={isLast}
            containerProps={{ ...(editable && collapsed ? handleProps : {}) }}
          />
          <button
            onClick={onDownClick}
            disabled={!editable || isLast}
            className="disabled:opacity-30">
            <StatMinusOneIcon className="w-6 h-6 fill-current" />
          </button>
        </div>
        <div className="relative">
          {shotHash && (
            <label className="absolute -top-2 left-0 z-10 px-1 bg-white text-black font-mono rounded">
              {shotHash}
            </label>
          )}
          <ShotThumbnail
            className="ml-2"
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            editable={true}
          />
        </div>
        <div className="flex-1 flex flex-row items-center">
          <div className="flex-1 flex flex-row">
            {collapsed && <ArrowForwardIcon className="w-6 h-6 fill-current" />}
          </div>
          {!collapsed &&
            (shotDescription ? (
              <p className="flex-1 text-xs overflow-auto">{shotDescription}</p>
            ) : (
              <div className="flex-1 opacity-30 text-xs hidden sm:block">
                {isFirst
                  ? '<- Tap the ◉ to record'
                  : choosePlaceholderRandomly(shotId)}
              </div>
            ))}
        </div>
        {!collapsed && (
          <ShotNumber
            sceneNumber={sceneNumber}
            shotNumber={shotNumber}
            onClick={onShotFocusClick}
          />
        )}
      </div>
      {!collapsed && <div className="flex-1 w-full">{children}</div>}
    </li>
  );
}
