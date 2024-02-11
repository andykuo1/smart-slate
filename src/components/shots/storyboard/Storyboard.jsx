import AddIcon from '@material-symbols/svg-400/rounded/add.svg';
import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';
import RedoIcon from '@material-symbols/svg-400/rounded/redo.svg';
import UndoIcon from '@material-symbols/svg-400/rounded/undo.svg';

import { useShotIds } from '@/stores/document';
import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

import ShotThumbnail from '../ShotThumbnail';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export function ShotBoard({ className, documentId, sceneId, blockId }) {
  const shotIds = useShotIds(documentId, blockId);
  return (
    <ul
      className={
        'md:grid-cols-4 grid auto-cols-min auto-rows-min grid-cols-2' +
        ' ' +
        className
      }>
      {shotIds.map((shotId, index, array) => (
        <ShotBoardEntry
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          index={index}
          start={index === 0}
          end={index === array.length - 1}
        />
      ))}
      <NewShotBoardEntry
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
      />
    </ul>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {number} props.index
 * @param {boolean} props.start
 * @param {boolean} props.end
 */
function ShotBoardEntry({ documentId, sceneId, shotId, index, start, end }) {
  return (
    <li key={`story-${shotId}`} className="relative px-6">
      {start && (
        <span className="pointer-events-none absolute bottom-0 left-0 top-0 flex items-center">
          <RedoIcon className="h-6 w-6 -translate-y-1 -scale-y-100 fill-current" />
        </span>
      )}
      <ShotThumbnail
        documentId={documentId}
        sceneId={sceneId}
        shotId={shotId}
        editable={true}
      />
      <span className="pointer-events-none absolute bottom-0 right-0 top-0 flex items-center">
        {index >= 0 ? (
          <ArrowForwardIcon className="h-6 w-6 fill-current" />
        ) : end ? (
          <UndoIcon className="h-6 w-6 translate-y-1.5 -scale-y-100 fill-current" />
        ) : null}
      </span>
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
function NewShotBoardEntry({ documentId, sceneId, blockId }) {
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let newShot = createShot();
    addShot(documentId, sceneId, blockId, newShot);
  }

  return (
    <li className="relative px-6">
      <button
        className="m-auto flex h-full w-full items-center border-4 border-dashed"
        onClick={onClick}>
        <AddIcon className="h-6 w-6 flex-1 fill-current" />
      </button>
    </li>
  );
}
