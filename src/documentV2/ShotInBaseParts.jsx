import { getShotTypeText } from '@/components/shots/options/ShotTypeIcon';
import { useSceneShotNumber } from '@/serdes/UseResolveSceneShotNumber';
import { isShotEmpty, useShotType } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export function SceneShotNumberPart({
  className,
  documentId,
  sceneId,
  shotId,
}) {
  const sceneShotNumber = useSceneShotNumber(documentId, sceneId, shotId);
  const shotEmpty = useDocumentStore((ctx) =>
    isShotEmpty(ctx, documentId, shotId),
  );
  // NOTE: Max length of 3 for scene number, 2 for shot number, 2 for parens.
  return (
    <div className={'w-[4.5rem]' + ' ' + className}>
      {shotEmpty ? `(${sceneShotNumber})` : sceneShotNumber}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export function ShotTypePart({ className, documentId, shotId }) {
  const shotType = useShotType(documentId, shotId);
  return (
    <div className={'w-[4.5rem]' + ' ' + className}>
      {getShotTypeText(shotType) || '--'}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export function ShotGroupPart({ className, documentId, shotId }) {
  return (
    <div className={'opacity-30' + ' ' + className}>
      {/* NOTE: For future, maybe tag names? */}
    </div>
  );
}
