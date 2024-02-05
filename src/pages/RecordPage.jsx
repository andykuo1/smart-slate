import Clapperboard from '@/clapper/Clapperboard';
import Drawer from '@/drawer/Drawer';
import RecorderBooth from '@/recorder/RecorderBooth';
import { useUserStore } from '@/stores/user';

import PageLayout from './PageLayout';

export default function RecordPage() {
  const recordMode = useUserStore((ctx) => ctx.recordMode);
  const isRecorderMode = recordMode === 'recorder';
  return (
    <PageLayout className="overflow-hidden overscroll-none bg-black">
      <Drawer darkMode={true}>
        {isRecorderMode ? <RecorderBooth /> : <Clapperboard />}
      </Drawer>
    </PageLayout>
  );
}
