import ChangelogButton from '@/buttons/ChangelogButton';
import ImportProjectButton from '@/buttons/ImportProjectButton';
import ProjectNewButton from '@/buttons/ProjectNewButton';
import ScannerButton from '@/buttons/ScannerButton';
import ProjectSelector from '@/components/projects/ProjectSelector';
import GoogleConnectButton from '@/libs/googleapi/auth/GoogleConnectButton';

import AppTitle from './AppTitle';

export default function WelcomePanel() {
  return (
    <>
      <AppTitle />
      <div className="flex flex-row text-center mx-auto">
        <div className="absolute top-2 right-2">
          <GoogleConnectButton />
        </div>
        <ProjectNewButton />
        <ImportProjectButton />
        <ChangelogButton />
        <ScannerButton />
      </div>
      <ProjectSelector className="mx-auto mb-auto" />
    </>
  );
}
