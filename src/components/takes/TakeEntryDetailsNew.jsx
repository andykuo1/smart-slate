import { useCallback } from 'react';

import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import HorizontallySnappableDiv from '@/libs/HorizontallySnappableDiv';
import { useMultiFileInput } from '@/libs/UseMultiFileInput';
import { useTakeExporter } from '@/serdes/UseTakeExporter';

import { getListDecorationStyleByViewMode } from './TakeListViewMode';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {'inline'|'list'} props.viewMode
 */
export default function TakeEntryDetails({
  className,
  documentId,
  sceneId,
  shotId,
  viewMode,
}) {
  const exportTake = useTakeExporter();
  /** @type {import('@/libs/UseMultiFileInput').MultiFileInputChangeHandler} */
  const onFile = useCallback(function _onFile(files) {
    for (let file of files) {
      console.log('[ImportFootage] Imported ' + file.name + ' ' + file.type);
      exportTake(file, documentId, sceneId, shotId);
    }
  }, []);
  const [render, click] = useMultiFileInput('video/*', onFile);

  const listDecorationStyle = getListDecorationStyleByViewMode(viewMode);
  return (
    <HorizontallySnappableDiv className={className + ' ' + listDecorationStyle}>
      <button
        className="flex flex-row p-2 ml-2 outline rounded text-gray-400 hover:text-black"
        onClick={click}>
        <UploadIcon className="w-6 h-6 fill-current ml-auto" />
        <span className="mr-auto">Import footage</span>
        {render()}
      </button>
    </HorizontallySnappableDiv>
  );
}
