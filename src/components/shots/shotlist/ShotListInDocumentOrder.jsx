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
      {sceneIds.map((sceneId) => (
        <PerUseArray
          arrayName="scene"
          useArray={() => useBlockIds(documentId, sceneId)}>
          {(blockId) => (
            <ShotListShots
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              editable={editable}
              collapsed={collapsed}
            />
          )}
        </PerUseArray>
      ))}
    </ShotListLayout>
  );
}

/**
 * @template T
 * @param {object} props
 * @param {string} props.arrayName
 * @param {() => Array<T>} props.useArray
 * @param {(
 * value: T,
 * index: number,
 * array: Array<T>
 * ) => import('react').ReactNode} props.children
 */
function PerUseArray({ arrayName, useArray, children }) {
  const result = useArray();
  return result.map((value, index, array) => (
    <Fragment key={`${arrayName}-${value}`}>
      {children(value, index, array)}
    </Fragment>
  ));
}
