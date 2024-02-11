import { useRef } from 'react';

import { useScrollIntoView } from '@/libs/UseScrollIntoView';
import { getShotById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useDraggable, useIsDragging } from '@/stores/draggable';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

import { getShotFocusId } from './ShotFocus';
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
 * @param {boolean} [props.showDescriptionWhenSmall]
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
  showDescriptionWhenSmall = true,
}) {
  const containerRef = useRef(/** @type {HTMLLIElement|null} */ (null));
  const currentCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    currentCursor.shotId === shotId;
  const isDragging = useIsDragging(shotId);
  const { elementProps, handleProps } = useDraggable(blockId, shotId);
  const scrollIntoView = useScrollIntoView(containerRef);

  const shotHash = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.shotHash,
  );

  function onShotFocusClick() {
    if (isActive) {
      setUserCursor(documentId, sceneId, '');
    } else {
      setUserCursor(documentId, sceneId, shotId);
    }
    scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  return (
    <li
      id={getShotFocusId(shotId)}
      ref={containerRef}
      className={
        'relative mx-auto flex flex-col items-center' +
        ' ' +
        (isDragging ? 'opacity-30' : '') +
        ' ' +
        className
      }
      {...elementProps}>
      <div
        className={
          'flex h-[6rem] w-full flex-row items-center border-b border-gray-300 shadow' +
          ' ' +
          (isActive && 'bg-black text-white')
        }>
        {!collapsed && (
          <ShotNumber
            className="sm:block hidden"
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
          isRightArrow={false}
        />
        <div className="relative">
          {shotHash && (
            <label className="absolute -top-2 left-0 z-10 rounded bg-white px-1 font-mono text-black">
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
        <div className="flex h-full flex-1 flex-row items-center">
          {collapsed && (
            <ShotMover
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              shotId={shotId}
              handleProps={handleProps}
              editable={editable}
              collapsed={collapsed}
              isRightArrow={true}
            />
          )}
          {!collapsed && (
            <ShotDescription
              className={
                'mx-2 h-full w-full flex-1 bg-transparent p-2 font-mono italic' +
                ' ' +
                (!showDescriptionWhenSmall ? 'sm:block hidden' : '')
              }
              documentId={documentId}
              shotId={shotId}
            />
          )}
        </div>
        {!collapsed && (
          <ShotNumber
            className="sm:block hidden"
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            onClick={onShotFocusClick}
          />
        )}
      </div>
      {!collapsed && <div className="w-full flex-1">{children}</div>}
    </li>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ShotDescription({ className, documentId, shotId }) {
  const shotDescription = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.description,
  );
  const setShotDescription = useDocumentStore((ctx) => ctx.setShotDescription);
  return (
    <textarea
      placeholder={choosePlaceholderRandomly(shotId)}
      value={shotDescription}
      onInput={(e) =>
        setShotDescription(
          documentId,
          shotId,
          /** @type {HTMLTextAreaElement} */ (e.target).value,
        )
      }
      className={'resize-none' + ' ' + className}
    />
  );
}
