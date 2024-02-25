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

import BlockParts from './BlockParts';
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
        className="sticky top-0 z-10 bg-gradient-to-b from-white from-60% to-transparent"
        slotLeft={<SceneNumber documentId={documentId} sceneId={sceneId} />}
        slotRight={<SceneNumber documentId={documentId} sceneId={sceneId} />}>
        <DocumentPartSceneHeader documentId={documentId} sceneId={sceneId} />
      </DocumentPart>
      <DocumentPart>
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
        <figure className="my-5 py-2">
          <ShotListPartShotListHeader
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
          />
          <ShotListParts
            documentId={documentId}
            sceneId={sceneId}
            blockIds={[blockId]}
            grid={grid}
          />
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
