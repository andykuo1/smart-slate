import Drawer from '@/drawer/Drawer';
import NavBar from '@/navbar/NavBar';

import PageLayout from './PageLayout';

export default function PreviewPage() {
  return (
    <PageLayout className="bg-white text-black">
      <NavBar>
        <Drawer darkMode={false}>UNDER CONSTRUCTION</Drawer>
      </NavBar>
    </PageLayout>
  );
}
