import { useState } from 'react';

import NavBarLayout from '@/app/NavBarLayout';
import TakeScanner from '@/app/TakeScanner';

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
      <NavBarLayout>
        <fieldset className="flex-1 flex flex-col items-center">
          <TakeScanner
            className="w-[80vw] m-2 p-2 border-2 border-black rounded bg-gray-300 disabled:opacity-30"
            onChange={onChange}
          />
          <pre className="flex-1 w-[80vw] overflow-x-auto">
            <code>{state}</code>
          </pre>
        </fieldset>
      </NavBarLayout>
    </PageLayout>
  );
}
