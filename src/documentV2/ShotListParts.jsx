import { useRef } from 'react';

import { useShotIds } from '@/stores/document';
import { useAsDraggableElement } from '@/stores/draggableV3';

import {
  getDragDirectionByShotListType,
  getNewShotClassNameByShotListType,
  getShotMarginClassNameByShotListType,
  getShotViewVariantByShotListType,
  getULClassNameByShotListType,
} from './ShotListType';
import { useAddShot } from './UseAddShot';
import ShotForDraggableShotList from './shots/ShotForDraggableShotList';
import ShotInBlockNew from './shots/ShotInBlockNew';
import ShotInLineNew from './shots/ShotInLineNew';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {Array<import('@/stores/document/DocumentStore').BlockId>} props.blockIds
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} props.shotListType
 * @param {boolean} props.newable
 */
export default function ShotListParts({
  className,
  documentId,
  sceneId,
  blockIds,
  shotListType,
  newable,
}) {
  const lastBlockId = blockIds.at(-1);
  return (
    <ul
      className={
        'grid' +
        ' ' +
        getULClassNameByShotListType(shotListType) +
        ' ' +
        className
      }>
      {blockIds.map((blockId) => (
        <ShotListItemsPerBlock
          key={blockId}
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotListType={shotListType}
        />
      ))}
      {newable && (
        <NewShot
          className={getNewShotClassNameByShotListType(shotListType)}
          documentId={documentId}
          sceneId={sceneId}
          blockId={lastBlockId || ''}
          type={getShotViewVariantByShotListType(shotListType)}
        />
      )}
    </ul>
  );
}

export const NEW_ELEMENT_ID = '__NEW__';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} props.shotListType
 */
function ShotListItemsPerBlock({ documentId, sceneId, blockId, shotListType }) {
  const shotIds = useShotIds(documentId, blockId);
  return shotIds.map((shotId) => (
    <ShotForDraggableShotList
      key={shotId}
      className={getShotMarginClassNameByShotListType(shotListType)}
      documentId={documentId}
      sceneId={sceneId}
      blockId={blockId}
      shotId={shotId}
      type={getShotViewVariantByShotListType(shotListType)}
      direction={getDragDirectionByShotListType(shotListType)}
    />
  ));
}

/** @typedef {'cell'|'line'|'block'} ShotViewVariant */

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {ShotViewVariant} props.type
 */
function NewShot({ className, documentId, sceneId, blockId, type }) {
  const [render, click] = useAddShot(documentId, sceneId, blockId);
  const elementRef = useRef(/** @type {HTMLFieldSetElement|null} */ (null));
  // NOTE: To be able to drag something to the end of the list.
  useAsDraggableElement(
    elementRef,
    elementRef,
    blockId,
    // NOTE: Refer to the <DraggableShot/> for the other piece of this...
    NEW_ELEMENT_ID,
    '',
    false,
    true,
  );

  if (type === 'cell') {
    // TODO: Gotta add this.
    return null;
  } else if (type === 'block') {
    return (
      <ShotInBlockNew
        containerRef={elementRef}
        className={
          'opacity-30 hover:cursor-pointer hover:opacity-100' + ' ' + className
        }
        onClick={click}>
        {render()}
      </ShotInBlockNew>
    );
  } else {
    return (
      <ShotInLineNew
        containerRef={elementRef}
        className={
          'flex aspect-video w-[1.8in] flex-row' +
          ' ' +
          'opacity-30 hover:cursor-pointer hover:opacity-100' +
          ' ' +
          className
        }
        onClick={click}>
        {render()}
      </ShotInLineNew>
    );
  }
}
