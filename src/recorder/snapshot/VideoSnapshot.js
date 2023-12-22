/**
 * @param {Blob} videoBlob
 * @param {number} timestampSeconds
 * @param {number} width
 * @param {number} height
 */
export async function captureVideoSnapshot(
  videoBlob,
  timestampSeconds,
  width,
  height,
) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(videoBlob);
    video.setAttribute('src', url);
    video.addEventListener('error', reject);
    video.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      // Start seeking!
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        drawElementToCanvasWithRespectToAspectRatio(
          canvas,
          video,
          video.videoWidth || video.width,
          video.videoHeight || video.height,
          width,
          height,
        );
        const result = canvas.toDataURL('image/png', 0.5);
        resolve(result);
      });
      // NOTE: Delay seeking, otherwise Safari won't fire event.
      setTimeout(() => (video.currentTime = timestampSeconds), 100);
    });
    video.load();
  });
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement|HTMLVideoElement} element
 * @param {number} elementWidth
 * @param {number} elementHeight
 * @param {number} toWidth
 * @param {number} toHeight
 */
export function drawElementToCanvasWithRespectToAspectRatio(
  canvas,
  element,
  elementWidth,
  elementHeight,
  toWidth,
  toHeight,
) {
  const w = elementWidth;
  const h = elementHeight;
  const hr = toWidth / w;
  const wr = toHeight / h;
  const ratio = Math.min(hr, wr);

  const dx = (toWidth - w * ratio) / 2;
  const dy = (toHeight - h * ratio) / 2;
  canvas.width = toWidth;
  canvas.height = toHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    element,
    0,
    0,
    elementWidth,
    elementHeight,
    dx,
    dy,
    w * ratio,
    h * ratio,
  );
}
