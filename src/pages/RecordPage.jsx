import { useEffect } from 'react';

import Clapperboard from '@/app/Clapperboard';
import RecorderBooth from '@/recorder/RecorderBooth';
import { useUserStore } from '@/stores/user';

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
    <main className="w-full h-full flex flex-col items-center bg-black">
      {isRecorderMode ? <RecorderBooth /> : <Clapperboard />}
    </main>
  );
}
