/**
 * @param {HTMLVideoElement} video
 * @param {Blob} blob
 */
export function setVideoSrcBlob(video, blob) {
  try {
    console.log('[VideoBlobSource] Setting srcObject as ' + blob.type);
    // NOTE: This is a Safari bug :(
    //  https://bugs.webkit.org/show_bug.cgi?id=232076
    //  As a temporary fix, we first try to use srcObject.
    video.srcObject = blob;
  } catch (e) {
    console.log(
      '[VideoBlobSource] Failed to set srcObject to Blob. Trying the old way.',
    );
    // ... then fallback to src when it fails :(
    video.src = URL.createObjectURL(blob);
  }
}
