import { useSceneShotNumber } from '@/serdes/UseResolveSceneShotNumber';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function ShotNumber({
  className,
  documentId,
  sceneId,
  shotId,
  onClick,
}) {
  const sceneShotNumber = useSceneShotNumber(documentId, sceneId, shotId);
  return (
    <button
      className={'px-2 font-mono opacity-30 rounded-full' + ' ' + className}
      onClick={onClick}
      disabled={sceneShotNumber === '0Z'}>
      {sceneShotNumber === '0Z' ? '--' : sceneShotNumber}
    </button>
  );
}
