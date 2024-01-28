import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { isShotEmpty } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentCursor, useSetUserCursor } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function SettingsShotDeleteButton({
  documentId,
  sceneId,
  shotId,
}) {
  const emptyShot = useDocumentStore((ctx) =>
    isShotEmpty(ctx, documentId, shotId),
  );
  const deleteShot = useDocumentStore((ctx) => ctx.deleteShot);
  const userCursor = useCurrentCursor();
  const setUserCursor = useSetUserCursor();

  function onClick() {
    if (emptyShot) {
      if (userCursor.shotId) {
        setUserCursor(documentId, sceneId, '', '');
      }
      deleteShot(documentId, shotId);
    }
  }

  return (
    <SettingsFieldButton
      className="w-auto"
      Icon={DeleteIcon}
      onClick={onClick}
      disabled={!emptyShot}>
      Delete shot
    </SettingsFieldButton>
  );
}
