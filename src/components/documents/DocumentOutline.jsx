import BoxDrawingCharacter from '@/components/documents/BoxDrawingCharacter';
import DocumentContentCount from '@/components/documents/DocumentContentCount';
import {
  formatSceneNumber,
  formatShotNumber,
} from '@/components/takes/TakeNameFormat';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useShotNumber } from '@/serdes/UseResolveShotNumber';
import {
  getSceneById,
  useBlockIds,
  useSceneHeading,
  useShotDescription,
  useShotIds,
} from '@/stores/document';
import {
  useDocumentTitle,
  useSceneIds,
  useSceneShotCount,
  useShotTakeCount,
} from '@/stores/document/use';
import { useDocumentStore } from '@/stores/document/use';
import { useSetUserCursor, useUserStore } from '@/stores/user';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

import DocumentDivider from './DocumentDivider';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentOutline({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  const activeSceneId = useUserStore((ctx) =>
    ctx.cursor?.shotId ? '' : ctx.cursor?.sceneId,
  );
  const [documentTitle] = useDocumentTitle(documentId);
  const setUserCursor = useSetUserCursor();

  function onClick() {
    setUserCursor(documentId, '', '', '');
  }

  return (
    <nav className="p-2">
      <button
        className="w-full flex flex-col items-center p-2 hover:bg-gray-300"
        onClick={onClick}>
        <div className="text-center">
          <span className="underline">{documentTitle}</span>
        </div>
        <DocumentContentCount documentId={documentId} />
      </button>
      <ul className="flex flex-col">
        {sceneIds.map((sceneId) => (
          <IndexScene
            documentId={documentId}
            sceneId={sceneId}
            isActive={sceneId === activeSceneId}
          />
        ))}
        <li>
          <DocumentDivider>The End</DocumentDivider>
        </li>
      </ul>
    </nav>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {boolean} props.isActive
 */
function IndexScene({ documentId, sceneId, isActive }) {
  const blockIds = useBlockIds(documentId, sceneId);
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const [sceneHeading] = useSceneHeading(documentId, sceneId);
  const listId = 'blocklist-' + sceneId;
  const setUserCursor = useSetUserCursor();

  function onClick() {
    setUserCursor(documentId, sceneId, '', '');
  }

  return (
    <li className="w-full flex flex-col">
      <button
        className={
          'w-full flex flex-row gap-2 px-4 text-left' +
          ' ' +
          (isActive ? 'bg-black text-white' : 'hover:bg-gray-300')
        }
        onClick={onClick}>
        <div>
          <label
            htmlFor={listId}
            className="font-bold pointer-events-none whitespace-nowrap">
            Scene {formatSceneNumber(sceneNumber, false)}
          </label>
          <SceneContentCount documentId={documentId} sceneId={sceneId} />
        </div>
        <div
          className={'font-bold' + ' ' + (!sceneHeading ? 'opacity-30' : '')}>
          {sceneHeading || 'INT/EXT. SCENE - DAY'}
        </div>
      </button>
      <ul id={listId} className="w-full flex flex-col">
        {blockIds.map((blockId) => (
          <IndexBlock
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
          />
        ))}
      </ul>
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
function IndexBlock({ documentId, sceneId, blockId }) {
  const shotIds = useShotIds(documentId, blockId);
  const activeShotId = useUserStore((ctx) => ctx.cursor?.shotId);
  return shotIds.map((shotId, index, array) => (
    <IndexShot
      documentId={documentId}
      sceneId={sceneId}
      blockId={blockId}
      shotId={shotId}
      isLastShot={index >= array.length - 1}
      isActive={activeShotId === shotId}
    />
  ));
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} props.isLastShot
 * @param {boolean} props.isActive
 */
function IndexShot({
  documentId,
  sceneId,
  blockId,
  shotId,
  isLastShot,
  isActive,
}) {
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const description = useShotDescription(documentId, shotId);
  const setUserCursor = useSetUserCursor();

  function onClick() {
    setUserCursor(documentId, sceneId, shotId, '');
  }

  return (
    <li className="w-full flex flex-col">
      <button
        className={
          'w-full flex flex-row gap-2 px-6 text-left' +
          ' ' +
          (isActive ? 'bg-black text-white' : 'hover:bg-gray-300')
        }
        onClick={onClick}>
        <BoxDrawingCharacter start={false} end={isLastShot} depth={0} />
        <div>
          <label className="pointer-events-none whitespace-nowrap">
            Shot {formatShotNumber(shotNumber)}
          </label>
          <ShotContentCount documentId={documentId} shotId={shotId} />
        </div>
        <p
          className={
            'italic max-h-[10vh] truncate' +
            ' ' +
            (!description ? 'opacity-30' : '')
          }>
          {description || choosePlaceholderRandomly(shotId)}
        </p>
      </button>
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneContentCount({ documentId, sceneId }) {
  const blockCount = useDocumentStore(
    (ctx) => getSceneById(ctx, documentId, sceneId)?.blockIds?.length,
  );
  const shotCount = useSceneShotCount(documentId, sceneId);
  return (
    <output className="text-xs opacity-30 flex gap-1 mx-auto whitespace-nowrap">
      <span>{blockCount} blocks</span>
      <span>/</span>
      <span>{shotCount} shots</span>
    </output>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ShotContentCount({ documentId, shotId }) {
  const takeCount = useShotTakeCount(documentId, shotId);
  return (
    <output className="text-xs opacity-30 flex gap-1 mx-auto whitespace-nowrap">
      <span>{takeCount} takes</span>
    </output>
  );
}
