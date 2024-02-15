import { usePopoverContext } from '@ariakit/react';
import { useState } from 'react';

import EditBlockIcon from '@material-symbols/svg-400/rounded/edit_note.svg';

import FieldButton from '@/fields/FieldButton';
import { useBlockShotCount } from '@/stores/document/use';
import { useUserStore } from '@/stores/user';

import AddShotTray from '../shots/AddShotTray';
import BlockContent from './BlockContent';
import BlockEntryLayout from './BlockEntryLayout';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 * @param {'faded'|'split'|'fullwidth'|'solowidth'|'childonly'} [props.mode]
 * @param {import('react').ReactNode} props.children
 */
export default function BlockEntry({
  className,
  documentId,
  sceneId,
  blockId,
  editable = true,
  mode = 'fullwidth',
  children,
}) {
  const [blockEditable, setBlockEditable] = useState(false);
  const blockShotCount = useBlockShotCount(documentId, blockId);
  const sequenceMode = useUserStore((ctx) => ctx.editMode === 'sequence');
  const textOnlyMode = useUserStore((ctx) => ctx.editMode === 'textonly');
  const hasAnyShots = blockShotCount > 0;
  const showShotTray = !textOnlyMode && (!hasAnyShots || sequenceMode);
  if (mode === 'faded' && !hasAnyShots) {
    return null;
  }

  return (
    <BlockEntryLayout
      documentId={documentId}
      sceneId={sceneId}
      className={className}
      mode={mode}
      content={
        mode !== 'childonly' && (
          <div
            className={
              'group flex h-full w-full' +
              ' ' +
              (blockEditable
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800')
            }>
            <BlockContent
              className={
                'mx-4 flex-1 pb-4' +
                ' ' +
                (blockEditable ? 'min-h-[20vh]' : '') +
                ' ' +
                (showShotTray &&
                  'transition-[padding-bottom] group-hover:pb-11')
              }
              documentId={documentId}
              blockId={blockId}
              editable={editable && blockEditable}
              setEditable={setBlockEditable}
            />
            <div
              className={
                'invisible absolute bottom-0 mb-1 flex w-full items-center gap-2 px-2' +
                ' ' +
                (!blockEditable && 'hover:visible group-hover:visible')
              }>
              <div className="flex flex-1 items-center gap-2">
                <div
                  className={
                    'flex-1 border-t-2 border-gray-300' +
                    ' ' +
                    (showShotTray ? 'group-hover:visible' : 'invisible')
                  }
                />
              </div>
              <AddShotTray
                className={
                  'flex' +
                  ' ' +
                  (showShotTray ? 'group-hover:visible' : 'invisible')
                }
                documentId={documentId}
                sceneId={sceneId}
                blockId={blockId}
              />
              <div className="flex flex-1 items-center gap-2">
                <div
                  className={
                    'flex-1 border-t-2 border-gray-300' +
                    ' ' +
                    (showShotTray ? 'group-hover:visible' : 'invisible')
                  }
                />
                <EditTextBlock
                  className="bg-gray-300"
                  setEditable={setBlockEditable}
                />
              </div>
            </div>
          </div>
        )
      }>
      {mode !== 'solowidth' && children}
    </BlockEntryLayout>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').Dispatch<import('react').SetStateAction<Boolean>>} props.setEditable
 */
function EditTextBlock({ className, setEditable }) {
  const store = usePopoverContext();
  function onEditClick() {
    setEditable((prev) => !prev);
    store?.hide();
  }
  return (
    <FieldButton
      className={'w-auto rounded-full' + ' ' + className}
      title="Edit text"
      Icon={EditBlockIcon}
      onClick={onEditClick}
    />
  );
}
