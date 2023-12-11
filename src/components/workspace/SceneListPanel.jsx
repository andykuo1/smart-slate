'use client';

import BarberpoleStyle from '@/app/barberpole.module.css';
import RecordButton from '@/components/lib/RecordButton';
import { choosePlaceholderRandomly } from '@/constants/PlaceholderText';
import {
  createScene,
  createShot,
  toScenShotTakeType,
} from '@/stores/DocumentStore';
import {
  useAddScene,
  useAddShot,
  useSceneIds,
  useSceneNumber,
  useSetShotType,
  useShotIds,
  useShotNumber,
  useShotTakeCount,
  useShotType,
} from '@/stores/DocumentStoreContext';
import ShotTypes from '@/stores/ShotTypes';
import {
  useCurrentCursor,
  useSetRecorderActive,
  useSetUserCursor,
} from '@/stores/UserStoreContext';

import SceneProjectTitle from './SceneProjectTitle';
import { ShotNotes } from './SceneShotEntry';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  return (
    <div className="w-full h-full overflow-x-hidden overflow-y-auto py-20">
      <SceneProjectTitle documentId={documentId} />
      <ul>
        {sceneIds.map((sceneId) => (
          <>
            <SceneHeader documentId={documentId} sceneId={sceneId} />
            <SceneContent documentId={documentId} sceneId={sceneId} />
          </>
        ))}
        <NewSceneHeader documentId={documentId} />
      </ul>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {string} props.sceneId
 */
function SceneHeader({ documentId, sceneId }) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  return (
    <li className="flex flex-row items-center mt-8">
      <SceneNumber sceneNumber={sceneNumber} />
      <span className="flex-1 text-center border-t-2 border-dotted border-black" />
      <SceneNumber sceneNumber={sceneNumber} />
    </li>
  );
}

/**
 * @param {object} props
 * @param {string} props.documentId
 */
function NewSceneHeader({ documentId }) {
  const addScene = useAddScene();
  function onClick() {
    let newScene = createScene();
    addScene(documentId, newScene);
  }
  return (
    <li className="flex flex-row items-center px-4 my-8">
      <span className="flex-1 text-center border-t-2 border-dotted border-black" />
      <button className="mx-4" onClick={onClick}>
        + New Scene
      </button>
      <span className="flex-1 text-center border-t-2 border-dotted border-black" />
    </li>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNumber
 */
function SceneNumber({ sceneNumber }) {
  const result = sceneNumber < 0 ? '??' : String(sceneNumber).padStart(2, '0');
  return <span className="mx-4 font-mono">SCENE {result}</span>;
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 */
function SceneContent({ documentId, sceneId }) {
  const shotIds = useShotIds(documentId, sceneId);
  return (
    <ul className="mx-8">
      {shotIds.map((shotId) => (
        <ShotHeader
          key={shotId}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
      ))}
      <NewShotHeader documentId={documentId} sceneId={sceneId} />
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
  function onClick() {
    setUserCursor(documentId, sceneId, shotId, '');
    setRecorderActive(true, true);
  }
  return (
    <li
      className={
        'flex flex-row border-b border-gray-300 w-full h-[5rem] overflow-x-auto' +
        ' ' +
        'snap-x snap-mandatory overscroll-x-none' +
        ' ' +
        (isActive && 'bg-black text-white' + ' ' + BarberpoleStyle.barberpole)
      }>
      <div className="w-full flex-shrink-0 flex flex-row snap-start">
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
            {choosePlaceholderRandomly(shotId)}
          </div>
        </div>
      </div>
      <div className="w-full flex-shrink-0 flex flex-row snap-start">
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
function NewShotHeader({ documentId, sceneId }) {
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
 * @param {number} props.scene
 * @param {number} props.shot
 * @param {number} props.take
 * @param {() => import('react').ReactNode} props.type
 */
export function ScenShotTakeType({ className, scene, shot, take, type }) {
  const [sceneString, shotString, takeString, _] = toScenShotTakeType(
    scene,
    shot,
    take,
  );
  return (
    <table className={'relative text-center group' + ' ' + className}>
      <tr className="text-xl align-bottom scale-y-125 whitespace-nowrap">
        <td className="font-mono text-right">{sceneString}</td>
        <td className="font-mono text-left">{shotString}</td>
        <td className="font-mono px-2">{takeString}</td>
        <td className="font-mono">{type()}</td>
      </tr>
      <tr className="text-xs select-none transition-opacity opacity-0 group-hover:opacity-30 align-top">
        <th className="font-normal">scen</th>
        <th className="font-normal">shot</th>
        <th className="font-normal px-2">#take</th>
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
