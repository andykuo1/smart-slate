import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import PopoverStyle from '@/styles/Popover.module.css';

import SettingsSceneShotsRenumberButton from '../scenes/settings/SettingsSceneShotsRenumberButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotListButton({
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
      <SettingsSceneShotsRenumberButton
        className="m-auto"
        documentId={documentId}
        sceneId={sceneId}
      />
    </div>
  );
}
