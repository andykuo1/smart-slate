import {
  Tooltip,
  TooltipAnchor,
  TooltipArrow,
  TooltipProvider,
} from '@ariakit/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import DownloadIcon from '@material-symbols/svg-400/rounded/download.svg';
import PlagiarismIcon from '@material-symbols/svg-400/rounded/plagiarism.svg';
import PlaylistAddCheckIcon from '@material-symbols/svg-400/rounded/playlist_add_check.svg';
import QRCodeScannerIcon from '@material-symbols/svg-400/rounded/qr_code_scanner.svg';
import ResetIcon from '@material-symbols/svg-400/rounded/reset_image.svg';
import ServiceToolboxIcon from '@material-symbols/svg-400/rounded/service_toolbox.svg';

import FieldButton from '@/fields/FieldButton';
import FieldOpenDirectoryInput from '@/fields/FieldOpenDirectory';
import FieldRenameFilesInput from '@/fields/FieldRenameFiles';
import FieldToggle from '@/fields/FieldToggle';
import { toDateString } from '@/serdes/ExportNameFormat';
import { useSetTakePreviewImage } from '@/stores/document';
import { useDocumentStore } from '@/stores/document/use';
import {
  createScannerAnalysisInfo,
  useScannerFileAnalysis,
  useScannerFileAnalysisKeys,
  useScannerFileKeys,
  useScannerFileObject,
  useScannerFileObjectMap,
  useScannerFileRenameKeys,
  useScannerFileRenameMap,
  useScannerFileRenameValue,
} from '@/stores/toolbox';
import { useToolboxStore } from '@/stores/toolbox/UseToolboxStore';
import { useTranscoderFFmpeg } from '@/stores/toolbox/UseTranscoder';
import { useCurrentDocumentId } from '@/stores/user';
import PopoverStyle from '@/styles/Popover.module.css';
import ToolboxNavigateBackButton from '@/toolbox/ToolboxNavigateBackButton';
import { downloadText } from '@/utils/Downloader';
import { basename } from '@/utils/PathHelper';

import PageLayout from './PageLayout';
import { analyzeFile, deriveRenameValue } from './ScannerAnalyzer';
import ScannerTranscoderInit from './ScannerTranscoderInit';
import { ToolboxActionList } from './ToolboxLayout';

export default function ScanPage() {
  return (
    <PageLayout className="bg-white text-black dark:bg-gray-900 dark:text-white">
      <fieldset className="relative m-4 mx-auto flex w-[80%] flex-col overflow-hidden border-2 border-black px-4 pb-4 md:flex-row">
        <legend className="my-3 flex w-full items-center gap-4 p-3 shadow">
          <QRCodeScannerIcon className="inline-block h-10 w-10 fill-current" />
          <span className="text-xl font-bold">QR Code Take Scanner Tool</span>
        </legend>
        <div className="max-w-sm flex-1 overflow-y-auto">
          <ToolboxActionList
            items={[
              <ScannerOpenDirectoryButton />,
              <>
                <ScannerAnalyzeButton />
                <ScannerSettingsShowAnalysisToggle />
                <ScannerResetButton />
                <br />
              </>,
              <>
                <ScannerOutputCount />
                <ScannerImportTakesButton />
                <ScannerRenameButton />
                <ScannerExportCSVButton />
                <ScannerToBatchRenameToolButton />
                <br />
              </>,
            ]}>
            <ToolboxNavigateBackButton />
          </ToolboxActionList>
        </div>
        <div className="flex flex-1 overflow-hidden md:w-1">
          <div className="m-1 w-1 flex-1 overflow-auto">
            <table className="table-auto p-1">
              <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700">
                <tr className="whitespace-nowrap text-left">
                  <th className="sticky left-0 bg-gradient-to-r from-gray-100 from-80% to-transparent px-4 dark:from-gray-700">
                    ##
                  </th>
                  <th className="p-2">LOCAL FILE</th>
                  <th className="p-2">RENAME TO</th>
                  <th className="p-2">ANALYSIS INFO</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <ScannerFileEntryList />
              </tbody>
              <tfoot className="sticky bottom-0 z-10 bg-gray-100 dark:bg-gray-700">
                <tr className="whitespace-nowrap text-left">
                  <th className="sticky left-0 bg-gradient-to-r from-gray-100 from-80% to-transparent px-4 dark:from-gray-700">
                    ##
                  </th>
                  <th className="p-2">LOCAL FILE</th>
                  <th className="p-2">RENAME TO</th>
                  <th className="p-2">ANALYSIS INFO</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </fieldset>
    </PageLayout>
  );
}

function ScannerResetButton() {
  const fileKeys = useScannerFileKeys();
  const hasFileKeys = fileKeys.length > 0;
  const clearScannerStore = useToolboxStore((ctx) => ctx.clearScannerStore);
  function onClick() {
    clearScannerStore();
  }
  return (
    <FieldButton
      title="Reset scanner"
      Icon={ResetIcon}
      onClick={onClick}
      disabled={!hasFileKeys}>
      Reset
    </FieldButton>
  );
}

function ScannerFileEntryList() {
  const fileKeys = useScannerFileKeys();
  const hasFileKeys = fileKeys.length > 0;
  return (
    <>
      {hasFileKeys && (
        <tr className="opacity-30">
          <th className="sticky left-0 bg-gradient-to-r from-white from-80% to-transparent dark:from-gray-900" />
          <td>--START OF LIST--</td>
          <td />
          <td />
        </tr>
      )}
      {fileKeys.map((fileKey, index) => (
        <ScannerFileEntry key={fileKey} index={index} fileKey={fileKey} />
      ))}
      {hasFileKeys && (
        <tr className="opacity-30">
          <th className="sticky left-0 bg-gradient-to-r from-white from-80% to-transparent dark:from-gray-900" />
          <td>--END OF LIST--</td>
          <td />
          <td />
        </tr>
      )}
      {!hasFileKeys && (
        <tr className="opacity-30">
          <th className="sticky left-0 bg-gradient-to-r from-white from-80% to-transparent dark:from-gray-900" />
          <td>--</td>
          <td>--</td>
          <td>--</td>
        </tr>
      )}
    </>
  );
}

/**
 * @param {object} props
 * @param {number} props.index
 * @param {import('@/stores/toolbox').FileKey} props.fileKey
 */
function ScannerFileEntry({ index, fileKey }) {
  const fileObject = useScannerFileObject(fileKey);
  const analysis = useScannerFileAnalysis(fileKey);
  const rename = useScannerFileRenameValue(fileKey);
  const showAnalysis = useToolboxStore(
    (ctx) => ctx.scanner.settings.showAnalysis,
  );
  const isFailedRename = rename === '';
  return (
    <TooltipProvider timeout={0} placement="right">
      <tr
        className={
          ' ' +
          (rename
            ? 'bg-lime-200 dark:bg-lime-800'
            : isFailedRename
              ? 'bg-red-200 dark:bg-red-900'
              : 'bg-white even:bg-gray-100 dark:bg-gray-900 dark:even:bg-gray-700')
        }>
        <th className="sticky left-0 whitespace-nowrap bg-gradient-to-r from-gray-100 from-80% to-transparent dark:from-gray-700">
          {String(index).padStart(2, '0')}
        </th>
        <td className="whitespace-nowrap">{fileObject.name}</td>
        <td
          className={
            'whitespace-nowrap' + ' ' + (isFailedRename ? 'italic' : '')
          }>
          <TooltipAnchor className="inline-block">
            {isFailedRename ? '<failed>' : rename || '--'}
          </TooltipAnchor>
        </td>
        <Tooltip
          className={PopoverStyle.popover}
          hidden={isFailedRename ? undefined : true}>
          <TooltipArrow className={PopoverStyle.arrow} />
          TIP: Try converting files into .mp4 or .mov and scanning those
          instead.
          <div className="mt-1">Like proxies ;)</div>
        </Tooltip>
        <td className="max-w-[30%] overflow-x-auto">
          <pre className={!showAnalysis && analysis ? 'opacity-30' : ''}>
            {showAnalysis
              ? jsonStringifyAndOmit(analysis, OMITTED_ANALYSIS_INFO_FIELDS)
              : analysis
                ? '<hidden>'
                : '--'}
          </pre>
        </td>
      </tr>
    </TooltipProvider>
  );
}

const OMITTED_ANALYSIS_INFO_FIELDS = ['snapshot'];
/**
 * @param {Record<string, any>} object
 * @param {Array<string>} omits
 */
function jsonStringifyAndOmit(object, omits = []) {
  let result = { ...object };
  for (let omit of omits) {
    if (!(omit in result)) {
      continue;
    }
    let current = result[omit];
    if (!current) {
      continue;
    }
    if (typeof current === 'string' && current.length >= 32) {
      result[omit] = current.substring(0, 10) + '...';
    }
  }
  return JSON.stringify(result, null, 4);
}

function ScannerOpenDirectoryButton() {
  const setScannerFileObject = useToolboxStore(
    (ctx) => ctx.setScannerFileObject,
  );

  /**
   * @param {Array<import('@/scanner/DirectoryPicker').FileWithHandles>} files
   */
  function onOpenDirectory(files) {
    for (let file of files) {
      setScannerFileObject(file.webkitRelativePath, file);
    }
  }

  return <FieldOpenDirectoryInput onChange={onOpenDirectory} />;
}

function ScannerAnalyzeButton() {
  const videoRef = useRef(/** @type {HTMLVideoElement|null} */ (null));
  const documentId = useCurrentDocumentId();
  const UNSAFE_getStore = useDocumentStore((ctx) => ctx.UNSAFE_getStore);
  const UNSAFE_getScannerStore = useToolboxStore(
    (ctx) => ctx.UNSAFE_getScannerStore,
  );
  const fileKeys = useScannerFileKeys();
  const renameKeys = useScannerFileRenameKeys();
  const setScannerFileAnalysis = useToolboxStore(
    (ctx) => ctx.setScannerFileAnalysis,
  );
  const setScannerFileRenameValue = useToolboxStore(
    (ctx) => ctx.setScannerFileRenameValue,
  );
  const hasFileKeys = fileKeys.length > 0;
  const hasRenameKeys = renameKeys.length > 0;
  const captureSnapshot = useToolboxStore((ctx) =>
    Boolean(ctx.scanner.settings.captureSnapshot),
  );
  const ffmpeg = useTranscoderFFmpeg();

  async function onAnalyzeFiles() {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    console.log('[Scanner] Start analyzing files...');
    const documentStore = UNSAFE_getStore();
    const scannerStore = UNSAFE_getScannerStore();
    for (let fileKey of fileKeys) {
      console.log('[Scanner] Analyze ' + fileKey + '...');
      let file = scannerStore.files[fileKey];

      let result = await analyzeFile(createScannerAnalysisInfo(), video, file, {
        onProgress(value) {
          setScannerFileAnalysis(fileKey, { ...value });
        },
        captureSnapshot,
        ffmpeg,
      });
      if (!result) {
        console.log('[Scanner] Failed analysis ' + fileKey);
        setScannerFileRenameValue(fileKey, '');
        continue;
      }
      setScannerFileAnalysis(fileKey, result);

      let value = await deriveRenameValue(
        documentStore,
        documentId,
        file,
        result,
      );
      if (!value) {
        console.log('[Scanner] Failed rename ' + fileKey);
        setScannerFileRenameValue(fileKey, '');
        continue;
      }
      setScannerFileRenameValue(fileKey, value);
    }
  }

  return (
    <>
      <FieldButton
        Icon={PlagiarismIcon}
        onClick={onAnalyzeFiles}
        disabled={!hasFileKeys || hasRenameKeys}>
        Analyze files
      </FieldButton>
      <ScannerTranscoderInit />
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

function ScannerSettingsShowAnalysisToggle() {
  const analysisKeys = useScannerFileAnalysisKeys();
  const hasAnalysisKeys = analysisKeys.length > 0;

  const showAnalysis = useToolboxStore(
    (ctx) => ctx.scanner.settings.showAnalysis,
  );
  const toggleScannerSettingsShowAnalysis = useToolboxStore(
    (ctx) => ctx.toggleScannerSettingsShowAnalysis,
  );

  function onClick() {
    toggleScannerSettingsShowAnalysis();
  }

  return (
    <FieldToggle
      value={showAnalysis}
      onClick={onClick}
      disabled={!hasAnalysisKeys}>
      Show analysis info
    </FieldToggle>
  );
}

function ScannerOutputCount() {
  let renameKeys = useScannerFileRenameKeys();
  const hasAnyRenames = renameKeys.length > 0;
  if (!hasAnyRenames) {
    return null;
  }
  return (
    <output className="italic opacity-30">
      Matched {renameKeys.length} file(s)
    </output>
  );
}

function ScannerImportTakesButton() {
  const UNSAFE_getScannerStore = useToolboxStore(
    (ctx) => ctx.UNSAFE_getScannerStore,
  );
  const analysisKeys = useScannerFileAnalysisKeys();
  const hasAnalysisKeys = analysisKeys.length > 0;

  const documentId = useCurrentDocumentId();
  const setTakePreview = useSetTakePreviewImage();

  function onClick() {
    if (!documentId) {
      // NOTE: Can only import if a project was chosen.
      return;
    }
    const scannerStore = UNSAFE_getScannerStore();
    for (let analysisKey of analysisKeys) {
      let analysis = scannerStore.analysis[analysisKey];
      if (!analysis.takeId || !analysis.snapshot) {
        continue;
      }
      setTakePreview(documentId, analysis.takeId, analysis.snapshot);
    }
  }
  return (
    <FieldButton
      title="Import takes to current project"
      Icon={PlaylistAddCheckIcon}
      onClick={onClick}
      disabled={!documentId || !hasAnalysisKeys}>
      Import snapshots to project
    </FieldButton>
  );
}

function ScannerRenameButton() {
  const files = useScannerFileObjectMap();
  const renames = useScannerFileRenameMap();
  return <FieldRenameFilesInput files={files} renames={renames} />;
}

function ScannerExportCSVButton() {
  const UNSAFE_getScannerStore = useToolboxStore(
    (ctx) => ctx.UNSAFE_getScannerStore,
  );
  const renameKeys = useScannerFileRenameKeys();
  const hasRenameKeys = renameKeys.length > 0;

  function onClick() {
    const scannerStore = UNSAFE_getScannerStore();
    let lines = [];
    for (let renameKey of renameKeys) {
      let rename = scannerStore.renames[renameKey];
      if (!rename) {
        continue;
      }
      let value = basename(rename);
      if (!value) {
        continue;
      }
      let file = scannerStore.files[renameKey];
      if (!file) {
        continue;
      }
      let key = basename(file.name);
      if (!key) {
        continue;
      }
      let csv = `${key},${value}`;
      lines.push(csv);
    }
    const result = lines.join('\n');
    const dateString = toDateString(new Date());
    downloadText(`EAGLESLATE_${dateString}_SCANNED_NAMES.csv`, result);
  }
  return (
    <FieldButton
      title="Download list as .csv"
      Icon={DownloadIcon}
      onClick={onClick}
      disabled={!hasRenameKeys}>
      Download list as .csv
    </FieldButton>
  );
}

function ScannerToBatchRenameToolButton() {
  const navigate = useNavigate();
  return (
    <FieldButton
      className="outline-none"
      title="Open batch rename tool"
      Icon={ServiceToolboxIcon}
      onClick={() => navigate('/rename')}>
      <div className="mx-auto">
        <span>{'Need a '}</span>
        <span className="whitespace-nowrap font-bold">batch rename tool?</span>
        <div className="mt-2">We got you.</div>
      </div>
    </FieldButton>
  );
}
