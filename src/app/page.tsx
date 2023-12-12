'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import Workspace from '@/components/workspace/Workspace';

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="relative w-screen h-screen text-black bg-white overflow-hidden">
        <Workspace />
      </main>
    </ErrorBoundary>
  );
}
