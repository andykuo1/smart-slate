import { useCallback } from 'react';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import FieldButton from '@/fields/FieldButton';
import { isShotEmpty } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function SettingsShotDeleteButton({
  documentId,
  sceneId,
  shotId,
  onClick,
}) {
  const emptyShot = useDocumentStore((ctx) =>
    isShotEmpty(ctx, documentId, shotId),
  );
  const deleteShot = useDocumentStore((ctx) => ctx.deleteShot);
  const userCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();

  const handleClick = useCallback(
    /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
    function _handleClick(e) {
      if (emptyShot) {
        if (userCursor.shotId) {
          setUserCursor(documentId, sceneId, '', '');
        }
        deleteShot(documentId, shotId);
        onClick?.(e);
      }
    },
    [
      documentId,
      sceneId,
      shotId,
      emptyShot,
      userCursor,
      onClick,
      setUserCursor,
      deleteShot,
    ],
  );

  return (
    <FieldButton
      className="w-auto"
      Icon={DeleteIcon}
      onClick={handleClick}
      disabled={!emptyShot}>
      Delete shot
    </FieldButton>
  );
}
