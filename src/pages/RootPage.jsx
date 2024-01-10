import MadeWithLove from '@/components/welcome/MadeWithLove';
import ProfilePopover from '@/components/welcome/ProfilePopover';
import WelcomePanel from '@/components/welcome/WelcomePanel';

export default function RootPage() {
  return (
    <main className="w-full h-full flex flex-col items-center bg-white">
      <WelcomePanel />
      <MadeWithLove />
      <ProfilePopover />
    </main>
  );
}
