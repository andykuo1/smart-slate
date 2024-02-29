import ClapperBoardV2 from '@/clapperV2/ClapperBoardV2';
import Drawer from '@/drawer/Drawer';
import { useGoogleDriveAutoSync } from '@/libs/googleapi/sync/UseGoogleDriveAutoSync';
import RecorderBooth from '@/recorder/RecorderBooth';
import { useSettingsStore } from '@/stores/settings';
import { useCurrentDocumentId, useUserStore } from '@/stores/user';

import PageLayout from './PageLayout';

export default function RecordPage() {
  // This is within the project context, so get the current document id...
  useCurrentDocumentId();
  // ...and auto-sync on interval.
  useGoogleDriveAutoSync();

  const recordMode = useUserStore((ctx) => ctx.recordMode);
  const isRecorderMode = recordMode === 'recorder';
  const preferDarkSlate = useSettingsStore((ctx) => ctx.user.preferDarkSlate);
  return (
    <PageLayout
      className={
        'overflow-hidden overscroll-none' +
        ' ' +
        (isRecorderMode || preferDarkSlate
          ? 'bg-black text-white'
          : 'bg-white text-black')
      }>
      <Drawer darkMode={true}>
        {isRecorderMode ? <RecorderBooth /> : <ClapperBoardV2 />}
      </Drawer>
    </PageLayout>
  );
}
