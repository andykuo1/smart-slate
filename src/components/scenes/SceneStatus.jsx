import SettingsSceneOpenClapperButton from './settings/SettingsSceneOpenClapperButton';
import SettingsSceneShotsRenumberButton from './settings/SettingsSceneShotsRenumberButton';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneStatus({ documentId, sceneId }) {
  return (
    <div className="flex flex-row">
      <SettingsSceneShotsRenumberButton
        documentId={documentId}
        sceneId={sceneId}
      />
      <SettingsSceneOpenClapperButton
        documentId={documentId}
        sceneId={sceneId}
      />
    </div>
  );
}
