import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import MoreVertIcon from '@material-symbols/svg-400/rounded/more_vert.svg';

import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import PopoverStyle from '@/styles/Popover.module.css';

import SettingsSceneShotsDetailButton from '../scenes/settings/SettingsSceneShotsDetailButton';

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
        'flex gap-2 items-center px-2 rounded italic bg-white' + ' ' + className
      }>
      <span className="flex-1" />
      <SettingsSceneShotsDetailButton
        documentId={documentId}
        sceneId={sceneId}
      />
      <PopoverProvider>
        <PopoverDisclosure className="italic flex gap-1">
          {'Shot List ' + sceneNumber}
          <MoreVertIcon className="inline-block w-6 h-6 fill-current" />
        </PopoverDisclosure>
        <Popover className={PopoverStyle.popover} modal={true}>
          <PopoverArrow className={PopoverStyle.arrow} />
          <p>{'Hello <3 this is still under construction.'}</p>
        </Popover>
      </PopoverProvider>
      <span className="flex-1" />
    </div>
  );
}
