import { useCallback, useState } from 'react';

import { findSceneWithBlockId } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import {
  useAsDraggableCursor,
  useDraggableContainerId,
  useDraggableElementId,
  useIsDraggingAny,
} from '@/stores/draggableV3';
import { useUserStore } from '@/stores/user';
import { getDocumentEditorBlockViewOptions } from '@/stores/user/EditorAccessor';

import { getShotViewVariantByShotListType } from '../ShotListParts';
import { Shot } from './parts/ShotParts';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function ShotForDraggingCursor({ documentId }) {
  const [style, setStyle] = useState({});
  const draggingAny = useIsDraggingAny();

  const onDraggableCursor = useCallback(
    /** @type {import('@/stores/draggableV3').DraggableCursorCallback} */
    function _onDraggableCursor(
      containerId,
      elementId,
      overContainerId,
      overElementId,
      clientX,
      clientY,
    ) {
      setStyle({
        top: `${clientY}px`,
        left: `${clientX}px`,
      });
    },
    [setStyle],
  );
  useAsDraggableCursor(onDraggableCursor);
  const elementId = useDraggableElementId();
  const containerId = useDraggableContainerId();
  const sceneId = useDocumentStore(
    (ctx) => findSceneWithBlockId(ctx, documentId, containerId)?.sceneId,
  );
  const shotListType = useUserStore(
    (ctx) =>
      getDocumentEditorBlockViewOptions(ctx, containerId)?.shotListType || '',
  );

  if (!draggingAny) {
    return null;
  }
  return (
    <div
      style={style}
      className="pointer-events-none absolute left-0 top-0 z-50 w-[1.5in] -translate-x-[50%] -translate-y-[50%] -rotate-12 font-mono">
      <Shot
        className="flex flex-col items-center"
        handleClassName="shadow-xl"
        documentId={documentId}
        sceneId={sceneId || ''}
        shotId={elementId}
        type={getShotViewVariantByShotListType(shotListType)}
        active={true}
        editable={false}
      />
    </div>
  );
}
