import { Fragment } from 'react';

import { useBlockIds, useShotIds } from '@/stores/document';
import { useUserStore } from '@/stores/user';

import TakeList from '../takes/TakeList';
import GridStyle from './GridStyle.module.css';
import { ShotEntry } from './ShotEntry';
import ShotEntryDragged from './ShotEntryDragged';
import ShotEntryNew from './ShotEntryNew';
import ShotListButton from './ShotListButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} [props.blockId]
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 * @param {boolean} [props.hidden]
 */
export default function ShotList({
  className,
  documentId,
  sceneId,
  blockId,
  editable = true,
  collapsed = false,
  hidden = false,
}) {
  const hasActiveShot = useUserStore((ctx) => Boolean(ctx.cursor?.shotId));
  const blockIds = useBlockIds(documentId, sceneId);
  const shotIds = useShotIds(documentId, blockId || '');
  const targetBlockId = blockId;
  const lastBlockId = blockIds.at(-1);
  const isNonEmptyShotList =
    !blockId || blockId === lastBlockId || shotIds?.length > 0;

  return (
    <fieldset
      className={
        'relative m-0 w-screen' +
        ' ' +
        (isNonEmptyShotList ? 'my-6 py-4' : '') +
        ' ' +
        (hidden ? /* NOTE: Quick hideaway to not lag. */ 'hidden' : className)
      }>
      <legend className="absolute top-0 left-0 right-0 z-10 ml-2 -translate-y-[50%]">
        <ShotListButton
          className={' ' + (!isNonEmptyShotList && 'hidden')}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId || ''}
        />
      </legend>
      <ul>
        <div className={collapsed ? GridStyle.grid : ''}>
          <PerBlock blockIds={blockId ? [blockId] : blockIds}>
            {(blockId) => (
              <ShotsByBlock
                documentId={documentId}
                sceneId={sceneId}
                blockId={blockId}
                editable={editable}
                collapsed={collapsed}
                showTakes={hasActiveShot}
                showNew={
                  editable
                    ? !targetBlockId
                      ? blockId === lastBlockId
                      : blockId === lastBlockId
                        ? true
                        : undefined
                    : false
                }
              />
            )}
          </PerBlock>
        </div>
        <ShotEntryDragged documentId={documentId} sceneId={sceneId} />
      </ul>
    </fieldset>
  );
}

/**
 * @param {object} props
 * @param {Array<import('@/stores/document/DocumentStore').BlockId>} props.blockIds
 * @param {(
 * blockId: import('@/stores/document/DocumentStore').BlockId,
 * index: number,
 * array: Array<import('@/stores/document/DocumentStore').BlockId>
 * ) => import('react').ReactNode} props.children
 */
function PerBlock({ blockIds, children }) {
  return blockIds.map((blockId, index, array) => (
    <Fragment key={`block-${blockId}`}>
      {children(blockId, index, array)}
    </Fragment>
  ));
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} props.editable
 * @param {boolean} props.collapsed
 * @param {boolean} props.showTakes
 * @param {boolean} [props.showNew]
 */
function ShotsByBlock({
  documentId,
  sceneId,
  blockId,
  editable,
  collapsed,
  showTakes,
  showNew = undefined,
}) {
  const shotIds = useShotIds(documentId, blockId);
  if (!showNew && shotIds.length <= 0) {
    return null;
  }
  if (typeof showNew === 'undefined' && shotIds.length > 0) {
    showNew = editable;
  }
  return (
    <>
      {shotIds.map((shotId) => (
        <Fragment key={`shot-${shotId}`}>
          <ShotEntry
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            shotId={shotId}
            editable={editable}
            collapsed={collapsed}>
            {showTakes && (
              <TakeList
                documentId={documentId}
                sceneId={sceneId}
                blockId={blockId}
                shotId={shotId}
                viewMode={collapsed ? 'list' : 'inline'}
              />
            )}
          </ShotEntry>
        </Fragment>
      ))}
      {showNew && (
        <ShotEntryNew
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          collapsed={collapsed}
        />
      )}
    </>
  );
}
