/**
 * @param {MediaRecorderOptions} mediaRecorderOptions
 * @param {MediaStreamConstraints} mediaStreamConstraints
 */
export function tryValidateMediaRecorderFeatures(
  mediaRecorderOptions,
  mediaStreamConstraints,
) {
  if (!window.MediaRecorder) {
    throw new Error(
      'MediaRecorder is not supported. Please update to the latest version of your browser.',
    );
  }
  if (typeof mediaStreamConstraints?.video === 'object') {
    tryValidateMediaRecorderConstraints(mediaStreamConstraints.video);
  }
  if (typeof mediaStreamConstraints?.audio === 'object') {
    tryValidateMediaRecorderConstraints(mediaStreamConstraints.audio);
  }
  if (
    mediaRecorderOptions &&
    mediaRecorderOptions.mimeType &&
    !MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)
  ) {
    throw new Error(
      `MIME type '${mediaRecorderOptions.mimeType}' is not supported by this browser.`,
    );
  }
}

/**
 * @param {Partial<MediaTrackConstraints>} constraints
 */
function tryValidateMediaRecorderConstraints(constraints) {
  const supportedConstraints =
    navigator.mediaDevices?.getSupportedConstraints();
  if (!supportedConstraints) {
    throw new Error('No supported constraints for navigator.mediaDevices');
  }
  let unsupported = [];
  for (let key of Object.keys(constraints)) {
    let value =
      supportedConstraints[
        /** @type {keyof MediaTrackSupportedConstraints} */ (key)
      ];
    if (!value) {
      unsupported.push(key);
    }
  }
  if (unsupported.length > 0) {
    throw new Error(
      `Requested constraints not supported for navigator.mediaDevices - ${unsupported.join(
        ', ',
      )}.`,
    );
  }
}

/**
 * @param {Array<string>} possibleTypes
 */
export function getMediaRecorderSupportedMimeType(possibleTypes) {
  if (
    typeof window === 'undefined' ||
    typeof window.MediaRecorder === 'undefined'
  ) {
    return '';
  }

  for (let type of possibleTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return '';
}

/**
 * @param {string} mimeType
 */
export function getVideoFileExtensionByMIMEType(mimeType) {
  switch (mimeType) {
    case 'video/mp4':
      return '.mp4';
    case 'video/quicktime':
      return '.mov';
    case 'video/webm':
      return '.webm';
    case 'video/ogg':
      return '.ogg';
    default:
      return '';
  }
}

export function isInputCaptureSupported() {
  return (
    typeof document !== 'undefined' &&
    typeof document.createElement('input').capture !== 'undefined'
  );
}

/**
 * @param {MediaRecorderOptions} mediaRecorderOptions
 * @param {MediaStreamConstraints} mediaStreamConstraints
 */
export function isMediaRecorderSupported(
  mediaRecorderOptions,
  mediaStreamConstraints,
) {
  try {
    tryValidateMediaRecorderFeatures(
      mediaRecorderOptions,
      mediaStreamConstraints,
    );
  } catch {
    return false;
  }
  return true;
}
