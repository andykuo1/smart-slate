import SettingsSceneShotsRenumberButton from '@/components/shots/settings/SettingsSceneShotsRenumberButton';
import SettingsShotDeleteButton from '@/components/shots/settings/SettingsShotDeleteButton';
import SettingsShotTakesImportButton from '@/components/shots/settings/SettingsShotTakesImportButton';
import HorizontallySnappableDiv from '@/libs/HorizontallySnappableDiv';

import { getListDecorationStyleByViewMode } from './TakeListViewMode';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {'inline'|'list'} props.viewMode
 */
export default function TakeEntryDetails({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  viewMode,
}) {
  const listDecorationStyle = getListDecorationStyleByViewMode(viewMode);
  return (
    <HorizontallySnappableDiv className={className + ' ' + listDecorationStyle}>
      <>
        <SettingsShotTakesImportButton
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
        <SettingsShotDeleteButton
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
        <SettingsSceneShotsRenumberButton
          documentId={documentId}
          sceneId={sceneId}
        />
      </>
    </HorizontallySnappableDiv>
  );
}
