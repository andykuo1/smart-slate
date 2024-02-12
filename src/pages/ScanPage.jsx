import { useState } from 'react';

import QRCodeScannerIcon from '@material-symbols/svg-400/rounded/qr_code_scanner.svg';

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
        <legend className="flex items-center gap-4 py-4">
          <QRCodeScannerIcon className="inline-block h-10 w-10 fill-current" />
          <span className="font-bold">QR Code Take Scanner Tool</span>
        </legend>
        <TakeScanner className="w-80 px-2 py-4" onChange={onChange} />
        <pre className="w-[50vw] flex-1 overflow-auto">
          <code>{state}</code>
        </pre>
      </fieldset>
    </PageLayout>
  );
}
