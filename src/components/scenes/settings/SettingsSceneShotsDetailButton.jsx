import ListAltIcon from '@material-symbols/svg-400/rounded/list_alt.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SettingsSceneShotsDetailButton({
  documentId,
  sceneId,
}) {
  const shotListMode = useUserStore((ctx) => ctx.shotListMode);
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);
  const userCursor = useUserStore((ctx) => ctx.cursor);

  function onClick() {
    if (shotListMode !== 'detail' || userCursor.shotId !== '') {
      setShotListMode('detail');
    } else {
      setShotListMode('hidden');
    }
  }

  return (
    <SettingsFieldButton
      className="w-auto"
      Icon={ListAltIcon}
      title="Toggle shot text"
      onClick={onClick}>
      Toggle shot text
    </SettingsFieldButton>
  );
}
