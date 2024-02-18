import { useCallback } from 'react';

import { useInterval } from '@/libs/UseInterval';

import { useGoogleStatus } from '../auth/UseGoogleStatus';
import { useGoogleDriveSync } from './GoogleDriveSync';

export function useGoogleDriveAutoSync() {
  const googleStatus = useGoogleStatus();
  const { syncStatus, syncToGoogleDrive } = useGoogleDriveSync();
  const disabled = !googleStatus || syncStatus === 'syncing';
  const onInterval = useCallback(
    function _onInterval() {
      if (disabled) {
        return;
      }
      syncToGoogleDrive();
    },
    [disabled, syncToGoogleDrive],
  );
  useInterval(onInterval, 5_000);
}
