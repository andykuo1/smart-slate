import { useCallback } from 'react';

import { useInterval } from '@/libs/UseInterval';
import { useSettingsStore } from '@/stores/settings';
import { MEDIA_BLOB_OPTIONS } from '@/values/RecorderValues';

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

  const onInterval = useCallback(
    function _onInterval() {
      // Always stop it if it's not in /rec page.
      if (isPrepared && !window?.location?.pathname?.endsWith?.('/rec')) {
        onStop({
          exit: !preferPersistedMediaStream,
          mediaBlobOptions: MEDIA_BLOB_OPTIONS,
        });
      }
    },
    [isPrepared, preferPersistedMediaStream, onStop],
  );
  useInterval(onInterval, 1_000);

  return (
    <RecorderContext.Provider value={value}>
      {children}
    </RecorderContext.Provider>
  );
}
