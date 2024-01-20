export const GAPI_DRIVE_APPDATA_SCOPE =
  'https://www.googleapis.com/auth/drive.appdata';

export async function listAppDataFiles() {
  let response = await gapi.client.drive.files.list({
    spaces: 'appDataFolder',
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  let files = response.result.files;
  if (!files || files.length <= 0) {
    return [];
  }
  let result = [];
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    result.push({
      id: file.id,
      name: file.name,
    });
  }
  return result;
}

/**
 * @param {string} fileId
 */
export async function readFile(fileId) {
  let response = await gapi.client.drive.files.get({
    fileId,
    alt: 'media',
  });
  return response.body;
}

/**
 * @param {string} fileId
 */
export async function deleteFile(fileId) {
  await gapi.client.drive.files.delete({
    fileId,
  });
}
