import { useGoogleDriveSyncImpl } from './GoogleDriveSync';
import { GoogleDriveSyncContext } from './GoogleDriveSyncContext';

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
