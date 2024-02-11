import AddBoxIcon from '@material-symbols/svg-400/rounded/add_box.svg';

import { createShot } from '@/stores/document/DocumentStore';
import { useDocumentStore } from '@/stores/document/use';

import ShotNumber from './ShotNumber';
import ShotThumbnailTypeSelector from './ShotThumbnailTypeSelector';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} props.collapsed
 */
export default function ShotEntryNew({
  documentId,
  sceneId,
  blockId,
  collapsed,
}) {
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let newShot = createShot();
    addShot(documentId, sceneId, blockId, newShot);
  }

  return (
    <li className={'relative mx-auto flex flex-col items-center'}>
      <div className={'z-10 flex h-[6rem] w-full flex-row items-center'}>
        {!collapsed && <ShotNumber documentId="" sceneId="" shotId="" />}
        <button
          className="group h-full translate-x-1 py-2.5 text-gray-400 hover:text-white"
          title="New shot"
          onClick={onClick}>
          <AddBoxIcon className="h-full w-6 fill-current group-hover:bg-black" />
        </button>
        <div className="relative ml-2">
          <label className="absolute -left-1 -top-2 z-10 rounded bg-white px-1 font-mono text-gray-400">
            *
          </label>
          <ShotThumbnailTypeSelector
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
          />
        </div>
        <div className="flex flex-1 flex-row items-center">
          {<div className="h-6 w-6" />}
          {!collapsed && (
            <div className="hidden flex-1 text-xs opacity-30 sm:block">
              {'<- Tap + to create a shot'}
            </div>
          )}
        </div>
        {!collapsed && <ShotNumber documentId="" sceneId="" shotId="" />}
      </div>
    </li>
  );
}
