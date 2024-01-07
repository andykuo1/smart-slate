import { MenuItem } from '@ariakit/react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { useSetUserCursor } from '@/stores/user';
import MenuStyle from '@/styles/Menu.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 */
export default function TakeViewMenuItem({
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  const navigate = useNavigate();
  const setUserCursor = useSetUserCursor();
  function onClick() {
    setUserCursor(documentId, sceneId, shotId, takeId);
    navigate({
      pathname: '/view',
      search: `${createSearchParams({ take: takeId })}`,
    });
  }
  return (
    <MenuItem className={MenuStyle.menuItem} onClick={onClick}>
      View
    </MenuItem>
  );
}
