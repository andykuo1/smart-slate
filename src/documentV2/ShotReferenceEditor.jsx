import {
  Dialog,
  DialogDescription,
  DialogDismiss,
  DialogHeading,
} from '@ariakit/react';
import { useCallback, useRef, useState } from 'react';

import CloseIcon from '@material-symbols/svg-400/rounded/close.svg';

import FieldButton from '@/fields/FieldButton';
import FieldToggle from '@/fields/FieldToggle';
import { getShotById, useShotType } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId, useUserStore } from '@/stores/user';
import DialogStyle from '@/styles/Dialog.module.css';
import { MAX_THUMBNAIL_HEIGHT } from '@/values/Resolutions';

import { LetterboxOutline, ShotReferenceImageWithLetterbox } from './ShotParts';

// NOTE: A good-enough guess at the scaling-to-translation factor
const REPOSITION_DELTA_MULT = 0.2;
const REMARGIN_DELTA_MULT = 0.2;

export default function ShotReferenceEditor() {
  const thumbnailRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const documentId = useCurrentDocumentId();
  const shotId = useUserStore((ctx) => ctx.editor.shotEditor.shotId);
  const shotType = useShotType(documentId, shotId);
  const setShotEditorShotId = useUserStore((ctx) => ctx.setShotEditorShotId);
  const setShotReferenceOffset = useDocumentStore(
    (ctx) => ctx.setShotReferenceOffset,
  );
  const { touch, mouse, wheel } = useInputOffsetHandler(documentId, shotId);
  const [blackBox, setBlackBox] = useState(false);

  const onToggle = useCallback(
    function _onToggle() {
      setBlackBox((prev) => !prev);
    },
    [setBlackBox],
  );

  return (
    <Dialog
      className={DialogStyle.dialog}
      open={Boolean(shotId)}
      onClose={() => setShotEditorShotId('')}
      modal={true}>
      <DialogDismiss className="absolute right-4 top-4 text-left text-xl">
        <CloseIcon className="h-6 w-6 fill-current" />
      </DialogDismiss>
      <DialogHeading className="">Shot Editor</DialogHeading>
      <DialogDescription className="text-gray-400">
        Edit with finer control over shot details.
      </DialogDescription>
      <div
        ref={thumbnailRef}
        className="relative my-2 cursor-crosshair select-none overflow-hidden rounded-xl"
        onTouchStart={touch}
        onMouseDown={mouse}
        onWheel={wheel}>
        <ShotReferenceImageWithLetterbox
          className="pointer-events-none bg-gray-200 text-gray-400"
          documentId={documentId}
          shotId={shotId}
          shotType={shotType}
          letterbox={blackBox}
        />
        <LetterboxOutline width="calc(100% - 25%)" shotType="" />
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-center opacity-30">Drag image to re-position</p>
        <InputMarginHandler documentId={documentId} shotId={shotId} />
        <div className="flex flex-row gap-4">
          <FieldButton
            onClick={() => setShotReferenceOffset(documentId, shotId, 0, 0, 0)}>
            Reset
          </FieldButton>
          <FieldToggle onClick={onToggle} value={blackBox}>
            Black Box
          </FieldToggle>
        </div>
      </div>
    </Dialog>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function InputMarginHandler({ documentId, shotId }) {
  const margin = useDocumentStore(
    (ctx) => getShotById(ctx, documentId, shotId)?.referenceMargin,
  );
  const setShotReferenceMargin = useDocumentStore(
    (ctx) => ctx.setShotReferenceMargin,
  );

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="shot-editor-magnify">Magnify</label>
      <input
        type="range"
        className="flex-1"
        list="thumbnail-value-sizes"
        id="shot-editor-magnify"
        min={-MAX_THUMBNAIL_HEIGHT * 0.25}
        max={MAX_THUMBNAIL_HEIGHT * 4}
        value={margin}
        onChange={(e) =>
          setShotReferenceMargin(documentId, shotId, Number(e.target.value))
        }
      />
      <datalist id="thumbnail-value-sizes">
        <option value={0} label="0" />
        <option value={MAX_THUMBNAIL_HEIGHT} label="1" />
        <option value={MAX_THUMBNAIL_HEIGHT * 2} label="2" />
        <option value={MAX_THUMBNAIL_HEIGHT * 3} label="3" />
      </datalist>
    </div>
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} shotId
 */
function useInputOffsetHandler(documentId, shotId) {
  const initialOffsetRef = useRef([0, 0, 0]);
  const dragStartRef = useRef([0, 0]);

  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const setShotReferenceOffset = useDocumentStore(
    (ctx) => ctx.setShotReferenceOffset,
  );
  const addShotReferenceOffset = useDocumentStore(
    (ctx) => ctx.addShotReferenceOffset,
  );

  const onWheel = useCallback(
    /** @type {import('react').WheelEventHandler<any>}*/
    function _onWheel(e) {
      addShotReferenceOffset(
        documentId,
        shotId,
        0,
        0,
        -(e.deltaX * REMARGIN_DELTA_MULT + e.deltaY * REMARGIN_DELTA_MULT),
      );
    },
    [documentId, shotId, addShotReferenceOffset],
  );

  const onMouseMove = useCallback(
    /**
     * @param {MouseEvent} e
     */
    function _onMouseMove(e) {
      let initialOffset = initialOffsetRef.current;
      let dragStart = dragStartRef.current;
      const dx = (e.clientX - dragStart[0]) * REPOSITION_DELTA_MULT;
      const dy = (e.clientY - dragStart[1]) * REPOSITION_DELTA_MULT;
      setShotReferenceOffset(
        documentId,
        shotId,
        initialOffset[0] + dx,
        initialOffset[1] + dy,
        initialOffset[2],
      );
    },
    [documentId, shotId, setShotReferenceOffset],
  );

  const onTouchMove = useCallback(
    /**
     * @param {TouchEvent} e
     */
    function _onTouchMove(e) {
      let initialOffset = initialOffsetRef.current;
      let dragStart = dragStartRef.current;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart[0];
      const dy = touch.clientY - dragStart[1];
      setShotReferenceOffset(
        documentId,
        shotId,
        initialOffset[0] + dx,
        initialOffset[1] + dy,
        initialOffset[2],
      );
    },
    [documentId, shotId, setShotReferenceOffset],
  );

  const onMouseUp = useCallback(
    /**
     * @param {MouseEvent} e
     */
    function _onMouseUp(e) {
      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('mouseup', onMouseUp, true);
    },
    [onMouseMove],
  );

  const onTouchEnd = useCallback(
    /**
     * @param {TouchEvent} e
     */
    function _onTouchEnd(e) {
      const target = /** @type {HTMLDivElement} */ (e.target);
      if (!target) {
        return;
      }
      target.removeEventListener('touchmove', onTouchMove);
      target.removeEventListener('touchend', onTouchEnd);
    },
    [onTouchMove],
  );

  const onMouseDown = useCallback(
    /** @type {import('react').MouseEventHandler<HTMLDivElement>} */
    function _onMouseDown(e) {
      const target = /** @type {HTMLDivElement} */ (e.target);
      if (!target) {
        return;
      }
      const store = UNSAFE_getStore();
      const shot = getShotById(store, documentId, shotId);
      if (!shot) {
        return;
      }

      let initialOffset = initialOffsetRef.current;
      initialOffset[0] = shot.referenceOffsetX;
      initialOffset[1] = shot.referenceOffsetY;
      initialOffset[2] = shot.referenceMargin;

      let dragStart = dragStartRef.current;
      dragStart[0] = e.clientX;
      dragStart[1] = e.clientY;

      document.addEventListener('mousemove', onMouseMove, true);
      document.addEventListener('mouseup', onMouseUp, true);
    },
    [documentId, shotId, onTouchMove, onTouchEnd, UNSAFE_getStore],
  );

  const onTouchStart = useCallback(
    /** @type {import('react').TouchEventHandler<HTMLDivElement>} */
    function _onTouchStart(e) {
      const target = /** @type {HTMLDivElement} */ (e.target);
      if (!target) {
        return;
      }
      const store = UNSAFE_getStore();
      const shot = getShotById(store, documentId, shotId);
      if (!shot) {
        return;
      }

      let initialOffset = initialOffsetRef.current;
      initialOffset[0] = shot.referenceOffsetX;
      initialOffset[1] = shot.referenceOffsetY;
      initialOffset[2] = shot.referenceMargin;

      const touch = e.touches[0];
      let dragStart = dragStartRef.current;
      dragStart[0] = touch.clientX;
      dragStart[1] = touch.clientY;

      target.addEventListener('touchmove', onTouchMove);
      target.addEventListener('touchend', onTouchEnd);
    },
    [documentId, shotId, onTouchMove, onTouchEnd, UNSAFE_getStore],
  );

  return {
    touch: onTouchStart,
    mouse: onMouseDown,
    wheel: onWheel,
  };
}
