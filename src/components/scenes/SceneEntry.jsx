import { useShallow } from 'zustand/react/shallow';

import { getBlockIdsInOrder, useDocumentStore } from '@/stores/document';

import BlockEntry from '../blocks/BlockEntry';
import SceneHeading from './SceneHeading';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneEntry({ className, documentId, sceneId }) {
  const blockIds = useDocumentStore(
    useShallow((ctx) => getBlockIdsInOrder(ctx, documentId, sceneId)),
  );
  return (
    <section className={'flex flex-col mb-10' + ' ' + className}>
      <SceneHeading documentId={documentId} sceneId={sceneId} />
      {blockIds.map((blockId) => (
        <BlockEntry
          key={`block-${blockId}`}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
        />
      ))}
    </section>
  );
}
