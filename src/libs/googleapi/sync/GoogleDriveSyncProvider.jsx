import {
  GoogleDriveSyncContext,
  useGoogleDriveSyncImpl,
} from './GoogleDriveSync';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function GoogleDriveSyncProvider({ children }) {
  const syncGoogleDrive = useGoogleDriveSyncImpl();
  return (
    <GoogleDriveSyncContext.Provider value={syncGoogleDrive}>
      {children}
    </GoogleDriveSyncContext.Provider>
  );
}
