import { useSceneIds } from '@/stores/document';

import DocumentTitle from '../shotlist/DocumentTitle';
import NewSceneEntry from './NewSceneEntry';
import SceneEntry from './SceneEntry';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  return (
    <article className="w-full h-full overflow-x-hidden overflow-y-auto py-20">
      <DocumentTitle documentId={documentId} />
      {sceneIds.map((sceneId) => (
        <SceneEntry key={sceneId} documentId={documentId} sceneId={sceneId} />
      ))}
      <NewSceneEntry documentId={documentId} />
    </article>
  );
}
