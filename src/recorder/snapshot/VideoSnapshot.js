/**
 * https://webkit.org/blog/6784/new-video-policies-for-ios/
 *
 * @param {Blob} videoBlob
 * @param {number} seekToSeconds
 * @param {number} width
 * @param {number} height
 */
export async function captureVideoSnapshot(
  videoBlob,
  seekToSeconds,
  width,
  height,
) {
  const video = document.createElement('video');
  video.setAttribute('preload', 'metadata');
  video.toggleAttribute('muted', true);
  video.toggleAttribute('playsinline', true);
  try {
    // NOTE: We can use srcObject, but it's not universally supported yet.
    video.srcObject = videoBlob;
  } catch {
    // ... so sometimes we stick to the old way :)
    video.src = URL.createObjectURL(videoBlob);
  }

  /**
   * @param {ErrorEvent} e
   */
  function onError(e) {
    if (video.src) {
      URL.revokeObjectURL(video.src);
    }
    throw e.error;
  }
  video.addEventListener('error', onError);

  // NOTE: This needs to be called DIRECTLY in a user-gesture callback
  //  for mobile support :)
  video.load();

  return new Promise((resolve, reject) => {
    // Replace the synchronouse error callback
    video.removeEventListener('error', onError);
    video.addEventListener('error', (e) => {
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }
      reject(e.error);
    });
    video.addEventListener('loadeddata', () => {
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }
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
      // Start seeking!
      video.currentTime = seekToSeconds;
    });
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
