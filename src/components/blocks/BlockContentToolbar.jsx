import AddBoxIcon from '@material-symbols/svg-400/rounded/add_box.svg';
import EditDocumentIcon from '@material-symbols/svg-400/rounded/edit_note.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('react').Dispatch<import('react').SetStateAction<Boolean>>} props.setEditable
 */
export default function BlockContentToolbar({
  documentId,
  sceneId,
  blockId,
  setEditable,
}) {
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let shot = createShot();
    addShot(documentId, sceneId, blockId, shot);
  }

  function onEditClick() {
    setEditable((prev) => !prev);
  }

  return (
    <div className="absolute top-0 right-0 z-10 p-1 flex flex-col rounded group-hover:bg-opacity-60 group-hover:bg-white">
      <SettingsFieldButton
        className="opacity-0 p-0 group-hover:opacity-100"
        Icon={EditDocumentIcon}
        onClick={onEditClick}
      />
      <SettingsFieldButton
        className="opacity-0 p-0 group-hover:opacity-100"
        Icon={AddBoxIcon}
        onClick={onClick}
      />
    </div>
  );
}
