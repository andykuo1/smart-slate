import CursorIcon from '@material-symbols/svg-400/rounded/arrow_selector_tool-fill.svg';
import EditIcon from '@material-symbols/svg-400/rounded/format_ink_highlighter.svg';
import ShotListIcon from '@material-symbols/svg-400/rounded/lists.svg';
import PanIcon from '@material-symbols/svg-400/rounded/pan_tool.svg';
import MoodBoardIcon from '@material-symbols/svg-400/rounded/photo_library.svg';
import SplitViewIcon from '@material-symbols/svg-400/rounded/vertical_split.svg';
import InlineViewIcon from '@material-symbols/svg-400/rounded/view_day.svg';

import SettingsSceneShotsDetailButton from '@/components/scenes/settings/SettingsSceneShotsDetailButton';
import SettingsSceneShotsRenumberButton from '@/components/scenes/settings/SettingsSceneShotsRenumberButton';
import FieldButton from '@/fields/FieldButton';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useSceneShotNumber } from '@/serdes/UseResolveSceneShotNumber';
import {
  getDocumentSettingsById,
  useBlockIds,
  useSceneHeading,
  useShotIds,
} from '@/stores/document';
import {
  useBlockShotCount,
  useDocumentStore,
  useDocumentTitle,
  useSceneIdsInDocumentOrder,
} from '@/stores/document/use';
import { useAsDraggableRoot } from '@/stores/draggableV3';
import { useUserStore } from '@/stores/user';

import BlockParts, { BlockPartContentToolbar } from './BlockParts';
import ShotListParts, { DraggedShot } from './ShotListParts';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentParts({ documentId }) {
  useAsDraggableRoot();
  const editMode = useUserStore((ctx) => ctx.editMode);
  const inline = editMode === 'inline';
  return (
    <div className="flex h-full w-full flex-col">
      <Document documentId={documentId} inline={inline} split={!inline} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {boolean} props.inline
 * @param {boolean} props.split
 */
function Document({ className, documentId, inline, split }) {
  return (
    <div className={'overflow-y-auto' + ' ' + className}>
      <article
        className={
          'mx-auto py-[1in] font-mono' +
          ' ' +
          (split ? 'w-full' : 'max-w-[calc(6in+6em)]')
        }>
        <DocumentTitle documentId={documentId} />
        <DocumentScenes documentId={documentId} inline={inline} />
      </article>
      <DraggedShot documentId={documentId} />
      <DocumentPartToolbar />
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneWiseDocumentPartShotList({ documentId, sceneId }) {
  const blockIds = useBlockIds(documentId, sceneId);
  const grid = useUserStore((ctx) => ctx.shotListMode) === 'hidden';
  return (
    <figure className="absolute left-0 top-0 h-full w-full">
      <ShotListParts
        documentId={documentId}
        sceneId={sceneId}
        blockIds={blockIds}
        grid={grid}
      />
    </figure>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {boolean} props.inline
 */
function DocumentScenes({ documentId, inline }) {
  const sceneIds = useSceneIdsInDocumentOrder(documentId);
  return (
    <div className="grid grid-cols-1">
      {sceneIds.map((sceneId) => (
        <SceneParts
          key={sceneId}
          documentId={documentId}
          sceneId={sceneId}
          inline={inline}
          split={!inline}
        />
      ))}
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {boolean} props.inline
 * @param {boolean} props.split
 */
function SceneParts({ documentId, sceneId, inline, split }) {
  const blockIds = useBlockIds(documentId, sceneId);
  return (
    <>
      <DocumentPart
        className="sticky top-0 z-30 bg-gradient-to-b from-white from-60% to-transparent"
        slotLeft={<SceneNumber documentId={documentId} sceneId={sceneId} />}
        slotRight={<SceneNumber documentId={documentId} sceneId={sceneId} />}>
        <DocumentPartSceneHeader documentId={documentId} sceneId={sceneId} />
      </DocumentPart>
      <DocumentPart className="mb-14">
        <div className={'grid' + ' ' + (split ? 'grid-cols-2' : 'grid-cols-1')}>
          <div className="grid max-w-[6in] grid-cols-1">
            {blockIds.map((blockId) => (
              <BlockOrShotList
                key={blockId}
                documentId={documentId}
                sceneId={sceneId}
                blockId={blockId}
                inline={inline}
              />
            ))}
          </div>
          <div
            className={
              'relative grid grid-cols-1 overflow-y-auto' +
              ' ' +
              (split ? '' : 'hidden')
            }>
            <SceneWiseDocumentPartShotList
              documentId={documentId}
              sceneId={sceneId}
            />
          </div>
        </div>
      </DocumentPart>
    </>
  );
}

// TODO: Drag and drop into a trash can
// TODO: select, highlight, then move to here button.

function DocumentPartToolbar() {
  const editMode = useUserStore((ctx) => ctx.editMode);
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  const cursorType = useUserStore(
    (ctx) => ctx?.editor?.documentEditor?.cursorType,
  );
  const toggleDocumentEditorCursorType = useUserStore(
    (ctx) => ctx.toggleDocumentEditorCursorType,
  );
  return (
    <div className="fixed bottom-0 left-0 top-0 z-30 flex flex-col items-center">
      <div className="mx-1 my-auto flex flex-col items-center gap-5 rounded-full bg-white px-2 py-5 shadow-xl">
        <FieldButton
          Icon={CursorIcon}
          className="mx-auto"
          inverted={cursorType === ''}
          onClick={() => toggleDocumentEditorCursorType('')}
        />
        <FieldButton Icon={EditIcon} className="mx-auto" onClick={() => {}} />
        <FieldButton
          Icon={PanIcon}
          className="mx-auto"
          inverted={cursorType === 'move'}
          onClick={() => toggleDocumentEditorCursorType('move')}
        />
        <FieldButton
          Icon={editMode !== 'inline' ? SplitViewIcon : InlineViewIcon}
          className="mx-auto"
          onClick={() =>
            setEditMode(editMode !== 'inline' ? 'inline' : 'sequence')
          }
        />
        <FieldButton
          Icon={MoodBoardIcon}
          className="mx-auto"
          onClick={() => setEditMode('sequence')}
        />
        <FieldButton
          Icon={ShotListIcon}
          className="mx-auto"
          onClick={() => setEditMode('sequence')}
        />
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function DocumentPartSceneHeader({ documentId, sceneId }) {
  const [sceneHeading] = useSceneHeading(documentId, sceneId);
  return <h3 className="py-5 font-bold">{sceneHeading}</h3>;
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
function ShotListPartShotListHeader({ documentId, sceneId, blockId }) {
  const shotIds = useShotIds(documentId, blockId);
  const firstNumber = useSceneShotNumber(documentId, sceneId, shotIds[0] || '');
  const lastNumber = useSceneShotNumber(
    documentId,
    sceneId,
    shotIds.at(-1) || '',
  );
  const prefix = firstNumber === lastNumber ? 'SHOT' : 'SHOTS';
  const numberRange =
    firstNumber === lastNumber ? firstNumber : `${firstNumber}-${lastNumber}`;
  // NOTE: 4rem from margin
  return (
    <figcaption className="absolute left-0 flex w-[4rem] -translate-x-[100%] rotate-180 items-center px-2 py-1 font-bold italic opacity-30 vertical-rl">
      {prefix + ' ' + numberRange}
    </figcaption>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} props.inline
 */
function BlockOrShotList({ documentId, sceneId, blockId, inline }) {
  const blockShotCount = useBlockShotCount(documentId, blockId);
  const grid = useUserStore((ctx) => ctx.shotListMode) === 'hidden';
  if (!inline || blockShotCount <= 0) {
    return (
      <BlockParts documentId={documentId} sceneId={sceneId} blockId={blockId} />
    );
  }
  return (
    <>
      <BlockParts documentId={documentId} sceneId={sceneId} blockId={blockId}>
        <figure className="relative">
          <ShotListPartShotListHeader
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
          />
          <ShotListParts
            className="my-2 py-5"
            documentId={documentId}
            sceneId={sceneId}
            blockIds={[blockId]}
            grid={grid}
          />
          <ShotListPartShotListToolbar
            documentId={documentId}
            sceneId={sceneId}
          />
          {/* NOTE: Since sticky only works for relative parents, height 0 makes it act like an absolute element. */}
          <div className="sticky bottom-10 z-20 h-0">
            <BlockPartContentToolbar
              className="flex -translate-y-[50%] flex-row opacity-0 group-hover:opacity-100"
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
            />
          </div>
        </figure>
      </BlockParts>
    </>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function ShotListPartShotListToolbar({ documentId, sceneId }) {
  return (
    <div className="absolute right-0 top-0 flex w-[4rem] translate-x-[100%] flex-col items-center px-2 py-1 text-gray-400 opacity-0 group-hover:opacity-100">
      <SettingsSceneShotsDetailButton className="mx-auto" />
      <SettingsSceneShotsRenumberButton
        className="mx-auto"
        documentId={documentId}
        sceneId={sceneId}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.id]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.slotLeft]
 * @param {import('react').ReactNode} [props.slotRight]
 * @param {import('react').ReactNode} props.children
 */
function DocumentPart({ id, className, slotLeft, slotRight, children }) {
  return (
    <section
      id={id}
      className={'grid grid-cols-[4rem_minmax(0,1fr)_4rem]' + ' ' + className}>
      <div className="">{slotLeft}</div>
      <div>{children}</div>
      <div className="">{slotRight}</div>
    </section>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function DocumentTitle({ documentId }) {
  const [documentTitle] = useDocumentTitle(documentId);
  const writerName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.writerName,
  );
  return (
    <header className="mx-auto mb-[0.5in] flex max-w-[60%] flex-col gap-2 text-center">
      <h2 className="underline">{documentTitle}</h2>
      {writerName && (
        <>
          <div>written by</div>
          <div>{writerName}</div>
        </>
      )}
    </header>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneNumber({ documentId, sceneId }) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const text = sceneNumber <= 0 ? '---' : String(sceneNumber);
  return (
    <div className="h-full pt-5 text-center font-bold opacity-30">{text}</div>
  );
}
