import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { openDirectory } from '@/qrcode/DirectoryPicker';
import { scanVideoBlobForQRCodes } from '@/qrcode/QRCodeReader';
import { captureVideoSnapshot } from '@/recorder/snapshot/VideoSnapshot';
import { toDateString } from '@/serdes/ExportNameFormat';
import {
  findDocumentsWithProjectId,
  findShotWithShotHash,
  findTakeWithTakeNumber,
  useSetTakePreviewImage,
} from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';
import { downloadText } from '@/utils/Downloader';
import { extname } from '@/utils/PathHelper';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

import { setVideoSrcBlob } from './VideoBlobSourceHelper';

/**
 * @callback OnScannerChangeCallback
 * @param {{ target: { value: object }}} e
 */

/**
 * @typedef {{ file: import('@/qrcode/DirectoryPicker').FileWithHandles, code: string, snapshot: string }} ScannerResult
 */

/**
 * @param {object} props
 * @param {string} props.className
 * @param {OnScannerChangeCallback} props.onChange
 */
export default function TakeScanner({ className, onChange }) {
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const documentId = useCurrentDocumentId();
  const setTakePreview = useSetTakePreviewImage();
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const inputRef = useRef(/** @type {Record<string, ScannerResult>} */ ({}));
  const outputRef = useRef(
    /** @type {Record<string, { status: string, result: string }>} */ ({}),
  );
  const navigate = useNavigate();
  const [status, setStatus] = useState('');

  function onBackClick() {
    if (documentId) {
      navigate('/settings');
    } else {
      navigate('/');
    }
  }

  async function onScanClick() {
    let input = inputRef.current;
    let output = outputRef.current;

    // Clear results...
    for (let key of Object.keys(input)) {
      delete input[key];
    }
    for (let key of Object.keys(output)) {
      delete output[key];
    }

    // Find files...
    const files = await openDirectory();
    if (!files) {
      return;
    }
    for (let file of files) {
      input[file.name] = { file, code: '', snapshot: '' };
      output[file.name] = { status: '[GOT]', result: '' };
    }
    onChange({ target: { value: output } });

    // Find videos...
    const videoFiles = filterVideoFiles(files);
    for (let file of videoFiles) {
      output[file.name] = { status: '[READY]', result: '' };
    }
    onChange({ target: { value: output } });
    const ignoredFiles = files.filter(
      (file) => !videoFiles.find((video) => video.name === file.name),
    );
    for (let file of ignoredFiles) {
      output[file.name] = { status: '[SKIP]', result: '' };
      delete input[file.name];
    }

    onChange({ target: { value: output } });
    setStatus('scanned');
    console.log(
      `[TakeScanner] Received ${files.length} file(s) - found ${videoFiles.length} video(s).`,
    );
  }

  async function onAnalyzeClick() {
    let input = inputRef.current;
    let output = outputRef.current;

    // Scan videos
    await performScan(input, output, videoRef, onChange);

    if (documentId) {
      for (const key of Object.keys(input)) {
        const value = input[key];
        if (!value.snapshot) {
          // Did not have a snapshot to use.
          output[key] = {
            status: '[ERROR: No snapshot available.]',
            result: output[key]?.result,
          };
          onChange({ target: { value: output } });
          continue;
        }
        const store = UNSAFE_getStore();
        const documents = findDocumentsWithQRCode(store, value.code);
        if (documents.length <= 0) {
          // No same project id found.
          output[key] = {
            status: '[ERROR: No project found with same project id.]',
            result: output[key]?.result,
          };
          onChange({ target: { value: output } });
          continue;
        }
        const target = documents.find(
          (document) => document.documentId === documentId,
        );
        if (!target) {
          // Project id matched, but the user's currently-viewed document is not it.
          output[key] = {
            status: '[ERROR: Found for another project.]',
            result: output[key]?.result,
          };
          onChange({ target: { value: output } });
          continue;
        }
        const take = findTakeWithQRCode(store, target.documentId, value.code);
        if (!take) {
          // Missing matching take info.
          output[key] = {
            status: '[ERROR: Take not found in this project.]',
            result: output[key]?.result,
          };
          onChange({ target: { value: output } });
          continue;
        }
        output[key] = {
          status: '[IMPORTED]',
          result: output[key]?.result,
        };
        onChange({ target: { value: output } });
        console.log('[TakeScanner] Found take with snapshot in project!');
        setTakePreview(documentId, take.takeId, value.snapshot);
      }
    }

    setStatus('analyzed');
    console.log(`[TakeScanner] Scanned videos.`);
  }

  async function onApplyClick() {
    let input = inputRef.current;
    let output = outputRef.current;

    // Rename files
    await performRename(input, output, onChange);

    console.log(`[TakeScanner] Renamed videos.`);
  }

  async function onExportClick() {
    let input = inputRef.current;

    let lines = [];
    for (let key of Object.keys(input)) {
      lines.push(`${key},${input[key].code}`);
    }
    const result = lines.join('\n');
    const dateString = toDateString(new Date());
    const fileName = 'EAGLESLATE_' + dateString + '_SCANNED_NAMES.csv';
    downloadText(fileName, result);
  }

  const isShowDirectoryPickerSupported =
    'showDirectoryPicker' in window &&
    typeof window.showDirectoryPicker !== 'undefined';

  return (
    <>
      <button className={className} onClick={onBackClick}>
        Back
      </button>
      <button className={className} onClick={onScanClick}>
        Scan directory
      </button>
      <button
        className={className}
        onClick={onAnalyzeClick}
        disabled={status !== 'scanned'}>
        Analyze files
      </button>
      <button
        className={className}
        onClick={onApplyClick}
        disabled={status !== 'analyzed' || !isShowDirectoryPickerSupported}>
        Apply to files
        {
          <span className="block w-[80%] mx-auto mt-4">
            NOTE: Only <b>Chrome</b> browsers currently support this step.
            Otherwise, download the CSV file below and use a batch rename tool.
          </span>
        }
      </button>
      <button
        className={className}
        onClick={onExportClick}
        disabled={status !== 'analyzed'}>
        Export list to .csv
      </button>
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

const PROJECT_ID_PATTERN = /^(.+)_S\d+\w+_T/;
const SHOT_HASH_PATTERN = /_(\d+)$/;
const TAKE_NUMBER_PATTERN = /_T(\d+)_/;

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {string} qrCode
 */
function findDocumentsWithQRCode(store, qrCode) {
  const projectIdExecArray = PROJECT_ID_PATTERN.exec(qrCode);
  if (!projectIdExecArray) {
    return [];
  }
  const [_, projectIdCaptured] = projectIdExecArray;
  const projectId = String(projectIdCaptured);
  return findDocumentsWithProjectId(store, projectId);
}

/**
 * @param {import('@/stores/document/DocumentStore').Store} store
 * @param {import('@/stores/document/DocumentStore').DocumentId} documentId
 * @param {string} qrCode
 */
function findTakeWithQRCode(store, documentId, qrCode) {
  const shotHashExecArray = SHOT_HASH_PATTERN.exec(qrCode);
  if (!shotHashExecArray) {
    return null;
  }
  const [_1, shotHashCaptured] = shotHashExecArray;
  const shotHash = String(shotHashCaptured);
  const shot = findShotWithShotHash(store, documentId, shotHash);
  if (!shot) {
    return null;
  }

  const takeNumberExecArray = TAKE_NUMBER_PATTERN.exec(qrCode);
  if (!takeNumberExecArray) {
    return null;
  }
  const [_2, takeNumberCaptured] = takeNumberExecArray;
  const takeNumber = Number(takeNumberCaptured);
  return findTakeWithTakeNumber(store, documentId, shot.shotId, takeNumber);
}

/**
 * @param {Array<File>} files
 */
function filterVideoFiles(files) {
  return files.filter((file) => /(\.mov|\.mp4|\.webm)$/i.test(file.name));
}

/**
 * @param {Record<string, ScannerResult>} input
 * @param {Record<string, { status: string, result: string }>} output
 * @param {import('react').RefObject<HTMLVideoElement>} videoRef
 * @param {OnScannerChangeCallback} onChange
 */
async function performScan(input, output, videoRef, onChange) {
  let video = videoRef.current;
  if (!video) {
    return;
  }

  // Clear existing scan results
  for (let key of Object.keys(input)) {
    output[key] = { status: '[WAITING]', result: '' };
  }
  onChange({ target: { value: output } });

  // Now start the scan.
  for (let key of Object.keys(input)) {
    const videoFile = input[key].file;
    try {
      output[key] = { status: '[SCANNING...]', result: '' };
      onChange({ target: { value: output } });
      setVideoSrcBlob(video, videoFile);

      try {
        const url = await captureVideoSnapshot(
          videoRef,
          0.5,
          MAX_THUMBNAIL_WIDTH,
          MAX_THUMBNAIL_HEIGHT,
        );
        input[key].snapshot = url;
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
        output[key] = { status: '[ERROR: No codes found :( ]', result: '' };
        delete input[key];
      } else if (codes.length > 1) {
        output[key] = { status: '[ERROR: Found too many codes!]', result: '' };
        delete input[key];
      } else {
        const transformedCode = transformCode(key, codes[0]);
        if (!transformedCode) {
          output[key] = {
            status: '[ERROR: Not a valid Eagle code.]',
            result: '',
          };
          delete input[key];
        } else {
          output[key] = { status: '[FOUND]', result: transformedCode };
          input[key].code = transformedCode;
        }
      }
    } finally {
      const currentSrc = video.currentSrc;
      if (currentSrc) {
        video.src = '';
        URL.revokeObjectURL(currentSrc);
      }
    }
    onChange({ target: { value: output } });
  }
}

/**
 * @param {Record<string, ScannerResult>} input
 * @param {Record<string, { status: string, result: string }>} output
 * @param {OnScannerChangeCallback} onChange
 */
async function performRename(input, output, onChange) {
  // Clear existing results
  onChange({ target: { value: output } });
  // Now start the renaming.
  for (let key of Object.keys(input)) {
    try {
      const fileHandle = input[key].file.handle;
      if (!fileHandle) {
        output[key] = {
          status: '[ERROR: FileSystemAPI is unsupported here :( ]',
          result: '',
        };
        onChange({ target: { value: output } });
        continue;
      }
      const result = input[key].code;
      if (!result || !extname(result)) {
        output[key] = {
          status: '[ERROR: Found no code for file.]',
          result: '',
        };
        onChange({ target: { value: output } });
        continue;
      }

      console.log(`[TakeScanner] Renaming ${fileHandle.name} => ${result}`);
      // @ts-expect-error Move is supported on chrome (though not standard).
      fileHandle.move(result);
      output[key] = { status: '[DONE]', result: '' };
      onChange({ target: { value: output } });
    } catch (e) {
      const error = /** @type {Error} */ (e);
      console.error(
        '[TakeScanner] Failed to move file - ',
        error.name,
        error.message,
      );
    }
  }
}

const PREFIX = 'https://jsonhero.io/new?j=';
/**
 * @param {string} filePath
 * @param {string} code
 */
function transformCode(filePath, code) {
  try {
    if (!code.startsWith(PREFIX)) {
      return '';
    }
    const data64 = code.substring(PREFIX.length);
    const dataString = window.atob(data64);
    const jsonData = JSON.parse(dataString);
    if (typeof jsonData.key === 'string' && jsonData.key.length > 0) {
      let fileName = jsonData.key;
      let extIndex = fileName.lastIndexOf('.');
      if (extIndex < 0) {
        extIndex = filePath.lastIndexOf('.');
        fileName = `${fileName}${filePath.substring(extIndex)}`;
      }
      return fileName;
    } else {
      return '';
    }
  } catch {
    return '';
  }
}
