import CheckBoxFillIcon from '@material-symbols/svg-400/rounded/check_box-fill.svg';
import CheckBoxIcon from '@material-symbols/svg-400/rounded/check_box.svg';
import CheckBoxOutlineBlankIcon from '@material-symbols/svg-400/rounded/check_box_outline_blank.svg';
import InfoFillIcon from '@material-symbols/svg-400/rounded/info-fill.svg';
import InfoIcon from '@material-symbols/svg-400/rounded/info.svg';
import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';

import BoxDrawingCharacter from '@/components/documents/BoxDrawingCharacter';
import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import {
  formatSceneNumber,
  formatSceneShotNumber,
  formatTakeNumber,
} from '@/components/takes/TakeNameFormat';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useShotNumber } from '@/serdes/UseResolveShotNumber';
import { useTakeNumber } from '@/serdes/UseResolveTakeNumber';
import {
  getSceneById,
  getShotById,
  getTakeById,
  getTakeExportDetailsById,
  useBlockIds,
  useSceneHeading,
  useShotDescription,
  useShotIds,
  useShotType,
  useTakeIds,
  useTakeRating,
} from '@/stores/document';
import {
  useSceneIds,
  useSceneShotCount,
  useShotTakeCount,
} from '@/stores/document/use';
import { useDocumentStore } from '@/stores/document/use';
import {
  useCurrentDocumentId,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

import DocumentDivider from '../components/documents/DocumentDivider';
import { getShotTypeColor } from '../components/shots/ShotColors';

export default function OutlineDrawer() {
  const setOutlineMode = useUserStore((ctx) => ctx.setOutlineMode);
  const detailMode = useUserStore((ctx) => ctx.outlineMode === 'detail');
  const documentId = useCurrentDocumentId();
  const sceneIds = useSceneIds(documentId);
  const activeSceneId = useUserStore((ctx) => ctx.cursor?.sceneId);
  function onInfoClick() {
    setOutlineMode(!detailMode ? 'detail' : 'overview');
  }
  return (
    <>
      <div className="relative p-4">
        <h3 className="text-xl">Screenplay outline</h3>
        <p className="text-xs opacity-30">
          A quick overview of the whole story
        </p>
        <SettingsFieldButton
          className="absolute top-4 right-4"
          Icon={!detailMode ? InfoIcon : InfoFillIcon}
          onClick={onInfoClick}
        />
      </div>
      <ul className="flex flex-col">
        {sceneIds.map((sceneId) => (
          <IndexScene
            key={sceneId}
            documentId={documentId}
            sceneId={sceneId}
            isActive={sceneId === activeSceneId}
          />
        ))}
        <li>
          <DocumentDivider>The End</DocumentDivider>
        </li>
      </ul>
    </>
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
  const detailMode = useUserStore((ctx) => ctx.outlineMode === 'detail');
  const setUserCursor = useSetUserCursor();

  function onClick() {
    if (!isActive) {
      setUserCursor(documentId, sceneId, '', '');
    } else {
      setUserCursor(documentId, '', '', '');
    }
  }

  return (
    <li className="w-full flex flex-col">
      <button
        className={
          'w-full flex flex-row gap-2 px-4 pt-2 text-left' +
          ' ' +
          (isActive ? 'bg-black text-white' : 'hover:bg-gray-300')
        }
        onClick={onClick}>
        <div>
          <label className="font-bold pointer-events-none whitespace-nowrap">
            Scene {formatSceneNumber(sceneNumber, false)}
          </label>
          <SceneContentCount
            className={!detailMode ? 'invisible' : ''}
            documentId={documentId}
            sceneId={sceneId}
          />
        </div>
        <div
          className={'font-bold' + ' ' + (!sceneHeading ? 'opacity-30' : '')}>
          {sceneHeading || 'INT/EXT. SCENE - DAY'}
        </div>
      </button>
      <ul id={listId} className="w-full flex flex-col">
        {blockIds.map((blockId) => (
          <IndexBlock
            key={blockId}
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
      key={shotId}
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
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const shotType = useShotType(documentId, shotId);
  const shotHasGoodTake = useDocumentStore((ctx) =>
    getShotById(ctx, documentId, shotId).takeIds.reduceRight(
      (prev, takeId) => prev || getTakeById(ctx, documentId, takeId).rating > 0,
      false,
    ),
  );
  const shotHasTakes = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId).takeIds.length > 0,
  );
  const description = useShotDescription(documentId, shotId);
  const detailMode = useUserStore((ctx) => ctx.outlineMode === 'detail');
  const activeTakeId = useUserStore((ctx) => ctx.cursor.takeId);
  const setUserCursor = useSetUserCursor();
  const takeIds = useTakeIds(documentId, shotId);

  function onClick() {
    if (!isActive) {
      setUserCursor(documentId, sceneId, shotId, '');
    } else {
      setUserCursor(documentId, sceneId, '', '');
    }
  }

  return (
    <li className="w-full flex flex-col">
      <button
        className={
          'w-full flex flex-row gap-2 px-6 text-left text-xs' +
          ' ' +
          (isActive ? 'bg-black text-white' : 'hover:bg-gray-300')
        }
        onClick={onClick}>
        <BoxDrawingCharacter start={false} end={isLastShot} depth={0} />

        <div className="-mx-1">
          {shotHasGoodTake ? (
            <CheckBoxFillIcon className="w-4 h-4 fill-current" />
          ) : shotHasTakes ? (
            <CheckBoxIcon className="w-4 h-4 fill-current" />
          ) : (
            <CheckBoxOutlineBlankIcon className="w-4 h-4 fill-current" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="pointer-events-none whitespace-nowrap">
            Shot {formatSceneShotNumber(sceneNumber, shotNumber, true)}{' '}
            <span
              className={
                'rounded px-1 text-black' + ' ' + getShotTypeColor(shotType)
              }>
              {shotType || '--'}
            </span>
          </span>
          <ShotContentCount
            className={!detailMode ? 'invisible' : ''}
            documentId={documentId}
            shotId={shotId}
          />
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
      {isActive && (
        <ul className="flex flex-col-reverse">
          {takeIds.map((takeId, index, array) => (
            <IndexTake
              key={takeId}
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              shotId={shotId}
              takeId={takeId}
              isActive={activeTakeId === takeId}
              isLastTake={/* NOTE: Cause the order is reversed. */ index <= 0}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {boolean} props.isActive
 * @param {boolean} props.isLastTake
 */
function IndexTake({
  documentId,
  sceneId,
  blockId,
  shotId,
  takeId,
  isActive,
  isLastTake,
}) {
  const takeRating = useTakeRating(documentId, takeId);
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  const takeRoll = useDocumentStore(
    (ctx) => getTakeExportDetailsById(ctx, documentId, takeId)?.rollName,
  );
  const setUserCursor = useSetUserCursor();

  function onClick() {
    if (!isActive) {
      setUserCursor(documentId, sceneId, shotId, takeId);
    } else {
      setUserCursor(documentId, sceneId, shotId, '');
    }
  }

  return (
    <li className="w-full flex flex-col">
      <button
        className={
          'w-full flex flex-row gap-2 px-20 text-left text-xs' +
          ' ' +
          (isActive ? 'bg-black text-white' : 'hover:bg-gray-300')
        }
        onClick={onClick}>
        <BoxDrawingCharacter
          className="text-sm"
          start={false}
          end={isLastTake}
          depth={1}
        />
        <div>Take {formatTakeNumber(takeNumber, true)}</div>
        {takeRating > 0 && <ThumbUpFillIcon className="w-4 h-4 fill-current" />}
        {takeRoll && `[ROLL ${takeRoll}]`}
      </button>
    </li>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneContentCount({ className, documentId, sceneId }) {
  const blockCount = useDocumentStore(
    (ctx) => getSceneById(ctx, documentId, sceneId)?.blockIds?.length,
  );
  const shotCount = useSceneShotCount(documentId, sceneId);
  return (
    <output
      className={
        'text-xs opacity-50 flex gap-1 ml-2 whitespace-nowrap' + ' ' + className
      }>
      <span>{blockCount} blocks</span>
      <span>/</span>
      <span>{shotCount} shots</span>
    </output>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ShotContentCount({ className, documentId, shotId }) {
  const takeCount = useShotTakeCount(documentId, shotId);
  return (
    <output
      className={
        'text-xs opacity-50 flex gap-1 ml-2 whitespace-nowrap' + ' ' + className
      }>
      <span>{takeCount} takes</span>
    </output>
  );
}
