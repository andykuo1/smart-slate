import { useCallback, useRef } from 'react';

/**
 * @param {import('react').RefObject<HTMLVideoElement|null>} videoRef
 * @returns {[import('react').RefObject<MediaStream|null>, (constraints: MediaStreamConstraints|Array<MediaStreamConstraints>|undefined) => Promise<MediaStream>, () => Promise<void>]}
 */
export function useMediaStream(videoRef) {
  const ref = useRef(/** @type {MediaStream|null} */ (null));

  const dead = useCallback(
    async function dead() {
      if (ref.current) {
        let mediaStream = ref.current;
        for (let track of mediaStream.getTracks()) {
          track.enabled = false;
          track.stop();
        }
        ref.current = null;
      }
    },
    [ref, videoRef],
  );

  const init = useCallback(
    /**
     * @param {MediaStreamConstraints|Array<MediaStreamConstraints>} [constraints]
     */
    async function init(constraints = []) {
      if (!Array.isArray(constraints)) {
        constraints = [constraints];
      }
      if (constraints.length <= 0) {
        // @ts-expect-error no contraints were given, so let's just use the default.
        constraints.push(undefined);
      }

      if (ref.current) {
        await dead();
      }

      const mediaDevices = await tryGetMediaDevices();
      const mediaStream = await tryGetUserMedia(mediaDevices, constraints);
      ref.current = mediaStream;

      return mediaStream;
    },
    [ref, videoRef, dead],
  );
  return [ref, init, dead];
}

class MissingFeatureError extends Error {
  /**
   * @param {string} featureName
   * @param {string} [supportMessage]
   */
  constructor(featureName, supportMessage = 'Please update your browser.') {
    super(`Feature '${featureName}' is not supported. ${supportMessage}`);
  }
}

class MissingWindowFeatureError extends MissingFeatureError {
  constructor() {
    super('window', 'Please use a client-side browser.');
  }
}

function tryGetWindow() {
  if (typeof window === 'undefined') {
    throw new MissingWindowFeatureError();
  }
  return window;
}

function tryGetMediaDevices() {
  const window = tryGetWindow();
  let result = window.navigator?.mediaDevices;
  if (!result) {
    throw new MissingFeatureError('navigator.mediaDevices');
  }
  return result;
}

function tryGetPermissions() {
  const window = tryGetWindow();
  let result = window.navigator?.permissions;
  if (!result) {
    throw new MissingFeatureError('navigator.permissions');
  }
  return result;
}

/**
 * @param {MediaDevices} mediaDevices
 * @param {Array<MediaStreamConstraints>} constraints
 */
async function tryGetUserMedia(mediaDevices, constraints) {
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
const DEFAULT_MEDIA_STREAM_CONSTRAINTS_BOTH = { video: true, audio: true };
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
const DEFAULT_MEDIA_STREAM_CONSTRAINTS_NONE = { video: false, audio: false };

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
