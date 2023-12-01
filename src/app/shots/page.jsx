import ShotList from '../../components/ShotList';
import { Navigation } from '../../components/Navigation';

export default function Page() {
  return (
    <>
    <Navigation title="Shot List"/>
    <main className="flex flex-col w-screen h-screen">
      <ShotList/>
    </main>
    </>
  );
}
