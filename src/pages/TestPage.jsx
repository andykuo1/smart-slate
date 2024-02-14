import { useState } from 'react';

import TestCRUDSync from '@/tests/TestCRUDSync';
import TestFFmpegTranscode from '@/tests/TestFFmpegTranscode';
import TestLexicalMarkdown from '@/tests/TestLexicalMarkdown';
import TestPDFViewer from '@/tests/TestPDFViewer';
import TestScreenplay from '@/tests/TestScreenplay';
import TestSnapshot from '@/tests/TestSnapshot';
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
    <main className="flex h-full w-full flex-col items-center overflow-y-auto bg-white py-20 text-black">
      <div className="fixed left-0 top-0 z-50 flex flex-row overflow-hidden rounded-ee-full bg-gray-200">
        <p className="m-1 rounded-full bg-green-300 px-2">
          {TEST_VERSION} @ {TEST_CONFIGTIME}
        </p>
        <select
          className="mr-4 bg-transparent outline-none"
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
          <option value="ffmpegtranscode">FFMPEG Transcode Test</option>
          <option value="pdfviewer">PDF Viewer Test</option>
        </select>
      </div>
      {test === 'screenplay' && <TestScreenplay />}
      {test === 'snapshot' && <TestSnapshot />}
      {test === 'videoconstraints' && <TestVideoConstraints />}
      {test === 'lexicalmarkdown' && <TestLexicalMarkdown />}
      {test === 'crudsync' && <TestCRUDSync />}
      {test === 'ffmpegtranscode' && <TestFFmpegTranscode />}
      {test === 'pdfviewer' && <TestPDFViewer />}
    </main>
  );
}
