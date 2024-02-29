import ShotInBlock from './ShotInBlock';
import ShotInCell from './ShotInCell';
import ShotInLine from './ShotInLine';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLLIElement|null>} [props.containerRef]
 * @param {import('react').MutableRefObject<HTMLDivElement|null>} [props.handleRef]
 * @param {string} [props.handleClassName]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('../ShotListParts').ShotViewVariant} props.type
 * @param {boolean} props.active
 * @param {boolean} props.editable
 */
export function Shot({
  className,
  containerRef,
  handleRef,
  handleClassName,
  documentId,
  sceneId,
  shotId,
  type,
  active,
  editable,
}) {
  return (
    <li ref={containerRef} className={className}>
      {type === 'cell' ? (
        <ShotInCell
          handleRef={handleRef}
          handleClassName={handleClassName}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          active={active}
          editable={editable}
        />
      ) : type === 'block' ? (
        <ShotInBlock
          handleRef={handleRef}
          handleClassName={handleClassName}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          active={active}
          editable={editable}
        />
      ) : (
        <ShotInLine
          handleRef={handleRef}
          handleClassName={handleClassName}
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          active={active}
          editable={editable}
        />
      )}
    </li>
  );
}
