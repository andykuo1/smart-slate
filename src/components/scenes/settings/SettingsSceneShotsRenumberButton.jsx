import { usePopoverContext } from '@ariakit/react';

import OneTwoThreeIcon from '@material-symbols/svg-400/rounded/format_list_numbered.svg';

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
  const store = usePopoverContext();
  const renumberShots = useDocumentStore((ctx) => ctx.renumberShots);
  function onClick() {
    renumberShots(documentId, sceneId, true);
    store?.hide();
  }
  return (
    <SettingsFieldButton
      className="w-auto"
      Icon={OneTwoThreeIcon}
      title="Re-number shots"
      onClick={onClick}
    />
  );
}
