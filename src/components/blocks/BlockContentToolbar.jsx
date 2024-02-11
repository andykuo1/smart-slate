import AddBoxIcon from '@material-symbols/svg-400/rounded/add_box.svg';
import EditDocumentIcon from '@material-symbols/svg-400/rounded/edit_note.svg';

import FieldButton from '@/fields/FieldButton';
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
    <div className="absolute right-0 top-0 z-10 flex flex-col rounded p-1 group-hover:bg-white group-hover:bg-opacity-60">
      <FieldButton
        className="p-0 opacity-0 group-hover:opacity-100"
        Icon={EditDocumentIcon}
        onClick={onEditClick}
      />
      <FieldButton
        className="p-0 opacity-0 group-hover:opacity-100"
        Icon={AddBoxIcon}
        onClick={onClick}
      />
    </div>
  );
}
