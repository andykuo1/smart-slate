import { useState } from 'react';

import TestCRUDSync from '@/tests/TestCRUDSync';
import TestLexicalMarkdown from '@/tests/TestLexicalMarkdown';
import TestScreenplay from '@/tests/TestScreenplay';
import TestSnapshot from '@/tests/TestSnapshot';
import TestTranscode from '@/tests/TestTranscode';
import TestVideoConstraints from '@/tests/TestVideoConstraints';

const TEST_VERSION = 'v16';
// @ts-expect-error This is a custom env variable defined in vite config.
const TEST_CONFIGTIME = new Date(__CONFIGTIME__ || 0).toLocaleString(); // eslint-disable-line no-undef
const TEST_STORAGE_KEY = '__TEST_PAGE_TARGET__';

export default function TestPage() {
  const [test, setTest] = useState(
    sessionStorage.getItem(TEST_STORAGE_KEY) || '',
  );
  return (
    <main className="w-full h-full flex flex-col items-center py-20 bg-white text-black">
      <div className="fixed top-0 left-0 z-50 flex flex-row rounded-ee-full bg-gray-200 overflow-hidden">
        <p className="bg-green-300 rounded-full px-2 m-1">
          {TEST_VERSION} @ {TEST_CONFIGTIME}
        </p>
        <select
          className="bg-transparent outline-none mr-4"
          value={test}
          onChange={(e) => {
            const value = e.target.value;
            setTest(value);
            sessionStorage.setItem(TEST_STORAGE_KEY, value);
          }}>
          <option value="">No Test</option>
          <option value="screenplay">Screenplay Test</option>
          <option value="snapshot">Snapshot Test</option>
          <option value="videoconstraints">Video Constraints Test</option>
          <option value="lexicalmarkdown">Lexical Markdown Test</option>
          <option value="crudsync">CRUD Sync Test</option>
          <option value="transcode">FFMPEG Transcode Test</option>
        </select>
      </div>
      {test === 'screenplay' && <TestScreenplay />}
      {test === 'snapshot' && <TestSnapshot />}
      {test === 'videoconstraints' && <TestVideoConstraints />}
      {test === 'lexicalmarkdown' && <TestLexicalMarkdown />}
      {test === 'crudsync' && <TestCRUDSync />}
      {test === 'transcode' && <TestTranscode />}
    </main>
  );
}
