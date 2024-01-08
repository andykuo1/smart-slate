/**
 * https://webkit.org/blog/6784/new-video-policies-for-ios/
 *
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @param {Blob} videoBlob
 * @param {number} seekToSeconds
 * @param {number} width
 * @param {number} height
 */
export function captureVideoSnapshot(
  videoRef,
  videoBlob,
  seekToSeconds,
  width,
  height,
) {
  const video = videoRef.current;
  if (!video) {
    return;
  }
  // NOTE: For some reason, only srcObject works for Safari for loading video.
  video.srcObject = videoBlob;
  // NOTE: This needs to be called DIRECTLY in a user-gesture callback
  //  for mobile support :)
  video.play();

  return new Promise((resolve, reject) => {
    console.log('[UseVideoSnapshot] Entering promise to take snapshot...');
    const video = videoRef.current;
    if (!video) {
      return;
    }
    /** @param {ErrorEvent} e */
    function onError(e) {
      console.log('[UseVideoSnapshot] ERROR! ' + e.message);
      const video = videoRef.current;
      if (!video) {
        return;
      }
      reject(e.error);
    }

    function onSeeked() {
      console.log('[UseVideoSnapshot] Seeked complete.');
      const video = videoRef.current;
      if (!video) {
        return;
      }
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
      console.log('[UseVideoSnapshot] Metadata loaded.');
      const video = videoRef.current;
      if (!video) {
        return;
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
    console.log('[UseVideoSnapshot] Listenting...');
  });
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement|HTMLVideoElement} element
 * @param {number} elementWidth
 * @param {number} elementHeight
 * @param {number} toWidth
 * @param {number} toHeight
 * @param {boolean} autoRotate
 */
export function drawElementToCanvasWithRespectToAspectRatio(
  canvas,
  element,
  elementWidth,
  elementHeight,
  toWidth,
  toHeight,
  autoRotate = false,
) {
  let shouldRotate = false;
  if (autoRotate) {
    const elementRatio = elementWidth / elementHeight;
    const toRatio = toWidth / toHeight;
    if (Math.sign(1 - elementRatio) !== Math.sign(1 - toRatio)) {
      // TODO: Fix this to save on pixels! It doesn't need to be a square.
      let max = Math.max(toWidth, toHeight);
      toWidth = max;
      toHeight = max;
      shouldRotate = true;
    }
  }
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
  let rw = ratio * w;
  let rh = ratio * h;
  if (shouldRotate) {
    ctx.translate(dx, dy);
    ctx.translate(rw / 2, rh / 2);
    ctx.rotate(Math.PI / 2);
    ctx.translate(-rw / 2, -rh / 2);
    ctx.translate(-dx, -dy);
  }
  ctx.drawImage(element, 0, 0, elementWidth, elementHeight, dx, dy, rw, rh);
  ctx.resetTransform();
}
