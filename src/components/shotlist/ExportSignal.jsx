import { useCallback, useState } from 'react';

import { useInterval } from '@/lib/UseInterval';
import { useGAPITokenHandler } from '@/lib/googleapi';

export default function ExportSignal() {
  const [dest, setDest] = useState('local');
  const tokenHandler = useGAPITokenHandler();
  const onInterval = useCallback(() => {
    if (!tokenHandler(() => setDest('drive'))) {
      setDest('local');
    }
  }, [tokenHandler]);
  useInterval(onInterval, 3_000);
  return (
    <p className="bg-white text-black rounded-full text-center px-4 self-center text-xs">
      Save to {dest}
    </p>
  );
}
