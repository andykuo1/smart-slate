import { useInterval } from '@/libs/UseInterval';

import { useGoogleDriveSync } from './GoogleDriveSync';

export default function AutoGoogleDriveSync() {
  const { syncToGoogleDrive } = useGoogleDriveSync();
  useInterval(() => {
    syncToGoogleDrive();
  }, 10_000);
  return null;
}
