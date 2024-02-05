import ClapperBoardV2 from '@/clapper/ClapperBoardV2';
import Drawer from '@/drawer/Drawer';
import RecorderBooth from '@/recorder/RecorderBooth';
import { useUserStore } from '@/stores/user';

import PageLayout from './PageLayout';

export default function RecordPage() {
  const recordMode = useUserStore((ctx) => ctx.recordMode);
  const isRecorderMode = recordMode === 'recorder';
  return (
    <PageLayout className="overflow-hidden overscroll-none bg-black text-white">
      <Drawer darkMode={true}>
        {isRecorderMode ? <RecorderBooth /> : <ClapperBoardV2 />}
      </Drawer>
    </PageLayout>
  );
}
