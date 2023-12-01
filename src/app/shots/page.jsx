'use client';

import ShotList from '../../components/ShotList';
import { Navigation } from '../../components/Navigation';
import { ShotTakeProvider } from '../../components/ShotContext';

export default function Page() {
  return (
    <ShotTakeProvider>
      <Navigation title="Shot List"/>
      <main className="flex flex-col w-screen h-screen">
          <ShotList/>
      </main>
    </ShotTakeProvider>
  );
}
