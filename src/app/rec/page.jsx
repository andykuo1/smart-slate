import { Navigation } from '../../components/Navigation';
import Recorder from '../../components/Recorder';

export default function Page() {
  return (
    <>
    <Navigation title="Recorder"/>
    <main className="flex flex-col w-screen h-screen">
      <Recorder/>
    </main>
    </>
  );
}
