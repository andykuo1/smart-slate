import { Fragment } from 'react';

import { createScene, createShot } from '@/stores/DocumentStore';
import {
  useAddScene,
  useAddShot,
  useSceneHeading,
  useSceneIds,
  useSceneNumber,
  useSetSceneHeading,
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
      <ul title="Scene list">
        {sceneIds.map((sceneId) => (
          <Fragment key={`scene-${sceneId}`}>
            <SceneHeader documentId={documentId} sceneId={sceneId}>
              <ShotList documentId={documentId} sceneId={sceneId} />
            </SceneHeader>
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
 * @param {import('react').ReactNode} [props.children]
 */
function SceneHeader({ documentId, sceneId, children }) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  return (
    <li className="flex flex-col items-center mt-8">
      <div className="relative flex flex-row items-center w-full border-b-2 border-dotted border-black">
        <SceneHeading
          className="flex-1 mx-2"
          documentId={documentId}
          sceneId={sceneId}
        />
        <SceneNumber sceneNumber={sceneNumber} />
      </div>
      <div className="flex-1 w-full">{children}</div>
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
 * @param {string} props.className
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 */
function SceneHeading({ className, documentId, sceneId }) {
  const sceneHeading = useSceneHeading(documentId, sceneId);
  const setSceneHeading = useSetSceneHeading();
  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  function onChange(e) {
    const el = e.target;
    setSceneHeading(documentId, sceneId, el.value.toUpperCase());
  }
  return (
    <input
      className={'bg-transparent px-2 text-xl' + ' ' + className}
      type="text"
      placeholder="INT/EXT. SCENE - DAY"
      value={sceneHeading}
      onChange={onChange}
      autoCapitalize="characters"
    />
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNumber
 */
function SceneNumber({ sceneNumber }) {
  const result = sceneNumber < 0 ? '??' : String(sceneNumber).padStart(2, '0');
  return <span className="mx-4 font-mono opacity-30">SCENE {result}</span>;
}
