import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useSettingsStore } from '@/stores/settings';

import { RecorderContext } from './RecorderContext';
import { useRecorderContextValue } from './RecorderContextValue';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function RecorderContextProvider({ children }) {
  const value = useRecorderContextValue();
  const { isPrepared, onStop } = value;
  const preferPersistedMediaStream = useSettingsStore(
    (ctx) => ctx.user.preferPersistedMediaStream,
  );
  const location = useLocation();

  useEffect(() => {
    if (isPrepared && !location.pathname.endsWith('/rec')) {
      onStop({ exit: !preferPersistedMediaStream });
    }
  }, [location, isPrepared, onStop, preferPersistedMediaStream]);

  return (
    <RecorderContext.Provider value={value}>
      {children}
    </RecorderContext.Provider>
  );
}
