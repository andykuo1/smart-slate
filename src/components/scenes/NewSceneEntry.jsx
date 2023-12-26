import { useAddBlock, useAddScene, useAddShot } from '@/stores/document';
import {
  createBlock,
  createScene,
  createShot,
} from '@/stores/document/DocumentStore';
import { useCurrentCursor } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} props.documentId
 */
export default function NewSceneEntry({ documentId }) {
  const userCursor = useCurrentCursor();
  const activeShotId = userCursor.shotId;
  const hasActiveShot = Boolean(activeShotId);

  const addScene = useAddScene();
  const addBlock = useAddBlock();
  const addShot = useAddShot();

  function onClick() {
    let newScene = createScene();
    let newBlock = createBlock();
    let newShot = createShot();
    addScene(documentId, newScene);
    addBlock(documentId, newScene.sceneId, newBlock);
    addShot(documentId, newBlock.blockId, newShot);
  }

  if (hasActiveShot) {
    return null;
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
