import ViewerBooth from '@/app/ViewerBooth';

import PageLayout from './PageLayout';

export default function CameraPage() {
  return (
    <PageLayout className="bg-black text-white">
      <ViewerBooth />
    </PageLayout>
  );
}
