import MadeWithLove from '@/components/workspace/MadeWithLove';
import WelcomePanel from '@/components/workspace/WelcomePanel';
import AutoInstallPopover from '@/progressive/AutoInstallPopover';

export default function RootPage() {
  return (
    <main className="w-full h-full flex flex-col items-center">
      <WelcomePanel />
      <MadeWithLove />
      <AutoInstallPopover />
    </main>
  );
}
