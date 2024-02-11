import { useCallback, useEffect, useRef } from 'react';

import QRCode2AddIcon from '@material-symbols/svg-400/rounded/qr_code_2_add.svg';

import { useDefineTake } from '@/serdes/UseDefineTake';
import { useResolveTakeQRCodeKey } from '@/serdes/UseResolveTakeQRCodeKey';
import { getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';

import { useQRCodeCanvas } from './UseQRCodeCanvas';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {(newTakeId: import('@/stores/document/DocumentStore').TakeId, prevTakeId: import('@/stores/document/DocumentStore').TakeId) => void} [props.onChange]
 */
export default function ClapperQRCodeField({
  className,
  documentId,
  sceneId,
  shotId,
  takeId,
  onChange,
}) {
  const setUserCursor = useSetUserCursor();
  const takeExportedQRCodeKey = useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportDetails?.qrCodeKey,
  );
  const defineTake = useDefineTake();
  const resolveTakeQRCodeKey = useResolveTakeQRCodeKey();

  const onClick = useCallback(
    function _onClick() {
      const thisTakeId =
        takeId || defineTake(documentId, sceneId, shotId).takeId;
      resolveTakeQRCodeKey(documentId, sceneId, shotId, thisTakeId);
      setUserCursor(documentId, sceneId, shotId, thisTakeId);
      // Only call for CHANGED takes
      if (takeId !== thisTakeId) {
        onChange?.(thisTakeId, takeId);
      }
    },
    [
      documentId,
      sceneId,
      shotId,
      takeId,
      defineTake,
      setUserCursor,
      resolveTakeQRCodeKey,
      onChange,
    ],
  );

  useEffect(() => {
    if (!documentId || !sceneId || !shotId || !takeId) {
      return;
    }
    onClick();
  }, [documentId, sceneId, shotId, takeId, onClick]);

  return (
    <button
      className={'flex h-full w-full items-center' + ' ' + className}
      onClick={onClick}>
      {takeExportedQRCodeKey ? (
        <QRCodeView data={takeExportedQRCodeKey} />
      ) : (
        <div className="m-auto flex flex-col">
          <QRCode2AddIcon className="m-auto h-32 w-32 fill-current" />
        </div>
      )}
    </button>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.data
 */
function QRCodeView({ className, data }) {
  const containerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  useQRCodeCanvas(data, containerRef, canvasRef);
  return (
    <div
      ref={containerRef}
      className={'relative flex h-full w-full items-center' + ' ' + className}>
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 right-0 top-0 mx-auto block h-full w-full"
      />
    </div>
  );
}
