export class MissingFeatureError extends Error {
  /**
   * @param {string} featureName
   * @param {string} [supportMessage]
   */
  constructor(featureName, supportMessage = 'Please update your browser.') {
    super(`Feature '${featureName}' is not supported. ${supportMessage}`);
  }
}

export class MissingWindowFeatureError extends MissingFeatureError {
  constructor() {
    super('window', 'Please use a client-side browser.');
  }
}

export class NonSecureAccessError extends Error {
  constructor() {
    super(
      'User media access denied for non-secure access. Please redirect using https.',
    );
  }
}

export function tryGetWindow() {
  if (typeof window === 'undefined') {
    throw new MissingWindowFeatureError();
  }
  return window;
}

export function tryGetMediaDevices() {
  const window = tryGetWindow();

  // Must be in a secure context -- localhost is allowed though.
  if (
    document?.location?.hostname !== 'localhost' &&
    document?.location?.protocol !== 'https:'
  ) {
    throw new NonSecureAccessError();
  }

  // Now actually check if it is supported.
  let result = window.navigator?.mediaDevices;
  if (!result) {
    throw new MissingFeatureError('navigator.mediaDevices');
  }
  return result;
}

export function tryGetPermissions() {
  const window = tryGetWindow();
  let result = window.navigator?.permissions;
  if (!result) {
    throw new MissingFeatureError('navigator.permissions');
  }
  return result;
}

export function tryGetSharing() {
  const window = tryGetWindow();
  const canShare = window.navigator?.canShare;
  if (!canShare) {
    throw new MissingFeatureError('navigator.canShare');
  }
  const share = window.navigator?.share;
  if (!share) {
    throw new MissingFeatureError('navigator.share');
  }
  return {
    canShare,
    share,
  };
}

export function tryGetUserAgent() {
  const window = tryGetWindow();
  return (window.navigator?.userAgent || '').toLowerCase();
}

/**
 * @param {MediaDevices} mediaDevices
 * @param {Array<MediaStreamConstraints>} constraints
 */
export async function tryGetUserMedia(mediaDevices, constraints) {
  let result = null;

  // Try all the constraints in order...
  for (let constraint of constraints) {
    try {
      result = await mediaDevices.getUserMedia(constraint);
      break;
    } catch {
      // ...give up and try the next one.
      continue;
    }
  }

  if (!result) {
    // Nothing worked. Let's try the most basic constraint...
    result = await tryGetDefaultUserMedia(mediaDevices);
  }

  return result;
}

/** @type {MediaStreamConstraints} */
const DEFAULT_MEDIA_STREAM_CONSTRAINTS_BOTH = {
  video: true,
  audio: true,
};
/** @type {MediaStreamConstraints} */
const DEFAULT_MEDIA_STREAM_CONSTRAINTS_VIDEO_ONLY = {
  video: true,
  audio: true,
};
/** @type {MediaStreamConstraints} */
const DEFAULT_MEDIA_STREAM_CONSTRAINTS_AUDIO_ONLY = {
  video: false,
  audio: true,
};
/** @type {MediaStreamConstraints} */
const DEFAULT_MEDIA_STREAM_CONSTRAINTS_NONE = {
  video: false,
  audio: false,
};

/**
 * @param {MediaDevices} mediaDevices
 */
async function tryGetDefaultUserMedia(mediaDevices) {
  /** @type {MediaStream|null} */
  let result = await mediaDevices
    .getUserMedia(DEFAULT_MEDIA_STREAM_CONSTRAINTS_BOTH)
    .catch(() => null);

  if (!result) {
    // That didn't work, so let's try each individually (just for compatibility check now)...
    let notPermitted = [];
    const permissions = tryGetPermissions();
    if (permissions) {
      let cameraPermission = await permissions.query({
        // @ts-expect-error This should exist, but type is missing :(
        name: 'camera',
      });
      if (cameraPermission.state === 'denied') {
        notPermitted.push('camera');
      }

      let microphonePermission = await permissions.query({
        // @ts-expect-error This should exist, but type is missing :(
        name: 'microphone',
      });
      if (microphonePermission.state === 'denied') {
        notPermitted.push('microphone');
      }
    }

    if (notPermitted.length > 0) {
      throw new Error(
        `Permission denied to get user media for [${notPermitted.join(
          ', ',
        )}]. Please allow requested media permissions to continue.`,
      );
    }

    let notSupported = [];
    try {
      result = await mediaDevices.getUserMedia(
        DEFAULT_MEDIA_STREAM_CONSTRAINTS_VIDEO_ONLY,
      );
    } catch {
      // ... no video!
      notSupported.push('video');
    }
    try {
      result = await mediaDevices.getUserMedia(
        DEFAULT_MEDIA_STREAM_CONSTRAINTS_AUDIO_ONLY,
      );
    } catch {
      // ... no audio!
      notSupported.push('audio');
    }
    try {
      result = await mediaDevices.getUserMedia(
        DEFAULT_MEDIA_STREAM_CONSTRAINTS_NONE,
      );
    } catch {
      // ... nothing at all!
      notSupported.push('any');
    }

    throw new Error(
      `Unable to get user media for [${notSupported.join(
        ', ',
      )}]. Please check device settings and enable permissions.`,
    );
  }
  return result;
}

export function tryGetIndexedDB() {
  const window = tryGetWindow();
  let result = window.indexedDB;
  if (!result) {
    throw new MissingFeatureError('window.indexedDB');
  }
  return result;
}
