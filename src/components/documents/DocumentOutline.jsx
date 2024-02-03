import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';
import GridViewIcon from '@material-symbols/svg-400/rounded/grid_view.svg';
import HomeIcon from '@material-symbols/svg-400/rounded/home.svg';
import InfoFillIcon from '@material-symbols/svg-400/rounded/info-fill.svg';
import InfoIcon from '@material-symbols/svg-400/rounded/info.svg';
import ListAltIcon from '@material-symbols/svg-400/rounded/list_alt.svg';
import TuneIcon from '@material-symbols/svg-400/rounded/tune.svg';

import BoxDrawingCharacter from '@/components/documents/BoxDrawingCharacter';
import DocumentContentCount from '@/components/documents/DocumentContentCount';
import {
  formatSceneNumber,
  formatSceneShotNumber,
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

import SettingsFieldButton from '../settings/SettingsFieldButton';
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
  const detailMode = useUserStore((ctx) => ctx.outlineMode === 'detail');
  const boardMode = useUserStore((ctx) => ctx.shotListMode === 'hidden');
  const setOutlineMode = useUserStore((ctx) => ctx.setOutlineMode);
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);
  const navigate = useNavigate();
  const isBackToHome = location.pathname.includes('/edit');

  function onShotListModeClick() {
    setShotListMode(!boardMode ? 'hidden' : 'detail');
  }

  function onInfoClick() {
    setOutlineMode(!detailMode ? 'detail' : 'overview');
  }

  function onProjectSettingsClick() {
    if (!location.pathname.includes('/settings')) {
      navigate('/settings');
    }
  }

  function onBackClick() {
    if (isBackToHome) {
      navigate('/');
    } else {
      navigate('/edit');
    }
  }

  return (
    <nav>
      <div className="sticky top-0 z-10 w-full flex p-2 bg-gray-200 shadow">
        <div className="flex-1">
          <SettingsFieldButton
            className="mr-auto"
            Icon={isBackToHome ? HomeIcon : ArrowBackIcon}
            onClick={onBackClick}
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-center">
            <span className="underline">{documentTitle}</span>
          </h3>
          <DocumentContentCount
            className={!detailMode ? 'invisible' : ''}
            documentId={documentId}
          />
          <div className="outline rounded flex flex-row mt-2">
            <SettingsFieldButton
              Icon={!detailMode ? InfoIcon : InfoFillIcon}
              onClick={onInfoClick}
            />
            <SettingsFieldButton
              Icon={ListAltIcon}
              disabled={!boardMode}
              onClick={onShotListModeClick}
            />
            <SettingsFieldButton
              Icon={GridViewIcon}
              disabled={boardMode}
              onClick={onShotListModeClick}
            />
          </div>
        </div>
        <div className="flex-1">
          <SettingsFieldButton
            className="ml-auto"
            Icon={TuneIcon}
            onClick={onProjectSettingsClick}
          />
        </div>
      </div>
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
          <label
            htmlFor={listId}
            className="font-bold pointer-events-none whitespace-nowrap">
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
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const description = useShotDescription(documentId, shotId);
  const detailMode = useUserStore((ctx) => ctx.outlineMode === 'detail');
  const setUserCursor = useSetUserCursor();

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
          'w-full flex flex-row gap-2 px-6 text-left' +
          ' ' +
          (isActive ? 'bg-black text-white' : 'hover:bg-gray-300')
        }
        onClick={onClick}>
        <BoxDrawingCharacter start={false} end={isLastShot} depth={0} />

        <div className="flex flex-col">
          <label className="pointer-events-none whitespace-nowrap">
            Shot {formatSceneShotNumber(sceneNumber, shotNumber, true)}
          </label>
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
        'text-xs opacity-30 flex gap-1 mx-auto whitespace-nowrap' +
        ' ' +
        className
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
        'text-xs opacity-30 flex gap-1 mx-auto whitespace-nowrap' +
        ' ' +
        className
      }>
      <span>{takeCount} takes</span>
    </output>
  );
}
