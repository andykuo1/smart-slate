import ListAltIcon from '@material-symbols/svg-400/rounded/list_alt.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useSetUserCursor, useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SettingsSceneShotsDetailButton({
  documentId,
  sceneId,
}) {
  const editMode = useUserStore((ctx) => ctx.editMode);
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  const userCursor = useUserStore((ctx) => ctx.cursor);
  const setUserCursor = useSetUserCursor();

  function onClick() {
    if (editMode !== 'shotlist' || userCursor.shotId !== '') {
      setEditMode('shotlist');
      setUserCursor(documentId, sceneId, '');
    } else {
      setEditMode('story');
      setUserCursor(documentId, '', '');
    }
  }

  return (
    <SettingsFieldButton
      className="w-auto"
      Icon={ListAltIcon}
      title="Toggle shot details"
      onClick={onClick}
    />
  );
}
