'use client';

import { ShotListProvider } from '@/components/ShotListContext';

import { Navigation } from '../../components/Navigation';
import { ShotTakeProvider } from '../../components/ShotContext';
import ShotList from '../../components/ShotList';

export default function Page() {
  return (
    <ShotTakeProvider>
      <ShotListProvider>
        <Navigation title="Shot List" />
        <main className="flex flex-col w-screen h-screen">
          <ShotList />
        </main>
      </ShotListProvider>
    </ShotTakeProvider>
  );
}
