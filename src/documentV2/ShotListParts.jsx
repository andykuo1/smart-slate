import { useRef } from 'react';

import { useShotIds } from '@/stores/document';
import { useAsDraggableElement } from '@/stores/draggableV3';

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
 */
export default function ShotListParts({
  className,
  documentId,
  sceneId,
  blockIds,
  shotListType,
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
      <NewShot
        className={getNewShotClassNameByShotListType(shotListType)}
        documentId={documentId}
        sceneId={sceneId}
        blockId={lastBlockId || ''}
        type={getShotViewVariantByShotListType(shotListType)}
      />
    </ul>
  );
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 */
function getULClassNameByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return 'grid-cols-1';
    case '':
    case 'grid':
    default:
      return 'grid-cols-[repeat(auto-fill,minmax(min(2.5in,100%),1fr))]';
  }
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 */
function getNewShotClassNameByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return 'mr-auto';
    case '':
    case 'grid':
    default:
      return '';
  }
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 * @returns {ShotViewVariant}
 */
export function getShotViewVariantByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return 'line';
    case '':
    case 'grid':
    default:
      return 'block';
  }
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 */
export function getDragDirectionByShotListType(shotListType) {
  switch (shotListType) {
    case 'list':
      return 'vertical';
    default:
      return 'horizontal';
  }
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
      documentId={documentId}
      sceneId={sceneId}
      blockId={blockId}
      shotId={shotId}
      details={shotListType === 'list'}
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
