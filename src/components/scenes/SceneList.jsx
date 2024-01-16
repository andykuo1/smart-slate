import { Fragment } from 'react';

import { useSceneIds } from '@/stores/document/use';

import SceneEntry from './SceneEntry';
import SceneEntryFocused from './SceneEntryFocused';
import SceneEntryNew from './SceneEntryNew';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneList({ documentId }) {
  const sceneIds = useSceneIds(documentId);
  return (
    <>
      {sceneIds.map((sceneId) => (
        <Fragment key={`scene-${sceneId}`}>
          <SceneEntry documentId={documentId} sceneId={sceneId} />
        </Fragment>
      ))}
      <SceneEntryNew className="pb-20" documentId={documentId} />
      <SceneEntryFocused documentId={documentId} />
    </>
  );
}
