import ChangelogButton from '@/buttons/ChangelogButton';
import ImportProjectButton from '@/buttons/ImportProjectButton';
import ProjectNewButton from '@/buttons/ProjectNewButton';
import ScannerButton from '@/buttons/ScannerButton';
import ProjectSelector from '@/components/projects/ProjectSelector';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';
import AppTitle from '@/welcome/AppTitle';
import MadeWithLove from '@/welcome/MadeWithLove';
import ProfilePopover from '@/welcome/ProfilePopover';

import PageLayout from './PageLayout';

export default function RootPage() {
  return (
    <PageLayout className="items-center">
      <AppTitle className="mt-auto" />
      <div className="flex flex-row text-center mx-auto">
        <div className="absolute top-2 right-2 bg-white">
          <GoogleConnectButton />
        </div>
        <ProjectNewButton />
        <ImportProjectButton />
        <ChangelogButton />
        <ScannerButton />
      </div>
      <ProjectSelector className="mt-2 mb-auto" />
      <MadeWithLove />
      <ProfilePopover />
    </PageLayout>
  );
}
