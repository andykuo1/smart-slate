import FieldToggle from '@/fields/FieldToggle';
import {
  useScannerFileAnalysisKeys,
  useScannerFileKeys,
} from '@/stores/toolbox';
import { useToolboxStore } from '@/stores/toolbox/UseToolboxStore';

export default function ScannerSettingsEnableTranscoderToggle() {
  const fileKeys = useScannerFileKeys();
  const analysisKeys = useScannerFileAnalysisKeys();
  const hasFileKeys = fileKeys.length > 0;
  const hasAnalysisKeys = analysisKeys.length > 0;

  const enableTranscoder = useToolboxStore(
    (ctx) => ctx.scanner.settings.enableTranscoder,
  );
  const toggleScannerSettingsEnableTranscoder = useToolboxStore(
    (ctx) => ctx.toggleScannerSettingsEnableTranscoder,
  );

  function onClick() {
    toggleScannerSettingsEnableTranscoder();
  }

  return (
    <FieldToggle
      className="py-0 outline-none"
      value={enableTranscoder}
      onClick={onClick}
      disabled={!hasFileKeys || hasAnalysisKeys}>
      Use FFmpeg transcoder
    </FieldToggle>
  );
}
