import { Menu, MenuButton, MenuProvider } from '@ariakit/react';
import { useRef } from 'react';

import MoreVertIcon from '@material-symbols/svg-400/rounded/more_vert.svg';

import { useVideoSnapshot } from '@/recorder/snapshot/UseVideoSnapshot';
import MenuStyle from '@/styles/Menu.module.css';

import TakeCacheMenuItem from './options/TakeCacheMenuItem';
import TakeExportMenuItem from './options/TakeExportMenuItem';
import TakeRatingMenuItem from './options/TakeRatingMenuItem';
import TakeReassignMenuItem from './options/TakeReassignMenuItem';
import TakeViewMenuItem from './options/TakeViewMenuItem';

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
  const videoRef = useRef(null);
  const [_, click] = useVideoSnapshot(videoRef, documentId, takeId);
  return (
    <MenuProvider>
      <MenuButton
        className={'relative flex flex-row items-center' + ' ' + className}
        onClick={click}
        disabled={disabled}>
        {children}
        {showButton && <MoreVertIcon className="h-6 w-6" />}
      </MenuButton>
      <Menu className={MenuStyle.menu}>
        <TakeRatingMenuItem
          documentId={documentId}
          shotId={shotId}
          takeId={takeId}
        />
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
        <TakeViewMenuItem
          documentId={documentId}
          sceneId={sceneId}
          shotId={shotId}
          takeId={takeId}
        />
        <video
          className="hidden"
          ref={videoRef}
          preload="metadata"
          muted={true}
          playsInline={true}
        />
      </Menu>
    </MenuProvider>
  );
}
