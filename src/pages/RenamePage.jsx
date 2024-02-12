import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';
import ServiceToolboxIcon from '@material-symbols/svg-400/rounded/service_toolbox.svg';

import FieldButton from '@/fields/FieldButton';
import FieldOpenDirectory from '@/fields/FieldOpenDirectory';
import FieldRenameFilesInput from '@/fields/FieldRenameFiles';
import FieldUploadFile from '@/fields/FieldUploadFile';
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
