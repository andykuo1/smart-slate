import DocumentDivider from '@/components/documents/DocumentDivider';
import { useAddBlock, useAddScene } from '@/stores/document';
import { createBlock, createScene } from '@/stores/document/DocumentStore';
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

  function onClick() {
    let newScene = createScene();
    let newBlock = createBlock();
    // NOTE: This should be the default.
    newBlock.contentType = 'fountain-json';
    addScene(documentId, newScene);
    addBlock(documentId, newScene.sceneId, newBlock);
  }

  if (hasActiveScene || hasActiveShot) {
    return null;
  }
  return (
    <li className={'flex my-8' + ' ' + className}>
      <DocumentDivider onClick={onClick}>+ New Scene</DocumentDivider>
    </li>
  );
}
