import { useState } from 'react';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';
import ShotListIcon from '@material-symbols/svg-400/rounded/receipt_long.svg';

import ChangelogButton from '@/buttons/ChangelogButton';
import ClapperButton from '@/buttons/ClapperButton';
import FancyButton from '@/buttons/FancyButton';
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
  const [view, setView] = useState('');

  return (
    <PageLayout className="items-center bg-white text-black dark:bg-slate-900 dark:text-white">
      <AppTitle className="mt-auto" />
      <div className="mx-auto flex flex-row gap-2 text-center">
        <div className="absolute right-2 top-2 bg-white dark:bg-slate-900">
          <GoogleConnectButton />
        </div>
        {view === '' && (
          <>
            <FancyButton
              title="Prepare Shot List?"
              label={
                <span className="hidden sm:block">Prepare Shot List?</span>
              }
              onClick={() => setView('shotlist')}>
              <ShotListIcon className="inline-block w-6 fill-current" />
            </FancyButton>
            <ClapperButton />
            <ScannerButton />
          </>
        )}
        {view === 'shotlist' && (
          <>
            <FancyButton
              title="Back"
              label={<span className="hidden sm:block">Back</span>}
              onClick={() => setView('')}>
              <BackIcon className="inline-block w-6 fill-current" />
            </FancyButton>
            <ProjectNewButton />
            <ImportProjectButton />
          </>
        )}
        <ChangelogButton />
        <NewReleasePrompt />
      </div>
      {view === 'shotlist' ? (
        <ProjectSelector className="mb-auto mt-2" />
      ) : (
        <div className="mb-auto mt-20" />
      )}
      {/* <DarkModeToggle className="absolute left-2 top-2" /> */}
      <MadeWithLove />
      {/* <ProfilePopover /> */}
    </PageLayout>
  );
}
