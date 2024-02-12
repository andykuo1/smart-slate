import { useRef } from 'react';

import PlagiarismIcon from '@material-symbols/svg-400/rounded/plagiarism.svg';

import { setVideoSrcBlob } from '@/app/VideoBlobSourceHelper';
import { formatSceneShotNumber } from '@/components/takes/TakeNameFormat';
import FieldButton from '@/fields/FieldButton';
import { captureVideoSnapshot } from '@/recorder/snapshot/VideoSnapshot';
import {
  tryDecodeQRCodeKeyV0,
  tryDecodeQRCodeKeyV1,
} from '@/serdes/UseResolveTakeQRCodeKey';
import {
  findDocumentWithTakeId,
  findDocumentsWithProjectId,
  findShotWithShotHash,
  findTakeWithTakeNumber,
  getDocumentById,
  getTakeById,
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
  attachTakeIdScanner,
  attachTakeInfoScanner,
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
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);

  async function onClick() {
    let output = outputRef.current;
    if (!output) {
      return;
    }
    let event = createScannerChangeEvent(output);

    // Scan videos
    await performScan(output, videoRef, onChange);

    // Get all un/verified files for this project
    if (documentId) {
      const store = UNSAFE_getStore();
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
        try {
          const takeInfo = decodeTakeInfoFromQRCode(result.code);
          attachTakeInfoScanner(result, takeInfo);
          updateScannerStatus(result, '[UN-VERIFIED]');
          onChange(event);

          const take = findTakeWithDecodedQRCode(
            store,
            takeInfo,
            documentId,
            false,
          );
          attachTakeIdScanner(result, take.takeId);
          updateScannerStatus(result, '[VERIFIED]');
          onChange(event);
        } catch (e) {
          // NOTE: Failures to find take should not invalidate entry (could be resolved later).
          errorScanner(result, e, false);
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
      <FieldButton Icon={PlagiarismIcon} onClick={onClick} disabled={disabled}>
        Analyze files
      </FieldButton>
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
        codes = await scanVideoBlobForQRCodes(video, videoFile);
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
          let fileNameParts = [
            result.projectId,
            'sceneNumber' in result || 'shotNumber' in result
              ? formatSceneShotNumber(
                  // @ts-expect-error We are okay with NaN
                  Number(result.sceneNumber),
                  // @ts-expect-error We are okay with NaN
                  Number(result.shotNumber),
                  false,
                )
              : [],
            'takeNumber' in result
              ? `T${String(result.takeNumber).padStart(2, '0')}`
              : [],
            result.shotHash,
            `IMPORTED${ext}`,
          ].flat();
          let fileName = fileNameParts.join('_');
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
 * @param {string} qrCode
 * @returns {ReturnType<tryDecodeQRCodeKeyV1>|ReturnType<tryDecodeQRCodeKeyV0>}
 */
function decodeTakeInfoFromQRCode(qrCode) {
  let result = tryDecodeQRCodeKeyV1(qrCode) || tryDecodeQRCodeKeyV0(qrCode);
  if (!result) {
    throw new Error('No supported qr code format.');
  }
  return result;
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {ReturnType<decodeTakeInfoFromQRCode>} takeInfo
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {boolean} forceImport
 */
function findTakeWithDecodedQRCode(store, takeInfo, documentId, forceImport) {
  let result = takeInfo;
  if (!result) {
    throw new Error('No supported qr code format.');
  }

  // NOTE: Rely on take id first, as that is a uuid. Project IDs has the potential to change...
  let document;
  let take;

  // Force import into this document
  if (forceImport) {
    document = getDocumentById(store, documentId);
    // TODO: Should also resolve the other scene/shot/take elements.
  }

  // V1 decoder - uses take id
  if ('takeId' in result) {
    if (!document) {
      document = findDocumentWithTakeId(store, result.takeId);
      if (!document) {
        throw new Error('No project found with take.');
      }
    }
    if (document) {
      take = getTakeById(store, document.documentId, result.takeId);
      if (!take) {
        throw new Error('No take found with same take id.');
      }
    }
  }

  // V0 decoder - uses take number
  if ('takeNumber' in result) {
    if (!document) {
      const documents = findDocumentsWithProjectId(store, result.projectId);
      if (documents.length > 0) {
        console.log(
          '[SettingsFootageAnalyzeButton] Found for documents: ',
          documents,
        );
        document = documents.find(
          (document) => document.documentId === documentId,
        );
        if (!document) {
          throw new Error(
            'Mismatched document id - found for another project though.',
          );
        }
      } else {
        throw new Error('No project found with same project id');
      }
    }

    if (document) {
      const shot = findShotWithShotHash(
        store,
        document.documentId,
        result.shotHash,
      );
      if (!shot) {
        throw new Error('No shot found with same shot hash.');
      }
      take = findTakeWithTakeNumber(
        store,
        document.documentId,
        shot.shotId,
        result.takeNumber,
      );
      if (!take) {
        throw new Error('No take found with same take number.');
      }
    }
  }

  if (!take) {
    throw new Error('No supported take specifier available in qr code.');
  }

  return take;
}
