/**
 * @typedef {ReturnType<createConfiguration>} Configuration
 * @typedef {ReturnType<createSyncFile>} SyncFile
 */
import CRUD from './CRUD';

export function createConfiguration() {
  return {
    /** @type {string|undefined} */
    fileId: undefined,
    /** @type {Array<SyncFile>} */
    files: [],
  };
}

/**
 * @param {string} key
 */
export function createSyncFile(key) {
  return {
    key,
    /** @type {string|undefined} */
    fileId: undefined,
    lastUpdatedMillis: 0,
    lastDeletedMillis: 0,
  };
}

/**
 * NOTE: Only supports json files.
 *
 * @template T
 * @param {CRUD<T>} localCRUD
 * @param {CRUD<T>} remoteCRUD
 * @param {() => Promise<Configuration>} getLocalConfiguration
 * @param {() => Promise<Configuration>} getRemoteConfiguration
 * @param {(config: Configuration, changed: Array<SyncFile>) => Promise<void>} applyRemoteConfiguration
 */
export async function sync(
  localCRUD,
  remoteCRUD,
  getLocalConfiguration,
  getRemoteConfiguration,
  applyRemoteConfiguration,
) {
  console.debug(
    '[GoogleDriveSync] Connection established. Trying to sync to Google Drive...',
  );

  const localConfig = await getLocalConfiguration();
  const remoteConfig = await getRemoteConfiguration();
  const nextConfig = createConfiguration();
  nextConfig.fileId = remoteConfig.fileId;
  const passivelyNextFiles = [];
  const activelyNextFiles = [];

  console.debug(
    '[GoogleDriveSync] Found configs: ',
    '\nlocal:',
    localConfig,
    '\nremote:',
    remoteConfig,
  );

  const { imports, exports, updates } = diff(localConfig, remoteConfig);

  if (
    Object.keys(updates).length <= 0 &&
    imports.length <= 0 &&
    exports.length <= 0
  ) {
    // Nothing to update :)
    console.log('[GoogleDriveSync] No changes found.');
    return;
  } else {
    console.log(
      '[GoogleDriveSync] Found files: ',
      '\nfor updates:',
      Object.keys(updates).join('\n') || '--',
      '\nfor imports:',
      imports.map((i) => i.key).join('\n') || '--',
      '\nfor exports:',
      exports.map((i) => i.key).join('\n') || '--',
    );
  }

  // Let's update existing files first.
  for (let [local, remote] of Object.values(updates)) {
    if (local.lastDeletedMillis > remote.lastDeletedMillis) {
      // Deleted locally. Let's delete it on remote.
      if (!remote.fileId) {
        // No remote file? Omit it from the next configuration.
        continue;
      }
      try {
        await remoteCRUD.delete(remote.fileId);
        let nextFile = createSyncFile(remote.key);
        nextFile.fileId = undefined;
        nextFile.lastUpdatedMillis = local.lastUpdatedMillis;
        nextFile.lastDeletedMillis = local.lastDeletedMillis;
        activelyNextFiles.push(nextFile);
      } catch (e) {
        // Could not delete it, so leave it.
        const { name, message } = /** @type {Error} */ (e);
        console.error(
          '[GoogleDriveSync] Failed to delete remote file - ' +
            JSON.stringify(remote),
          name,
          message,
        );
        // ...and keep the configuration.
        passivelyNextFiles.push(remote);
      }
      continue;
    } else if (local.lastDeletedMillis < remote.lastDeletedMillis) {
      // Deleted remotely. Let's delete it on local.
      try {
        await localCRUD.delete(local.key);
        let nextFile = createSyncFile(local.key);
        nextFile.fileId = remote.fileId;
        nextFile.lastUpdatedMillis = remote.lastUpdatedMillis;
        nextFile.lastDeletedMillis = remote.lastDeletedMillis;
        activelyNextFiles.push(nextFile);
      } catch (e) {
        // Could not delete it, so leave it.
        const { name, message } = /** @type {Error} */ (e);
        console.error(
          '[GoogleDriveSync] Failed to delete local file - ' +
            JSON.stringify(remote),
          name,
          message,
        );
        // ...and keep the configuration.
        passivelyNextFiles.push(remote);
      }
      continue;
    }

    if (local.lastUpdatedMillis > remote.lastUpdatedMillis) {
      // Updated locally. Let's update it on remote.
      if (!remote.fileId) {
        // No remote file? Something is terribly wrong.
        // ...but keep the configuration.
        passivelyNextFiles.push(remote);
        continue;
      }
      try {
        const data = await localCRUD.read(local.key);
        await remoteCRUD.update(
          remote.fileId,
          'projectdata_' + local.key + '.json',
          data,
        );
        let nextFile = createSyncFile(local.key);
        nextFile.fileId = remote.fileId;
        nextFile.lastUpdatedMillis = local.lastUpdatedMillis;
        nextFile.lastDeletedMillis = local.lastDeletedMillis;
        activelyNextFiles.push(nextFile);
      } catch (e) {
        // Could not update it, so leave it.
        const { name, message } = /** @type {Error} */ (e);
        console.error(
          '[GoogleDriveSync] Failed to update remote file - ' +
            JSON.stringify(remote),
          name,
          message,
        );
        // ...and keep the configuration.
        passivelyNextFiles.push(remote);
      }
      continue;
    } else if (local.lastUpdatedMillis < remote.lastUpdatedMillis) {
      // Updated remotely. Let's update it on local.
      if (!remote.fileId) {
        // No remote file? Something is terribly wrong.
        // ...but keep the configuration.
        passivelyNextFiles.push(remote);
        continue;
      }
      try {
        const data = await remoteCRUD.read(remote.fileId);
        await localCRUD.update(remote.key, remote.fileId, data);
        let nextFile = createSyncFile(remote.key);
        nextFile.fileId = remote.fileId;
        nextFile.lastUpdatedMillis = remote.lastUpdatedMillis;
        nextFile.lastDeletedMillis = remote.lastDeletedMillis;
        activelyNextFiles.push(nextFile);
      } catch (e) {
        // Could not update it, so leave it.
        const { name, message } = /** @type {Error} */ (e);
        console.error(
          '[GoogleDriveSync] Failed to update local file - ' +
            JSON.stringify(remote),
          name,
          message,
        );
        // ...and keep the configuration.
        passivelyNextFiles.push(remote);
      }
      continue;
    } else {
      // It's already updated! So do nothing!
      // ...but keep the configuration.
      passivelyNextFiles.push(remote);
    }
  }

  // ...and then import.
  for (let file of imports) {
    if (file.lastDeletedMillis > 0) {
      // Actually a deleted file. Don't import it.
      console.debug(
        '[GoogleDriveSync] Skipping deleted remote file - ' +
          JSON.stringify(file),
      );
      continue;
    }
    let fileId = file.fileId;
    if (!fileId) {
      console.error(
        '[GoogleDriveSync] Cannot import file without file handle - ' +
          JSON.stringify(file),
      );
      continue;
    }
    try {
      const data = await remoteCRUD.read(fileId);
      const key = await localCRUD.create(file.key, fileId, data);
      let nextFile = createSyncFile(key);
      nextFile.fileId = fileId;
      nextFile.lastUpdatedMillis = file.lastUpdatedMillis;
      nextFile.lastDeletedMillis = file.lastDeletedMillis;
      activelyNextFiles.push(nextFile);
    } catch (e) {
      const { name, message } = /** @type {Error} */ (e);
      console.error(
        '[GoogleDriveSync] Failed to import file - ' +
          JSON.stringify(file) +
          ' - ',
        name,
        message,
      );
      continue;
    }
  }

  // ...and then export.
  for (let file of exports) {
    if (file.lastDeletedMillis > 0) {
      // Actually a deleted file. Don't export it.
      console.debug(
        '[GoogleDriveSync] Skipping deleted local file - ' +
          JSON.stringify(file),
      );
      continue;
    }
    try {
      const data = await localCRUD.read(file.key);
      const fileId = await remoteCRUD.create(
        file.key,
        'projectdata_' + file.key + '.json',
        data,
      );
      if (!fileId) {
        // This means we uploaded the file, but lost the file id.
        // ...welp. I guess that means we should retry the export.
        // and throw away all this work.
        continue;
      }
      let nextFile = createSyncFile(file.key);
      nextFile.fileId = fileId;
      nextFile.lastUpdatedMillis = file.lastUpdatedMillis;
      nextFile.lastDeletedMillis = file.lastDeletedMillis;
      activelyNextFiles.push(nextFile);
    } catch (e) {
      const { name, message } = /** @type {Error} */ (e);
      console.error(
        '[GoogleDriveSync] Failed to export file - ' +
          JSON.stringify(file) +
          ' - ',
        name,
        message,
      );
      continue;
    }
  }

  //...and then re-upload the new config.
  if (activelyNextFiles.length > 0) {
    nextConfig.files.push(...passivelyNextFiles, ...activelyNextFiles);
    console.log(
      '[GoogleDriveSync] Applying new config (with ' +
        passivelyNextFiles.length +
        ' passives, ' +
        activelyNextFiles.length +
        ' actives): ',
      nextConfig,
    );
    await applyRemoteConfiguration(nextConfig, activelyNextFiles);
    return nextConfig;
  } else {
    console.log('[GoogleDriveSync] No active file changes. Skipping!');
    return null;
  }
}

/**
 * @param {Configuration} localConfig
 * @param {Configuration} remoteConfig
 */
export function diff(localConfig, remoteConfig) {
  /** @type {Array<SyncFile>} */
  let imports = [];
  /** @type {Array<SyncFile>} */
  let exports = [];
  /** @type {Record<string, [SyncFile, SyncFile]>} */
  let updates = {};

  // Import any files not local.
  for (let remote of remoteConfig.files) {
    if (remote.key in updates) {
      continue;
    }
    let local = localConfig.files.find((file) => file.key === remote.key);
    if (!local) {
      // ...is not local, let's try to import it.
      imports.push(remote);
    } else {
      // ...is on both, so let's try to update it.
      updates[remote.key] = [local, remote];
    }
  }
  // Export any files not remote.
  for (let local of localConfig.files) {
    if (local.key in updates) {
      continue;
    }
    let remote = remoteConfig.files.find((file) => file.key === local.key);
    if (!remote) {
      // ...is not remote, let's try to export it.
      exports.push(local);
    } else {
      // ...is on both, so let's try to update it.
      updates[local.key] = [local, remote];
    }
  }
  return {
    imports,
    exports,
    updates,
  };
}
