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
        'grid md:grid-cols-4 grid-cols-2 auto-rows-min auto-cols-min' +
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
      <NewShotBoardEntry documentId={documentId} blockId={blockId} />
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
        <span className="absolute top-0 bottom-0 left-0 flex items-center pointer-events-none">
          <RedoIcon className="w-6 h-6 fill-current -translate-y-1 -scale-y-100" />
        </span>
      )}
      <ShotThumbnail
        documentId={documentId}
        sceneId={sceneId}
        shotId={shotId}
        editable={true}
      />
      <span className="absolute top-0 bottom-0 right-0 flex items-center pointer-events-none">
        {index >= 0 ? (
          <ArrowForwardIcon className="w-6 h-6 fill-current" />
        ) : end ? (
          <UndoIcon className="w-6 h-6 fill-current translate-y-1.5 -scale-y-100" />
        ) : null}
      </span>
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
function NewShotBoardEntry({ documentId, blockId }) {
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let newShot = createShot();
    addShot(documentId, blockId, newShot);
  }

  return (
    <li className="relative px-6">
      <button
        className="w-full h-full border-4 border-dashed flex items-center m-auto"
        onClick={onClick}>
        <AddIcon className="w-6 h-6 fill-current flex-1" />
      </button>
    </li>
  );
}
