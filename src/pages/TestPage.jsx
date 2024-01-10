import { useState } from 'react';

import TestScreenplay from '@/tests/TestScreenplay';
import TestSnapshot from '@/tests/TestSnapshot';

import TestVideoConstraints from '../tests/TestVideoConstraints';

const TEST_VERSION = 'v16';
// @ts-expect-error This is a custom env variable defined in vite config.
const TEST_CONFIGTIME = new Date(__CONFIGTIME__ || 0).toLocaleString();

export default function TestPage() {
  const [test, setTest] = useState('');
  return (
    <main className="w-full h-full flex flex-col items-center py-20">
      <div className="fixed top-0 left-0 z-50 flex flex-row rounded-ee-full bg-gray-200 overflow-hidden">
        <p className="bg-green-300 rounded-full px-2 m-1">
          {TEST_VERSION} @ {TEST_CONFIGTIME}
        </p>
        <select
          className="bg-transparent outline-none mr-4"
          value={test}
          onChange={(e) => setTest(e.target.value)}>
          <option value="">No Test</option>
          <option value="screenplay">Screenplay Test</option>
          <option value="snapshot">Snapshot Test</option>
          <option value="videoconstraints">Video Constraints Test</option>
        </select>
      </div>
      {test === 'screenplay' && <TestScreenplay />}
      {test === 'snapshot' && <TestSnapshot />}
      {test === 'videoconstraints' && <TestVideoConstraints />}
    </main>
  );
}
