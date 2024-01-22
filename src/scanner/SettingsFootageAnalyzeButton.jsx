import { useRef } from 'react';

import PlagiarismIcon from '@material-symbols/svg-400/rounded/plagiarism.svg';

import { setVideoSrcBlob } from '@/app/VideoBlobSourceHelper';
import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { captureVideoSnapshot } from '@/recorder/snapshot/VideoSnapshot';
import {
  tryDecodeQRCodeKeyV0,
  tryDecodeQRCodeKeyV1,
} from '@/serdes/UseResolveTakeQRCodeKey';
import {
  findDocumentsWithProjectId,
  findShotWithShotHash,
  findTakeWithTakeNumber,
  getTakeById,
  useSetTakePreviewImage,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';
import { extname } from '@/utils/PathHelper';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { scanVideoBlobForQRCodes } from './QRCodeReader';
import {
  createScannerChangeEvent,
  errorScanner,
  isScannerFailure,
  updateScannerStatus,
} from './ScannerResult';

/**
 * @param {object} props
 * @param {import('./ScannerResult').ScannerOutputRef} props.outputRef
 * @param {import('./ScannerResult').OnScannerChangeCallback} props.onChange
 * @param {boolean} props.disabled
 */
export default function SettingsFootageAnalyzeButton({
  outputRef,
  onChange,
  disabled,
}) {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const documentId = useCurrentDocumentId();
  const setTakePreview = useSetTakePreviewImage();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);

  async function onClick() {
    let output = outputRef.current;
    if (!output) {
      return;
    }
    let event = createScannerChangeEvent(output);

    // Scan videos
    await performScan(output, videoRef, onChange);

    if (documentId) {
      for (const key of Object.keys(output)) {
        let result = output[key];
        if (isScannerFailure(result)) {
          continue;
        }
        if (!result.snapshot) {
          // Did not have a snapshot to use.
          updateScannerStatus(result, '[ERROR: No snapshot available.]');
          onChange(event);
          continue;
        }
        const store = UNSAFE_getStore();
        try {
          const take = findTakeWithQRCode(
            store,
            result.code,
            documentId,
            false,
          );

          updateScannerStatus(result, '[IMPORTED]');
          onChange(event);

          console.log('[TakeScanner] Found take with snapshot in project!');
          setTakePreview(documentId, take.takeId, result.snapshot);
        } catch (e) {
          errorScanner(result, e);
          onChange(event);
        }
      }
    }

    // Complete!
    output.status = 'analyzed';
    onChange(event);

    console.log(`[TakeScanner] Scanned videos.`);
  }

  return (
    <>
      <SettingsFieldButton
        Icon={PlagiarismIcon}
        onClick={onClick}
        disabled={disabled}>
        Analyze files
      </SettingsFieldButton>
      <video
        ref={videoRef}
        className="w-[50%]"
        preload="metadata"
        playsInline={true}
        muted={true}
        hidden={true}
      />
    </>
  );
}

/**
 * @param {import('./ScannerResult').ScannerOutput} output
 * @param {import('react').RefObject<HTMLVideoElement>} videoRef
 * @param {import('./ScannerResult').OnScannerChangeCallback} onChange
 */
async function performScan(output, videoRef, onChange) {
  let video = videoRef.current;
  if (!video) {
    return;
  }
  let event = createScannerChangeEvent(output);

  // Clear existing scan results
  for (let key of Object.keys(output)) {
    let o = output[key];
    if (isScannerFailure(o)) {
      continue;
    }
    updateScannerStatus(o, '[WAITING]');
  }
  onChange(event);

  // Now start the scan.
  for (let key of Object.keys(output)) {
    let o = output[key];
    if (isScannerFailure(o)) {
      continue;
    }
    const videoFile =
      /** @type {import('./DirectoryPicker').FileWithHandles} */ (o.file);
    try {
      o.status = '[SCANNING...]';
      onChange(event);

      setVideoSrcBlob(video, videoFile);
      try {
        const url = await captureVideoSnapshot(
          videoRef,
          0.5,
          MAX_THUMBNAIL_WIDTH,
          MAX_THUMBNAIL_HEIGHT,
        );
        o.snapshot = url;
        o.status = '[CAPTURED]';
      } catch (e) {
        console.error('[TakeScanner] Failed snapshot - ', e);
      }

      /** @type {string[]} */
      let codes;
      try {
        codes = await scanVideoBlobForQRCodes(videoFile);
      } catch (e) {
        console.error('[TakeScanner] Failed scanning - ', e);
        codes = [];
      }
      if (!codes || codes.length <= 0) {
        o.status = '[ERROR: No codes found :( ]';
        o.file = null;
      } else if (codes.length > 1) {
        o.status = '[ERROR: Found too many codes!]';
        o.file = null;
      } else {
        const code = codes[0];
        o.code = code;
        try {
          let result = tryDecodeQRCodeKeyV1(code) || tryDecodeQRCodeKeyV0(code);
          if (!result) {
            throw new Error('Cannot decode qr code.');
          }
          let ext = extname(key);
          let fileName = `${result.projectId}_${result.shotHash}_T${String(
            o.index,
          ).padStart(2, '0')}_IMPORTED${ext}`;
          o.status = '[FOUND]';
          o.value = fileName;
        } catch {
          o.status = '[ERROR: Not a valid Eagle code.]';
          o.file = null;
        }
      }
    } finally {
      const currentSrc = video.currentSrc;
      if (currentSrc) {
        video.src = '';
        URL.revokeObjectURL(currentSrc);
      }
    }

    // Complete!
    onChange(event);
  }
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {string} qrCode
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {boolean} forceDocument
 */
function findTakeWithQRCode(store, qrCode, documentId, forceDocument) {
  let result = tryDecodeQRCodeKeyV1(qrCode) || tryDecodeQRCodeKeyV0(qrCode);
  if (!result) {
    throw new Error('No supported qr code format.');
  }
  const documents = findDocumentsWithProjectId(store, result.projectId);
  if (documents.length <= 0) {
    throw new Error('No project found with same project id.');
  }
  const document =
    documents.find((document) => document.documentId === documentId) ||
    (forceDocument ? documents[0] : null);
  if (!document) {
    throw new Error(
      'Mismatched document id - found for another project though.',
    );
  }
  const shot = findShotWithShotHash(store, documentId, result.shotHash);
  if (!shot) {
    throw new Error('No shot found with same shot hash.');
  }
  const shotId = shot.shotId;
  if ('takeNumber' in result) {
    let take = findTakeWithTakeNumber(
      store,
      documentId,
      shotId,
      result.takeNumber,
    );
    if (!take) {
      throw new Error('No take found with same take number.');
    }
    return take;
  } else if ('takeId' in result) {
    let take = getTakeById(store, documentId, result.takeId);
    if (!take) {
      throw new Error('No take found with same take id.');
    }
    return take;
  } else {
    throw new Error('No supported take specifier available in qr code.');
  }
}
