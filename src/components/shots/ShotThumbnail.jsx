import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
  Tab,
  TabList,
  TabProvider,
} from '@ariakit/react';

import LinkIcon from '@material-symbols/svg-400/rounded/link.svg';
import PhotoCameraIcon from '@material-symbols/svg-400/rounded/photo_camera.svg';
import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import ImageWithCaption from '@/lib/ImageWithCaption';
import { isInputCaptureSupported } from '@/recorder/MediaRecorderSupport';
import {
  useSceneNumber,
  useShotNumber,
  useShotThumbnail,
} from '@/stores/document';
import { shotNumberToChar } from '@/stores/document/DocumentStore';
import PopoverStyle from '@/styles/Popover.module.css';
import TabStyle from '@/styles/Tab.module.css';

import { ShotTypeSelector, getShotTypeIcon } from './ShotTypeSelector';
import { useShotTypeChange } from './UseShotType';
import ShotThumbnailCameraTabPanel from './options/ShotThumbnailCameraTabPanel';
import ShotThumbnailEmbedTabPanel from './options/ShotThumbnailEmbedTabPanel';
import ShotThumbnailUploadTabPanel from './options/ShotThumbnailUploadTabPanel';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {boolean} [props.editable]
 */
export default function ShotThumbnail({
  className,
  documentId,
  sceneId,
  shotId,
  editable = false,
}) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const sceneShotString =
    sceneNumber <= 0 || shotNumber <= 0
      ? '--'
      : `${sceneNumber}${shotNumberToChar(shotNumber)}`;
  const [activeShotType, onShotTypeChange] = useShotTypeChange(
    documentId,
    shotId,
  );

  return (
    <div className={'relative flex items-center' + ' ' + className}>
      <PopoverProvider>
        <ShotThumbnailImage
          className={'flex-1 bg-gray-300'}
          documentId={documentId}
          shotId={shotId}
          alt={sceneShotString}
          Icon={getShotTypeIcon(activeShotType)}
        />
        <PopoverDisclosure
          className="absolute left-0 top-0 bottom-0 right-0"
          disabled={!editable}
        />
        <Popover className={PopoverStyle.popover} modal={true}>
          <PopoverArrow className={PopoverStyle.arrow} />
          <div className="flex flex-row gap-4">
            <ShotTypeSelector
              className="flex-1 flex flex-col items-center"
              activeShotType={activeShotType}
              onChange={onShotTypeChange}
            />
            <div className="flex flex-col gap-4">
              <TabProvider>
                <TabList
                  className={TabStyle.tabList + ' ' + 'flex flex-row'}
                  aria-label="Where to get thumbnail images?">
                  <Tab className={TabStyle.tab + ' ' + 'flex-1'}>
                    <UploadIcon className="w-6 h-6 fill-current" />
                  </Tab>
                  <Tab className={TabStyle.tab + ' ' + 'flex-1'}>
                    <LinkIcon className="w-6 h-6 fill-current" />
                  </Tab>
                  <Tab
                    className={TabStyle.tab + ' ' + 'flex-1'}
                    disabled={!isInputCaptureSupported()}>
                    <PhotoCameraIcon className="w-6 h-6 fill-current" />
                  </Tab>
                </TabList>
                <ShotThumbnailUploadTabPanel
                  documentId={documentId}
                  shotId={shotId}
                />
                <ShotThumbnailEmbedTabPanel
                  documentId={documentId}
                  shotId={shotId}
                />
                <ShotThumbnailCameraTabPanel
                  documentId={documentId}
                  shotId={shotId}
                />
              </TabProvider>
            </div>
          </div>
        </Popover>
      </PopoverProvider>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.alt
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('react').FC<any>} [props.Icon]
 */
function ShotThumbnailImage({ className, alt, documentId, shotId, Icon }) {
  const thumbnail = useShotThumbnail(documentId, shotId);
  return (
    <ImageWithCaption
      src={thumbnail}
      alt={alt}
      className={'max-w-sm w-[128px] h-[72px]' + ' ' + className}
      usage="add"
      Icon={Icon}
    />
  );
}
