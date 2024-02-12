import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';

import FieldButton from '@/fields/FieldButton';
import { toDateString } from '@/serdes/ExportNameFormat';
import { downloadText } from '@/utils/Downloader';
import { basename } from '@/utils/PathHelper';

import { isScannerFailure } from './ScannerResult';

/**
 * @param {object} props
 * @param {import('./ScannerResult').ScannerOutputRef} props.outputRef
 * @param {import('./ScannerResult').OnScannerChangeCallback} props.onChange
 * @param {boolean} [props.disabled]
 */
export default function SettingsFootageExportCSVButton({
  outputRef,
  onChange,
  disabled,
}) {
  async function onClick() {
    let output = outputRef.current;
    if (!output) {
      return;
    }
    let lines = [];
    for (let key of Object.keys(output)) {
      let result = output[key];
      if (isScannerFailure(result)) {
        continue;
      }
      let keyFileName = basename(key);
      let baseFileName = basename(result.value);
      lines.push(`${keyFileName},${baseFileName}`);
    }
    const result = lines.join('\n');
    const dateString = toDateString(new Date());
    const fileName = 'EAGLESLATE_' + dateString + '_SCANNED_NAMES.csv';
    downloadText(fileName, result);
  }

  return (
    <FieldButton Icon={DownloadIcon} onClick={onClick} disabled={disabled}>
      Export list to .csv
    </FieldButton>
  );
}
