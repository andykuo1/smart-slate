import { useCallback, useState } from 'react';

import FolderOpenIcon from '@material-symbols/svg-400/rounded/folder_open.svg';
import SaveIcon from '@material-symbols/svg-400/rounded/save.svg';
import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import FieldButton from '@/fields/FieldButton';
import { useSingleFileInput } from '@/libs/UseSingleFileInput';
import { openDirectory } from '@/scanner/DirectoryPicker';
import BarberpoleStyle from '@/styles/Barberpole.module.css';
import { basename, extname } from '@/utils/PathHelper';

import PageLayout from './PageLayout';

export default function RenamePage() {
  const [files, setFiles] = useState(
    /** @type {Array<import('@/scanner/DirectoryPicker').FileWithHandles>} */ ([]),
  );
  const [mapping, setMapping] = useState(
    /** @type {Record<string, string>} */ ({}),
  );

  const hasAnyMapping = Object.keys(mapping).length > 0;

  return (
    <PageLayout className="bg-white text-black dark:bg-gray-900 dark:text-white">
      <fieldset className="mx-auto flex h-full flex-1 flex-col gap-4 p-10 font-mono sm:flex-row">
        <title>Batch Rename</title>
        <div className="flex flex-col gap-2">
          <FieldOpenDirectoryInput onChange={(files) => setFiles(files)} />
          <FieldUploadFileInput
            title="Upload .csv file"
            accept=".csv"
            onChange={async (fileData) => {
              let textData = await fileData.text();
              let lines = textData.split('\n');
              /** @type {Record<string, string>} */
              let result = {};
              for (let line of lines) {
                let [first, second] = line.split(',');
                result[basename(first)] = basename(second);
              }
              setMapping(result);
            }}>
            Upload .csv
          </FieldUploadFileInput>
          <output className={hasAnyMapping ? 'visible' : 'invisible'}>
            Found {Object.keys(mapping).length} entries
          </output>
          <FieldRenameFilesInput
            files={files}
            mapping={(file) => mapping[basename(file.name)]}
          />
        </div>
        <ul className="flex flex-col overflow-y-auto p-2">
          {files.map((file) => {
            const fileBaseName = basename(file.name);
            const fileExtName = extname(file.name);
            const mappedName = mapping[fileBaseName];
            return (
              <li
                key={file.webkitRelativePath}
                className={
                  'flex flex-col gap-2 px-2 ' +
                  ' ' +
                  (mappedName
                    ? 'rounded bg-green-200 py-4'
                    : hasAnyMapping
                      ? 'opacity-30'
                      : '')
                }>
                {file.name}
                {mappedName ? ` => ${mappedName}${fileExtName}` : ''}
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
 * @param {(file: T) => string} props.mapping
 * @param {(e: { value: T|undefined, done: boolean}) => void} [props.onChange]
 */
function FieldRenameFilesInput({ files, mapping, onChange }) {
  const [progress, setProgress] = useState(-1);

  const onClick = useCallback(
    async function _onClick() {
      setProgress(0);
      /** @type {Record<string, T>} */
      let result = {};
      for (let file of files) {
        let naming = mapping(file);
        if (typeof naming !== 'string' || naming.trim().length <= 0) {
          continue;
        }
        result[naming] = file;
      }
      let resultKeys = Object.keys(result);
      console.log(
        `[FieldRenameFilesInput] Renaming ${resultKeys.length}/${files.length} file(s)...`,
      );
      // NOTE: Offset by 1 so the LAST setProgress() can complete.
      let maxProgress = (resultKeys.length + 1) * 100;
      let deltaProgress = Math.ceil((1 / maxProgress) * 100);
      for (let [key, file] of Object.entries(result)) {
        let fileName = file.name;
        let fileHandle = file.handle;
        let fileExtName = extname(fileName);
        let value = `${key}${fileExtName}`;
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
      disabled={files.length <= 0}>
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

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.accept
 * @param {import('@/libs/UseSingleFileInput').SingleFileInputChangeHandler} props.onChange
 * @param {import('react').ReactNode} [props.children]
 */
function FieldUploadFileInput({
  accept,
  title = 'Upload file',
  onChange,
  children = 'Upload file',
  ...buttonProps
}) {
  const [render, click] = useSingleFileInput(accept, onChange);
  return (
    <>
      <FieldButton
        title={title}
        Icon={UploadIcon}
        onClick={click}
        {...buttonProps}>
        {children}
      </FieldButton>
      {render()}
    </>
  );
}

/**
 * @param {object} props
 * @param {(files: Array<import('@/scanner/DirectoryPicker').FileWithHandles>) => void} props.onChange
 * @param {string} [props.title]
 * @param {boolean} [props.disabled]
 * @param {import('react').ReactNode} [props.children]
 */
function FieldOpenDirectoryInput({
  title = 'Open directory on local device',
  onChange,
  disabled,
  children = 'Open directory',
}) {
  async function onClick() {
    const files = await openDirectory();
    if (!files) {
      return;
    }
    onChange(files);
  }
  return (
    <FieldButton
      Icon={FolderOpenIcon}
      title={title}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </FieldButton>
  );
}
