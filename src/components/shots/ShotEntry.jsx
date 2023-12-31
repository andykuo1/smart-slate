import { useRef } from 'react';

import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';

import OpenRecorderButton from '@/recorder/OpenRecorderButton';
import {
  useSceneNumber,
  useSceneShotCount,
  useShotNumber,
} from '@/stores/document';
import { useDraggable, useDraggableTarget } from '@/stores/draggable';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';
import BarberpoleStyle from '@/styles/Barberpole.module.css';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

import BoxDrawingCharacter from '../shotlist/BoxDrawingCharacter';
import ShotThumbnail from './ShotThumbnail';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.collapsed]
 */
export function ShotEntry({
  documentId,
  sceneId,
  blockId,
  shotId,
  children,
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
  const isFirst = sceneNumber <= 1 && shotNumber <= 1;
  const draggedShotId = useDraggableTarget();
  const { onMouseEnter, onMouseLeave, handleProps } = useDraggable(
    shotId,
    containerRef,
  );

  return (
    <li
      className={
        'flex flex-col items-center mx-auto' +
        ' ' +
        (draggedShotId === shotId ? 'opacity-30' : '')
      }
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <div
        className={
          'flex w-full h-[6rem] z-10 border-b border-gray-300 shadow' +
          ' ' +
          (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
        }>
        <BoxDrawingCharacter
          className={
            'cursor-grab' + ' ' + (collapsed ? 'opacity-100' : 'opacity-30')
          }
          depth={0}
          start={false}
          end={shotNumber >= shotCount}
          containerProps={collapsed ? handleProps : {}}
        />
        <ShotThumbnail
          className="ml-2"
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          editable={true}
        />
        <div className="flex flex-row items-center">
          <div className="flex-1 flex flex-row">
            {!collapsed && (
              <div className="flex flex-col">
                <OpenRecorderButton
                  className={
                    'group mx-2 my-auto' +
                    ' ' +
                    'text-4xl text-red-400 disabled:text-gray-300'
                  }
                  documentId={documentId}
                  sceneId={sceneId}
                  shotId={shotId}>
                  ◉
                </OpenRecorderButton>
                <button
                  className={
                    'rounded px-2 m-2 whitespace-nowrap' +
                    ' ' +
                    (isActive ? 'bg-gray-600' : 'bg-gray-300')
                  }
                  onClick={() => {
                    if (isActive) {
                      setUserCursor(documentId, '', '');
                    } else {
                      setUserCursor(documentId, sceneId, shotId);
                    }
                  }}>
                  {isActive ? 'unfocus?' : 'focus?'}
                </button>
              </div>
            )}
            {collapsed && <ArrowForwardIcon className="w-6 h-6" />}
          </div>
          {!collapsed && (
            <div className="flex-1 opacity-30 text-xs hidden sm:block">
              {isFirst
                ? '<- Tap the ◉ to record'
                : choosePlaceholderRandomly(shotId)}
            </div>
          )}
        </div>
      </div>
      {!collapsed && <div className="flex-1 w-full">{children}</div>}
    </li>
  );
}
