import { useState } from 'react';

import TakeScanner from '@/scanner/TakeScanner';

import PageLayout from './PageLayout';

export default function ScanPage() {
  const [state, setState] = useState('');
  /**
   * @param {{ target: { value: object } } } e
   */
  function onChange(e) {
    setState(JSON.stringify(e.target.value, null, 4));
  }
  return (
    <PageLayout className="bg-white text-black">
      <fieldset className="mx-auto flex h-full flex-1 flex-col sm:flex-row">
        <TakeScanner className="w-80 p-4" onChange={onChange} />
        <pre className="w-[50vw] flex-1 overflow-auto">
          <code>{state}</code>
        </pre>
      </fieldset>
    </PageLayout>
  );
}
