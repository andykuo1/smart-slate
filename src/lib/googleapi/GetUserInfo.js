import { getGoogleAPI } from './GoogleAPI';

export const GAPI_DRIVE_ABOUT_URI =
  'https://www.googleapis.com/upload/drive/v3/about';

/**
 * Requires gapi scope `https://www.googleapis.com/auth/drive.file`.
 *
 * @see https://developers.google.com/drive/api/reference/rest/v3/about/get
 * @param {string} accessToken
 * @param {object} [opts]
 * @param {Array<string>} [opts.parentFolderIds]
 * @returns {Promise<string>}
 */
export async function getUserInfo(accessToken, opts = {}) {
  const result = await getGoogleAPI().client.drive.about.get({
    access_token: accessToken,
    fields: 'user',
  });
  return result;
}
