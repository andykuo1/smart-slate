import ClapperBoardV2 from '@/clapper/ClapperBoardV2';
import Drawer from '@/drawer/Drawer';
import RecorderBooth from '@/recorder/RecorderBooth';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';

import PageLayout from './PageLayout';

export default function RecordPage() {
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
