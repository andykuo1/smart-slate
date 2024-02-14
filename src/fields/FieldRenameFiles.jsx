import { useCallback, useState } from 'react';

import SaveIcon from '@material-symbols/svg-400/rounded/save.svg';

import BarberpoleStyle from '@/styles/Barberpole.module.css';
import { extname } from '@/utils/PathHelper';

import FieldButton from './FieldButton';

/**
 * @template {import('@/scanner/DirectoryPicker').FileWithHandles} T
 * @param {object} props
 * @param {Record<string, T>} props.files
 * @param {Record<string, string>} props.renames
 * @param {(e: { value: T|undefined, done: boolean}) => void} [props.onChange]
 * @param {boolean} [props.disabled]
 */
export default function FieldRenameFiles({
  files,
  renames,
  onChange,
  disabled,
}) {
  const [progress, setProgress] = useState(-1);
  const hasFileKeys = Object.keys(files).length > 0;
  const isReady = hasFileKeys && Object.keys(renames).length > 0;
  const showProgressBar = hasFileKeys;

  const onClick = useCallback(
    async function _onClick() {
      setProgress(0);

      const renameKeys = Object.keys(renames);
      console.log(
        `[FieldRenameFilesInput] Renaming ${renameKeys.length} file(s)...`,
      );

      // NOTE: Offset by 1 so the LAST setProgress() can complete.
      const maxProgress = (renameKeys.length + 1) * 100;
      const deltaProgress = Math.ceil((1 / maxProgress) * 100);
      for (let renameKey of renameKeys) {
        let rename = renames[renameKey];
        let file = files[renameKey];
        if (!file) {
          console.error(`[FieldRenameFiles] Missing file object!`);
          setProgress((prev) => Math.min(prev + deltaProgress, 100));
          continue;
        }
        if (!rename) {
          console.error(`[FieldRenameFiles] Missing rename value!`);
          setProgress((prev) => Math.min(prev + deltaProgress, 100));
          continue;
        }

        let fileName = file.name;
        let fileHandle = file.handle;
        let fileExtName = extname(fileName);

        // NOTE: Preserve file ext if not yet on there.
        if (rename.indexOf('.') < 0) {
          rename = `${rename}${fileExtName}`;
        }

        if (!fileHandle) {
          console.error(`[FieldRenameFilesInput] Missing file handle!`);
          setProgress((prev) => Math.min(prev + deltaProgress, 100));
          continue;
        }

        console.log(`[FieldRenameFilesInput] Moving ${fileName} => ${rename}`);
        // NOTE: handle.move() is supported on chrome (though not standard).
        await /** @type {any} */ (fileHandle).move(rename);

        onChange?.({ value: file, done: false });
        setProgress((prev) => Math.min(prev + deltaProgress, 100));
      }
      // NOTE: Complete it :)
      onChange?.({ value: undefined, done: true });
      setProgress(100);
    },
    [files, renames, setProgress, onChange],
  );

  return (
    <FieldButton
      className="group relative"
      title="Rename selected files"
      Icon={SaveIcon}
      onClick={onClick}
      disabled={disabled || !isReady}>
      <div className="mx-auto flex flex-col gap-2 py-2">
        <div>Rename files on disk</div>
        <div className="flex flex-col items-center gap-2 text-xs opacity-50">
          {/* SOURCE: https://caniuse.com/mdn-api_filesystemhandle_move */}
          <div>
            NOTE: Only <b>Chrome</b> browsers are supported.
          </div>
          <div className="w-[70%]">
            Otherwise, download the CSV file and use a batch rename tool.
          </div>
        </div>
        {showProgressBar && (
          <>
            <div
              style={{ width: `${Math.trunc(progress)}%` }}
              className={
                'absolute bottom-0 left-0 right-0 h-2 outline' +
                ' ' +
                (progress > 0
                  ? 'bg-black group-hover:bg-gray-400'
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
