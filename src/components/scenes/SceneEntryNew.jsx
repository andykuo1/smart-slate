import { useAddBlock, useAddScene, useAddShot } from '@/stores/document';
import {
  createBlock,
  createScene,
  createShot,
} from '@/stores/document/DocumentStore';
import { useCurrentCursor } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneEntryNew({ className, documentId }) {
  const userCursor = useCurrentCursor();
  const hasActiveShot = Boolean(userCursor.shotId);
  const hasActiveScene = Boolean(userCursor.sceneId);

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

  if (hasActiveScene || hasActiveShot) {
    return null;
  }
  return (
    <li className={'flex flex-row items-center px-4 my-8' + ' ' + className}>
      <span className="flex-1 text-center border-t-2 border-dotted border-black" />
      <button className="mx-4" onClick={onClick}>
        + New Scene
      </button>
      <span className="flex-1 text-center border-t-2 border-dotted border-black" />
    </li>
  );
}
