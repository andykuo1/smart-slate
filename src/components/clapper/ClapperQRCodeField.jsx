import { useEffect, useRef, useState } from 'react';

import QRCode from 'qrcode';

import {
  useTakeFileNameResolver,
  useTakeShotHashResolver,
} from '@/serdes/UseTakeExporter';
import { useDocumentStore } from '@/stores/document';
import { useCurrentCursor } from '@/stores/user';

export default function ClapperQRCodeField() {
  const [dataString, setDataString] = useState('');
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();

  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const resolveTakeFileName = useTakeFileNameResolver();
  const resolveTakeShotHash = useTakeShotHashResolver();

  useEffect(() => {
    if (!documentId || !sceneId || !shotId) {
      return;
    }
    const store = UNSAFE_getStore();
    const takeShotHash = resolveTakeShotHash(store, documentId, shotId);
    const takeFileName = resolveTakeFileName(
      store,
      documentId,
      sceneId,
      shotId,
      takeId,
      takeShotHash,
      '',
    );
    let takeFileNameWithoutExt = takeFileName;
    const extIndex = takeFileName.lastIndexOf('.');
    if (extIndex >= 0) {
      takeFileNameWithoutExt = takeFileName.substring(0, extIndex);
    }
    const result = JSON.stringify({ key: takeFileNameWithoutExt });
    const base64 = btoa(result);
    setDataString('https://jsonhero.io/new?j=' + base64);
  }, [
    documentId,
    sceneId,
    shotId,
    takeId,
    UNSAFE_getStore,
    resolveTakeFileName,
    resolveTakeShotHash,
    setDataString,
  ]);

  return <TakeQRCode data={dataString} />;
}

/**
 * @param {object} props
 * @param {string} props.data
 */
function TakeQRCode({ data }) {
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
  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="flex-1 m-auto" />
      <a
        className="text-xs whitespace-nowrap overflow-x-auto w-full"
        href={data}
        target="_blank">
        {data}
      </a>
    </div>
  );
}
