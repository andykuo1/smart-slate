import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';
import SaveIcon from '@material-symbols/svg-400/rounded/save.svg';
import ServiceToolboxIcon from '@material-symbols/svg-400/rounded/service_toolbox.svg';

import FieldButton from '@/fields/FieldButton';
import FieldOpenDirectory from '@/fields/FieldOpenDirectory';
import FieldUploadFile from '@/fields/FieldUploadFile';
import BarberpoleStyle from '@/styles/Barberpole.module.css';
import { basename, extname } from '@/utils/PathHelper';

import PageLayout from './PageLayout';

export default function RenamePage() {
  const [files, setFiles] = useState(
    /** @type {Array<import('@/scanner/DirectoryPicker').FileWithHandles>} */ ([]),
  );
  const [mapping, setMapping] = useState(
    /** @type {Record<string, import('@/scanner/DirectoryPicker').FileWithHandles>} */ ({}),
  );
  const navigate = useNavigate();

  function onBackClick() {
    navigate('/');
  }

  const hasAnyMapping = Object.keys(mapping).length > 0;
  const hasAnyFiles = files.length > 0;

  return (
    <PageLayout className="bg-white text-black dark:bg-gray-900 dark:text-white">
      <fieldset className="mx-auto flex h-full flex-1 flex-col gap-4 p-10 font-mono sm:flex-row">
        <legend className="flex items-center gap-4 py-4">
          <ServiceToolboxIcon className="inline-block h-10 w-10 fill-current" />
          <span className="font-bold">Batch Rename Tool</span>
          (with CSV support :D)
        </legend>
        <div className="flex flex-col gap-2 overflow-y-auto p-2">
          <FieldButton Icon={ArrowBackIcon} onClick={onBackClick}>
            Return home
          </FieldButton>
          <br />
          <FieldOpenDirectory
            onChange={(files) => setFiles(files)}
            disabled={hasAnyMapping}
          />
          <FieldUploadFile
            title="Upload .csv file"
            accept=".csv"
            onChange={async (fileData) => {
              let textData = await fileData.text();
              let lines = textData.split('\n');
              // Get names from CSV...
              /** @type {Record<string, string>} */
              let jsonData = {};
              for (let line of lines) {
                let [first, second] = line.split(',');
                jsonData[basename(first)] = basename(second);
              }
              // Compare against actual files...
              /** @type {Record<string, import('@/scanner/DirectoryPicker').FileWithHandles>} */
              let result = {};
              for (let file of files) {
                let fileName = basename(file.name);
                let dataName = jsonData[fileName];
                if (dataName && dataName.trim().length > 0) {
                  result[dataName] = file;
                }
              }
              let resultKeys = Object.keys(result);
              let resultCount = resultKeys.length;
              console.log(
                `[FieldRenameFilesInput] Matched ${resultCount}/${files.length} file(s)...`,
              );
              if (resultCount <= 0) {
                window.alert('No files matched.');
                return;
              }
              setMapping(result);
            }}
            disabled={!hasAnyFiles}>
            Upload .csv
          </FieldUploadFile>
          <output
            className={
              'text-center' + ' ' + (hasAnyMapping ? 'visible' : 'invisible')
            }>
            Found {Object.keys(mapping).length} matched file(s)
          </output>
          <FieldRenameFilesInput
            files={files}
            mapping={mapping}
            disabled={!hasAnyMapping || !hasAnyFiles}
          />
          <FieldButton
            onClick={() => {
              setFiles([]);
              setMapping({});
            }}
            disabled={!hasAnyMapping || !hasAnyFiles}>
            Reset
          </FieldButton>
        </div>
        <ul className="flex w-[50vw] flex-col overflow-y-auto p-2">
          {files.map((file) => {
            const fileExtName = extname(file.name);
            const mappedResult = Object.entries(mapping).find(
              ([_, mappedFile]) => mappedFile === file,
            );
            return (
              <li
                key={file.webkitRelativePath}
                className={
                  'flex flex-col gap-2 px-2 ' +
                  ' ' +
                  (mappedResult
                    ? 'rounded bg-green-200 font-bold'
                    : hasAnyMapping
                      ? 'opacity-30'
                      : '')
                }>
                {file.name}
                {mappedResult ? ` => ${mappedResult[0]}${fileExtName}` : ''}
              </li>
            );
          })}
        </ul>
      </fieldset>
    </PageLayout>
  );
}

/**
 * @template {import('@/scanner/DirectoryPicker').FileWithHandles} T
 * @param {object} props
 * @param {Array<T>} props.files
 * @param {Record<string, T>} props.mapping
 * @param {(e: { value: T|undefined, done: boolean}) => void} [props.onChange]
 * @param {boolean} props.disabled
 */
function FieldRenameFilesInput({
  files,
  mapping,
  onChange,
  disabled = !onChange || files.length <= 0,
}) {
  const [progress, setProgress] = useState(-1);

  const onClick = useCallback(
    async function _onClick() {
      setProgress(0);
      let resultKeys = Object.keys(mapping);
      console.log(
        `[FieldRenameFilesInput] Renaming ${resultKeys.length} file(s)...`,
      );
      // NOTE: Offset by 1 so the LAST setProgress() can complete.
      let maxProgress = (resultKeys.length + 1) * 100;
      let deltaProgress = Math.ceil((1 / maxProgress) * 100);
      for (let [unformattedValue, file] of Object.entries(mapping)) {
        let fileName = file.name;
        let fileHandle = file.handle;
        let fileExtName = extname(fileName);
        let hasUnformattedExt = unformattedValue.indexOf('.') >= 0;
        let value = hasUnformattedExt
          ? unformattedValue
          : `${unformattedValue}${fileExtName}`;
        if (fileHandle) {
          console.log(`[FieldRenameFilesInput] Moving ${fileName} => ${value}`);
          // @ts-expect-error handle.move() is supported on chrome (though not standard).
          await fileHandle.move(value);
        }
        setProgress((prev) => Math.min(prev + deltaProgress, 100));
        onChange?.({ value: file, done: false });
      }
      // NOTE: Complete it :)
      setProgress(100);
      onChange?.({ value: undefined, done: true });
    },
    [files, mapping, setProgress],
  );

  return (
    <FieldButton
      className="group relative"
      title="Rename selected files"
      Icon={SaveIcon}
      onClick={onClick}
      disabled={disabled}>
      <div className="flex flex-col gap-2">
        <div className="mt-2">Rename files on disk</div>
        <div className="mx-auto mb-4 block w-[80%] text-xs opacity-50">
          NOTE: Only <b>Chrome</b> browsers are supported.
          {/* SOURCE: https://caniuse.com/mdn-api_filesystemhandle_move */}
        </div>
        {files.length > 0 && (
          <>
            <div
              className={
                'absolute bottom-0 left-0 right-0 h-2 outline' +
                ' ' +
                (progress > 0
                  ? `w-[${String(
                      Math.trunc(progress),
                    )}%] bg-black group-hover:bg-gray-400`
                  : progress === 0
                    ? BarberpoleStyle.barberpole
                    : 'invisible')
              }
            />
            <div
              className={
                'absolute bottom-0 right-2 mx-auto my-1 rounded-full bg-white px-2 text-xs group-hover:bg-black' +
                ' ' +
                (progress > 0 ? 'visible' : 'invisible')
              }>
              {progress >= 100 ? 'DONE! ' : ''}
              {progress}%
            </div>
          </>
        )}
      </div>
    </FieldButton>
  );
}
