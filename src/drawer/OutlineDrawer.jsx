import AddIcon from '@material-symbols/svg-400/rounded/add.svg';
import CheckBoxFillIcon from '@material-symbols/svg-400/rounded/check_box-fill.svg';
import CheckBoxIcon from '@material-symbols/svg-400/rounded/check_box.svg';
import CheckBoxOutlineBlankIcon from '@material-symbols/svg-400/rounded/check_box_outline_blank.svg';
import HistoryIcon from '@material-symbols/svg-400/rounded/history.svg';
import InfoFillIcon from '@material-symbols/svg-400/rounded/info-fill.svg';
import InfoIcon from '@material-symbols/svg-400/rounded/info.svg';
import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';

import BoxDrawingCharacter from '@/components/documents/BoxDrawingCharacter';
import DocumentDivider from '@/components/documents/DocumentDivider';
import SettingsSceneOpenClapperButton from '@/components/scenes/settings/SettingsSceneOpenClapperButton';
import { getShotTypeColor } from '@/components/shots/ShotColors';
import {
  formatSceneNumber,
  formatSceneShotNumber,
  formatTakeNumber,
} from '@/components/takes/TakeNameFormat';
import FieldButton from '@/fields/FieldButton';
import FieldButtonAndMenu from '@/fields/FieldButtonAndMenu';
import { scrollSceneFocusIntoView } from '@/scrollfocus/SceneFocus';
import {
  getShotFocusIdForDrawer,
  scrollShotFocusIntoView,
} from '@/scrollfocus/ShotFocus';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useShotNumber } from '@/serdes/UseResolveShotNumber';
import { useTakeNumber } from '@/serdes/UseResolveTakeNumber';
import {
  getLastBlockIdInScene,
  getShotById,
  getTakeExportDetailsById,
  isShotWithGoodTake,
  useBlockIds,
  useSceneHeading,
  useShotDescription,
  useShotIds,
  useShotType,
  useTakeIds,
  useTakeRating,
} from '@/stores/document';
import { createShot } from '@/stores/document/DocumentStore';
import {
  useSceneIds,
  useSceneShotCount,
  useShotTakeCount,
} from '@/stores/document/use';
import { useDocumentStore } from '@/stores/document/use';
import { SHOT_TYPES } from '@/stores/document/value';
import {
  useCurrentDocumentId,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';
import { choosePlaceholderRandomly } from '@/values/PlaceholderText';

export default function OutlineDrawer() {
  const setDrawerShowDetails = useUserStore((ctx) => ctx.setDrawerShowDetails);
  const drawerShowDetails = useUserStore((ctx) => ctx.drawer.showDetails);
  const documentId = useCurrentDocumentId();
  const sceneIds = useSceneIds(documentId);
  const activeSceneId = useUserStore((ctx) => ctx.cursor?.sceneId);
  function onInfoClick() {
    setDrawerShowDetails(!drawerShowDetails);
  }
  return (
    <>
      <div className="relative p-4">
        <h3 className="text-xl">Screenplay outline</h3>
        <p className="text-xs opacity-30">
          A quick overview of the whole story
        </p>
        <div className="absolute right-4 top-4">
          <FieldButton
            Icon={!drawerShowDetails ? InfoIcon : InfoFillIcon}
            onClick={onInfoClick}
          />
        </div>
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
  const detailMode = useUserStore((ctx) => ctx.drawer.showDetails);
  const setUserCursor = useSetUserCursor();

  function onClick() {
    if (!isActive) {
      setUserCursor(documentId, sceneId, '', '');
      scrollSceneFocusIntoView(sceneId);
    } else {
      setUserCursor(documentId, '', '', '');
    }
  }

  return (
    <li className="flex w-full flex-col">
      <div
        className={
          'flex w-full flex-row gap-2 px-4 pt-2 text-left' +
          ' ' +
          (isActive
            ? 'bg-black text-white dark:bg-gray-700 dark:text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-600')
        }
        onClick={onClick}>
        <div>
          <label className="pointer-events-none whitespace-nowrap">
            SCENE {formatSceneNumber(sceneNumber, false)}
          </label>
          <SceneContentCount
            className={!detailMode ? 'invisible' : ''}
            documentId={documentId}
            sceneId={sceneId}
          />
        </div>
        <div
          className={
            'flex-1 font-bold uppercase' +
            ' ' +
            (!sceneHeading ? 'opacity-30' : '')
          }>
          {sceneHeading || 'INT/EXT. SCENE - DAY'}
        </div>
        <div
          className={
            '-mt-1 flex flex-row items-center' + ' ' + (!isActive && 'hidden')
          }>
          <SettingsSceneOpenClapperButton
            documentId={documentId}
            sceneId={sceneId}
            inverted={true}
            onClick={(e) => e.stopPropagation()}
          />
          <AddShotButton documentId={documentId} sceneId={sceneId} />
        </div>
      </div>
      <ul id={listId} className="flex w-full flex-col">
        {blockIds.map((blockId, index, array) => (
          <IndexBlock
            key={blockId}
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            isLastBlock={index >= array.length - 1}
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
 */
function AddShotButton({ documentId, sceneId }) {
  const setUserCursor = useSetUserCursor();
  const addShot = useDocumentStore((ctx) => ctx.addShot);
  const lastBlockId = useDocumentStore((ctx) =>
    getLastBlockIdInScene(ctx, documentId, sceneId),
  );

  /**
   * @param {string} shotType
   */
  function addNewShot(shotType) {
    let shot = createShot();
    shot.shotType = shotType;
    addShot(documentId, sceneId, lastBlockId, shot);
    // NOTE: Debounce so the shot is added before we focus.
    setTimeout(() => {
      setUserCursor(documentId, sceneId, shot.shotId, '');
      scrollShotFocusIntoView(sceneId, shot.shotId);
    });
  }

  return (
    <FieldButtonAndMenu
      inverted={true}
      title="Add new shot to scene"
      Icon={AddIcon}
      onClick={() => addNewShot('')}
      items={SHOT_TYPES.map(
        (shotType) =>
          shotType && (
            <FieldButton
              className="outline-none"
              title={shotType}
              onClick={() => addNewShot(shotType)}>
              {shotType}
            </FieldButton>
          ),
      )}
    />
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} props.isLastBlock
 */
function IndexBlock({ documentId, sceneId, blockId, isLastBlock }) {
  const shotIds = useShotIds(documentId, blockId);
  const activeShotId = useUserStore((ctx) => ctx.cursor?.shotId);
  return (
    <>
      {shotIds.map((shotId, index, array) => (
        <IndexShot
          key={shotId}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotId={shotId}
          isLastShot={index >= array.length - 1}
          isActive={activeShotId === shotId}
        />
      ))}
    </>
  );
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
    isShotWithGoodTake(ctx, documentId, shotId),
  );
  const shotHasTakes = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId).takeIds.length > 0,
  );
  const description = useShotDescription(documentId, shotId);
  const detailMode = useUserStore((ctx) => ctx.drawer.showDetails);
  const activeTakeId = useUserStore((ctx) => ctx.cursor.takeId);
  const setUserCursor = useSetUserCursor();
  const takeIds = useTakeIds(documentId, shotId);

  function onClick() {
    if (!isActive || activeTakeId) {
      setUserCursor(documentId, sceneId, shotId, '');
      scrollShotFocusIntoView(sceneId, shotId);
    } else {
      setUserCursor(documentId, sceneId, '', '');
      scrollSceneFocusIntoView(sceneId);
    }
  }

  /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
  function onShowTakesClick(e) {
    if (activeTakeId) {
      setUserCursor(documentId, sceneId, shotId, '');
      scrollShotFocusIntoView(sceneId, shotId);
    } else {
      setUserCursor(documentId, sceneId, shotId, takeIds.at(-1) || '');
      scrollShotFocusIntoView(sceneId, shotId);
    }
    e.stopPropagation();
  }

  return (
    <li id={getShotFocusIdForDrawer(shotId)} className="flex w-full flex-col">
      <div
        className={
          'flex w-full flex-row gap-2 px-6 text-left text-xs' +
          ' ' +
          (isActive
            ? 'bg-black text-white dark:bg-gray-700 dark:text-white'
            : 'hover:bg-gray-300 dark:hover:bg-gray-600')
        }
        onClick={onClick}>
        <BoxDrawingCharacter start={false} end={isLastShot} depth={0} />

        <div className="-mx-1">
          {shotHasGoodTake ? (
            <CheckBoxFillIcon className="h-4 w-4 fill-current" />
          ) : shotHasTakes ? (
            <CheckBoxIcon className="h-4 w-4 fill-current" />
          ) : (
            <CheckBoxOutlineBlankIcon className="h-4 w-4 fill-current" />
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
            'max-h-[10vh] truncate italic' +
            ' ' +
            (!description ? 'opacity-30' : '')
          }>
          {description || choosePlaceholderRandomly(shotId)}
        </p>
        <div className={'ml-auto' + ' ' + (!isActive && 'hidden')}>
          <FieldButton
            inverted={isActive}
            Icon={HistoryIcon}
            onClick={onShowTakesClick}
            disabled={takeIds.length <= 0}
          />
        </div>
      </div>
      {isActive && activeTakeId && (
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
  const timestampMillis = useDocumentStore(
    (ctx) =>
      getTakeExportDetailsById(ctx, documentId, takeId)?.timestampMillis || 0,
  );
  const detailMode = useUserStore((ctx) => ctx.drawer.showDetails);
  const setUserCursor = useSetUserCursor();

  function onClick() {
    if (!isActive) {
      setUserCursor(documentId, sceneId, shotId, takeId);
      scrollShotFocusIntoView(sceneId, shotId);
    } else {
      setUserCursor(documentId, sceneId, shotId, '');
      scrollShotFocusIntoView(sceneId, shotId);
    }
  }

  return (
    <li className="flex w-full flex-col">
      <button
        className={
          'flex w-full flex-row gap-2 px-20 text-left text-xs' +
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
        {takeRating > 0 && <ThumbUpFillIcon className="h-4 w-4 fill-current" />}
        <div className="my-auto flex-1 border-b-2 border-dotted border-gray-400" />
        <span className="opacity-50">
          {takeRoll && `[${takeRoll}] `}
          {timestampMillis > 0 &&
            `${
              detailMode
                ? new Date(timestampMillis).toLocaleString()
                : new Date(timestampMillis).toLocaleDateString()
            }`}
        </span>
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
  const shotCount = useSceneShotCount(documentId, sceneId);
  return (
    <output
      className={
        'ml-2 flex gap-1 whitespace-nowrap text-xs opacity-50' + ' ' + className
      }>
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
        'ml-2 flex gap-1 whitespace-nowrap text-xs opacity-50' + ' ' + className
      }>
      <span>{takeCount} takes</span>
    </output>
  );
}
