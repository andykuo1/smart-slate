import { BrowserQRCodeReader, NotFoundException } from '@zxing/library';

/**
 * @param {HTMLVideoElement} video
 */
export async function scanVideoForQRCodes(video) {
  const reader = new BrowserQRCodeReader();
  let results = [];
  try {
    let result = await reader.decodeFromVideo(video);
    results.push(result.getText());
  } catch (err) {
    console.error('[QRCodeReader] ', err);
    results.push('');
  }
  return results;
}

/**
 * @param {HTMLVideoElement} video
 * @param {Blob} videoBlob
 */
export async function scanVideoBlobForQRCodes(video, videoBlob) {
  let results = [];
  const reader = new BrowserQRCodeReader();
  const url = URL.createObjectURL(videoBlob);
  try {
    let result = await reader.decodeFromVideo(video, url);
    results.push(result.getText());
  } catch (err) {
    if (err instanceof NotFoundException) {
      // No qr code in this one.
      results.push('');
    } else {
      console.error('[QRCodeReader] ', err);
    }
  } finally {
    URL.revokeObjectURL(url);
  }
  return results;
}
