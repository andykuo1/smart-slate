import ViewerBooth from '@/app/ViewerBooth';
import Drawer from '@/drawer/Drawer';
import { useUserStore } from '@/stores/user';

import PDFBooth from './PDFBooth';
import PageLayout from './PageLayout';

export default function CameraPage() {
  const viewerMode = useUserStore((ctx) => ctx.viewer.mode);
  return (
    <PageLayout className="bg-black text-white">
      <Drawer>{viewerMode === 'video' ? <ViewerBooth /> : <PDFBooth />}</Drawer>
    </PageLayout>
  );
}
