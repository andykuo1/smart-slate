import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import ListAltIcon from '@material-symbols/svg-400/rounded/list_alt.svg';

import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import PopoverStyle from '@/styles/Popover.module.css';

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
        'mx-4 my-2 flex items-center gap-2 rounded-xl bg-gray-100 px-2 italic opacity-60' +
        ' ' +
        className
      }>
      <span className="flex-1" />
      <PopoverProvider>
        <PopoverDisclosure className="flex gap-1 italic">
          <ListAltIcon className="inline-block h-6 w-6 fill-current" />
          {'Shot List ' + sceneNumber}
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
