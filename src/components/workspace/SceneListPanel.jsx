'use client';

import { createScene, createShot } from '@/stores/DocumentStore';
import {
  useAddScene,
  useAddShot,
  useSceneIds,
  useSceneNumber,
  useSetShotDescription,
  useSetShotType,
  useShotDescription,
  useShotIds,
  useShotNumber,
  useShotTakeCount,
  useShotType,
} from '@/stores/DocumentStoreContext';
import ShotTypes from '@/stores/ShotTypes';
import { useCurrentCursor } from '@/stores/UserStoreContext';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  return (
    <ul className="w-full h-full overflow-x-hidden overflow-y-auto">
      {sceneIds.map((sceneId) => (
        <>
          <SceneHeader documentId={documentId} sceneId={sceneId} />
          <SceneContent documentId={documentId} sceneId={sceneId} />
        </>
      ))}
      <NewSceneHeader documentId={documentId} />
    </ul>
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
        <ShotHeader documentId={documentId} sceneId={sceneId} shotId={shotId} />
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
  const isActive =
    currentCursor.documentId === documentId &&
    currentCursor.sceneId === sceneId &&
    currentCursor.shotId === shotId;
  function onClick() {}
  return (
    <li
      className={
        'flex flex-row border-b border-gray-300 w-full h-[5rem] pl-2 overflow-hidden' +
        ' ' +
        (isActive && 'bg-black text-white')
      }>
      <ScenShotTakeType
        scene={sceneNumber}
        shot={shotNumber}
        take={takeCount}
        type={() => (
          <ShotTypesSelector documentId={documentId} shotId={shotId} />
        )}
      />
      <div className="flex-1 flex flex-row">
        <button
          className={'mx-4 px-4 my-auto rounded-full bg-red-300 text-black'}
          onClick={onClick}>
          + Record Take
        </button>
        <ShotNotes className="flex-1" documentId={documentId} shotId={shotId} />
      </div>
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
      className={'resize-none m-1 p-2 bg-transparent' + ' ' + className}
      value={description}
      onChange={onChange}
      placeholder="Additional notes..."
    />
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
 * @param {number} props.scene
 * @param {number} props.shot
 * @param {number} props.take
 * @param {() => import('react').ReactNode} props.type
 */
function ScenShotTakeType({ scene, shot, take, type }) {
  return (
    <table className="relative text-center group">
      <tr className="text-xl align-bottom scale-y-125 whitespace-nowrap">
        <td className="font-mono text-right">
          {scene > 0 ? String(scene).padStart(2, '0') : '--'}
        </td>
        <td className="font-mono text-left">
          {shot > 0
            ? String.fromCharCode('A'.charCodeAt(0) + (shot - 1))
            : '--'}
        </td>
        <td className="font-mono px-2">
          #{take > 0 ? String(take).padStart(2, '0') : '--'}
        </td>
        <td className="font-mono">{type()}</td>
      </tr>
      <tr className="text-xs text-black select-none transition-opacity opacity-0 group-hover:opacity-30 align-top">
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
      {Object.values(ShotTypes).map((type) => (
        <option key={type.value} title={type.name} value={type.value}>
          {type.abbr}
        </option>
      ))}
    </select>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function ShotTypesSelectSpinner({ documentId, shotId }) {
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType(documentId, shotId);

  /** @param {ShotTypes[keyof ShotTypes]} e */
  function onShotTypeChange(e) {
    setShotType(documentId, shotId, e.value);
  }

  return (
    <div className="group relative h-full my-auto">
      <div className="absolute top-0 bottom-[50%] left-0 right-0 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute top-[50%] bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      <div className="h-full overflow-y-auto px-4 snap-y snap-center scroll-smooth snap-mandatory">
        <ul className="flex flex-col">
          <li>
            <br />
          </li>
          {Object.values(ShotTypes).map((type) => (
            <li
              className={
                'text-center' +
                ' ' +
                (shotType === type.value
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100')
              }>
              <button
                title={type.name}
                className="w-full"
                onClick={() => onShotTypeChange(type)}>
                {type.abbr}
              </button>
            </li>
          ))}
          <li>
            <br />
          </li>
        </ul>
      </div>
    </div>
  );
}
