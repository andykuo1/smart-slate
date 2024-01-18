import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { openDirectory } from '@/qrcode/DirectoryPicker';
import { scanVideoBlobForQRCodes } from '@/qrcode/QRCodeReader';
import { toDateString } from '@/serdes/ExportNameFormat';
import { useCurrentDocumentId } from '@/stores/user';
import { downloadText } from '@/utils/Downloader';
import { extname } from '@/utils/PathHelper';

import { setVideoSrcBlob } from './VideoBlobSource';

/**
 * @callback OnScannerChangeCallback
 * @param {{ target: { value: object }}} e
 */

/**
 * @typedef {{ file: import('@/qrcode/DirectoryPicker').FileWithHandles, code: string }} ScannerResult
 */

/**
 * @param {object} props
 * @param {string} props.className
 * @param {OnScannerChangeCallback} props.onChange
 */
export default function TakeScanner({ className, onChange }) {
  const documentId = useCurrentDocumentId();
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const inputRef = useRef(/** @type {Record<string, ScannerResult>} */ ({}));
  const outputRef = useRef(/** @type {Record<string, string>} */ ({}));
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
      input[file.name] = { file, code: '' };
      output[file.name] = '[GOT]';
    }
    onChange({ target: { value: output } });

    // Find videos...
    const videoFiles = filterVideoFiles(files);
    for (let file of videoFiles) {
      output[file.name] = '[READY]';
    }
    onChange({ target: { value: output } });
    const ignoredFiles = files.filter(
      (file) => !Boolean(videoFiles.find((video) => video.name === file.name)),
    );
    for (let file of ignoredFiles) {
      output[file.name] = '[SKIP]';
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
    // @ts-ignore
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

/**
 * @param {Array<File>} files
 */
function filterVideoFiles(files) {
  return files.filter((file) => /(\.mov|\.mp4|\.webm)$/i.test(file.name));
}

/**
 * @param {Record<string, ScannerResult>} input
 * @param {Record<string, string>} output
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
    output[key] = '[WAITING]';
  }
  onChange({ target: { value: output } });
  // Now start the scan.
  for (let key of Object.keys(input)) {
    const videoFile = input[key].file;
    try {
      output[key] = '[SCANNING...]';
      onChange({ target: { value: output } });
      setVideoSrcBlob(video, videoFile);
      /** @type {string[]} */
      let codes;
      try {
        codes = await scanVideoBlobForQRCodes(videoFile);
      } catch (e) {
        console.error('[TakeScanner] Failed scanning - ', e);
        codes = [];
      }
      if (!codes || codes.length <= 0) {
        output[key] = '[ERROR: No codes found :( ]';
        delete input[key];
      } else if (codes.length > 1) {
        output[key] = '[ERROR: Found too many codes!]';
        delete input[key];
      } else {
        const transformedCode = transformCode(key, codes[0]);
        if (!transformedCode) {
          output[key] = '[ERROR: Not a valid Eagle code.]';
          delete input[key];
        } else {
          output[key] = transformedCode;
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
 * @param {Record<string, string>} output
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
        output[key] = '[ERROR: FileSystemAPI is unsupported here :( ]';
        onChange({ target: { value: output } });
        continue;
      }
      const result = input[key].code;
      if (!result || !extname(result)) {
        output[key] = '[ERROR: Found no code for file.]';
        onChange({ target: { value: output } });
        continue;
      }

      console.log(`[TakeScanner] Renaming ${fileHandle.name} => ${result}`);
      // @ts-ignore
      fileHandle.move(result);
      output[key] = '[DONE]';
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
