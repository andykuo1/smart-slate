import { useCallback } from 'react';

import { listAppDataFiles, readFile } from '../ListFiles';
import { deleteFile } from '../ListFiles';
import { uploadFile, uploadFileByFileId } from '../UploadFile';
import { useGAPITokenHandler } from '../UseGoogleAPI';
import CRUD from './CRUD';
import { createConfiguration } from './Sync';

const CONFIG_FILE_NAME = '__config.json';

export function useGetToken() {
  const handleToken = useGAPITokenHandler();

  const getToken = useCallback(
    /**
     * @returns {Promise<import('@react-oauth/google').TokenResponse|null>}
     */
    function getToken() {
      return new Promise((resolve, reject) => {
        let result = handleToken((token) => {
          if (token) {
            resolve(token);
          } else {
            resolve(null);
          }
        });
        if (!result) {
          resolve(null);
        }
      });
    },
    [handleToken],
  );

  return getToken;
}

export function useGetGoogleDriveConfiguration() {
  const getToken = useGetToken();

  const getGoogleDriveConfiguration = useCallback(
    async function _getGoogleDriveConfiguration() {
      const token = await getToken();
      if (!token) {
        throw new Error('Missing token.');
      }
      const files = await listAppDataFiles();
      let result;
      let target = files.find((file) => file.name === CONFIG_FILE_NAME);
      if (!target) {
        result = createConfiguration();
        const fileId = await uploadFile(
          token.access_token,
          CONFIG_FILE_NAME,
          'application/json',
          JSON.stringify(result),
          { parentFolderIds: ['appDataFolder'] },
        );
        result.fileId = fileId;
        target = {
          id: fileId,
          name: CONFIG_FILE_NAME,
        };
      } else if (target.id) {
        result = /** @type {import('./Sync').Configuration} */ (
          JSON.parse(await readFile(target.id))
        );
        // Assumes the response is a configuration.
        result.fileId = target.id;
      } else {
        // Could not get the file id for the config file... try again later?
        throw new Error('Cannot find file handle for config.');
      }
      return result;
    },
    [getToken],
  );

  return getGoogleDriveConfiguration;
}

export function useUpdateGoogleDriveConfiguration() {
  const getToken = useGetToken();

  const updateGoogleDriveConfiguration = useCallback(
    /**
     * @param {import('./Sync').Configuration} config
     */
    async function _updateGoogleDriveConfiguration(config) {
      const token = await getToken();
      if (!token) {
        return;
      }
      if (!config.fileId) {
        return;
      }
      await uploadFileByFileId(
        token.access_token,
        config.fileId,
        CONFIG_FILE_NAME,
        'application/json',
        JSON.stringify(config),
      );
    },
    [getToken],
  );
  return updateGoogleDriveConfiguration;
}

/**
 * @template T
 * @extends CRUD<T>
 */
export class GoogleDriveCRUD extends CRUD {
  /**
   * @param {import('@react-oauth/google').TokenResponse} token
   */
  constructor(token) {
    super();
    this.token = token;
  }

  /**
   * @override
   * @param {string} key
   * @param {string} name
   * @param {T} data
   * @returns {Promise<string>}
   */
  async create(key, name, data) {
    return await uploadFile(
      this.token.access_token,
      name,
      'application/json',
      JSON.stringify(data),
      { parentFolderIds: ['appDataFolder'] },
    );
  }

  /**
   * @override
   * @param {string} key
   * @returns {Promise<T>}
   */
  async read(key) {
    return /** @type {T} */ (JSON.parse(await readFile(key)));
  }

  /**
   * @override
   * @param {string} key
   * @param {string} name
   * @param {T} data
   */
  async update(key, name, data) {
    const fileId = await uploadFileByFileId(
      this.token.access_token,
      key,
      name,
      'application/json',
      JSON.stringify(data),
    );
    if (fileId !== key) {
      // Uh oh. File handle doesn't match? What does that mean?
      throw new Error(
        'Mismatched file handles - response:' + fileId + '; local:' + key,
      );
    }
  }

  /**
   * @override
   * @param {string} key
   */
  async delete(key) {
    await deleteFile(key);
  }

  /**
   * @override
   */
  async list() {
    return await listAppDataFiles();
  }
}
