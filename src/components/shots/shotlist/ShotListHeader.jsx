import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import SettingsSceneShotsDetailButton from '@/components/scenes/settings/SettingsSceneShotsDetailButton';
import SettingsSceneShotsRenumberButton from '@/components/scenes/settings/SettingsSceneShotsRenumberButton';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import PopoverStyle from '@/styles/Popover.module.css';

import ShotListAddButton from './ShotListAddButton';
import ShotListAddWithReferenceButton from './ShotListAddWithReferenceButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotListHeader({
  className,
  documentId,
  sceneId,
  blockId,
}) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  return (
    <div
      className={
        'mx-4 my-2 flex items-center gap-2 rounded-xl bg-gray-100 px-2 italic dark:bg-gray-800' +
        ' ' +
        className
      }>
      <span className="flex-1" />
      <PopoverProvider>
        <PopoverDisclosure className="flex gap-1 italic">
          {'Shot List ' + sceneNumber}
        </PopoverDisclosure>
        <Popover className={PopoverStyle.popover} modal={true}>
          <PopoverArrow className={PopoverStyle.arrow} />
          <p>{'Hello <3 this is still under construction.'}</p>
        </Popover>
      </PopoverProvider>
      <span className="flex-1" />
      <div className="h-8 w-8 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="WS"
          title="New wide shot"
        />
      </div>
      <div className="h-8 w-8 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="MS"
          title="New medium shot"
        />
      </div>
      <div className="h-8 w-8 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
        <ShotListAddButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          shotType="CU"
          title="New close-up shot"
        />
      </div>
      <div className="h-8 w-8 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
        <ShotListAddWithReferenceButton
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          title="New shot with reference"
        />
      </div>
      <div className="h-6 border-l-2" />
      <SettingsSceneShotsRenumberButton
        className=""
        documentId={documentId}
        sceneId={sceneId}
      />
      <SettingsSceneShotsDetailButton className="" />
    </div>
  );
}
