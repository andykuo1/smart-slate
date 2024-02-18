import ChangelogButton from '@/buttons/ChangelogButton';
import ImportProjectButton from '@/buttons/ImportProjectButton';
import NewReleasePrompt from '@/buttons/NewReleasePrompt';
import ProjectNewButton from '@/buttons/ProjectNewButton';
import ScannerButton from '@/buttons/ScannerButton';
import ProjectSelector from '@/components/projects/ProjectSelector';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';
import { useGoogleDriveAutoSync } from '@/libs/googleapi/sync/UseGoogleDriveAutoSync';
import AppTitle from '@/welcome/AppTitle';
// import DarkModeToggle from '@/welcome/DarkModeToggle';
import MadeWithLove from '@/welcome/MadeWithLove';

// import ProfilePopover from '@/welcome/ProfilePopover';
import PageLayout from './PageLayout';

export default function RootPage() {
  // ...auto-sync on interval for new projects.
  useGoogleDriveAutoSync();

  return (
    <PageLayout className="items-center bg-white text-black dark:bg-slate-900 dark:text-white">
      <AppTitle className="mt-auto" />
      <div className="mx-auto flex flex-row text-center">
        <div className="absolute right-2 top-2 bg-white dark:bg-slate-900">
          <GoogleConnectButton />
        </div>
        <ProjectNewButton />
        <ImportProjectButton />
        <ChangelogButton />
        <ScannerButton />
        <NewReleasePrompt />
      </div>
      <ProjectSelector className="mb-auto mt-2" />
      {/* <DarkModeToggle className="absolute left-2 top-2" /> */}
      <MadeWithLove />
      {/* <ProfilePopover /> */}
    </PageLayout>
  );
}
