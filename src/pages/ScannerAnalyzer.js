import { FFmpeg } from '@ffmpeg/ffmpeg';

import {
  formatSceneShotNumber,
  formatTakeNumber,
} from '@/components/takes/TakeNameFormat';
import { captureVideoSnapshot } from '@/recorder/snapshot/VideoSnapshot';
import { getFFmpegVideoMetadata } from '@/scanner/FFmpegTranscoder';
import {
  tryDecodeQRCodeKeyV0,
  tryDecodeQRCodeKeyV1,
} from '@/serdes/UseResolveTakeQRCodeKey';
import {
  findBlockWithShotId,
  findSceneWithBlockId,
  findShotWithShotHash,
  findShotWithTakeId,
  findTakeWithTakeNumber,
  getDocumentById,
  getTakeById,
} from '@/stores/document';
import { extname } from '@/utils/PathHelper';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

/**
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} out
 * @param {HTMLVideoElement} video
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 * @param {object} [opts]
 * @param {boolean} [opts.captureSnapshot]
 * @param {(current: import('@/stores/toolbox').ScannerAnalysisInfo) => void} [opts.onProgress]
 * @param {FFmpeg|null} [opts.ffmpeg]
 */
export async function analyzeFile(out, video, file, opts) {
  const { onProgress, ffmpeg } = opts || {};
  out.qrCode = '';
  out.progress = 0;
  onProgress?.(out);

  let url = URL.createObjectURL(file);
  try {
    // Step 1 - Is it playable?
    if (await tryPlayVideo(video, url)) {
      console.log('[Scanner] File is a playable video. Scanning it...');
      // Step 2 & 3 - Capture and scan
      await tryVideoBlobPath(out, file, video, opts);
    } else if (ffmpeg) {
      console.log(
        '[Scanner] File is NOT a playable video. Try transcoding it...',
      );
      // Step 2 & 3 - Transcode, capture, and scan (if able)
      await tryTranscodingPath(out, file, ffmpeg, opts);
    }

    // Step 4 - Decode QR code
    let resultDecoded =
      tryDecodeQRCodeKeyV1(out.qrCode) || tryDecodeQRCodeKeyV0(out.qrCode);
    out.decoded = resultDecoded;
    out.progress = 80;
    onProgress?.(out);

    // Done!
    out.progress = 100;
    onProgress?.(out);
    return out;
  } catch (e) {
    console.error('[Scanner] Error: ' + /** @type {Error} */ (e)?.message);
    return null;
  } finally {
    console.log('[Scanner] Finished! Cleaning up...');
    video.src = '';
    URL.revokeObjectURL(url);
  }
}

/**
 * NOTE: This does modify the analysis object!
 *
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} out
 * @param {HTMLVideoElement} video
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 * @param {object} [opts]
 * @param {boolean} [opts.captureSnapshot]
 * @param {(current: import('@/stores/toolbox').ScannerAnalysisInfo) => void} [opts.onProgress]
 */
async function tryVideoBlobPath(out, file, video, opts) {
  const { onProgress, captureSnapshot } = opts || {};

  // Step 2 - Capture snapshot
  if (captureSnapshot) {
    await tryCaptureSnapshotFromVideoForAnalysis(out, video);
  }
  out.progress = 20;
  onProgress?.(out);

  // Step 3 - Scan for QR Code
  const { tryScanVideoBlobForQRCode } = await import('@/scanner/QRCodeReader');
  let result = await tryScanVideoBlobForQRCode(video, file);
  if (!result) {
    console.log('[Scanner] No QR code found in video file. Skipping.');
    return null;
  }
  let resultText = result.getText();
  console.log('[Scanner] Found QR code: ' + resultText);
  out.qrCode = resultText;

  // Complete scanning at 60%
  out.progress = 60;
  onProgress?.(out);
}

/**
 * NOTE: This does modify the analysis object!
 *
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} out
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 * @param {FFmpeg} ffmpeg
 * @param {object} [opts]
 * @param {boolean} [opts.captureSnapshot]
 * @param {(current: import('@/stores/toolbox').ScannerAnalysisInfo) => void} [opts.onProgress]
 */
async function tryTranscodingPath(out, file, ffmpeg, opts) {
  const { onProgress, captureSnapshot } = opts || {};
  const inputDir = '/input';
  const inputName = inputDir + '/' + file.name;

  try {
    await ffmpeg.createDir(inputDir);
    await ffmpeg.createDir(inputDir);
    await ffmpeg.mount(
      // @ts-expect-error WORKERFS is supported in chrome.
      'WORKERFS',
      {
        files: [file],
      },
      inputDir,
    );

    const { duration } = await getFFmpegVideoMetadata(ffmpeg, inputName);
    // NOTE: Scanning will progress from 10% to 60% (50% in total).
    out.progress = 10;
    onProgress?.(out);
    let deltaProgressPerSecond = (1 / duration) * 50;
    for (let i = 0; i < duration; ++i) {
      let secs = String(i % 60).padStart(2, '0');
      let mins = String(Math.floor(i / 60) % 60).padStart(2, '0');
      let hours = String(Math.floor(i / 60 / 60)).padStart(2, '0');
      let timeString = `${hours}:${mins}:${secs}`;
      console.log(`Getting frame at ${timeString}...`);

      const outputName = 'output.jpg';
      const outputType = 'image/jpg';
      await ffmpeg.exec([
        '-ss',
        timeString,
        '-i',
        inputName,
        '-frames:v',
        '1',
        '-q:v',
        '30',
        outputName,
      ]);

      const result = await ffmpeg.readFile(outputName);
      await ffmpeg.deleteFile(outputName);

      let blob = new Blob([result], { type: outputType });

      // Step 2 (repeated per frame) - Capture snapshot (but just once)
      if (captureSnapshot && !out.snapshot) {
        // TODO: Resize this to a smaller image?
        await tryCaptureSnapshotFromBlobForAnalysis(out, blob);
      }

      // Step 3 (repeated per frame) - Scan for QR code
      let blobUrl = URL.createObjectURL(blob);
      try {
        const { scanImageURLForQRCode } = await import(
          '@/scanner/QRCodeReader'
        );
        let result = await scanImageURLForQRCode(blobUrl);
        if (result) {
          out.qrCode = result;
          break;
        }
      } catch (e) {
        console.error('[Scanner] Failed to scan for QR code.', e);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }

      out.progress += deltaProgressPerSecond;
      onProgress?.(out);
    }
  } catch (e) {
    console.error('[Scanner] Failed to transcode video.', e);
  } finally {
    await ffmpeg.unmount(inputDir);
    await ffmpeg.deleteDir(inputDir);
  }

  // Complete scanning at 60%
  out.progress = 60;
  onProgress?.(out);
}

/**
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} out
 * @param {Blob} blob
 */
async function tryCaptureSnapshotFromBlobForAnalysis(out, blob) {
  try {
    let promise = new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.addEventListener('loadend', (e) => {
        resolve(e.target?.result);
      });
      reader.addEventListener('error', (e) => {
        reject(e);
      });
    });
    let dataUrl = await promise;
    out.snapshot = dataUrl;
    console.log(
      `[Scanner] Captured snapshot as a data url (${
        dataUrl.length
      }): ${dataUrl.substring(0, 100)}.`,
    );
    return true;
  } catch (e) {
    console.error('[Scanner] Failed to capture snapshot.', e);
    return false;
  }
}

/**
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} out
 * @param {HTMLVideoElement} video
 */
async function tryCaptureSnapshotFromVideoForAnalysis(out, video) {
  try {
    const dataUrl = await captureVideoSnapshot(
      { current: video },
      0.5,
      MAX_THUMBNAIL_WIDTH,
      MAX_THUMBNAIL_HEIGHT,
    );
    out.snapshot = dataUrl;
    console.log('[Scanner] Captured snapshot from video!');
    return true;
  } catch (e) {
    console.error('[Scanner] Failed to capture snapshot.', e);
    return false;
  }
}

/**
 * NOTE: This DOES modify analysis object.
 *
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} analysis
 */
export async function deriveRenameValue(store, documentId, file, analysis) {
  /** @type {ReturnType<tryDecodeQRCodeKeyV1>|ReturnType<tryDecodeQRCodeKeyV0>} */
  let decoded = analysis.decoded;
  if (!decoded) {
    return '';
  }

  if (documentId && store) {
    // Has a store! Use all the information available to track this down!
    if ('takeId' in decoded) {
      // V1
      let d = /** @type {Exclude<ReturnType<tryDecodeQRCodeKeyV1>, null>} */ (
        decoded
      );
      let result = deriveRenameValueFromDocumentAndTakeId(
        store,
        documentId,
        d.takeId,
        file,
        analysis,
      );
      if (result) {
        return result;
      }
    } else {
      // V0
      let d = /** @type {Exclude<ReturnType<tryDecodeQRCodeKeyV0>, null>} */ (
        decoded
      );
      let result = deriveRenameValueFromDocumentAndShotHash(
        store,
        documentId,
        d.shotHash,
        d.takeNumber,
        file,
        analysis,
      );
      if (result) {
        return result;
      }
    }
  }

  // Not part of a project, so just do what we can.
  return deriveRenameValueFromAnalysisOnly(file, analysis);
}

/**
 * NOTE: This DOES modify analysis object.
 *
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').ShotHash} shotHash
 * @param {number} takeNumber
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} analysis
 */
function deriveRenameValueFromDocumentAndShotHash(
  store,
  documentId,
  shotHash,
  takeNumber,
  file,
  analysis,
) {
  let document = getDocumentById(store, documentId);
  let shot = findShotWithShotHash(store, documentId, shotHash);
  let take = findTakeWithTakeNumber(
    store,
    documentId,
    shot?.shotId || '',
    takeNumber,
  );
  let block = findBlockWithShotId(store, documentId, shot?.shotId || '');
  let scene = findSceneWithBlockId(store, documentId, block?.blockId || '');
  if (!document || !take || !shot || !block || !scene) {
    return '';
  }
  return deriveRenameValueFromDocumentSceneBlockShot(
    store,
    document,
    scene,
    block,
    shot,
    take,
    file,
    analysis,
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} analysis
 */
function deriveRenameValueFromDocumentAndTakeId(
  store,
  documentId,
  takeId,
  file,
  analysis,
) {
  let document = getDocumentById(store, documentId);
  let take = getTakeById(store, documentId, takeId);
  let shot = findShotWithTakeId(store, documentId, takeId);
  let block = findBlockWithShotId(store, documentId, shot?.shotId || '');
  let scene = findSceneWithBlockId(store, documentId, block?.blockId || '');
  if (!document || !take || !shot || !block || !scene) {
    return '';
  }
  return deriveRenameValueFromDocumentSceneBlockShot(
    store,
    document,
    scene,
    block,
    shot,
    take,
    file,
    analysis,
  );
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').Document} document
 * @param {import('@/stores/document/DocumentStore').Scene} scene
 * @param {import('@/stores/document/DocumentStore').Block} block
 * @param {import('@/stores/document/DocumentStore').Shot} shot
 * @param {import('@/stores/document/DocumentStore').Take} take
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} analysis
 */
function deriveRenameValueFromDocumentSceneBlockShot(
  store,
  document,
  scene,
  block,
  shot,
  take,
  file,
  analysis,
) {
  // Set take id...
  analysis.takeId = take.takeId;
  // ...then compute rename.
  let ext = extname(file.name);
  let parts = [
    document.settings.projectId,
    formatSceneShotNumber(scene.sceneNumber, shot.shotNumber, false),
    formatTakeNumber(take.takeNumber),
    shot.shotHash,
    shot.shotType,
    take.rating > 0 ? 'PRINT' : '',
  ].filter((s) => Number(s?.length) > 0);
  return `${parts.join('_')}${ext}`;
}

/**
 * @param {import('@/scanner/DirectoryPicker').FileWithHandles} file
 * @param {import('@/stores/toolbox').ScannerAnalysisInfo} analysis
 */
function deriveRenameValueFromAnalysisOnly(file, analysis) {
  /** @type {ReturnType<tryDecodeQRCodeKeyV1>|ReturnType<tryDecodeQRCodeKeyV0>} */
  let decoded = analysis.decoded;
  if (!decoded) {
    return '';
  }
  if ('sceneNumber' in decoded) {
    // V1
    let ext = extname(file.name);
    let d = /** @type {Exclude<ReturnType<tryDecodeQRCodeKeyV1>, null>} */ (
      decoded
    );
    let parts = [
      d.projectId,
      formatSceneShotNumber(d.sceneNumber, d.shotNumber, false),
      formatTakeNumber(d.takeNumber),
      d.shotHash,
    ];
    return `${parts.join('_')}${ext}`;
  } else {
    // V0
    let ext = extname(file.name);
    let d = /** @type {Exclude<ReturnType<tryDecodeQRCodeKeyV0>, null>} */ (
      decoded
    );
    let parts = [d.projectId, formatTakeNumber(d.takeNumber), d.shotHash];
    return `${parts.join('_')}${ext}`;
  }
}

const TRY_PLAY_VIDEO_TIMEOUT_MILLIS = 3_000;

/**
 * @param {HTMLVideoElement} video
 * @param {string} url
 */
async function tryPlayVideo(video, url) {
  return new Promise((resolve, reject) => {
    /** @type {NodeJS.Timeout} */
    let timeoutHandle;
    function onTimeout() {
      clearTimeout(timeoutHandle);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      resolve(false);
    }
    function onLoadedMetadata() {
      clearTimeout(timeoutHandle);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      resolve(true);
    }
    try {
      video.src = url;
      video.load();
      video.addEventListener('loadedmetadata', onLoadedMetadata);
      timeoutHandle = setTimeout(onTimeout, TRY_PLAY_VIDEO_TIMEOUT_MILLIS);
    } catch (e) {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      reject(e);
    }
  });
}
