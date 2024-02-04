import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
} from '@ariakit/react';

import { useSceneShotNumber } from '@/serdes/UseResolveSceneShotNumber';
import PopoverStyle from '@/styles/Popover.module.css';

import SettingsShotTakesImportButton from '../shots/settings/SettingsShotTakesImportButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function TakeListButton({
  className,
  documentId,
  sceneId,
  blockId,
  shotId,
}) {
  const sceneShotNumber = useSceneShotNumber(documentId, sceneId, shotId);
  return (
    <PopoverProvider>
      <PopoverDisclosure
        className={
          'mx-auto px-2 bg-white rounded text-xl shadow-xl' + ' ' + className
        }>
        <span className="opacity-30">Take List {sceneShotNumber}</span>
      </PopoverDisclosure>
      <Popover className={PopoverStyle.popover} modal={true}>
        <PopoverArrow className={PopoverStyle.arrow} />
        <p className="flex flex-col gap-2">
          <SettingsShotTakesImportButton
            documentId={documentId}
            sceneId={sceneId}
            shotId={shotId}
          />
        </p>
      </Popover>
    </PopoverProvider>
  );
}
