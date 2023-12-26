import { Fragment } from 'react';

import {
  useAddBlock,
  useAddScene,
  useAddShot,
  useSceneIds,
} from '@/stores/document';
import {
  createBlock,
  createScene,
  createShot,
} from '@/stores/document/DocumentStore';
import { useCurrentCursor } from '@/stores/user';

import DocumentTitle from '../shotlist/DocumentTitle';
import ShotList from '../shots/ShotList';
import SceneHeading from './SceneHeading';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const userCursor = useCurrentCursor();
  const activeShotId = userCursor.shotId;
  const activeSceneId = userCursor.sceneId;
  const hasActiveShot = Boolean(activeShotId);
  const sceneIds = useSceneIds(documentId);
  return (
    <div className="w-full h-full overflow-x-hidden overflow-y-auto py-20">
      <DocumentTitle documentId={documentId} />
      <ul title="Scene list">
        {sceneIds.map(
          (sceneId) =>
            (!hasActiveShot || sceneId === activeSceneId) && (
              <Fragment key={`scene-${sceneId}`}>
                <SceneHeader documentId={documentId} sceneId={sceneId}>
                  <ShotList documentId={documentId} sceneId={sceneId} />
                </SceneHeader>
              </Fragment>
            ),
        )}
        {!hasActiveShot && <NewScene documentId={documentId} />}
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
  return (
    <li className="flex flex-col items-center mt-8">
      <SceneHeading documentId={documentId} sceneId={sceneId} />
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
  const addBlock = useAddBlock();
  const addShot = useAddShot();

  function onClick() {
    let newScene = createScene();
    let newBlock = createBlock();
    let newShot = createShot();
    addScene(documentId, newScene);
    addBlock(documentId, newScene.sceneId, newBlock);
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
