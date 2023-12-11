'use client';

import VideoBooth from '@/components/recorder/VideoBooth';
import Workspace from '@/components/workspace/Workspace';

export default function Home() {
  return (
    <main className="flex flex-col w-screen h-screen text-black bg-white overflow-hidden">
      <Workspace />
    </main>
  );
}
