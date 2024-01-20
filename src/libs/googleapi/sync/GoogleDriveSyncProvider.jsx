import {
  GoogleDriveSyncContext,
  useGoogleDriveSyncImpl,
} from './GoogleDriveSync';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function GoogleDriveSyncProvider({ children }) {
  const value = useGoogleDriveSyncImpl();
  return (
    <GoogleDriveSyncContext.Provider value={value}>
      {children}
    </GoogleDriveSyncContext.Provider>
  );
}
