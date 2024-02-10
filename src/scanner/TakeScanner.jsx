import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useCurrentDocumentId } from '@/stores/user';

import SettingsFootageAnalyzeButton from './SettingsFootageAnalyzeButton';
import SettingsFootageDirectoryButton from './SettingsFootageDirectoryButton';
import SettingsFootageExportCSVButton from './SettingsFootageExportCSVButton';
import SettingsFootageProjectImportButton from './SettingsFootageProjectImportButton';
import SettingsFootageSaveToDiskButton from './SettingsFootageSaveToDiskButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('./ScannerResult').OnScannerChangeCallback} props.onChange
 */
export default function TakeScanner({ className, onChange }) {
  const [status, setStatus] = useState('');

  const outputRef = useRef(
    /** @type {import('./ScannerResult').ScannerOutput} */ ({
      status: '',
    }),
  );
  const documentId = useCurrentDocumentId();
  const navigate = useNavigate();

  function onBackClick() {
    if (documentId) {
      navigate('/edit');
    } else {
      navigate('/');
    }
  }

  /** @type {import('./ScannerResult').OnScannerChangeCallback} */
  function onScannerChange(e) {
    setStatus(e.target.value.status);
    onChange(e);
  }

  const isShowDirectoryPickerSupported =
    'showDirectoryPicker' in window &&
    typeof window.showDirectoryPicker !== 'undefined';

  return (
    <div
      className={
        'mx-auto flex flex-col gap-4 items-center overflow-y-auto' +
        ' ' +
        className
      }>
      <SettingsFieldButton Icon={ArrowBackIcon} onClick={onBackClick}>
        Back
      </SettingsFieldButton>
      <SettingsFootageDirectoryButton
        outputRef={outputRef}
        onChange={onScannerChange}
      />
      <SettingsFootageAnalyzeButton
        outputRef={outputRef}
        onChange={onScannerChange}
        disabled={status !== 'scanned'}
      />
      <SettingsFootageProjectImportButton
        outputRef={outputRef}
        onChange={onScannerChange}
        disabled={status !== 'analyzed'}
      />
      <SettingsFootageSaveToDiskButton
        outputRef={outputRef}
        onChange={onScannerChange}
        disabled={status !== 'analyzed' || !isShowDirectoryPickerSupported}
      />
      <SettingsFootageExportCSVButton
        outputRef={outputRef}
        onChange={onScannerChange}
        disabled={status !== 'analyzed'}
      />
    </div>
  );
}
