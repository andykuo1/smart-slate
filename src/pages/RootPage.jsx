import ChangelogButton from '@/buttons/ChangelogButton';
import ImportProjectButton from '@/buttons/ImportProjectButton';
import ProjectNewButton from '@/buttons/ProjectNewButton';
import ScannerButton from '@/buttons/ScannerButton';
import ProjectSelector from '@/components/projects/ProjectSelector';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';
import AppTitle from '@/welcome/AppTitle';
import DarkModeToggle from '@/welcome/DarkModeToggle';
import MadeWithLove from '@/welcome/MadeWithLove';

// import ProfilePopover from '@/welcome/ProfilePopover';
import PageLayout from './PageLayout';

export default function RootPage() {
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
      </div>
      <ProjectSelector className="mb-auto mt-2" />
      <DarkModeToggle className="absolute left-0 top-0" />
      <MadeWithLove />
      {/* <ProfilePopover /> */}
    </PageLayout>
  );
}
