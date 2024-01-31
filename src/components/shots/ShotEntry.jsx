import { useRef } from 'react';

import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';

import { getShotById, useShotOrder } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useDraggable, useIsDragging } from '@/stores/draggable';
import {
  useCurrentCursor,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';
import BarberpoleStyle from '@/styles/Barberpole.module.css';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

import ShotMover from './ShotMover';
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
  const shotOrder = useShotOrder(documentId, sceneId, shotId);
  const currentCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    currentCursor.shotId === shotId;
  const isFirst = shotOrder <= 1;
  const isDragging = useIsDragging(shotId);
  const { elementProps, handleProps } = useDraggable(blockId, shotId);

  const shotHash = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.shotHash,
  );
  const shotDescription = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.description,
  );

  function onShotFocusClick() {
    if (isActive) {
      setUserCursor(documentId, sceneId, '');
    } else {
      setUserCursor(documentId, sceneId, shotId);
    }
    setShotListMode('detail');
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
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            onClick={onShotFocusClick}
          />
        )}
        <ShotMover
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotId={shotId}
          handleProps={handleProps}
          editable={editable}
          collapsed={collapsed}
        />
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
          <div className="flex-1">
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
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            onClick={onShotFocusClick}
          />
        )}
      </div>
      {!collapsed && <div className="flex-1 w-full">{children}</div>}
    </li>
  );
}
