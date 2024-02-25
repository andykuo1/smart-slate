import { Fragment } from 'react';

import DocumentLayout from '@/components/documents/DocumentLayout';
import DocumentTitle from '@/components/documents/DocumentTitle';
import SceneEntryNew from '@/components/scenes/SceneEntryNew';
import { SceneEntry } from '@/components/scenes/SceneList';
import ShotListInDocumentOrder from '@/components/shots/shotlist/ShotListInDocumentOrder';
import ShotListInSceneOrder from '@/components/shots/shotlist/ShotListInSceneOrder';
import { useMatchMedia } from '@/libs/UseMatchMedia';
import { useSceneIds } from '@/stores/document/use';
import { useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentParts({ documentId }) {
  return (
    <DocumentLayout documentId={documentId}>
      <DocumentTitle className="pt-20" documentId={documentId} />
      <div className="flex">
        <DocumentByScene documentId={documentId} />
        <DocumentByShot documentId={documentId} />
      </div>
    </DocumentLayout>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function DocumentByScene({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  const shotOnlyMode = useUserStore((ctx) => ctx.editMode === 'shotonly');
  const hidden = shotOnlyMode;
  return (
    <div className={'flex-1' + ' ' + (hidden ? 'hidden' : '')}>
      <PerScene sceneIds={sceneIds}>
        {(sceneId) => (
          <div className="flex flex-row">
            <SceneTextBlocks documentId={documentId} sceneId={sceneId} />
            <SceneShotLists documentId={documentId} sceneId={sceneId} />
          </div>
        )}
      </PerScene>
      <SceneEntryNew className="pb-20" documentId={documentId} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function DocumentByShot({ documentId }) {
  const shotListMode = useUserStore((ctx) => ctx.shotListMode === 'detail');
  const shotOnlyMode = useUserStore((ctx) => ctx.editMode === 'shotonly');
  const hidden = !shotOnlyMode;
  return (
    <div className={'flex-1' + ' ' + (hidden && 'hidden')}>
      <ShotListInDocumentOrder
        className="mx-auto"
        documentId={documentId}
        collapsed={!shotListMode}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneTextBlocks({ documentId, sceneId }) {
  const shotOnlyMode = useUserStore((ctx) => ctx.editMode === 'shotonly');
  const hidden = shotOnlyMode;
  return (
    <div className={'flex-1' + ' ' + (hidden && 'hidden')}>
      <SceneEntry
        className="mx-auto max-w-[6in]"
        documentId={documentId}
        sceneId={sceneId}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
function SceneShotLists({ documentId, sceneId }) {
  const shotListMode = useUserStore((ctx) => ctx.shotListMode === 'detail');
  const smallMedia = useMatchMedia('(max-width: 640px)');
  const shotOnlyMode = useUserStore((ctx) => ctx.editMode === 'shotonly');
  const sequenceMode = useUserStore((ctx) => ctx.editMode === 'sequence');
  const hidden = !sequenceMode && !shotOnlyMode;
  return (
    <div className={'flex-1' + ' ' + (hidden && 'hidden')}>
      <ShotListInSceneOrder
        className="mx-auto"
        documentId={documentId}
        sceneId={sceneId}
        collapsed={smallMedia || !shotListMode}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {Array<import('@/stores/document/DocumentStore').SceneId>} props.sceneIds
 * @param {(
 * sceneId: import('@/stores/document/DocumentStore').SceneId,
 * index: number,
 * array: Array<import('@/stores/document/DocumentStore').SceneId>
 * ) => import('react').ReactNode} props.children
 */
function PerScene({ sceneIds, children }) {
  return (
    <>
      {sceneIds.map((sceneId, index, array) => (
        <Fragment key={`scene-${sceneId}`}>
          {children(sceneId, index, array)}
        </Fragment>
      ))}
    </>
  );
}
