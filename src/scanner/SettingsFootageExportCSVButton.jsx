import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { toDateString } from '@/serdes/ExportNameFormat';
import { downloadText } from '@/utils/Downloader';

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
      lines.push(`${key},${result.value}`);
    }
    const result = lines.join('\n');
    const dateString = toDateString(new Date());
    const fileName = 'EAGLESLATE_' + dateString + '_SCANNED_NAMES.csv';
    downloadText(fileName, result);
  }

  return (
    <SettingsFieldButton
      Icon={DownloadIcon}
      onClick={onClick}
      disabled={disabled}>
      Export list to .csv
    </SettingsFieldButton>
  );
}
