import { drawElementToCanvasWithRespectToAspectRatio } from '@/recorder/snapshot/VideoSnapshot';

/**
 * @param {Blob} blob
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {import('react').RefObject<HTMLCanvasElement>} canvasRef
 * @returns {Promise<string>}
 */
export async function blobToDataURI(blob, maxWidth, maxHeight, canvasRef) {
  return new Promise((resolve, reject) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      reject(new Error('No valid canvas element.'));
      return;
    }
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.addEventListener('load', () => {
      URL.revokeObjectURL(url);
      drawElementToCanvasWithRespectToAspectRatio(
        canvas,
        img,
        img.width,
        img.height,
        maxWidth,
        maxHeight,
        false,
      );
      const uri = canvas.toDataURL('image/png', 0.5);
      resolve(uri);
    });
    img.addEventListener('error', reject);
    img.src = url;
  });
}
