import { useCallback } from 'react';

import UploadIcon from '@material-symbols/svg-400/rounded/upload-fill.svg';

import FancyButton from '@/buttons/FancyButton';
import { useSingleFileInput } from '@/libs/UseSingleFileInput';
import { useProjectImport } from '@/serdes/UseProjectImport';
import { extname } from '@/utils/PathHelper';
import { NOOP, RETHROW } from '@/values/Functions';

/**
 * @param {object} props
 * @param {() => void} [props.onSuccess]
 * @param {(e: Error) => void} [props.onError]
 */
export default function ImportProjectButton({
  onSuccess = NOOP,
  onError = RETHROW,
}) {
  const importProject = useProjectImport();

  /** @type {import('../libs/UseSingleFileInput').SingleFileInputChangeHandler} */
  const onFile = useCallback(
    async function _onFile(file) {
      try {
        const ext = extname(file.name);
        switch (ext) {
          case '.fountain':
          case '.txt':
            await importProject('fountain-text', await file.text());
            break;
          case '.json':
            await importProject('project-json', await file.text());
            break;
          case '.fdx':
            await importProject('fdx', await file.text());
            break;
          default:
            throw new Error('Unsupported project file extension.');
        }
        onSuccess();
      } catch (e) {
        /** @type {Error} */
        let error;
        if (!(e instanceof Error)) {
          error = new Error(String(e));
        } else {
          error = e;
        }
        onError(error);
      }
    },
    [importProject, onSuccess, onError],
  );

  const [render, click] = useSingleFileInput('*.fountain,*.txt,*.json', onFile);
  return (
    <FancyButton title="Import" className="mx-1 px-12" onClick={click}>
      {render()}
      <UploadIcon className="inline h-6 w-6 fill-current" />
    </FancyButton>
  );
}
