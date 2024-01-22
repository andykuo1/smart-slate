import FolderOpenIcon from '@material-symbols/svg-400/rounded/folder_open.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';

import { openDirectory } from './DirectoryPicker';
import {
  createScannerChangeEvent,
  createScannerResult,
  isScannerFailure,
  readyScanner,
  skipScanner,
  updateScannerStatus,
} from './ScannerResult';

const SUPPORTED_VIDEO_FILENAMES_PATTERN = /(\.mov|\.mp4|\.webm)$/i;

/**
 * @param {object} props
 * @param {import('./ScannerResult').ScannerOutputRef} props.outputRef
 * @param {import('./ScannerResult').OnScannerChangeCallback} props.onChange
 * @param {boolean} [props.disabled]
 */
export default function SettingsFootageDirectoryButton({
  outputRef,
  onChange,
  disabled,
}) {
  async function onClick() {
    let output = outputRef.current;
    if (!output) {
      return;
    }
    let event = createScannerChangeEvent(output);

    // Clear results...
    for (let key of Object.keys(output)) {
      delete output[key];
    }

    // Find files...
    const files = await openDirectory();
    if (!files) {
      return;
    }
    for (let file of files) {
      let result = createScannerResult(file);
      updateScannerStatus(result, '[GOT]');
      output[file.name] = result;
    }
    onChange(event);

    // Find videos...
    let index = 1;
    const videoFiles = filterVideoFiles(files);
    for (let file of videoFiles) {
      let result = output[file.name];
      if (isScannerFailure(result)) {
        continue;
      }
      readyScanner(result, index++);
    }
    onChange(event);

    const ignoredFiles = files.filter(
      (file) => !videoFiles.find((video) => video.name === file.name),
    );
    for (let file of ignoredFiles) {
      let result = output[file.name];
      if (isScannerFailure(result)) {
        continue;
      }
      skipScanner(result);
    }

    console.log(
      `[SettingsFootageDirectoryButton] Received ${files.length} file(s) - found ${videoFiles.length} video(s).`,
    );

    // Complete!
    output.status = 'scanned';
    onChange(event);
  }

  return (
    <SettingsFieldButton
      Icon={FolderOpenIcon}
      onClick={onClick}
      disabled={disabled}>
      Scan directory
    </SettingsFieldButton>
  );
}

/**
 * @param {Array<File>} files
 */
function filterVideoFiles(files) {
  return files.filter((file) =>
    SUPPORTED_VIDEO_FILENAMES_PATTERN.test(file.name),
  );
}
