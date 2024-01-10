import { useEffect } from 'react';

import ViewerBooth from '@/viewer/ViewerBooth';

export default function CameraPage() {
  useEffect(() => {
    document.body.style.background = 'black';
    return () => {
      document.body.style.removeProperty('background');
    };
  }, []);
  return (
    <main className="w-full h-full flex flex-col items-center bg-black">
      <ViewerBooth />
    </main>
  );
}
