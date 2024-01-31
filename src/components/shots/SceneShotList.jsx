import { Fragment } from 'react';

import { useBlockIds, useShotIds } from '@/stores/document';

import TakeList from '../takes/TakeList';
import GridStyle from './GridStyle.module.css';
import { ShotEntry } from './ShotEntry';
import ShotEntryDragged from './ShotEntryDragged';
import ShotEntryNew from './ShotEntryNew';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 */
export default function SceneShotList({
  className,
  documentId,
  sceneId,
  editable = true,
  collapsed = true,
}) {
  const blockIds = useBlockIds(documentId, sceneId);
  const lastBlockId = blockIds.at(-1);
  return (
    <ul className={className}>
      <div className={collapsed ? GridStyle.grid : ''}>
        {blockIds.map((blockId) => (
          <Fragment key={`block-${blockId}`}>
            <BlockShotList
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              editable={editable}
              collapsed={collapsed}
            />
          </Fragment>
        ))}
        {lastBlockId && editable && (
          <ShotEntryNew
            documentId={documentId}
            sceneId={sceneId}
            blockId={lastBlockId}
            collapsed={collapsed}
          />
        )}
      </div>
      <ShotEntryDragged documentId={documentId} sceneId={sceneId} />
    </ul>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} props.editable
 * @param {boolean} props.collapsed
 */
function BlockShotList({ documentId, sceneId, blockId, editable, collapsed }) {
  const shotIds = useShotIds(documentId, blockId);
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
            <TakeList
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              shotId={shotId}
              viewMode={collapsed ? 'list' : 'inline'}
            />
          </ShotEntry>
        </Fragment>
      ))}
    </>
  );
}
