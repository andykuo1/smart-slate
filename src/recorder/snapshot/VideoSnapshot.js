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
  video.muted = true;
  // NOTE: We can use srcObject, but it's not universally supported yet.
  // ... so we stick to the old way :)
  video.src = URL.createObjectURL(videoBlob);
  // NOTE: This needs to be called DIRECTLY in a user-gesture callback
  //  for mobile support :)
  video.load();

  return new Promise((resolve, reject) => {
    /** @param {ErrorEvent} e */
    function onError(e) {
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }
      reject(e.error);
    }

    function onSeeked() {
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
    }

    function onLoadedMetadata() {
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }
      // NOTE: This doesn't work well on Safari :(
      if (seekToSeconds > 0) {
        video.addEventListener('seeked', onSeeked);
        // Start seeking!
        video.currentTime = seekToSeconds;
      } else {
        onSeeked();
      }
    }

    video.addEventListener('error', onError);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
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
