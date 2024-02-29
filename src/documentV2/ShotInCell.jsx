import { useShotDescription, useShotType } from '@/stores/document';
import BarberpoleStyle from '@/styles/Barberpole.module.css';

import {
  SceneShotNumberPart,
  ShotGroupPart,
  ShotTypePart,
} from './ShotInBaseParts';
import { ShotReferenceImagePlaceholder, ShotThumbnail } from './ShotParts';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLDivElement|null>} [props.handleRef]
 * @param {string} [props.handleClassName]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} props.active
 * @param {boolean} props.editable
 */
export default function ShotInCell({
  className,
  handleRef,
  handleClassName,
  documentId,
  sceneId,
  shotId,
  active,
  editable,
}) {
  const shotType = useShotType(documentId, shotId);
  const shotText = useShotDescription(documentId, shotId);
  return (
    <fieldset
      className={
        'relative flex w-[2.5in] flex-col overflow-hidden text-xs' +
        ' ' +
        className
      }>
      <div
        ref={handleRef}
        className={
          'p-1 text-gray-400' +
          ' ' +
          (active ? 'bg-white' + ' ' + BarberpoleStyle.barberpole : '') +
          ' ' +
          handleClassName
        }>
        <ShotThumbnail
          className="bg-black"
          documentId={documentId}
          shotId={shotId}
          placeholder={<ShotReferenceImagePlaceholder shotType={shotType} />}
          clipped={true}>
          <legend className="overflow-hidden whitespace-nowrap text-center text-white">
            <SceneShotNumberPart
              className="absolute left-0 top-0"
              documentId={documentId}
              sceneId={sceneId}
              shotId={shotId}
            />
            <ShotGroupPart
              className="absolute left-0 right-0 top-0"
              documentId={documentId}
              shotId={shotId}
            />
            <ShotTypePart
              className="absolute right-0 top-0"
              documentId={documentId}
              shotId={shotId}
            />
          </legend>
          <div className="base absolute bottom-0 left-2 right-2 -mb-0.5 truncate italic text-white">
            {shotText}
          </div>
        </ShotThumbnail>
      </div>
    </fieldset>
  );
}
