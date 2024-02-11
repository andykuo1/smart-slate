import ImageWithCaption from '@/libs/ImageWithCaption';

import ShotListAddButton from './shotlist/ShotListAddButton';
import ShotListAddWithReferenceButton from './shotlist/ShotListAddWithReferenceButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotThumbnailTypeSelector({
  className,
  documentId,
  sceneId,
  blockId,
}) {
  return (
    <div
      className={
        'relative flex items-center text-gray-400 dark:text-gray-700' +
        ' ' +
        className
      }>
      <ImageWithCaption
        src=""
        alt="New shot"
        Icon={null}
        className={
          'grid h-[72px] w-[128px] max-w-sm flex-1 grid-cols-2 grid-rows-2'
        }>
        <ShotListAddButton
          className="border-b border-r hover:text-black dark:hover:text-white"
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          title="New wide shot"
          shotType="WS"
        />
        <ShotListAddButton
          className="border-b border-l hover:text-black dark:hover:text-white"
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          title="New medium shot"
          shotType="MS"
        />
        <ShotListAddButton
          className="border-r border-t hover:text-black dark:hover:text-white"
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          title="New close-up shot"
          shotType="CU"
        />
        <ShotListAddWithReferenceButton
          className="border-l border-t hover:text-black dark:hover:text-white"
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          title="New shot with reference"
        />
      </ImageWithCaption>
    </div>
  );
}
