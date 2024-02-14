import FieldToggle from '@/fields/FieldToggle';
import {
  useScannerFileAnalysisKeys,
  useScannerFileKeys,
} from '@/stores/toolbox';
import { useToolboxStore } from '@/stores/toolbox/UseToolboxStore';

export default function ScannerSettingsCaptureSnapshotToggle() {
  const fileKeys = useScannerFileKeys();
  const analysisKeys = useScannerFileAnalysisKeys();
  const hasFileKeys = fileKeys.length > 0;
  const hasAnalysisKeys = analysisKeys.length > 0;

  const captureSnapshot = useToolboxStore(
    (ctx) => ctx.scanner.settings.captureSnapshot,
  );
  const toggleScannerSettingsCaptureSnapshot = useToolboxStore(
    (ctx) => ctx.toggleScannerSettingsCaptureSnapshot,
  );

  function onClick() {
    toggleScannerSettingsCaptureSnapshot();
  }

  return (
    <FieldToggle
      className="py-0 outline-none"
      value={captureSnapshot}
      onClick={onClick}
      disabled={!hasFileKeys || hasAnalysisKeys}>
      Capture take snapshots
    </FieldToggle>
  );
}
