import { MenuItem } from '@ariakit/react';

import MenuStyle from '@/styles/Menu.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 */
export default function TakeReassignMenuItem({
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  return (
    <MenuItem className={MenuStyle.menuItem} disabled={true}>
      Reassign
    </MenuItem>
  );
}
