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
    <PageLayout>
      <fieldset className="flex-1 flex flex-col sm:flex-row mx-auto">
        <TakeScanner className="p-4 w-80" onChange={onChange} />
        <pre className="flex-1 overflow-x-auto w-[80vw]">
          <code>{state}</code>
        </pre>
      </fieldset>
    </PageLayout>
  );
}
