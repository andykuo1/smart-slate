import MadeWithLove from '@/components/welcome/MadeWithLove';
import ProfilePopover from '@/components/welcome/ProfilePopover';
import WelcomePanel from '@/components/welcome/WelcomePanel';

import PageLayout from './PageLayout';

export default function RootPage() {
  return (
    <PageLayout>
      <WelcomePanel />
      <MadeWithLove />
      <ProfilePopover />
    </PageLayout>
  );
}
