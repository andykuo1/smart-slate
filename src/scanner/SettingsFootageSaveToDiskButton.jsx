import SaveIcon from '@material-symbols/svg-400/rounded/save.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';

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
 * @param {boolean} [props.disabled]
 */
export default function SettingsFootageSaveToDiskButton({
  outputRef,
  onChange,
  disabled,
}) {
  async function onClick() {
    let output = outputRef.current;
    if (!output) {
      return;
    }

    // Rename files
    await performRename(output, onChange);

    console.log(`[TakeScanner] Renamed videos.`);
  }
  return (
    <SettingsFieldButton Icon={SaveIcon} onClick={onClick} disabled={disabled}>
      Rename files on disk
      {
        <span className="mx-auto mt-4 block w-[80%]">
          NOTE: Only <b>Chrome</b> browsers currently support this step.
          Otherwise, download the CSV file below and use a batch rename tool.
        </span>
      }
    </SettingsFieldButton>
  );
}

/**
 * @param {import('./ScannerResult').ScannerOutput} output
 * @param {import('./ScannerResult').OnScannerChangeCallback} onChange
 */
async function performRename(output, onChange) {
  let event = createScannerChangeEvent(output);
  // Clear existing results
  onChange(event);
  // Now start the renaming.
  for (let key of Object.keys(output)) {
    let result = output[key];
    if (isScannerFailure(result)) {
      continue;
    }
    try {
      const fileHandle = result?.file?.handle;
      if (!fileHandle) {
        updateScannerStatus(
          result,
          '[ERROR: FileSystemAPI is unsupported here :(]',
        );
        onChange(event);
        continue;
      }
      const fileName = result.value;
      if (!fileName) {
        updateScannerStatus(result, '[ERROR: Found empty name for file.]');
        onChange(event);
        continue;
      }

      console.log(`[TakeScanner] Renaming ${fileHandle.name} => ${fileName}`);
      // @ts-expect-error Move is supported on chrome (though not standard).
      fileHandle.move(fileName);
      updateScannerStatus(result, '[DONE]');
      onChange(event);
    } catch (e) {
      errorScanner(result, e);
    }
  }
}
