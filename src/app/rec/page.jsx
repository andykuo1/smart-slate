'use client';

import { Navigation } from '../../components/Navigation';
import Recorder from '../../components/Recorder';
import { ShotTakeProvider } from '../../components/ShotContext';

export default function Page() {
  return (
    <ShotTakeProvider>
      <Navigation title="Recorder"/>
      <main className="flex flex-col w-screen h-screen">
          <Recorder/>
      </main>
    </ShotTakeProvider>
  );
}
