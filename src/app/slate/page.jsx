import Clapper from '../../components/Clapper';
import { Navigation } from '../../components/Navigation';

export default function Page() {
  return (
    <>
    <Navigation title={"Slate"}/>
    <main className="flex flex-col w-screen h-screen">
      <Clapper/>
    </main>
    </>
  );
}
