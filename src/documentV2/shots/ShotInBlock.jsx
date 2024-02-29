import { useShotType } from '@/stores/document';
import BarberpoleStyle from '@/styles/Barberpole.module.css';

import {
  SceneShotNumberPart,
  ShotGroupPart,
  ShotTypePart,
} from './ShotInBaseParts';
import ShotReferenceImagePlaceholder from './parts/ShotReferenceImagePlaceholder';
import ShotTextArea from './parts/ShotTextArea';
import ShotThumbnail from './parts/ShotThumbnail';

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
 * @param {import('react').ReactNode} [props.children]
 */
export default function ShotInBlock({
  className,
  handleRef,
  handleClassName,
  documentId,
  sceneId,
  shotId,
  active,
  editable,
  children,
}) {
  const shotType = useShotType(documentId, shotId);
  return (
    <fieldset
      className={
        'relative flex w-[2.5in] flex-col overflow-hidden' + ' ' + className
      }>
      {/* NOTE: width-3in is closest to smallest supported screen at 320px (about 3.2in by CSS standard). */}
      <legend className="float-left flex w-full overflow-hidden whitespace-nowrap text-center">
        <SceneShotNumberPart
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
        <ShotGroupPart
          className="flex-1"
          documentId={documentId}
          shotId={shotId}
        />
        <ShotTypePart documentId={documentId} shotId={shotId} />
      </legend>
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
          documentId={documentId}
          shotId={shotId}
          placeholder={<ShotReferenceImagePlaceholder shotType={shotType} />}
        />
      </div>
      <ShotTextArea
        className="min-h-[4.5rem] px-2"
        documentId={documentId}
        shotId={shotId}
        disabled={!editable}
      />
      {children}
    </fieldset>
  );
}
