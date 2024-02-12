import { useCallback, useState } from 'react';

import SaveIcon from '@material-symbols/svg-400/rounded/save.svg';

import BarberpoleStyle from '@/styles/Barberpole.module.css';
import { extname } from '@/utils/PathHelper';

import FieldButton from './FieldButton';

/**
 * @template {import('@/scanner/DirectoryPicker').FileWithHandles} T
 * @param {object} props
 * @param {Array<T>} props.files
 * @param {Record<string, T>} props.mapping
 * @param {(e: { value: T|undefined, done: boolean}) => void} [props.onChange]
 * @param {boolean} props.disabled
 */
export default function FieldRenameFilesInput({
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
    [files, mapping, setProgress, onChange],
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
