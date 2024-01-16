import { useCallback, useEffect, useRef } from 'react';

import QRCode2AddIcon from '@material-symbols/svg-400/rounded/qr_code_2_add.svg';
import QRCode from 'qrcode';

import { useDefineTake } from '@/serdes/UseDefineTake';
import { useResolveTakeQRCodeKey } from '@/serdes/UseResolveTakeQRCodeKey';
import { getTakeById, useDocumentStore } from '@/stores/document';
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
    (ctx) => getTakeById(ctx, documentId, takeId)?.exportedQRCodeKey,
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
          <label className="text-xs">CREATE TAKE</label>
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
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    if (!data) {
      return;
    }
    QRCode.toCanvas(canvas, data, { errorCorrectionLevel: 'L' });
  }, [data]);
  return <canvas ref={canvasRef} className={className} />;
}
