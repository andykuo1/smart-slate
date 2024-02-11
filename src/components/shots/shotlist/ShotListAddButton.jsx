import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

import { getShotTypeIcon } from '../options/ShotTypeIcon';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {string} props.title
 * @param {string} props.shotType
 */
export default function ShotListAddButton({
  className,
  documentId,
  sceneId,
  blockId,
  title,
  shotType,
}) {
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let newShot = createShot();
    newShot.shotType = shotType;
    addShot(documentId, sceneId, blockId, newShot);
  }

  const ShotIcon = getShotTypeIcon(shotType);
  return (
    <button
      className={'h-full w-full' + ' ' + className}
      title={title}
      onClick={onClick}>
      <ShotIcon className="h-full w-full fill-current" />
    </button>
  );
}
