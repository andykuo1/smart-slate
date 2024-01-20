import { useEffect } from 'react';

import Clapperboard from '@/clapper/Clapperboard';
import RecorderBooth from '@/recorder/RecorderBooth';
import { useUserStore } from '@/stores/user';

import PageLayout from './PageLayout';

export default function RecordPage() {
  const recordMode = useUserStore((ctx) => ctx.recordMode);
  const isRecorderMode = recordMode === 'recorder';
  useEffect(() => {
    document.body.style.background = 'black';
    return () => {
      document.body.style.removeProperty('background');
    };
  }, []);
  return (
    <PageLayout>
      {isRecorderMode ? <RecorderBooth /> : <Clapperboard />}
    </PageLayout>
  );
}
