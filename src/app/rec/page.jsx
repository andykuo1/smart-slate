'use client';

import { ShotListProvider } from '@/components/ShotListContext';

import { Navigation } from '../../components/Navigation';
import Recorder from '../../components/Recorder';
import { ShotTakeProvider } from '../../components/ShotContext';

export default function Page() {
  return (
    <ShotTakeProvider>
      <ShotListProvider>
        <Navigation title="Recorder" />
        <main className="flex flex-col w-screen h-screen">
          <Recorder />
        </main>
      </ShotListProvider>
    </ShotTakeProvider>
  );
}
