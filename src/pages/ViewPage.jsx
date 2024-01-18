import { useEffect } from 'react';

import ViewerBooth from '@/app/ViewerBooth';

import PageLayout from './PageLayout';

export default function CameraPage() {
  useEffect(() => {
    document.body.style.background = 'black';
    return () => {
      document.body.style.removeProperty('background');
    };
  }, []);
  return (
    <PageLayout>
      <ViewerBooth />
    </PageLayout>
  );
}
