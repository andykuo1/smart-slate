import SettingsSceneOpenClapperButton from './settings/SettingsSceneOpenClapperButton';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneStatus({ documentId, sceneId }) {
  return (
    <div className="flex flex-row">
      <SettingsSceneOpenClapperButton
        documentId={documentId}
        sceneId={sceneId}
      />
    </div>
  );
}
