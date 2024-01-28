import { useRef } from 'react';

import AddIcon from '@material-symbols/svg-400/rounded/add.svg';

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
  const containerRef = useRef(/** @type {HTMLLIElement|null} */ (null));
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let newShot = createShot();
    addShot(documentId, sceneId, blockId, newShot);
  }

  return (
    <li
      ref={containerRef}
      className={'relative flex flex-col items-center mx-auto'}>
      <div
        className={
          'flex flex-row items-center w-full h-[6rem] z-10 border-b border-gray-300 shadow'
        }>
        {!collapsed && <ShotNumber documentId="" sceneId="" shotId="" />}
        <button
          className="group h-full translate-x-1 py-2.5 hover:text-white"
          title="New shot"
          onClick={onClick}>
          <AddIcon className="w-6 h-full fill-current group-hover:bg-black" />
        </button>
        <div className="relative ml-2">
          <label className="absolute -top-2 -left-1 z-10 px-1 bg-white text-black font-mono rounded">
            *
          </label>
          <ShotThumbnailTypeSelector
            documentId={documentId}
            sceneId={sceneId}
            blockId={blockId}
          />
        </div>
        <div className="flex-1 flex flex-row items-center">
          <div className="flex-1 flex flex-row">
            {collapsed && <div className="w-6 h-6" />}
          </div>
          {!collapsed && (
            <div className="flex-1 opacity-30 text-xs hidden sm:block">
              {'<- Tap + to create a shot'}
            </div>
          )}
        </div>
        {!collapsed && <ShotNumber documentId="" sceneId="" shotId="" />}
      </div>
    </li>
  );
}
