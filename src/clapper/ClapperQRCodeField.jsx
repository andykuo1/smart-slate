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
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 */
export default function ClapperQRCodeField({
  documentId,
  sceneId,
  shotId,
  takeId,
}) {
  const setUserCursor = useSetUserCursor();
  const takeExportedQRCodeKey = useDocumentStore(
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportDetails?.qrCodeKey,
  );
  const defineTake = useDefineTake();
  const resolveTakeQRCodeKey = useResolveTakeQRCodeKey();

  const onClick = useCallback(
    function _onClick() {
      const thisTakeId = takeId || defineTake(documentId, sceneId, shotId);
      resolveTakeQRCodeKey(documentId, sceneId, shotId, thisTakeId);
      setUserCursor(documentId, sceneId, shotId, thisTakeId);
    },
    [
      documentId,
      sceneId,
      shotId,
      takeId,
      defineTake,
      setUserCursor,
      resolveTakeQRCodeKey,
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
      className="w-full h-full flex items-center outline"
      onClick={onClick}>
      {takeExportedQRCodeKey ? (
        <QRCodeView className="m-auto" data={takeExportedQRCodeKey} />
      ) : (
        <div className="flex flex-col m-auto">
          <QRCode2AddIcon className="w-32 h-32 fill-current m-auto" />
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
      className={'relative w-full h-full flex items-center' + ' ' + className}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 block mx-auto w-full h-full"
      />
    </div>
  );
}
