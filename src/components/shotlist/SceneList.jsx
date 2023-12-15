import { Fragment } from 'react';

import { createScene, createShot } from '@/stores/DocumentStore';
import {
  useAddScene,
  useAddShot,
  useSceneIds,
  useSceneNumber,
} from '@/stores/DocumentStoreContext';

import DocumentTitle from './DocumentTitle';
import ShotList from './ShotList';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  return (
    <div className="w-full h-full overflow-x-hidden overflow-y-auto py-20">
      <DocumentTitle documentId={documentId} />
      <ul>
        {sceneIds.map((sceneId) => (
          <Fragment key={`scene-${sceneId}`}>
            <SceneHeader documentId={documentId} sceneId={sceneId} />
            <ShotList documentId={documentId} sceneId={sceneId} />
          </Fragment>
        ))}
        <NewScene documentId={documentId} />
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
function NewScene({ documentId }) {
  const addScene = useAddScene();
  const addShot = useAddShot();

  function onClick() {
    let newScene = createScene();
    let newShot = createShot();
    addScene(documentId, newScene);
    addShot(documentId, newScene.sceneId, newShot);
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
