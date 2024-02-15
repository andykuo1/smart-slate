import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
  usePopoverContext,
} from '@ariakit/react';

import EditBlockIcon from '@material-symbols/svg-400/rounded/edit_note.svg';
import AddShotListIcon from '@material-symbols/svg-400/rounded/format_list_bulleted_add.svg';
import MenuIcon from '@material-symbols/svg-400/rounded/more_vert.svg';

import FieldButton from '@/fields/FieldButton';
import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';
import PopoverStyle from '@/styles/Popover.module.css';

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
  return (
    <div className="absolute bottom-0 right-0 top-0 flex items-center">
      <PopoverProvider>
        <PopoverDisclosure>
          <MenuIcon
            className={
              'invisible h-full w-10 rounded-full bg-gradient-to-r from-transparent to-50% fill-current group-hover:visible group-hover:to-gray-100 dark:group-hover:to-gray-800'
            }
          />
        </PopoverDisclosure>
        <Popover className={PopoverStyle.popover} modal={false}>
          <PopoverArrow className={PopoverStyle.arrow} />
          <MenuContent
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
            setEditable={setEditable}
          />
        </Popover>
      </PopoverProvider>
    </div>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('react').Dispatch<import('react').SetStateAction<Boolean>>} props.setEditable
 */
function MenuContent({ documentId, sceneId, blockId, setEditable }) {
  const store = usePopoverContext();
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onNewClick() {
    let shot = createShot();
    addShot(documentId, sceneId, blockId, shot);
    store?.hide();
  }

  function onEditClick() {
    setEditable((prev) => !prev);
    store?.hide();
  }

  return (
    <>
      <FieldButton title="Edit text" Icon={EditBlockIcon} onClick={onEditClick}>
        Edit text
      </FieldButton>
      <FieldButton
        title="New shotlist"
        Icon={AddShotListIcon}
        onClick={onNewClick}>
        New shotlist
      </FieldButton>
    </>
  );
}
