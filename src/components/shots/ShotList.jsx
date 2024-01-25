import { Fragment } from 'react';

import { useShotIds } from '@/stores/document';
import { useFirstBlockIdInScene } from '@/stores/document/use';

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
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 */
export default function ShotList({
  className,
  documentId,
  sceneId,
  blockId,
  editable = true,
  collapsed = false,
}) {
  const shotIds = useShotIds(documentId, blockId);
  const firstBlockId = useFirstBlockIdInScene(documentId, sceneId);
  if (firstBlockId !== blockId && collapsed && shotIds.length <= 0) {
    return null;
  }
  return (
    <ul className={className}>
      <div className={collapsed ? GridStyle.grid : ''}>
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
      </div>
      {editable && (
        <ShotEntryNew
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
        />
      )}
      <ShotEntryDragged
        documentId={documentId}
        sceneId={sceneId}
        blockId={blockId}
      />
    </ul>
  );
}
