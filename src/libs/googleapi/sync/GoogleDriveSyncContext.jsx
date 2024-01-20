import { createContext } from 'react';

export const GoogleDriveSyncContext = createContext(
  /** @type {ReturnType<import('./GoogleDriveSync').useGoogleDriveSyncImpl>|null} */ (
    null
  ),
);
