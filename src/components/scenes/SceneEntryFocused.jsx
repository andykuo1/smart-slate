import { useCurrentCursor } from '@/stores/user';

import BlockEntryFocused from '../blocks/BlockEntryFocused';
import BlockList from '../blocks/BlockList';
import SettingsSceneShotsRenumberButton from '../shots/settings/SettingsSceneShotsRenumberButton';
import SceneEntryHeader from './SceneEntryHeader';

/**
 * This works by escaping document flow as an overlay. Every
 * deeper focus will use this overlay as its root.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function SceneEntryFocused({ className, documentId }) {
  const { sceneId, shotId } = useCurrentCursor();
  if (!sceneId) {
    return null;
  }
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 overflow-y-auto bg-white">
      <section className={'flex flex-col mb-10' + ' ' + className}>
        <SceneEntryHeader documentId={documentId} sceneId={sceneId} />
        <div className="flex flex-row items-center">
          <label className="mx-2">Options:</label>
          <SettingsSceneShotsRenumberButton
            documentId={documentId}
            sceneId={sceneId}
          />
        </div>
        {!shotId ? (
          <BlockList documentId={documentId} sceneId={sceneId} />
        ) : (
          <BlockEntryFocused documentId={documentId} />
        )}
      </section>
    </div>
  );
}
