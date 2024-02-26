import {
  Select,
  SelectItem,
  SelectPopover,
  SelectProvider,
} from '@ariakit/react';

import MoveItemIcon from '@material-symbols/svg-400/rounded/move_item.svg';

import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useSceneHeading } from '@/stores/document';
import { useDocumentStore, useSceneIds } from '@/stores/document/use';
import { useSetUserCursor } from '@/stores/user';
import SelectStyle from '@/styles/Select.module.css';

import { formatSceneNumber } from '../takes/TakeNameFormat';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function MoveToSceneButton({
  documentId,
  sceneId,
  blockId,
  shotId,
}) {
  const sceneIds = useSceneIds(documentId);
  const setUserCursor = useSetUserCursor();
  const moveShotToScene = useDocumentStore((ctx) => ctx.moveShotToScene);
  /**
   * @param {import('@/stores/document/DocumentStore').SceneId} value
   */
  function onSceneChange(value) {
    moveShotToScene(documentId, blockId, shotId, value);
    setUserCursor(documentId, value, '', '');
  }
  return (
    <SelectProvider value={sceneId} setValue={onSceneChange}>
      <Select className="ml-2 flex flex-row rounded p-2 text-gray-400 outline hover:text-black">
        <MoveItemIcon className="ml-auto h-6 w-6 fill-current" />
        <span className="mr-auto">Move to scene</span>
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
      <span className="mr-1">{formatSceneNumber(sceneNumber, false)}</span>
      <span className="uppercase">{sceneHeading || 'SCENE'}</span>
    </SelectItem>
  );
}
