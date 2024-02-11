import { Fragment } from 'react';

import { useBlockIds } from '@/stores/document';
import { useDocumentShotCount, useSceneIds } from '@/stores/document/use';

import ShotListLayout from './ShotListLayout';
import ShotListShots from './ShotListShots';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 * @param {boolean} [props.hidden]
 */
export default function ShotListInDocumentOrder({
  className,
  documentId,
  editable = true,
  collapsed = false,
  hidden = false,
}) {
  const sceneIds = useSceneIds(documentId);
  const lastSceneId = sceneIds.at(-1) || '';
  const lastSceneBlockIds = useBlockIds(documentId, lastSceneId);
  const lastBlockId = lastSceneBlockIds.at(-1) || '';
  const shotCount = useDocumentShotCount(documentId);
  return (
    <ShotListLayout
      className={className}
      documentId={documentId}
      sceneId={lastSceneId}
      blockId={lastBlockId}
      shotCount={shotCount}
      editable={editable}
      collapsed={collapsed}
      hidden={hidden}>
      <PerSceneBlock documentId={documentId}>
        {(sceneId, blockId) => (
          <ShotListShots
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            editable={editable}
            collapsed={collapsed}
          />
        )}
      </PerSceneBlock>
    </ShotListLayout>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {(
 * sceneId: import('@/stores/document/DocumentStore').SceneId,
 * blockId: import('@/stores/document/DocumentStore').BlockId,
 * index: number,
 * array: Array<import('@/stores/document/DocumentStore').BlockId>
 * ) => import('react').ReactNode} props.children
 */
export function PerSceneBlock({ documentId, children }) {
  const sceneIds = useSceneIds(documentId);
  return (
    <>
      {sceneIds.map((sceneId) => (
        <PerSceneBlockInner documentId={documentId} sceneId={sceneId}>
          {children}
        </PerSceneBlockInner>
      ))}
    </>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {(
 * sceneId: import('@/stores/document/DocumentStore').SceneId,
 * blockId: import('@/stores/document/DocumentStore').BlockId,
 * index: number,
 * array: Array<import('@/stores/document/DocumentStore').BlockId>
 * ) => import('react').ReactNode} props.children
 */
function PerSceneBlockInner({ documentId, sceneId, children }) {
  const blockIds = useBlockIds(documentId, sceneId);
  return (
    <>
      {blockIds.map((blockId, index, array) => (
        <Fragment key={`block-${blockId}`}>
          {children(sceneId, blockId, index, array)}
        </Fragment>
      ))}
    </>
  );
}
