import OneTwoThreeIcon from '@material-symbols/svg-400/rounded/123.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SettingsSceneShotsRenumberButton({
  documentId,
  sceneId,
}) {
  const reorderShots = useDocumentStore((ctx) => ctx.reorderShots);
  function onClick() {
    reorderShots(documentId, sceneId, true);
  }
  return (
    <SettingsFieldButton
      className="w-auto"
      Icon={OneTwoThreeIcon}
      onClick={onClick}>
      Re-number shots
    </SettingsFieldButton>
  );
}
