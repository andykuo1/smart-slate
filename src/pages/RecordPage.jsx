import { useEffect } from 'react';

import Clapperboard from '@/clapper/Clapperboard';
import DocumentDrawer from '@/outline/DocumentDrawer';
import RecorderBooth from '@/recorder/RecorderBooth';
import { useCurrentDocumentId, useUserStore } from '@/stores/user';

import PageLayout from './PageLayout';

export default function RecordPage() {
  const documentId = useCurrentDocumentId();
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
      <DocumentDrawer darkMode={true} documentId={documentId}>
        {isRecorderMode ? <RecorderBooth /> : <Clapperboard />}
      </DocumentDrawer>
    </PageLayout>
  );
}
