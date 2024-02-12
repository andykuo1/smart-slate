import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';
import ServiceToolboxIcon from '@material-symbols/svg-400/rounded/service_toolbox.svg';

import FieldButton from '@/fields/FieldButton';
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
        'mx-auto flex flex-col items-center gap-4 overflow-y-auto' +
        ' ' +
        className
      }>
      <FieldButton Icon={ArrowBackIcon} onClick={onBackClick}>
        Back
      </FieldButton>
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
      <FieldButton
        className="outline-none"
        title="Open batch rename tool"
        Icon={ServiceToolboxIcon}
        onClick={() => navigate('/rename')}>
        <div>
          Don't have a{' '}
          <span className="whitespace-nowrap">batch rename tool</span>?{' '}
          <div className="mt-2">We got you.</div>
        </div>
      </FieldButton>
    </div>
  );
}
