import { useGoogleDriveSync } from './GoogleDriveSync';

export function useGoogleDriveSyncStatus() {
  const { syncStatus } = useGoogleDriveSync();
  return syncStatus;
}
