import { useCallback } from 'react';

import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import FieldButton from '@/fields/FieldButton';
import { useMultiFileInput } from '@/libs/UseMultiFileInput';
import { useTakeExporter } from '@/serdes/UseTakeExporter';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function SettingsShotTakesImportButton({
  documentId,
  sceneId,
  shotId,
}) {
  const exportTake = useTakeExporter();

  /** @type {import('@/libs/UseMultiFileInput').MultiFileInputChangeHandler} */
  const onFile = useCallback(
    function _onFile(files) {
      for (let file of files) {
        console.log('[ImportFootage] Imported ' + file.name + ' ' + file.type);
        exportTake(file, documentId, sceneId, shotId);
      }
    },
    [documentId, sceneId, shotId, exportTake],
  );

  const [render, click] = useMultiFileInput('video/*', onFile);

  return (
    <FieldButton className="w-auto" Icon={UploadIcon} onClick={click}>
      Import take
      {render()}
    </FieldButton>
  );
}
