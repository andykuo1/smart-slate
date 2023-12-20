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
      const lastSeekableRangeIndex = video.seekable.length - 1;
      const lastSeekableRangeStart = video.seekable.start(
        lastSeekableRangeIndex,
      );
      const lastSeekableRangeEnd = video.seekable.end(lastSeekableRangeIndex);
      const lastSeekableRange = Number.isFinite(lastSeekableRangeEnd)
        ? lastSeekableRangeEnd
        : Number.isFinite(lastSeekableRangeStart)
          ? lastSeekableRangeStart
          : 0;
      const seekToSeconds = timestampSeconds;
      // NOTE: Delay seeking, otherwise Safari won't fire event.
      setTimeout(() => {
        // Start seeking!
        video.addEventListener('seeking', () => {
          console.log('SEEKING', video.currentTime);
        });
        video.addEventListener('seeked', () => {
          console.log('SEEKED');
          const canvas = document.createElement('canvas');
          drawElementToCanvasWithRespectToAspectRatio(
            canvas,
            video,
            width,
            height,
          );
          const result = canvas.toDataURL('image/png', 0.5);
          resolve(result);
        });
        video.currentTime = seekToSeconds;
      }, 200);
    });
    video.load();
  });
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement|HTMLVideoElement} element
 * @param {number} toWidth
 * @param {number} toHeight
 */
export function drawElementToCanvasWithRespectToAspectRatio(
  canvas,
  element,
  toWidth,
  toHeight,
) {
  const w = element.width;
  const h = element.height;
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
  ctx.drawImage(element, 0, 0, w, h, dx, dy, w * ratio, h * ratio);
}
