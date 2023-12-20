import { useCallback } from 'react';

import UploadIcon from '@material-symbols/svg-400/rounded/upload-fill.svg';

import { NOOP, RETHROW } from '@/constants/Functions';
import FancyButton from '@/lib/FancyButton';
import { useProjectImport } from '@/serdes/UseProjectImport';

import { useSingleFileInput } from './UseSingleFileInput';

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

  /** @type {import('./UseSingleFileInput').SingleFileInputChangeHandler} */
  const onFile = useCallback(
    function _onFile(file) {
      file
        .text()
        .then((text) => importProject('fountain-text', text))
        .then(onSuccess)
        .catch(onError);
    },
    [importProject, onSuccess, onError],
  );

  const [render, click] = useSingleFileInput('*.fountain,*.txt', onFile);
  return (
    <FancyButton title="Import" className="mx-1 px-12" onClick={click}>
      {render()}
      <UploadIcon className="inline w-6 h-6 fill-current" />
    </FancyButton>
  );
}
