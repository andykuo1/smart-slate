import { Menu, MenuButton, MenuProvider } from '@ariakit/react';

import MoreVertIcon from '@material-symbols/svg-400/rounded/more_vert.svg';

import { useVideoSnapshot } from '@/recorder/snapshot/UseVideoSnapshot';
import MenuStyle from '@/styles/Menu.module.css';

import TakeCacheMenuItem from './options/TakeCacheMenuItem';
import TakeExportMenuItem from './options/TakeExportMenuItem';
import TakeRatingMenuItem from './options/TakeRatingMenuItem';
import TakeReassignMenuItem from './options/TakeReassignMenuItem';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.showButton]
 * @param {boolean} [props.disabled]
 */
export default function TakeOptions({
  documentId,
  sceneId,
  shotId,
  takeId,
  className,
  children,
  showButton = true,
  disabled = false,
}) {
  const [_, click] = useVideoSnapshot(documentId, takeId);
  return (
    <MenuProvider>
      <MenuButton
        className={'relative flex flex-row items-center' + ' ' + className}
        onClick={click}
        disabled={disabled}>
        {children}
        {showButton && <MoreVertIcon className="w-6 h-6" />}
      </MenuButton>
      <Menu className={MenuStyle.menu}>
        <TakeRatingMenuItem documentId={documentId} takeId={takeId} />
        <TakeCacheMenuItem documentId={documentId} takeId={takeId} />
        <TakeExportMenuItem
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          takeId={takeId}
        />
        <TakeReassignMenuItem
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          takeId={takeId}
        />
      </Menu>
    </MenuProvider>
  );
}
