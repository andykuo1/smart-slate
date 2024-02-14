import ResetIcon from '@material-symbols/svg-400/rounded/reset_image.svg';
import ServiceToolboxIcon from '@material-symbols/svg-400/rounded/service_toolbox.svg';

import FieldButton from '@/fields/FieldButton';
import FieldOpenDirectory from '@/fields/FieldOpenDirectory';
import FieldRenameFilesInput from '@/fields/FieldRenameFiles';
import FieldUploadFile from '@/fields/FieldUploadFile';
import {
  useRenamerFileKeys,
  useRenamerFileObject,
  useRenamerFileRenameKeys,
  useRenamerFileRenameValue,
} from '@/stores/toolbox/UseRenamer';
import { useToolboxStore } from '@/stores/toolbox/UseToolboxStore';
import ToolboxNavigateBackButton from '@/toolbox/ToolboxNavigateBackButton';
import { basename, extname } from '@/utils/PathHelper';

import PageLayout from './PageLayout';
import { ToolboxActionList } from './ToolboxLayout';

export default function RenamePage() {
  const files = useToolboxStore((ctx) => ctx.renamer.files);
  const renames = useToolboxStore((ctx) => ctx.renamer.renames);
  const setFileObject = useToolboxStore((ctx) => ctx.setRenamerFileObject);
  const setFileRenameValue = useToolboxStore(
    (ctx) => ctx.setRenamerFileRenameValue,
  );

  const hasAnyRenames = Object.keys(renames).length > 0;
  const hasAnyFiles = Object.keys(files).length > 0;

  return (
    <PageLayout className="bg-white text-black dark:bg-gray-900 dark:text-white">
      <fieldset className="relative m-4 flex flex-col overflow-hidden border-2 border-black px-4 pb-4 md:flex-row">
        <legend className="my-3 flex w-full items-center gap-4 p-3 shadow">
          <ServiceToolboxIcon className="inline-block h-10 w-10 fill-current" />
          <span className="text-xl font-bold">
            Batch Rename Tool{' '}
            <span className="opacity-30">(w/ CSV support!)</span>
          </span>
        </legend>

        <div className="flex-1 overflow-y-auto">
          <ToolboxActionList
            items={[
              <FieldOpenDirectory
                onChange={(files) => {
                  for (let file of files) {
                    setFileObject(file.webkitRelativePath, file);
                  }
                }}
                disabled={hasAnyRenames}
              />,
              <>
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
                    let count = 0;
                    for (let fileKey of Object.keys(files)) {
                      let file = files[fileKey];
                      let fileName = basename(file.name);
                      let dataName = jsonData[fileName];
                      if (dataName && dataName.trim().length > 0) {
                        setFileRenameValue(
                          fileKey,
                          dataName + extname(file.name),
                        );
                        ++count;
                      }
                    }
                    console.log(
                      `[FieldRenameFilesInput] Matched ${count}/${files.length} file(s)...`,
                    );
                    if (count <= 0) {
                      window.alert('No files matched.');
                      return;
                    }
                  }}
                  disabled={!hasAnyFiles}>
                  Upload .csv
                </FieldUploadFile>
              </>,
              <>
                <RenamerOutputCount />
                <FieldRenameFilesInput
                  files={files}
                  renames={renames}
                  disabled={!hasAnyRenames || !hasAnyFiles}
                />
                <RenamerResetButton title="Reset renamer" />
                <br />
              </>,
            ]}>
            <ToolboxNavigateBackButton />
          </ToolboxActionList>
        </div>

        <div className="flex flex-1 overflow-hidden md:w-1">
          <div className="m-1 w-1 flex-1 overflow-auto">
            <table className="table-auto p-1">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr className="whitespace-nowrap text-left">
                  <th className="sticky left-0 bg-gradient-to-r from-gray-100 from-80% to-transparent px-4">
                    ##
                  </th>
                  <th className="p-2">LOCAL FILE</th>
                  <th className="p-2">RENAME TO</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <RenamerFileEntryList />
              </tbody>
              <tfoot className="sticky bottom-0 z-10 bg-gray-100">
                <tr className="whitespace-nowrap text-left">
                  <th className="sticky left-0 bg-gradient-to-r from-gray-100 from-80% to-transparent px-4">
                    ##
                  </th>
                  <th className="p-2">LOCAL FILE</th>
                  <th className="p-2">RENAME TO</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </fieldset>
    </PageLayout>
  );
}

function RenamerOutputCount() {
  let renameKeys = useRenamerFileRenameKeys();
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

function RenamerFileEntryList() {
  const fileKeys = useRenamerFileKeys();
  const hasFileKeys = fileKeys.length > 0;
  return (
    <>
      {hasFileKeys && (
        <tr className="opacity-30">
          <th className="sticky left-0 bg-gradient-to-r from-white from-80% to-transparent" />
          <td>--START OF LIST--</td>
          <td />
        </tr>
      )}
      {fileKeys.map((fileKey, index) => (
        <RenamerFileEntry key={fileKey} index={index} fileKey={fileKey} />
      ))}
      {hasFileKeys && (
        <tr className="opacity-30">
          <th className="sticky left-0 bg-gradient-to-r from-white from-80% to-transparent" />
          <td>--END OF LIST--</td>
          <td />
        </tr>
      )}
      {!hasFileKeys && (
        <tr className="opacity-30">
          <th className="sticky left-0 bg-gradient-to-r from-white from-80% to-transparent" />
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
function RenamerFileEntry({ index, fileKey }) {
  const fileObject = useRenamerFileObject(fileKey);
  const rename = useRenamerFileRenameValue(fileKey);
  return (
    <tr
      className={
        ' ' +
        (rename
          ? 'bg-green-200 even:bg-green-300'
          : 'bg-white even:bg-gray-100')
      }>
      <th className="sticky left-0 whitespace-nowrap bg-gradient-to-r from-gray-100 from-80% to-transparent">
        {String(index).padStart(2, '0')}
      </th>
      <td className="whitespace-nowrap">{fileObject.name}</td>
      <td className="whitespace-nowrap">{rename || '--'}</td>
    </tr>
  );
}

/**
 * @param {object} props
 * @param {string} props.title
 */
function RenamerResetButton({ title }) {
  const fileKeys = useRenamerFileKeys();
  const hasFileKeys = fileKeys.length > 0;
  const clearRenamerStore = useToolboxStore((ctx) => ctx.clearRenamerStore);
  function onClick() {
    clearRenamerStore();
  }
  return (
    <FieldButton
      title={title}
      Icon={ResetIcon}
      onClick={onClick}
      disabled={!hasFileKeys}>
      Reset
    </FieldButton>
  );
}
