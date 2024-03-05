import AddIcon from '@material-symbols/svg-400/rounded/add.svg';

import SettingsSceneShotsRenumberButton from '@/components/scenes/settings/SettingsSceneShotsRenumberButton';
import GoToSettingsButton from '@/drawer/GoToSettingsButton';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useSceneShotNumber } from '@/serdes/UseResolveSceneShotNumber';
import {
  getDocumentSettingsById,
  useAddBlock,
  useAddScene,
  useBlockIds,
  useSceneHeading,
  useShotIds,
} from '@/stores/document';
import { createBlock, createScene } from '@/stores/document/DocumentStore';
import {
  useBlockShotCount,
  useDocumentStore,
  useDocumentTitle,
  useSceneIdsInDocumentOrder,
} from '@/stores/document/use';
import { useAsDraggableRoot } from '@/stores/draggableV3';
import { useUserStore } from '@/stores/user';
import {
  getDocumentEditorBlockViewOptions,
  getDocumentEditorSceneViewOptions,
} from '@/stores/user/EditorAccessor';

import BlockViewShotListTypeToggle from './BlockViewShotListTypeToggle';
import DocumentToolbarParts from './DocumentToolbarParts';
import SceneViewShotListTypeToggle from './SceneViewShotListTypeToggle';
import ShotListParts from './ShotListParts';
import BlockParts, { BlockPartContentToolbar } from './blocks/BlockParts';
import ShotForDraggingCursor from './shots/ShotForDraggingCursor';

// TODO: Drag and drop into a trash can
// TODO: select, highlight, then move to here button.

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
          (split ? 'w-full md:w-[95vw]' : 'max-w-[calc(6in+6em)]')
        }>
        <DocumentPart slotLeft={<GoToSettingsButton className="mx-auto" />}>
          <div className="hover:bg-gray-100">
            <DocumentTitle documentId={documentId} />
          </div>
        </DocumentPart>
        <DocumentScenes documentId={documentId} inline={inline} split={split} />
      </article>
      <ShotForDraggingCursor documentId={documentId} />
      <DocumentToolbarParts documentId={documentId} />
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
  const shotListType = useUserStore(
    (ctx) => getDocumentEditorSceneViewOptions(ctx, sceneId)?.shotListType,
  );
  return (
    <>
      <div className="relative h-full overflow-y-auto">
        <figure className="absolute left-0 top-0 h-full w-full">
          <ShotListParts
            documentId={documentId}
            sceneId={sceneId}
            blockIds={blockIds}
            shotListType={shotListType}
            newable={true}
          />
        </figure>
      </div>
      {/* ShotList Toolbar */}
      <div className="absolute right-0 top-0 flex w-[4rem] translate-x-[100%] flex-col items-center px-2 py-1 text-gray-400">
        <SceneViewShotListTypeToggle className="mx-auto" sceneId={sceneId} />
        <SettingsSceneShotsRenumberButton
          className="mx-auto"
          documentId={documentId}
          sceneId={sceneId}
        />
      </div>
    </>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {boolean} props.inline
 * @param {boolean} props.split
 */
function DocumentScenes({ documentId, inline, split }) {
  const sceneIds = useSceneIdsInDocumentOrder(documentId);
  return (
    <div className="grid grid-cols-1">
      {sceneIds.map((sceneId) => (
        <SceneParts
          key={sceneId}
          documentId={documentId}
          sceneId={sceneId}
          inline={inline}
          split={split}
        />
      ))}
      <ScenePartNew documentId={documentId} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function ScenePartNew({ documentId }) {
  const addScene = useAddScene();
  const addBlock = useAddBlock();
  function onClick() {
    let scene = createScene();
    let block = createBlock();
    // NOTE: This should be the default.
    block.contentType = 'fountain-json';
    addScene(documentId, scene);
    addBlock(documentId, scene.sceneId, block);
  }
  return (
    <button
      className="z-30 select-none rounded-full opacity-30 outline-2 transition-transform hover:-translate-y-1 hover:cursor-pointer hover:opacity-60 hover:shadow-2xl active:translate-y-0 active:bg-gray-200 active:shadow-inner"
      onClick={onClick}>
      <DocumentPart
        slotLeft={<SceneNumberNew />}
        slotRight={<SceneNumberNew />}>
        <h3
          style={{ letterSpacing: 'min(4vw, 1.5em)' }}
          className="w-full py-5 text-center text-2xl uppercase">
          NEW SCENE
        </h3>
      </DocumentPart>
    </button>
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
        {/* NOTE: min height at 1in so it can AT LEAST fit 1 shot. */}
        <div className="flex min-h-[1in] flex-row">
          <div
            className={
              'grid max-w-[6in] flex-1 grid-cols-1' +
              ' ' +
              (split ? 'w-[50vw]' : '')
            }>
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
              'relative grid min-w-[2in] flex-1 grid-cols-1' +
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

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function DocumentPartSceneHeader({ documentId, sceneId }) {
  const isCursorEditType = useUserStore(
    (ctx) => ctx.editor?.documentEditor?.cursorType === 'edit',
  );
  const [sceneHeading, setSceneHeading] = useSceneHeading(documentId, sceneId);
  /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
  function onChange(e) {
    setSceneHeading(documentId, sceneId, e.target.value.toUpperCase());
  }
  return (
    <h3 className="py-5 font-bold">
      <input
        className="w-full truncate bg-transparent uppercase outline-none"
        type="text"
        value={sceneHeading}
        placeholder="INT/EXT. SCENE - DAY"
        onChange={onChange}
        autoCapitalize="character"
        disabled={!isCursorEditType}
      />
    </h3>
  );
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
  const shotListType = useUserStore(
    (ctx) => getDocumentEditorBlockViewOptions(ctx, blockId)?.shotListType,
  );
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
            shotListType={shotListType}
            newable={false}
          />
          {/* ShotList Toolbar */}
          <div className="absolute right-0 top-0 flex w-[4rem] translate-x-[100%] flex-col items-center px-2 py-1 text-gray-400 opacity-0 group-hover:opacity-100">
            <BlockViewShotListTypeToggle
              className="mx-auto"
              blockId={blockId}
            />
            <SettingsSceneShotsRenumberButton
              className="mx-auto"
              documentId={documentId}
              sceneId={sceneId}
            />
          </div>
          {/* NOTE: Since sticky only works for relative parents, height 0 makes it act like an absolute element. */}
          <div className="sticky bottom-24 z-20 hidden h-0 group-hover:block">
            <BlockPartContentToolbar
              className="pointer-events-none flex -translate-y-[50%] flex-row"
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}>
              <div className="mr-auto" />
            </BlockPartContentToolbar>
          </div>
        </figure>
      </BlockParts>
    </>
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
      {/* NOTE: 2px offset for underline so it can overlap underscores. */}
      <h2 className="text-xl underline underline-offset-2">{documentTitle}</h2>
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

function SceneNumberNew() {
  return (
    <div className="flex h-full text-center font-bold opacity-30">
      <AddIcon className="m-auto h-6 w-6 fill-current" />
    </div>
  );
}
