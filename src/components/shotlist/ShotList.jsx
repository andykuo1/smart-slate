import { Fragment, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import BarberpoleStyle from '@/app/barberpole.module.css';
import { choosePlaceholderRandomly } from '@/constants/PlaceholderText';
import RecordButton from '@/lib/RecordButton';
import { useFullscreen } from '@/lib/fullscreen';
import { useInputCaptureV2 } from '@/lib/inputcapture';
import {
  isMediaRecorderSupported,
  useMediaRecorderV2,
} from '@/lib/mediarecorder';
import { createShot, toScenShotTakeType } from '@/stores/DocumentStore';
import {
  useAddShot,
  useSceneNumber,
  useSetShotDescription,
  useSetShotType,
  useShotDescription,
  useShotNumber,
  useShotTakeCount,
  useShotType,
} from '@/stores/DocumentStoreContext';
import { useShotIds } from '@/stores/DocumentStoreContext';
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

import {
  MEDIA_RECORDER_OPTIONS,
  MEDIA_STREAM_CONSTRAINTS,
} from '../recorder/RecorderPanel';
import { useTakeExporter } from '../recorder/UseTakeExporter';
import TakeList from './TakeList';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 */
export default function ShotList({ documentId, sceneId }) {
  const shotIds = useShotIds(documentId, sceneId);
  return (
    <ul className="mx-4">
      {shotIds.map((shotId) => (
        <Fragment key={`shot-${shotId}`}>
          <ShotHeader
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
          />
          <TakeList documentId={documentId} sceneId={sceneId} shotId={shotId} />
        </Fragment>
      ))}
      <NewShot documentId={documentId} sceneId={sceneId} />
    </ul>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function ShotHeader({ documentId, sceneId, shotId }) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeCount = useShotTakeCount(documentId, shotId);
  const currentCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();
  const setRecorderActive = useSetRecorderActive();
  const { enterFullscreen } = useFullscreen();
  const { startCapturing } = useInputCaptureV2();
  const { startRecording } = useMediaRecorderV2();
  const exportTake = useTakeExporter();
  const navigate = useNavigate();
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    currentCursor.shotId === shotId;
  const isFirst = sceneNumber <= 1 && shotNumber <= 1;

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

  return (
    <li
      className={
        'flex flex-row border-b border-gray-300 w-full h-[5rem]' +
        ' ' +
        'overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-none' +
        ' ' +
        (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
      }>
      <div className="w-full flex-shrink-0 flex flex-row snap-start overflow-hidden">
        <ShotTypesSelector documentId={documentId} shotId={shotId} />
        <RecordButton onClick={onRecord} />
        <ScenShotTakeType
          scene={sceneNumber}
          shot={shotNumber}
          take={takeCount > 0 ? takeCount + 1 : takeCount}
        />
        <div className="group w-full h-full flex flex-row items-center text-center">
          <div className="flex-1 opacity-30 text-xs invisible sm:visible">
            {isFirst
              ? '<- Tap the ◉ to record'
              : choosePlaceholderRandomly(shotId)}
          </div>
        </div>
      </div>
      <div className="w-full flex-shrink-0 flex flex-row snap-start overflow-hidden">
        <ShotNotes className="flex-1" documentId={documentId} shotId={shotId} />
      </div>
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 */
function NewShot({ documentId, sceneId }) {
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
 * @param {string} [props.className]
 * @param {number} props.scene
 * @param {number} props.shot
 * @param {number} props.take
 * @param {() => import('react').ReactNode} [props.type]
 */
function ScenShotTakeType({ className, scene, shot, take, type = undefined }) {
  const [sceneString, shotString, takeString, _] = toScenShotTakeType(
    scene,
    shot,
    take,
  );
  return (
    <table
      className={
        'relative text-center group flex flex-col items-center my-auto' +
        ' ' +
        className
      }>
      <tbody className="flex-1 w-full h-full flex">
        <tr className="flex-1 text-xl scale-y-125 whitespace-nowrap self-center">
          <td className="font-mono text-right">S{sceneString}</td>
          <td className="font-mono text-left">{shotString}</td>
          <td className="font-mono px-2">T{takeString}</td>
        </tr>
      </tbody>
      <tfoot className="absolute -bottom-4 w-full flex">
        <tr className="flex-1 text-xs select-none transition-opacity opacity-0 group-hover:opacity-30">
          <th className="font-normal">scene</th>
          <th className="font-normal">shot</th>
          <th className="font-normal px-2">take</th>
        </tr>
      </tfoot>
    </table>
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
    <div className="flex flex-row items-center ml-2">
      <ShotTypeButton
        shotType={WIDE_SHOT.value}
        className={
          '' + (shotType === WIDE_SHOT.value && 'border-red-400 bg-red-300')
        }
        onClick={() => setShotType(documentId, shotId, WIDE_SHOT.value)}
      />
      <span>|</span>
      <ShotTypeButton
        shotType={MEDIUM_SHOT.value}
        className={
          '' +
          (shotType === MEDIUM_SHOT.value && 'border-green-400 bg-green-300')
        }
        onClick={() => setShotType(documentId, shotId, MEDIUM_SHOT.value)}
      />
      <span>|</span>
      <ShotTypeButton
        shotType={CLOSE_UP.value}
        className={
          '' + (shotType === CLOSE_UP.value && 'border-blue-400 bg-blue-300')
        }
        onClick={() => setShotType(documentId, shotId, CLOSE_UP.value)}
      />
      <span>|</span>
      <ShotTypeButton />
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').ShotType} [props.shotType]
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler} [props.onClick]
 */
function ShotTypeButton({ shotType, className, onClick }) {
  const params = shotType
    ? ShotTypes.getParamsByType(shotType)
    : {
        name: 'Special',
        abbr: 'X',
      };
  return (
    <button
      className={'border-b-2 p-2 disabled:opacity-30' + ' ' + className}
      title={params.name}
      onClick={onClick}
      disabled={!onClick}>
      {params.abbr[0]}
    </button>
  );
}

/**
 * @param {import('@/stores/DocumentStore').ShotType} shotType
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
      return '';
  }
}
