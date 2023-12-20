import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import FaceIcon from '@material-symbols/svg-400/rounded/face-fill.svg';
import NaturePeopleIcon from '@material-symbols/svg-400/rounded/nature_people-fill.svg';
import PersonIcon from '@material-symbols/svg-400/rounded/person-fill.svg';
import StarsIcon from '@material-symbols/svg-400/rounded/stars-fill.svg';

import { choosePlaceholderRandomly } from '@/constants/PlaceholderText';
import RecordButton from '@/lib/RecordButton';
import { useFullscreen } from '@/lib/fullscreen';
import { useInputCaptureV2 } from '@/lib/inputcapture';
import {
  isMediaRecorderSupported,
  useMediaRecorderV2,
} from '@/lib/mediarecorder';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
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
import {
  useCurrentCursor,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/UserStoreContext';
import BarberpoleStyle from '@/styles/Barberpole.module.css';

import {
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '../recorder/RecorderPanel';
import BoxDrawingCharacter from './BoxDrawingCharacter';
import ShotName from './ShotName';
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
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    currentCursor.shotId === shotId;
  const isFirst = sceneNumber <= 1 && shotNumber <= 1;
  const shotRecorder = useShotRecorder(documentId, sceneId, shotId);

  return (
    <li className="flex flex-col items-center">
      <div
        className={
          'flex flex-row border-b border-gray-300 w-full h-[4rem]' +
          ' ' +
          'overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-none' +
          ' ' +
          (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
        }>
        <div className="w-full flex-shrink-0 flex flex-row snap-start overflow-hidden">
          <BoxDrawingCharacter
            depth={0}
            start={false}
            end={shotNumber >= shotCount}
          />
          <ShotTypesSelector documentId={documentId} shotId={shotId} />
          <RecordButton onClick={shotRecorder} />
          <ShotName
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
            editable={true}
          />
          <div className="group w-full h-full flex flex-row items-center text-center">
            <div className="flex-1 opacity-30 text-xs hidden sm:block">
              {isFirst
                ? '<- Tap the ◉ to record'
                : choosePlaceholderRandomly(shotId)}
            </div>
          </div>
        </div>
        <div className="w-full flex-shrink-0 flex flex-row snap-start overflow-hidden">
          <ShotThumbnail documentId={documentId} shotId={shotId} />
          <ShotNotes
            className="flex-1"
            documentId={documentId}
            shotId={shotId}
          />
        </div>
      </div>
      <div className="flex-1 w-full">{children}</div>
    </li>
  );
}

/**
 * @param {import('@/stores/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/DocumentStore').SceneId} sceneId
 * @param {import('@/stores/DocumentStore').ShotId} shotId
 */
function useShotRecorder(documentId, sceneId, shotId) {
  const setUserCursor = useSetUserCursor();
  const setRecorderActive = useSetRecorderActive();
  const { enterFullscreen } = useFullscreen();
  const { startCapturing } = useInputCaptureV2();
  const { startRecording } = useMediaRecorderV2();
  const exportTake = useTakeExporter();
  const navigate = useNavigate();

  const onRecord = useCallback(
    function onRecord() {
      setUserCursor(documentId, sceneId, shotId, '');
      if (
        isMediaRecorderSupported(
          MEDIA_RECORDER_OPTIONS,
          MEDIA_STREAM_CONSTRAINTS,
        )
      ) {
        setRecorderActive(true, true);
        enterFullscreen();
        navigate('/rec');
        startRecording(({ status, data }) => {
          if (!data) {
            return;
          }
          if (status === 'stopped') {
            const takeId = exportTake(data, documentId, sceneId, shotId);
            setUserCursor(documentId, sceneId, shotId, takeId);
          }
        });
      } else {
        setRecorderActive(false, false);
        startCapturing(({ status, data }) => {
          if (!data) {
            return;
          }
          if (status === 'stopped') {
            const takeId = exportTake(data, documentId, sceneId, shotId);
            setUserCursor(documentId, sceneId, shotId, takeId);
          }
        });
      }
    },
    [
      documentId,
      sceneId,
      shotId,
      setUserCursor,
      setRecorderActive,
      exportTake,
      startRecording,
      startCapturing,
      enterFullscreen,
      navigate,
    ],
  );

  return onRecord;
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
    <li className="flex flex-row">
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
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function ShotTypesSelector({ documentId, shotId }) {
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType();

  return (
    <div className="flex flex-row items-center">
      <ShotTypeButton
        shotType={WIDE_SHOT.value}
        onClick={() => setShotType(documentId, shotId, WIDE_SHOT.value)}
        isActive={shotType === WIDE_SHOT.value}
      />
      <span>|</span>
      <ShotTypeButton
        shotType={MEDIUM_SHOT.value}
        onClick={() => setShotType(documentId, shotId, MEDIUM_SHOT.value)}
        isActive={shotType === MEDIUM_SHOT.value}
      />
      <span>|</span>
      <ShotTypeButton
        shotType={CLOSE_UP.value}
        onClick={() => setShotType(documentId, shotId, CLOSE_UP.value)}
        isActive={shotType === CLOSE_UP.value}
      />
      <span>|</span>
      <ShotTypeButton
        isActive={
          !!shotType &&
          shotType !== WIDE_SHOT.value &&
          shotType !== MEDIUM_SHOT.value &&
          shotType !== CLOSE_UP.value
        }
      />
    </div>
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
        'px-0 sm:px-2 rounded' +
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

/**
 * @param {import('@/stores/DocumentStore').ShotType} [shotType]
 */
export function getShotTypeColor(shotType) {
  switch (shotType) {
    case CLOSE_UP.value:
      return 'bg-blue-300';
    case MEDIUM_SHOT.value:
      return 'bg-green-300';
    case WIDE_SHOT.value:
      return 'bg-red-300';
    default:
      return 'bg-yellow-300';
  }
}
