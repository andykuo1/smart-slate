import { getGoogleAPI } from './GoogleAPI';

export const GAPI_FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

/**
 * Requires gapi scope `https://www.googleapis.com/auth/drive.file`.
 *
 * @see https://developers.google.com/drive/api/guides/folder
 * @param {string} accessToken
 * @param {string} folderName
 * @param {object} [opts]
 * @param {Array<string>} [opts.parentFolderIds]
 */
export async function createFolder(accessToken, folderName, opts = {}) {
  const { parentFolderIds = [] } = opts;
  /** @type {gapi.client.drive.File} */
  const metadata = {
    name: folderName,
    mimeType: GAPI_FOLDER_MIME_TYPE,
    parents: parentFolderIds,
  };
  const response = await getGoogleAPI().client.drive.files.create({
    resource: metadata,
    fields: 'id',
    access_token: accessToken,
  });
  return response.result.id || '';
}
