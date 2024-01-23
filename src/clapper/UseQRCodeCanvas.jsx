import { useEffect } from 'react';

import QRCode from 'qrcode';

// import { drawElementToCanvasWithRespectToAspectRatio } from '@/recorder/snapshot/VideoSnapshot';

/**
 *
 * @param {string} qrCodeData
 * @param {import('react').RefObject<HTMLElement>} containerRef
 * @param {import('react').RefObject<HTMLCanvasElement>} canvasRef
 */
export function useQRCodeCanvas(qrCodeData, containerRef, canvasRef) {
  useEffect(() => {
    if (!qrCodeData) {
      return;
    }
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }
    QRCode.toCanvas(canvas, qrCodeData, { errorCorrectionLevel: 'L' });
    /*
    const buffer = document.createElement('canvas');
    QRCode.toCanvas(canvas, qrCodeData, { errorCorrectionLevel: 'L' });
    const rect = container.getBoundingClientRect();
    drawElementToCanvasWithRespectToAspectRatio(
      canvas,
      buffer,
      buffer.width,
      buffer.height,
      rect.width,
      rect.height,
    );

    // TODO: Fix this for mobile.
    /*
    let handle = requestAnimationFrame(onAnimationFrame);
    function onAnimationFrame() {
      if (handle === 0) {
        return;
      }
      handle = requestAnimationFrame(onAnimationFrame);
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) {
        return;
      }
      const buffer = document.createElement('canvas');
      QRCode.toCanvas(buffer, qrCodeData, { errorCorrectionLevel: 'L' });
      const rect = container.getBoundingClientRect();
      drawElementToCanvasWithRespectToAspectRatio(
        canvas,
        buffer,
        buffer.width,
        buffer.height,
        rect.width,
        rect.height,
      );
    }
    return () => {
      const prevHandle = handle;
      handle = 0;
      cancelAnimationFrame(prevHandle);
    };
    */
  }, [qrCodeData, canvasRef, containerRef]);
}
