import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import PopoverStyle from '@/styles/Popover.module.css';

import SettingsSceneShotsDetailButton from '../scenes/settings/SettingsSceneShotsDetailButton';
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
    <PopoverProvider>
      <PopoverDisclosure
        className={
          'mx-auto px-2 rounded text-xl italic bg-white opacity-30' +
          ' ' +
          className
        }>
        {'Shot List ' + sceneNumber}
      </PopoverDisclosure>
      <Popover className={PopoverStyle.popover} modal={true}>
        <PopoverArrow className={PopoverStyle.arrow} />
        <p className="flex flex-col gap-2">
          <SettingsSceneShotsRenumberButton
            documentId={documentId}
            sceneId={sceneId}
          />
          <SettingsSceneShotsDetailButton
            documentId={documentId}
            sceneId={sceneId}
          />
        </p>
      </Popover>
    </PopoverProvider>
  );
}
