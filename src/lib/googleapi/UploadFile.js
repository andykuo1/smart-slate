import { getGoogleAPI } from './GoogleAPI';

export const GAPI_DRIVE_FILE_SCOPE =
  'https://www.googleapis.com/auth/drive.file';
export const GAPI_DRIVE_FILES_URI =
  'https://www.googleapis.com/upload/drive/v3/files';

/**
 * Requires gapi scope `https://www.googleapis.com/auth/drive.file`.
 *
 * @deprecated
 * @see https://developers.google.com/drive/api/reference/rest/v3/files/create
 * @param {string} accessToken
 * @param {string} fileName
 */
export async function uploadEmptyFileInAppData(accessToken, fileName) {
  const mimeType = 'application/json';
  /** @type {gapi.client.drive.File} */
  const metadata = {
    name: fileName,
    mimeType,
    parents: ['appDataFolder'],
  };
  const response = await getGoogleAPI().client.drive.files.create({
    uploadType: 'multipart',
    resource: metadata,
    fields: 'id',
    access_token: accessToken,
  });
  return response.result.id || '';
}

/**
 * Requires gapi scope `https://www.googleapis.com/auth/drive.file`.
 *
 * @deprecated
 * @see https://developers.google.com/drive/api/reference/rest/v3/files/create
 * @param {string} accessToken
 * @param {string} fileName
 * @param {object} [opts]
 * @param {Array<string>} [opts.parentFolderIds]
 */
export async function uploadEmptyFile(accessToken, fileName, opts = {}) {
  const { parentFolderIds = [] } = opts;
  const mimeType = 'application/json';
  /** @type {gapi.client.drive.File} */
  const metadata = {
    name: fileName,
    mimeType,
    parents: parentFolderIds,
  };
  const response = await getGoogleAPI().client.drive.files.create({
    uploadType: 'multipart',
    resource: metadata,
    fields: 'id',
    access_token: accessToken,
  });
  return response.result.id || '';
}

/**
 * Requires gapi scope `https://www.googleapis.com/auth/drive.file`.
 *
 * @deprecated
 * @see https://developers.google.com/drive/api/reference/rest/v3/files/create
 * @param {string} accessToken
 * @param {string} fileName
 * @param {string} [textData]
 * @param {object} [opts]
 * @param {Array<string>} [opts.parentFolderIds]
 */
export async function uploadTextFile(
  accessToken,
  fileName,
  textData = '',
  opts = {},
) {
  const { parentFolderIds = [] } = opts;
  const textMimeType = 'text/plain';
  /** @type {gapi.client.drive.File} */
  const metadata = {
    name: fileName,
    mimeType: textMimeType,
    parents: parentFolderIds,
  };
  const boundary = 'EAGLE_SMART_SLATE_REQUEST';
  const body = buildMultiPartRequestBody(
    metadata,
    textMimeType,
    textData,
    boundary,
  );
  const request = getGoogleAPI().client.request({
    path: GAPI_DRIVE_FILES_URI,
    method: 'POST',
    params: {
      uploadType: 'multipart',
      // For the response
      fields: 'id',
      // For security
      access_token: accessToken,
    },
    headers: {
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });
  const response = await request.then();
  return response.result.id || '';
}

/**
 * @see https://dev.to/arnabsen1729/using-google-drive-api-v3-to-upload-a-file-to-drive-using-react-4loi
 * @param {gapi.client.drive.File} metadata
 * @param {string} dataMimeType
 * @param {string} dataString
 * @param {string} boundary
 */
function buildMultiPartRequestBody(
  metadata,
  dataMimeType,
  dataString,
  boundary,
) {
  const crlf = '\r\n';
  const delimiter = `${crlf}--${boundary}${crlf}`;
  const endDelimiter = `${crlf}--${boundary}--`;
  const metadataContentType = 'application/json; charset=UTF-8';
  const metadataHeaders = [`Content-Type: ${metadataContentType}`];
  const metadataBody = `${delimiter}${metadataHeaders.join(
    ' ',
  )}${crlf}${crlf}${JSON.stringify(metadata)}`;
  const dataHeaders = [`Content-Type: ${dataMimeType}`];
  const dataBody = `${delimiter}${dataHeaders.join(
    ' ',
  )}${crlf}${crlf}${dataString}${crlf}`;
  return `${metadataBody}${dataBody}${endDelimiter}`;
}

/**
 * Requires gapi scope `https://www.googleapis.com/auth/drive.file`.
 *
 * @see https://developers.google.com/drive/api/reference/rest/v3/files/create
 * @param {string} accessToken
 * @param {string} fileName
 * @param {string} mimeType
 * @param {string|Blob} data
 * @param {object} [opts]
 * @param {Array<string>} [opts.parentFolderIds]
 */
export async function uploadFile(
  accessToken,
  fileName,
  mimeType,
  data,
  opts = {},
) {
  const { parentFolderIds = [] } = opts;
  /** @type {gapi.client.drive.File} */
  const metadata = {
    name: fileName,
    mimeType,
    parents: parentFolderIds,
  };

  let url = new URL(GAPI_DRIVE_FILES_URI);
  let params = new URLSearchParams({
    uploadType: 'multipart',
    // For the response
    fields: 'id',
    // For security
    access_token: accessToken,
  });
  url.search = params.toString();

  let body = new FormData();
  let metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: 'application/json; charset=UTF-8',
  });
  body.append('metadata', metadataBlob);
  body.append('data', data);

  const response = await fetch(url, {
    method: 'POST',
    body,
  });
  const result = await response.json();
  return result.id || '';
}
