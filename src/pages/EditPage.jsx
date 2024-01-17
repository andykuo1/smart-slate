import { useState } from 'react';

import DrawerLayout from '@/app/DrawerLayout';
import NavBarLayout from '@/app/NavBarLayout';
import TakeScanner from '@/app/TakeScanner';
import DocumentEntry from '@/components/documents/DocumentEntry';
import { useCurrentDocumentId } from '@/stores/user';

export default function EditPage() {
  const documentId = useCurrentDocumentId();
  return (
    <main className="w-full h-full flex flex-col bg-white">
      <NavBarLayout>
        <DrawerLayout
          content={() => (
            <>
              <div className="m-2 p-2 border-l-4 border-gray-400 bg-gray-300 font-bold font-serif">
                <p>
                  <i>Something strange in the neighborhood...</i>
                </p>
                <p className="text-right">
                  <i>Who are you going to call?</i>
                </p>
                <p className="text-center mt-2">GHOSTBUSTERS!</p>
              </div>
              <DrawerContent />
            </>
          )}>
          <DocumentEntry documentId={documentId} />
        </DrawerLayout>
      </NavBarLayout>
    </main>
  );
}

function DrawerContent() {
  const [state, setState] = useState('');
  /**
   * @param {{ target: { value: object } } } e
   */
  function onChange(e) {
    setState(JSON.stringify(e.target.value, null, 4));
  }
  return (
    <div className="flex flex-col pb-20">
      <TakeScanner
        className="m-2 p-2 border-2 border-black rounded bg-gray-300"
        onChange={onChange}
      />
      <pre className="overflow-x-auto">
        <code>{state}</code>
      </pre>
    </div>
  );
}
