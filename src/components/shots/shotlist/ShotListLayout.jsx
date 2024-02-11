import GridStyle from '@/components/shots/GridStyle.module.css';
import ShotEntryDragged from '@/components/shots/ShotEntryDragged';
import ShotEntryNew from '@/components/shots/ShotEntryNew';

import ShotListHeader from './ShotListHeader';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {number} props.shotCount
 * @param {boolean} [props.editable]
 * @param {boolean} [props.collapsed]
 * @param {boolean} [props.hidden]
 * @param {boolean} [props.showNew]
 * @param {boolean} [props.showTakes]
 * @param {import('react').ReactNode} props.children
 */
export default function ShotListLayout({
  className,
  documentId,
  sceneId,
  blockId,
  shotCount,
  children,
  editable = true,
  collapsed = false,
  hidden = false,
  showNew,
}) {
  const isNonEmptyShotList = shotCount > 0;
  if (!showNew && shotCount <= 0) {
    return null;
  }
  if (typeof showNew === 'undefined' && isNonEmptyShotList) {
    showNew = editable;
  }
  return (
    <fieldset
      className={
        'w-full' +
        ' ' +
        (isNonEmptyShotList ? '' : '') +
        ' ' +
        (hidden ? /* NOTE: Quick hideaway to not lag. */ 'hidden' : className)
      }>
      <legend className="w-full">
        <ShotListHeader
          className={' ' + (!isNonEmptyShotList && 'hidden')}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
        />
      </legend>
      <ul>
        <div className={collapsed ? GridStyle.grid : ''}>
          {children}
          {showNew && (
            <ShotEntryNew
              documentId={documentId}
              sceneId={sceneId}
              blockId={blockId}
              collapsed={collapsed}
            />
          )}
        </div>
        <ShotEntryDragged documentId={documentId} sceneId={sceneId} />
      </ul>
    </fieldset>
  );
}
