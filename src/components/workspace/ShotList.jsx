import BarberpoleStyle from '@/app/barberpole.module.css';
import { choosePlaceholderRandomly } from '@/constants/PlaceholderText';
import RecordButton from '@/lib/RecordButton';
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
import ShotTypes from '@/stores/ShotTypes';
import {
  useCurrentCursor,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/UserStoreContext';

import TakeList from './TakeList';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 */
export default function ShotList({ documentId, sceneId }) {
  const shotIds = useShotIds(documentId, sceneId);
  return (
    <ul className="mx-8">
      {shotIds.map((shotId) => (
        <>
          <ShotHeader
            key={shotId}
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
          />
          <TakeList
            key={shotId}
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
          />
        </>
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
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    currentCursor.shotId === shotId;
  const isFirst = sceneNumber <= 1 && shotNumber <= 1;
  function onClick() {
    setUserCursor(documentId, sceneId, shotId, '');
    setRecorderActive(true, true);
  }
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
        <ScenShotTakeType
          scene={sceneNumber}
          shot={shotNumber}
          take={takeCount > 0 ? takeCount + 1 : takeCount}
          type={() => (
            <ShotTypesSelector documentId={documentId} shotId={shotId} />
          )}
        />
        <div className="group w-full h-full flex flex-row items-center text-center">
          <RecordButton onClick={onClick} />
          <div className="flex-1 opacity-30 text-xs">
            {isFirst
              ? '<-- Tap the ◉ to record'
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
 * @param {() => import('react').ReactNode} props.type
 */
function ScenShotTakeType({ className, scene, shot, take, type }) {
  const [sceneString, shotString, takeString, _] = toScenShotTakeType(
    scene,
    shot,
    take,
  );
  return (
    <table className={'relative text-center group' + ' ' + className}>
      <tr className="text-xl align-bottom scale-y-125 whitespace-nowrap">
        <td className="font-mono text-right">S{sceneString}</td>
        <td className="font-mono text-left">{shotString}</td>
        <td className="font-mono px-2">T{takeString}</td>
        <td className="font-mono">{type()}</td>
      </tr>
      <tr className="text-xs select-none transition-opacity opacity-0 group-hover:opacity-30 align-top">
        <th className="font-normal">scene</th>
        <th className="font-normal">shot</th>
        <th className="font-normal px-2">take</th>
        <th className="font-normal">type</th>
      </tr>
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
  const setShotType = useSetShotType(documentId, shotId);

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function onShotTypeChange(e) {
    let el = e.target;
    setShotType(
      documentId,
      shotId,
      /** @type {import('@/stores/DocumentStore').ShotType} */ (el.value),
    );
  }

  return (
    <select
      className="text-center bg-transparent"
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
