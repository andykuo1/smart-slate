import { Tab, TabList, TabProvider } from '@ariakit/react';
import { useEffect, useState } from 'react';

import LinkIcon from '@material-symbols/svg-400/rounded/link.svg';
import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import { isInputCaptureSupported } from '@/recorder/MediaRecorderSupport';
import TabStyle from '@/styles/Tab.module.css';

import ShotThumbnailCameraTab from './options/ShotThumbnailCameraTab';
import ShotThumbnailEmbedTabPanel from './options/ShotThumbnailEmbedTabPanel';
import ShotThumbnailUploadTabPanel from './options/ShotThumbnailUploadTabPanel';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export default function ShotThumbnailOptions({
  className,
  documentId,
  shotId,
}) {
  const [isCameraEnabled, setCameraEnabled] = useState(false);

  useEffect(() => {
    setCameraEnabled(isInputCaptureSupported());
  }, []);

  return (
    <div className={'flex flex-col gap-4' + ' ' + className}>
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
          <ShotThumbnailCameraTab
            documentId={documentId}
            shotId={shotId}
            disabled={!isCameraEnabled}
          />
        </TabList>
        <ShotThumbnailUploadTabPanel documentId={documentId} shotId={shotId} />
        <ShotThumbnailEmbedTabPanel documentId={documentId} shotId={shotId} />
      </TabProvider>
    </div>
  );
}
