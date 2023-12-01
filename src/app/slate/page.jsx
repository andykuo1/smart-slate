'use client';

import Clapper from '../../components/Clapper';
import { Navigation } from '../../components/Navigation';
import { ShotTakeProvider } from '../../components/ShotContext';

export default function Page() {
  return (
    <ShotTakeProvider>
      <Navigation title={"Slate"}/>
      <main className="flex flex-col w-screen h-screen">
        <Clapper/>
      </main>
    </ShotTakeProvider>
  );
}
