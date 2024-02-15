import ShotListAddButton from './shotlist/ShotListAddButton';
import ShotListAddWithReferenceButton from './shotlist/ShotListAddWithReferenceButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function AddShotTray({
  className,
  documentId,
  sceneId,
  blockId,
}) {
  return (
    <div
      className={
        'flex-row gap-2 rounded-full bg-gray-300 px-4 text-gray-400 dark:bg-gray-600 dark:text-gray-800' +
        ' ' +
        (className ?? 'flex')
      }>
      <div className="h-8 w-8 rounded hover:text-black dark:hover:text-white">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType=""
          title="New shot"
        />
      </div>
      <div className="h-8 w-8 rounded hover:text-black dark:hover:text-white">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="WS"
          title="New wide shot"
        />
      </div>
      <div className="h-8 w-8 rounded hover:text-black dark:hover:text-white">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="MS"
          title="New medium shot"
        />
      </div>
      <div className="h-8 w-8 rounded hover:text-black dark:hover:text-white">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="CU"
          title="New close-up shot"
        />
      </div>
      <div className="h-8 w-8 rounded hover:text-black dark:hover:text-white">
        <ShotListAddWithReferenceButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          title="New shot with reference"
        />
      </div>
    </div>
  );
}
