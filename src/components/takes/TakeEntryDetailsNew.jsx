import {
  Select,
  SelectItem,
  SelectPopover,
  SelectProvider,
} from '@ariakit/react';
import { useCallback } from 'react';

import MoveItemIcon from '@material-symbols/svg-400/rounded/move_item.svg';
import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import HorizontallySnappableDiv from '@/libs/HorizontallySnappableDiv';
import { useMultiFileInput } from '@/libs/UseMultiFileInput';
import { useTakeExporter } from '@/serdes/UseTakeExporter';
import { useSceneHeading, useSceneNumber } from '@/stores/document';
import { useDocumentStore, useSceneIds } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';
import SelectStyle from '@/styles/Select.module.css';

import { getListDecorationStyleByViewMode } from './TakeListViewMode';
import { formatSceneNumber } from './TakeNameFormat';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {'inline'|'list'} props.viewMode
 */
export default function TakeEntryDetails({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
  viewMode,
}) {
  const sceneIds = useSceneIds(documentId);
  const moveShotToScene = useDocumentStore((ctx) => ctx.moveShotToScene);
  const setUserCursor = useSetUserCursor();

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

  /**
   * @param {import('@/stores/document/DocumentStore').SceneId} value
   */
  function onSceneChange(value) {
    moveShotToScene(documentId, blockId, shotId, value);
    setUserCursor(documentId, value, '', '');
  }

  const listDecorationStyle = getListDecorationStyleByViewMode(viewMode);
  return (
    <HorizontallySnappableDiv className={className + ' ' + listDecorationStyle}>
      <>
        <button
          className="flex flex-row p-2 ml-2 outline rounded text-gray-400 hover:text-black"
          onClick={click}>
          <UploadIcon className="w-6 h-6 fill-current ml-auto" />
          <span className="mr-auto">Import footage</span>
          {render()}
        </button>
        <SelectProvider value={sceneId} setValue={onSceneChange}>
          <Select className="flex flex-row p-2 ml-2 outline rounded text-gray-400 hover:text-black">
            <MoveItemIcon className="w-6 h-6 fill-current ml-auto" />
            <span className="mr-auto">Move to scene</span>
            {render()}
          </Select>
          <SelectPopover
            className={SelectStyle.popover}
            gutter={4}
            sameWidth={true}>
            {sceneIds.map((value) => (
              <SceneSelectItem
                key={value}
                documentId={documentId}
                sceneId={value}
                disabled={sceneId === value}
              />
            ))}
          </SelectPopover>
        </SelectProvider>
      </>
    </HorizontallySnappableDiv>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {boolean} props.disabled
 */
function SceneSelectItem({ documentId, sceneId, disabled }) {
  const [sceneHeading] = useSceneHeading(documentId, sceneId);
  const sceneNumber = useSceneNumber(documentId, sceneId);
  return (
    <SelectItem
      className={SelectStyle.selectItem}
      value={sceneId}
      disabled={disabled}>
      <span className="mr-1">{formatSceneNumber(sceneNumber)}</span>
      <span>{sceneHeading || 'SCENE'}</span>
    </SelectItem>
  );
}
