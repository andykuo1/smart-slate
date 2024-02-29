import DragIndicatorIcon from '@material-symbols/svg-400/rounded/drag_indicator.svg';

import { useUserStore } from '@/stores/user';
import BarberpoleStyle from '@/styles/Barberpole.module.css';

import {
  SceneShotNumberPart,
  ShotGroupPart,
  ShotTypePart,
} from './ShotInBaseParts';
import ShotTextArea from './ShotTextArea';

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
export default function ShotInLine({
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
  const isCursorTypeMoveable = useUserStore(
    (ctx) => ctx.editor?.documentEditor?.cursorType === 'edit',
  );
  return (
    <fieldset
      className={
        'relative flex h-12 w-full flex-row gap-2' +
        ' ' +
        handleClassName +
        ' ' +
        className
      }>
      {/* NOTE: height-12 from 2 line-heights of text. */}
      {/* NOTE: width-9rem from max chars (noted below). */}
      <legend
        className={
          'relative float-left grid w-[9rem] grid-cols-2 grid-rows-2 overflow-hidden whitespace-nowrap bg-white text-center'
        }>
        <SceneShotNumberPart
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
        />
        <ShotTypePart documentId={documentId} shotId={shotId} />
        <ShotGroupPart
          className="col-span-2"
          documentId={documentId}
          shotId={shotId}
        />
      </legend>
      <div
        ref={handleRef}
        className={
          'absolute left-0 top-0 -translate-x-[50%] rounded bg-white text-gray-400 transition-opacity' +
          ' ' +
          (!isCursorTypeMoveable ? 'opacity-0' : 'opacity-100')
        }>
        <DragIndicatorIcon className="h-full w-6 fill-current" />
      </div>
      <ShotTextArea
        className="flex-1"
        documentId={documentId}
        shotId={shotId}
        disabled={!editable}
      />
      <div
        className={
          'absolute bottom-0 z-10 h-1 w-full' +
          ' ' +
          (active ? 'bg-white' + ' ' + BarberpoleStyle.barberpole : '')
        }
      />
      {children}
    </fieldset>
  );
}
