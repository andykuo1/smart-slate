import { useCallback, useEffect, useRef } from 'react';

import QRCode2AddIcon from '@material-symbols/svg-400/rounded/qr_code_2_add.svg';
import QRCode from 'qrcode';

import { drawElementToCanvasWithRespectToAspectRatio } from '@/recorder/snapshot/VideoSnapshot';
import { useDefineTake } from '@/serdes/UseDefineTake';
import { useResolveTakeQRCodeKey } from '@/serdes/UseResolveTakeQRCodeKey';
import { getTakeById } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';

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
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeQRCodeKey = useResolveTakeQRCodeKey();

  const onClick = useCallback(
    function _onClick() {
      const thisTakeId = takeId || defineTake(documentId, sceneId, shotId);
      const store = UNSAFE_getStore();
      resolveTakeQRCodeKey(store, documentId, sceneId, shotId, thisTakeId);
      setUserCursor(documentId, sceneId, shotId, thisTakeId);
    },
    [
      documentId,
      sceneId,
      shotId,
      takeId,
      UNSAFE_getStore,
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
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    if (!canvas || !ctx) {
      return;
    }
    if (!data) {
      return;
    }
    const buffer = document.createElement('canvas');
    QRCode.toCanvas(buffer, data, { errorCorrectionLevel: 'L' });
    const rect = canvas.getBoundingClientRect();
    drawElementToCanvasWithRespectToAspectRatio(
      canvas,
      buffer,
      buffer.width,
      buffer.height,
      rect.width,
      rect.height,
    );
  }, [data]);
  return (
    <div className={'w-full h-full flex items-center' + ' ' + className}>
      <canvas ref={canvasRef} className="block mx-auto w-full h-full" />
    </div>
  );
}
