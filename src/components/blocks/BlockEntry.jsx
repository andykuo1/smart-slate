import { useUserStore } from '@/stores/user';

import ShotList from '../shots/ShotList';
import BlockContent from './BlockContent';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 */
export default function BlockEntry({
  documentId,
  sceneId,
  blockId,
  editable = true,
}) {
  const hasActiveShot = useUserStore((ctx) => Boolean(ctx.cursor?.shotId));
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  const isShotListMode = useUserStore((ctx) => ctx.editMode === 'shotlist');
  const isCollapsed = !isShotListMode && !hasActiveShot;
  return (
    <div>
      <div className={'flex flex-row' + ' ' + (!isCollapsed ? 'flex-col' : '')}>
        <div
          className={
            'relative' +
            ' ' +
            (!isCollapsed ? 'max-h-[15vh] overflow-y-hidden' : 'max-w-[60vw]')
          }>
          <BlockContent
            documentId={documentId}
            blockId={blockId}
            editable={editable}
          />
          {!isCollapsed && (
            <button
              className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent"
              onClick={() => setEditMode('story')}
            />
          )}
        </div>
        <fieldset className="flex-1">
          <legend className="hidden">Shot list</legend>
          <ShotList
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            editable={editable && !hasActiveShot}
            collapsed={isCollapsed}
          />
        </fieldset>
      </div>
    </div>
  );
}
