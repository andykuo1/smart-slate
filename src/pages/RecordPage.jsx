import { useEffect } from 'react';

import RecorderBooth from '@/recorder/RecorderBooth';

export default function RecordPage() {
  useEffect(() => {
    document.body.style.background = 'black';
    return () => {
      document.body.style.removeProperty('background');
    };
  }, []);
  return (
    <main className="w-full h-full flex flex-col items-center bg-black">
      <RecorderBooth />
    </main>
  );
}
