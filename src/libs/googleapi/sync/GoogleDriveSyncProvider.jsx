import { useInterval } from '@/libs/UseInterval';
import { useGoogleDriveSync } from '@/libs/googleapi/sync/GoogleDriveSync';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function GoogleDriveSyncProvider({ children }) {
  const syncToGoogleDrive = useGoogleDriveSync();
  // TODO: Would be nice to see sync on page load
  //  and also keep the cloud status actually updated.
  useInterval(syncToGoogleDrive, 10_000);
  return <>{children}</>;
}
