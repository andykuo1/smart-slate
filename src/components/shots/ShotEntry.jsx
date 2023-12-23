import { useCallback, useRef } from 'react';

import FaceIcon from '@material-symbols/svg-400/rounded/face-fill.svg';
import NaturePeopleIcon from '@material-symbols/svg-400/rounded/nature_people-fill.svg';
import PersonIcon from '@material-symbols/svg-400/rounded/person-fill.svg';
import StarsIcon from '@material-symbols/svg-400/rounded/stars-fill.svg';

import HorizontallySnappableDiv from '@/lib/HorizontallySnappableDiv';
import OpenRecorderButton from '@/recorder/OpenRecorderButton';
import { createShot } from '@/stores/DocumentStore';
import {
  useAddShot,
  useSceneNumber,
  useSceneShotCount,
  useSetShotDescription,
  useSetShotType,
  useShotDescription,
  useShotNumber,
  useShotType,
} from '@/stores/DocumentStoreContext';
import ShotTypes, {
  CLOSE_UP,
  MEDIUM_SHOT,
  WIDE_SHOT,
} from '@/stores/ShotTypes';
import { useCurrentCursor, useSetUserCursor } from '@/stores/UserStoreContext';
import BarberpoleStyle from '@/styles/Barberpole.module.css';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

import BoxDrawingCharacter from '../shotlist/BoxDrawingCharacter';
import { getShotTypeColor } from './ShotColors';
import ShotThumbnail from './ShotThumbnail';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {import('react').ReactNode} [props.children]
 */
export function ShotEntry({ documentId, sceneId, shotId, children }) {
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

  return (
    <li className="flex flex-col items-center">
      <HorizontallySnappableDiv
        className={
          'z-10 h-[6rem] border-b border-gray-300 shadow' +
          ' ' +
          (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
        }>
        <>
          <BoxDrawingCharacter
            depth={0}
            start={false}
            end={shotNumber >= shotCount}
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
              <ShotTypesSelector
                className="ml-2"
                documentId={documentId}
                shotId={shotId}
              />
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
                      setUserCursor(documentId, sceneId, '');
                    } else {
                      setUserCursor(documentId, sceneId, shotId);
                    }
                  }}>
                  {isActive ? 'unfocus?' : 'focus?'}
                </button>
              </div>
            </div>
            <div className="flex-1 opacity-30 text-xs hidden sm:block">
              {isFirst
                ? '<- Tap the ◉ to record'
                : choosePlaceholderRandomly(shotId)}
            </div>
          </div>
        </>
        <>
          <ShotNotes
            className="flex-1"
            documentId={documentId}
            shotId={shotId}
          />
        </>
      </HorizontallySnappableDiv>
      <div className="flex-1 w-full">{children}</div>
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 */
export function NewShot({ documentId, sceneId }) {
  const addShot = useAddShot();

  function onClick() {
    let newShot = createShot();
    addShot(documentId, sceneId, newShot);
  }

  return (
    <li className="flex flex-row w-[50%] ml-auto">
      <button
        className="flex-1 text-right bg-gradient-to-l from-gray-300 to-transparent px-4 py-2 my-2 rounded-full"
        onClick={onClick}>
        + New Shot
      </button>
    </li>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function ShotNotes({ className, documentId, shotId }) {
  const description = useShotDescription(documentId, shotId);
  const setShotDescription = useSetShotDescription();

  /** @type {import('react').ChangeEventHandler<HTMLTextAreaElement>} */
  function onChange(e) {
    let el = e.target;
    setShotDescription(documentId, shotId, el.value);
  }

  return (
    <textarea
      className={
        'resize-none m-1 p-2 bg-transparent overflow-x-hidden overflow-y-auto' +
        ' ' +
        className
      }
      value={description}
      onChange={onChange}
      placeholder="Additional notes..."
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function ShotTypesSelector({ className, documentId, shotId }) {
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType();

  return (
    <div className={'flex flex-row items-center' + ' ' + className}>
      <div className="flex flex-col items-center">
        <ShotTypeButton
          shotType={WIDE_SHOT.value}
          onClick={() => setShotType(documentId, shotId, WIDE_SHOT.value)}
          isActive={shotType === WIDE_SHOT.value}
        />
        <ShotTypeButton
          shotType={MEDIUM_SHOT.value}
          onClick={() => setShotType(documentId, shotId, MEDIUM_SHOT.value)}
          isActive={shotType === MEDIUM_SHOT.value}
        />
        <ShotTypeButton
          shotType={CLOSE_UP.value}
          onClick={() => setShotType(documentId, shotId, CLOSE_UP.value)}
          isActive={shotType === CLOSE_UP.value}
        />
      </div>
      <MoreShotTypeSelector documentId={documentId} shotId={shotId} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function MoreShotTypeSelector({ className, documentId, shotId }) {
  const selectRef = useRef(/** @type {HTMLSelectElement|null} */ (null));
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType();

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  const onShotTypeChange = useCallback(
    function onShotTypeChange(e) {
      let el = e.target;
      setShotType(
        documentId,
        shotId,
        /** @type {import('@/stores/DocumentStore').ShotType} */ (el.value),
      );
    },
    [documentId, shotId, setShotType],
  );

  const isActive =
    !!shotType &&
    shotType !== WIDE_SHOT.value &&
    shotType !== MEDIUM_SHOT.value &&
    shotType !== CLOSE_UP.value;

  return (
    <select
      ref={selectRef}
      className={
        'text-center bg-transparent rounded' +
        ' ' +
        (isActive && getShotTypeColor(shotType) + ' ' + className)
      }
      value={shotType}
      onChange={onShotTypeChange}>
      {ShotTypes.params().map((type) => (
        <option key={type.value} title={type.name} value={type.value}>
          {type.abbr}
        </option>
      ))}
    </select>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').ShotType} [props.shotType]
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler} [props.onClick]
 * @param {boolean} [props.isActive]
 */
function ShotTypeButton({ shotType, className, onClick, isActive = false }) {
  return (
    <button
      className={
        'px-1 rounded' +
        ' ' +
        (isActive && getShotTypeColor(shotType)) +
        ' ' +
        className
      }
      title={
        (shotType && ShotTypes.getParamsByType(shotType)?.name) || 'Special'
      }
      onClick={onClick}
      disabled={!onClick}>
      <ShotTypeIcon shotType={shotType} className="w-6 h-6 fill-current" />
    </button>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/DocumentStore').ShotType} [props.shotType]
 */
function ShotTypeIcon({ className, shotType }) {
  switch (shotType) {
    case CLOSE_UP.value:
      return <FaceIcon className={className} />;
    case MEDIUM_SHOT.value:
      return <PersonIcon className={className} />;
    case WIDE_SHOT.value:
      return <NaturePeopleIcon className={className} />;
    default:
      return <StarsIcon className={className} />;
  }
}
