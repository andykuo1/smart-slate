import ShotTextIcon from '@material-symbols/svg-400/rounded/table_rows.svg';
import ShotImageIcon from '@material-symbols/svg-400/rounded/window.svg';

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
  const hasActiveShot = false; // useUserStore((ctx) => Boolean(ctx.cursor?.shotId));

  function onClick() {
    if (shotListMode !== 'detail' || hasActiveShot) {
      setShotListMode('detail');
    } else {
      setShotListMode('hidden');
    }
  }

  return (
    <SettingsFieldButton
      className="w-auto hidden sm:block"
      Icon={shotListMode === 'detail' ? ShotTextIcon : ShotImageIcon}
      title="Toggle shot text"
      onClick={onClick}
    />
  );
}
